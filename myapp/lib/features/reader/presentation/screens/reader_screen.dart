import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:papermind/core/models/paper.dart';
import 'package:papermind/core/models/user_profile.dart';
import 'package:papermind/core/services/api_client.dart';
import 'package:papermind/core/services/arxiv_service.dart';
import 'package:papermind/core/theme/app_colors.dart';
import 'package:papermind/core/widgets/app_toast.dart';
import 'package:papermind/features/ai_chat/presentation/widgets/ai_chat_sheet.dart';
import 'package:papermind/features/auth/presentation/providers/auth_controller.dart';
import 'package:papermind/features/home/presentation/providers/home_controller.dart';
import 'package:papermind/features/onboarding/presentation/providers/onboarding_controller.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

class ReaderScreen extends ConsumerStatefulWidget {
  const ReaderScreen({required this.paper, super.key});

  final Paper paper;

  @override
  ConsumerState<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends ConsumerState<ReaderScreen> {
  final _textScrollController = ScrollController();

  double _progress = 0;
  bool _isBookmarked = false;
  int _pdfPages = 1;
  List<String> _pdfCandidates = const [];
  String? _activePdfUrl;
  int _candidateIndex = 0;
  File? _downloadedPdfFile;
  Uint8List? _downloadedPdfBytes;
  bool _isResolvingPdf = false;
  bool _didTryDownloadFallback = false;
  String? _pdfStatusMessage;

  @override
  void initState() {
    super.initState();
    _isBookmarked = widget.paper.isBookmarked;
    _pdfCandidates = _buildPdfCandidates(widget.paper);
    if (_pdfCandidates.isNotEmpty) {
      _activePdfUrl = _pdfCandidates.first;
    }
    _primeDownloadedPdf();

    _textScrollController.addListener(() {
      if (!_textScrollController.hasClients) {
        return;
      }
      final max = _textScrollController.position.maxScrollExtent;
      if (max <= 0) {
        return;
      }
      setState(() => _progress = _textScrollController.position.pixels / max);
    });
  }

  @override
  void reassemble() {
    super.reassemble();

    assert(() {
      setState(() {
        _resetPdfResolutionState(rebuildCandidates: true);
        _pdfStatusMessage =
            'Hot reload detected. Re-resolving full-paper source...';
      });
      Future<void>.microtask(_primeDownloadedPdf);
      return true;
    }());
  }

  void _resetPdfResolutionState({required bool rebuildCandidates}) {
    if (rebuildCandidates) {
      _pdfCandidates = _buildPdfCandidates(widget.paper);
    }

    _candidateIndex = 0;
    _activePdfUrl = _pdfCandidates.isNotEmpty ? _pdfCandidates.first : null;
    _downloadedPdfFile = null;
    _downloadedPdfBytes = null;
    _didTryDownloadFallback = false;
    _isResolvingPdf = false;
    _progress = 0;
    _pdfPages = 1;
  }

  Future<void> _retryFullPdfLoad() async {
    if (_isResolvingPdf) {
      return;
    }

    setState(() {
      _resetPdfResolutionState(rebuildCandidates: true);
      _pdfStatusMessage = 'Retrying full-paper load...';
    });

    await _primeDownloadedPdf();
    if (!mounted) {
      return;
    }

    if (_downloadedPdfFile != null || _downloadedPdfBytes != null) {
      return;
    }

    if (_activePdfUrl == null && _pdfCandidates.isNotEmpty) {
      await _attemptDownloadFallback(
        reason: 'Retrying secure full-paper download...',
        force: true,
      );
      return;
    }

    if (_activePdfUrl == null && _pdfCandidates.isEmpty) {
      setState(() {
        _pdfStatusMessage = 'No PDF sources available to retry right now.';
      });
    }
  }

  List<String> _buildPdfCandidates(Paper paper) {
    final arxivService = ref.read(arxivServiceProvider);
    final candidates = <String>{};
    final arxivIds = <String>{};

    String? externalIdByKey(String key) {
      for (final entry in paper.externalIds.entries) {
        if (entry.key.toLowerCase() == key.toLowerCase()) {
          return entry.value;
        }
      }
      return null;
    }

    void addArxivId(String? value) {
      final resolved = arxivService.extractArxivId(value);
      if (resolved != null && resolved.trim().isNotEmpty) {
        arxivIds.add(resolved.trim());
      }
    }

    final doiArxivId = arxivService.extractArxivIdFromCanonicalDoi(
      paper.doi ?? externalIdByKey('DOI'),
    );

    addArxivId(paper.arxivId);
    addArxivId(paper.semanticScholarId);
    addArxivId(externalIdByKey('ArXiv'));
    addArxivId(doiArxivId);

    final normalized = arxivService.buildPdfCandidates(
      primaryPdfUrl: paper.pdfUrl,
      arxivId: arxivIds.isNotEmpty ? arxivIds.first : null,
      extra: paper.pdfCandidates,
    );
    candidates.addAll(normalized);

    for (final id in arxivIds) {
      candidates.add('https://arxiv.org/pdf/$id.pdf');
      candidates.add('https://arxiv.org/pdf/$id');
      candidates.add('https://export.arxiv.org/pdf/$id.pdf');
      candidates.add('https://export.arxiv.org/pdf/$id');
    }

    return candidates.where((e) => e.trim().isNotEmpty).toList(growable: false);
  }

  String? _extractArxivId(String? source) {
    if (source == null || source.trim().isEmpty) {
      return null;
    }

    final match = RegExp(
      r'arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)',
      caseSensitive: false,
    ).firstMatch(source);
    if (match != null) {
      return match.group(1);
    }

    final raw = RegExp(
      r'^([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)$',
      caseSensitive: false,
    ).firstMatch(source.trim());
    return raw?.group(1);
  }

  Future<void> _primeDownloadedPdf() async {
    await _enrichCandidatesFromArxiv();

    if (_pdfCandidates.isEmpty) {
      return;
    }

    setState(() {
      _isResolvingPdf = true;
      _pdfStatusMessage = 'Downloading complete paper for smooth reading...';
    });

    final bestPdf = await _downloadBestPdf();

    if (!mounted) {
      return;
    }

    if (bestPdf == null) {
      setState(() {
        _isResolvingPdf = false;
        _pdfStatusMessage = 'Streaming paper source...';
      });
      return;
    }

    final file = await _persistPdf(bestPdf);
    if (!mounted) {
      return;
    }

    if (file == null) {
      setState(() {
        _isResolvingPdf = false;
        _downloadedPdfBytes = bestPdf;
        _activePdfUrl = null;
        _pdfStatusMessage = 'Using secure in-app PDF stream.';
      });
      return;
    }

    setState(() {
      _isResolvingPdf = false;
      _downloadedPdfFile = file;
      _activePdfUrl = null;
      _pdfStatusMessage = 'Opened downloaded full-paper PDF.';
      _progress = 0;
      _pdfPages = 1;
    });
  }

  Future<void> _enrichCandidatesFromArxiv() async {
    final hasArxivCandidate = _pdfCandidates.any(
      (candidate) => candidate.toLowerCase().contains('arxiv.org/'),
    );
    if (hasArxivCandidate) {
      return;
    }

    final arxivIdFromPaper =
        _extractArxivId(widget.paper.arxivId) ??
        _extractArxivId(widget.paper.semanticScholarId);

    if (arxivIdFromPaper != null) {
      final merged = <String>{
        'https://arxiv.org/pdf/$arxivIdFromPaper.pdf',
        ..._pdfCandidates,
      }.toList(growable: false);
      if (!mounted) {
        return;
      }
      setState(() {
        _pdfCandidates = merged;
        _candidateIndex = 0;
        _activePdfUrl = _pdfCandidates.first;
      });
      return;
    }

    final lookup = await ref
        .read(arxivServiceProvider)
        .lookupByTitle(widget.paper.title);
    if (lookup == null || !mounted) {
      return;
    }

    final merged = <String>{
      lookup.pdfUrl,
      ..._pdfCandidates,
    }.toList(growable: false);
    setState(() {
      _pdfCandidates = merged;
      _candidateIndex = 0;
      _activePdfUrl = _pdfCandidates.first;
    });
  }

  bool _moveToNextCandidate() {
    if (_candidateIndex + 1 >= _pdfCandidates.length) {
      return false;
    }

    setState(() {
      _candidateIndex += 1;
      _activePdfUrl = _pdfCandidates[_candidateIndex];
      _progress = 0;
      _pdfStatusMessage = 'Trying an alternate full-paper source...';
    });

    return true;
  }

  Future<void> _attemptDownloadFallback({
    required String reason,
    bool force = false,
  }) async {
    if ((!force && _didTryDownloadFallback) || _pdfCandidates.isEmpty) {
      return;
    }

    _didTryDownloadFallback = true;
    setState(() {
      _isResolvingPdf = true;
      _pdfStatusMessage = reason;
    });

    final best = await _downloadBestPdf();

    if (!mounted) {
      return;
    }

    if (best == null) {
      setState(() {
        _isResolvingPdf = false;
        _activePdfUrl = null;
        _pdfStatusMessage =
            'Full PDF unavailable right now. Showing readable fallback text.';
      });
      context.showAppToast('Could not fetch a complete PDF. Showing fallback.');
      return;
    }

    final file = await _persistPdf(best);
    if (!mounted) {
      return;
    }

    if (file == null) {
      setState(() {
        _isResolvingPdf = false;
        _downloadedPdfBytes = best;
        _activePdfUrl = null;
        _pdfStatusMessage =
            'Downloaded PDF in memory. Opening best available source.';
      });
      return;
    }

    setState(() {
      _isResolvingPdf = false;
      _downloadedPdfFile = file;
      _activePdfUrl = null;
      _progress = 0;
      _pdfPages = 1;
      _pdfStatusMessage = 'Opened downloaded full-paper source.';
    });
  }

  Future<Uint8List?> _downloadBestPdf() async {
    final dio = ref.read(dioProvider);
    final attempted = <String>{};
    Uint8List? best;

    for (final candidate in _pdfCandidates) {
      for (final variant in _candidateDownloadVariants(candidate)) {
        final normalizedVariant = variant.trim();
        if (normalizedVariant.isEmpty ||
            attempted.contains(normalizedVariant)) {
          continue;
        }
        attempted.add(normalizedVariant);

        try {
          final response = await dio.get<List<int>>(
            normalizedVariant,
            options: Options(
              responseType: ResponseType.bytes,
              followRedirects: true,
              headers: const {
                'Accept': 'application/pdf,application/octet-stream,*/*',
                'User-Agent':
                    'Mozilla/5.0 (PaperMind; +https://papermind.app) FlutterReader/1.0',
              },
              receiveTimeout: const Duration(seconds: 45),
            ),
          );
          final data = response.data;
          if (data == null || data.isEmpty) {
            continue;
          }

          final bytes = Uint8List.fromList(data);
          final contentType =
              response.headers.value('content-type')?.toLowerCase() ?? '';
          final looksLikePdf =
              _looksLikePdf(bytes) || contentType.contains('application/pdf');
          if (!looksLikePdf) {
            continue;
          }

          if (best == null || bytes.length > best.length) {
            best = bytes;
          }
        } catch (_) {
          // Try the next source candidate.
        }
      }
    }

    return best;
  }

  Iterable<String> _candidateDownloadVariants(String candidate) {
    final variants = <String>{};
    final trimmed = candidate.trim();
    if (trimmed.isEmpty) {
      return variants;
    }

    variants.add(trimmed);

    if (trimmed.contains('arxiv.org/abs/')) {
      final asPdf = trimmed.replaceFirst('/abs/', '/pdf/');
      variants.add(asPdf);
      if (!asPdf.toLowerCase().endsWith('.pdf')) {
        variants.add('$asPdf.pdf');
      }
    }

    final arxivId = _extractArxivId(trimmed);
    if (arxivId != null) {
      variants.add('https://arxiv.org/pdf/$arxivId.pdf');
      variants.add('https://arxiv.org/pdf/$arxivId');
      variants.add('https://export.arxiv.org/pdf/$arxivId.pdf');
      variants.add('https://export.arxiv.org/pdf/$arxivId');
    }

    return variants;
  }

  Future<File?> _persistPdf(Uint8List bytes) async {
    try {
      final safeId = widget.paper.id.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
      final file = File(
        '${Directory.systemTemp.path}${Platform.pathSeparator}papermind_$safeId.pdf',
      );
      await file.writeAsBytes(bytes, flush: true);
      return file;
    } catch (_) {
      return null;
    }
  }

  bool _looksLikePdf(Uint8List bytes) {
    if (bytes.length < 4) {
      return false;
    }

    final scanLimit = bytes.length < 1024 ? bytes.length - 3 : 1021;
    for (var i = 0; i < scanLimit; i++) {
      if (bytes[i] == 0x25 &&
          bytes[i + 1] == 0x50 &&
          bytes[i + 2] == 0x44 &&
          bytes[i + 3] == 0x46) {
        return true;
      }
    }

    return false;
  }

  void _onPdfLoaded(PdfDocumentLoadedDetails details) {
    setState(() {
      _pdfPages = details.document.pages.count;
      _pdfStatusMessage = null;
    });

    if (_pdfPages > 1 ||
        _downloadedPdfFile != null ||
        _downloadedPdfBytes != null) {
      return;
    }

    if (_moveToNextCandidate()) {
      return;
    }

    _attemptDownloadFallback(
      reason: 'Detected a partial source. Downloading full paper...',
    );
  }

  void _onPdfLoadFailed(PdfDocumentLoadFailedDetails _) {
    if (_moveToNextCandidate()) {
      return;
    }

    _attemptDownloadFallback(
      reason: 'Could not open the network source. Trying secure download...',
    );
  }

  @override
  void dispose() {
    _textScrollController.dispose();
    super.dispose();
  }

  Future<ResearchLevel> _loadLevel() async {
    final userId = ref.read(authRepositoryProvider).currentUser()?.id;
    if (userId == null) {
      return ResearchLevel.intermediate;
    }

    final profile = await ref
        .read(onboardingRepositoryProvider)
        .getLocalProfile(userId);
    return profile?.level ?? ResearchLevel.intermediate;
  }

  Future<void> _openChat({
    String? prefilledQuestion,
    bool autoSend = false,
    bool explainSelection = false,
  }) async {
    final userId = ref.read(authRepositoryProvider).currentUser()?.id;
    if (userId == null) {
      if (mounted) {
        context.showAppToast('Sign in is required for AI chat.');
      }
      return;
    }

    final level = await _loadLevel();
    if (!mounted) {
      return;
    }

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AiChatSheet(
        userId: userId,
        paper: widget.paper,
        level: level,
        prefilledQuestion: prefilledQuestion,
        autoSendPrefill: autoSend,
        explainSelection: explainSelection,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.paper.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          IconButton(
            onPressed: () async {
              final userId = ref.read(authRepositoryProvider).currentUser()?.id;
              if (userId == null) {
                return;
              }
              await ref
                  .read(homeControllerProvider.notifier)
                  .toggleBookmark(
                    userId: userId,
                    paper: widget.paper.copyWith(isBookmarked: _isBookmarked),
                  );
              setState(() => _isBookmarked = !_isBookmarked);
            },
            icon: Icon(
              _isBookmarked ? LucideIcons.bookMarked : LucideIcons.bookmark,
            ),
          ),
          IconButton(
            onPressed: () async {
              await Clipboard.setData(ClipboardData(text: widget.paper.title));
              if (!context.mounted) {
                return;
              }
              context.showAppToast('Paper title copied for sharing.');
            },
            icon: const Icon(LucideIcons.share2),
          ),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              LinearProgressIndicator(value: _progress.clamp(0, 1)),
              if (_isResolvingPdf || _pdfStatusMessage != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
                  color: Theme.of(
                    context,
                  ).colorScheme.primary.withValues(alpha: 0.09),
                  child: Row(
                    children: [
                      if (_isResolvingPdf)
                        const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      if (_isResolvingPdf) const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _pdfStatusMessage ?? 'Resolving full-paper source...',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: Container(
                  color: AppColors.lightSurfaceMuted.withValues(alpha: 0.42),
                  child: _buildReaderSurface(context),
                ),
              ),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 12 + bottomInset,
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 260),
                child: FilledButton.icon(
                  onPressed: () => _openChat(),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(0, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                  icon: const Icon(LucideIcons.sparkles, size: 18),
                  label: const Text('Ask AI'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReaderSurface(BuildContext context) {
    if (_downloadedPdfFile != null) {
      return SfPdfViewer.file(
        _downloadedPdfFile!,
        canShowPaginationDialog: false,
        onDocumentLoaded: _onPdfLoaded,
        onPageChanged: (details) {
          setState(() {
            _progress = details.newPageNumber / _pdfPages;
          });
        },
      );
    }

    if (_downloadedPdfBytes != null) {
      return SfPdfViewer.memory(
        _downloadedPdfBytes!,
        canShowPaginationDialog: false,
        onDocumentLoaded: _onPdfLoaded,
        onPageChanged: (details) {
          setState(() {
            _progress = details.newPageNumber / _pdfPages;
          });
        },
      );
    }

    if (_activePdfUrl != null) {
      return SfPdfViewer.network(
        _activePdfUrl!,
        headers: const {
          'Accept': 'application/pdf,application/octet-stream,*/*',
          'User-Agent':
              'Mozilla/5.0 (PaperMind; +https://papermind.app) FlutterReader/1.0',
        },
        canShowPaginationDialog: false,
        onDocumentLoaded: _onPdfLoaded,
        onDocumentLoadFailed: _onPdfLoadFailed,
        onPageChanged: (details) {
          setState(() {
            _progress = details.newPageNumber / _pdfPages;
          });
        },
      );
    }

    return _fallbackReader(context);
  }

  Widget _fallbackReader(BuildContext context) {
    final summary = widget.paper.summary?.trim();
    final summaryText = (summary == null || summary.isEmpty)
        ? 'No summary is available for this paper yet.'
        : summary;

    final bodyText =
        '''
Full PDF could not be loaded right now.

Title
${widget.paper.title}\n
Authors
${widget.paper.authors.join(', ')}\n
Venue
${widget.paper.venue} (${widget.paper.year})\n
Abstract
${widget.paper.abstract}\n
Summary
$summaryText\n
Possible PDF Sources
${_pdfCandidates.isEmpty ? 'No candidate PDF links were found.' : _pdfCandidates.join('\n')}
''';

    return SingleChildScrollView(
      controller: _textScrollController,
      padding: EdgeInsets.fromLTRB(
        16,
        16,
        16,
        116 + MediaQuery.paddingOf(context).bottom,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!_isResolvingPdf)
            OutlinedButton.icon(
              onPressed: () => _retryFullPdfLoad(),
              icon: const Icon(Icons.refresh, size: 16),
              label: const Text('Retry Full PDF'),
            ),
          if (!_isResolvingPdf) const SizedBox(height: 12),
          SelectableText(
            bodyText,
            style: Theme.of(context).textTheme.bodyLarge,
            contextMenuBuilder: (context, editableTextState) {
              final fullText = editableTextState.textEditingValue.text;
              final selection = editableTextState.textEditingValue.selection;
              final selectedText = selection.textInside(fullText).trim();

              final items = [
                ContextMenuButtonItem(
                  label: 'Copy',
                  onPressed: () async {
                    if (selectedText.isNotEmpty) {
                      await Clipboard.setData(
                        ClipboardData(text: selectedText),
                      );
                    }
                    ContextMenuController.removeAny();
                  },
                ),
                ContextMenuButtonItem(
                  label: 'Explain This',
                  onPressed: () {
                    ContextMenuController.removeAny();
                    if (selectedText.isNotEmpty) {
                      _openChat(
                        prefilledQuestion: selectedText,
                        autoSend: true,
                        explainSelection: true,
                      );
                    }
                  },
                ),
                ContextMenuButtonItem(
                  label: 'Ask About This',
                  onPressed: () {
                    ContextMenuController.removeAny();
                    if (selectedText.isNotEmpty) {
                      _openChat(
                        prefilledQuestion:
                            'Can you clarify this excerpt: "$selectedText"',
                      );
                    }
                  },
                ),
              ];

              return AdaptiveTextSelectionToolbar.buttonItems(
                anchors: editableTextState.contextMenuAnchors,
                buttonItems: items,
              );
            },
          ),
        ],
      ),
    );
  }
}

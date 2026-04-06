import { motion } from "framer-motion";

const teamMembers = [
    {
        name: "Rear Admiral Amit Vikram(Retd)",
        role: "Director",
        image: "/incubation photos/Director.jpeg",
    },
     {
        name: "Hon. Mr. Tejas Satej Patil",
        role: "Director",
        image: "/incubation photos/Tejas_patil.png",
    },
   
    {
        name: "Dhanashree Patil",
        role: "Director",
        image: "/incubation photos/DSC069111.JPG",
    },
     {
        name: "Dr Manish Sharma",
        role: "Director",
        image: "/incubation photos/Manish_Sharma.webp",
    },
];

const TeamSection = () => {
    return (
        <section className="px-6 py-24 md:px-12 lg:px-20 bg-background" id="team">
            <div className="max-w-[1400px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <p className="font-mono-ui text-muted-foreground uppercase tracking-widest mb-4">Leadership</p>
                    <h2 className="font-season-mix text-4xl md:text-6xl text-foreground">Directors</h2>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        The visionary leaders and dedicated experts driving innovation and supporting our startup ecosystem.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center group"
                        >
                            <div className="relative mb-6">
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-border/50 group-hover:border-accent transition-colors duration-500 shadow-xl">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                            <h3 className="font-season-mix text-2xl text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                                {member.name}
                            </h3>
                            <p className="font-mono-ui text-sm text-muted-foreground uppercase tracking-widest">
                                {member.role}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;

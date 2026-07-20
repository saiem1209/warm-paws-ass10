import React from 'react';
import { motion } from 'motion/react';
import { 
    Search, Calendar, ShieldCheck, HeartHandshake, 
    Star, Quote, Sparkles, CheckCircle2, Heart, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router';

const steps = [
    {
        number: '01',
        icon: Search,
        title: 'Explore & Discover',
        description: 'Browse verified pet adoption listings, nutritious foods, accessories, and expert veterinary services.'
    },
    {
        number: '02',
        icon: Calendar,
        title: 'Book & Connect',
        description: 'Schedule a vet consultation or submit an adoption request directly with transparent pricing.'
    },
    {
        number: '03',
        icon: ShieldCheck,
        title: 'Vet Health Assurance',
        description: 'Our certified partner veterinarians conduct thorough health inspections, vaccinations, and checks.'
    },
    {
        number: '04',
        icon: HeartHandshake,
        title: 'Welcome Home & Care',
        description: 'Bring home your new companion or receive premium supplies with lifetime support from WarmPaws.'
    }
];

const testimonials = [
    {
        name: "Sarah & Winston (Golden Dog)",
        role: "Adopted in Jan 2026",
        rating: 5,
        quote: "Adopting Winston filled a huge gap in our lives. He's the most loving, healthy companion we could ask for!",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        badge: "Verified Adoption"
    },
    {
        name: "Mark S. & Mittens (Cat)",
        role: "Customer since 2025",
        rating: 5,
        quote: "Mittens is the perfect lap cat. The vet checkup records were crystal clear and booking was seamless.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        badge: "Verified Parent"
    },
    {
        name: "The Chen Family & Zuzu (Rabbit)",
        role: "Adopted in Feb 2026",
        rating: 5,
        quote: "Zuzu taught us that all pets deserve a second chance. She is playful, healthy, and a beloved family member.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
        badge: "Verified Adoption"
    }
];

const WinterTips = () => {
    return (
        <section className="my-16 space-y-16">
            
            {/* How It Works Section */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700">
                        <Sparkles className="h-3.5 w-3.5" /> Simple Process
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                        How WarmPaws Works
                    </h2>
                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        Four quick steps to finding your ideal pet, booking expert care, or ordering quality supplies.
                    </p>
                </div>

                {/* 4 Steps Grid */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group relative flex flex-col justify-between rounded-3xl border border-slate-100 bg-slate-50/50 p-6 transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:border-blue-200 hover:shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition duration-300">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className="text-2xl font-black text-slate-300 group-hover:text-blue-500 transition-colors">
                                            {step.number}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Testimonials & Success Stories */}
            <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-50/70 via-slate-50 to-sky-50/40 p-8 md:p-12 border border-blue-100 shadow-[0_20px_50px_rgba(37,99,235,0.08)]">
                <div className="text-center max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-700">
                        <Heart className="h-3.5 w-3.5 fill-rose-500" /> Warm Stories
                    </span>
                    <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                        Happy Pet Parents & Heroes
                    </h2>
                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        See how WarmPaws has brought joy, companionship, and expert care to loving homes.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-xl hover:-translate-y-1"
                        >
                            <div>
                                {/* Rating & Badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="h-3 w-3" /> {item.badge}
                                    </span>
                                </div>

                                {/* Quote */}
                                <div className="relative mt-4">
                                    <Quote className="absolute -left-1 -top-1 h-6 w-6 text-blue-100 -z-0" />
                                    <p className="relative z-10 text-xs italic leading-relaxed text-slate-600">
                                        "{item.quote}"
                                    </p>
                                </div>
                            </div>

                            {/* User Profile */}
                            <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-11 w-11 rounded-full object-cover border-2 border-blue-500"
                                />
                                <div>
                                    <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
                                    <p className="text-[10px] font-semibold text-slate-400">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-10 text-center">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
                    >
                        <span>Find Your Companion Today</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default WinterTips;
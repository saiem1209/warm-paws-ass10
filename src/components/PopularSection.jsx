import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { catalogServices } from '../utils/initialServices';
import { Sparkles, ArrowRight, PawPrint, UtensilsCrossed, Package, HeartPulse, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

const popularCategories = [
    { name: 'Featured Trending', value: 'all', icon: Flame },
    { name: 'Adoptable Pets', value: 'Pets', icon: PawPrint },
    { name: 'Pet Food', value: 'Food', icon: UtensilsCrossed },
    { name: 'Care Essentials', value: 'Care Products', icon: HeartPulse },
    { name: 'Accessories', value: 'Accessories', icon: Package },
];

const PopularSection = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [allServices, setAllServices] = useState([]);

    useEffect(() => {
        fetch('https://warm-paws-backend-bysaiem.vercel.app/services')
            .then(res => res.json())
            .then(data => {
                const apiServices = Array.isArray(data) ? data : [];
                const combined = [...apiServices];
                const existingNames = new Set(apiServices.map(s => s.name?.toLowerCase()));

                catalogServices.forEach(item => {
                    if (!existingNames.has(item.name?.toLowerCase())) {
                        combined.push(item);
                    }
                });
                setAllServices(combined);
            })
            .catch(err => {
                console.error(err);
                setAllServices(catalogServices);
            });
    }, []);

    // Filter items based on selected tab
    const displayServices = activeTab === 'all'
        ? allServices.slice(0, 6)
        : allServices.filter(s => s.category?.toLowerCase() === activeTab.toLowerCase()).slice(0, 6);

    return (
        <section className="mt-16 px-4 md:px-[80px] lg:px-[120px]">
            {/* Header Section */}
            <div className="mb-8 text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-blue-500/20">
                    <Sparkles className="h-3.5 w-3.5" /> Popular & New Arrivals
                </span>
                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                    Discover Top-Rated Pet Offerings
                </h2>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                    Explore our handpicked selection of healthy pets, premium nutrition, grooming essentials, and cozy accessories.
                </p>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
                {popularCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.value;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => setActiveTab(cat.value)}
                            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100 shadow-sm'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Grid of New Service Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayServices.map((service, index) => (
                    <motion.div
                        key={service._id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <ServiceCard service={service} />
                    </motion.div>
                ))}
            </div>

            {/* Bottom CTA to full catalog */}
            <div className="mt-10 text-center">
                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:shadow-xl hover:from-blue-700 hover:to-sky-600 active:scale-95"
                >
                    <span>View All 40+ Catalog Items</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
};

export default PopularSection;
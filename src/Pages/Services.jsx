import React, { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { catalogServices } from '../utils/initialServices';
import { Search, Sparkles, PawPrint, UtensilsCrossed, Package, HeartPulse, RefreshCw } from 'lucide-react';

const categories = [
    { name: 'All', value: '', icon: Sparkles },
    { name: 'Pets', value: 'Pets', icon: PawPrint },
    { name: 'Food', value: 'Food', icon: UtensilsCrossed },
    { name: 'Accessories', value: 'Accessories', icon: Package },
    { name: 'Care Products', value: 'Care Products', icon: HeartPulse },
];

const Services = () => {
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [loading, setLoading] = useState(true);

    const fetchServices = () => {
        setLoading(true);
        fetch(`https://warm-paws-backend-bysaiem.vercel.app/services?category=${category}`)
            .then(res => res.json())
            .then(data => {
                const apiServices = Array.isArray(data) ? data : [];
                const combined = [...apiServices];
                const existingNames = new Set(apiServices.map(s => s.name?.toLowerCase()));

                const catalogFiltered = category
                    ? catalogServices.filter(s => s.category.toLowerCase() === category.toLowerCase())
                    : catalogServices;

                catalogFiltered.forEach(item => {
                    if (!existingNames.has(item.name?.toLowerCase())) {
                        combined.push(item);
                    }
                });

                setServices(combined);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching API services:', err);
                const catalogFiltered = category
                    ? catalogServices.filter(s => s.category.toLowerCase() === category.toLowerCase())
                    : catalogServices;
                setServices(catalogFiltered);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchServices();
    }, [category]);

    // Client side filtering for search & sorting
    const filteredServices = services
        .filter(service =>
            service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service?.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price-low') return (Number(a?.price) || 0) - (Number(b?.price) || 0);
            if (sortBy === 'price-high') return (Number(b?.price) || 0) - (Number(a?.price) || 0);
            return 0;
        });

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-slate-50 to-white px-4 py-8 md:px-[80px] lg:px-[120px]">
            <title>Services & Products | WarmPaws</title>

            {/* Header Banner */}
            <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-8 md:p-12 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
                <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-sky-300/20 blur-xl" />

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5" /> Full Catalog (40+ Live Items)
                    </span>
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Explore Pets, Food, Accessories & Care
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-blue-100/90 sm:text-base">
                        Browse our complete live catalog of pets for adoption, nutritious food, essential care products, and high-quality accessories.
                    </p>
                </div>
            </div>

            {/* Filter & Controls Bar */}
            <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = category === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search Field */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="h-48 w-full rounded-2xl bg-slate-200"></div>
                            <div className="mt-4 h-5 w-3/4 rounded-md bg-slate-200"></div>
                            <div className="mt-2 h-4 w-1/2 rounded-md bg-slate-200"></div>
                            <div className="mt-6 h-10 w-full rounded-2xl bg-slate-200"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredServices.length === 0 && (
                <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <PawPrint className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-800">No Items Found</h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                        We couldn't find any items matching your search.
                    </p>
                    <button
                        onClick={() => { setCategory(''); setSearchTerm(''); }}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset All Filters
                    </button>
                </div>
            )}

            {/* Services Grid */}
            {!loading && filteredServices.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;
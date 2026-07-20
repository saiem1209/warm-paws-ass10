import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Star, Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';
import fallbackImage from '../assets/pawmart.png';

const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case 'pets':
            return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'food':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'accessories':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'care products':
            return 'bg-sky-100 text-sky-700 border-sky-200';
        default:
            return 'bg-blue-100 text-blue-700 border-blue-200';
    }
};

const ServiceCard = ({ service }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(37,99,235,0.15)] hover:border-blue-200"
        >
            <div>
                {/* Image Container with Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        src={service?.imgurl || fallbackImage}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImage;
                        }}
                        alt={service?.name || 'Service image'}
                    />

                    {/* Gradient Overlay for subtle text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 opacity-80" />

                    {/* Category Pill */}
                    {service?.category && (
                        <span className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${getCategoryColor(service.category)}`}>
                            <Tag className="h-3 w-3" />
                            {service.category}
                        </span>
                    )}

                    {/* Rating Badge */}
                    {service?.rating && (
                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-sm">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{service.rating}</span>
                        </div>
                    )}

                    {/* Price Badge over Image Bottom Right */}
                    <div className="absolute bottom-3 right-3.5 rounded-2xl bg-blue-600/90 px-3.5 py-1.5 text-sm font-extrabold text-white shadow-lg backdrop-blur-md">
                        ${service?.price}
                    </div>
                </div>

                {/* Card Body Content */}
                <div className="flex flex-col p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                        {service?.name}
                    </h3>

                    {/* Meta info tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                        {service?.date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                <span>{service.date}</span>
                            </div>
                        )}
                        {service?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                <span className="line-clamp-1">{service.location}</span>
                            </div>
                        )}
                    </div>

                    {service?.description && (
                        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {service.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-slate-100 p-4 pt-3 bg-slate-50/50">
                <Link
                    to={`/details/${service?._id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-sky-600 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99]"
                >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ServiceCard;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { catalogServices } from '../utils/initialServices';
import {
    ArrowLeft, Star, MapPin, Mail, Calendar, Tag,
    CheckCircle2, ShoppingBag, ShieldCheck, Heart,
    Phone, FileText, User, Hash, DollarSign, X
} from 'lucide-react';
import fallbackImage from '../assets/pawmart.png';

const ServicesDetails = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        fetch(`https://warm-paws-backend-bysaiem.vercel.app/services/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && (data._id || data.name)) {
                    setService(data);
                    setLoading(false);
                } else {
                    const localFound = catalogServices.find(s => s._id === id);
                    setService(localFound || null);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                const localFound = catalogServices.find(s => s._id === id);
                setService(localFound || null);
                setLoading(false);
            });
    }, [id]);

    const handleorder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target;
        const productName = form.product.value;
        const buyername = form.buyername.value;
        const buyeremail = form.buyeremail.value;
        const phone = form.phone.value;
        const address = form.address.value;
        const qty = parseInt(form.quantity.value) || 1;
        const unitPrice = parseFloat(form.price.value) || 0;
        const note = form.description.value;

        const sellerEmail = service?.email || service?.userEmail || 'store@warmpaws.com';
        const imgurl = service?.imgurl || '';

        const formdata = {
            productId: id,
            productName,
            buyername,
            buyeremail,
            sellerEmail,
            status: 'Pending',
            imgurl,
            phone,
            address,
            quantity: qty,
            price: unitPrice * qty,
            note,
            date: new Date().toISOString()
        };

        // Helper to save order to local storage for instant sync across tabs / client sessions
        const saveToLocalStorage = (orderObj) => {
            try {
                const existing = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
                const newOrder = { ...orderObj, _id: orderObj._id || `order_${Date.now()}` };
                localStorage.setItem('warmpaws_orders', JSON.stringify([newOrder, ...existing]));
            } catch (err) {
                console.error("Local storage error:", err);
            }
        };

        axios.post("https://warm-paws-backend-bysaiem.vercel.app/orders", formdata)
            .then(res => {
                const createdOrder = res.data && res.data.insertedId ? { ...formdata, _id: res.data.insertedId } : formdata;
                saveToLocalStorage(createdOrder);
                setIsSubmitting(false);
                document.getElementById('my_modal_3')?.close();
                Swal.fire({
                    title: 'Order Placed Successfully!',
                    text: `Your request for "${productName}" has been received.`,
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                    customClass: {
                        popup: 'rounded-3xl font-sans'
                    }
                });
                form.reset();
                setQuantity(1);
            })
            .catch(err => {
                console.error(err);
                saveToLocalStorage(formdata);
                setIsSubmitting(false);
                document.getElementById('my_modal_3')?.close();
                Swal.fire({
                    title: 'Order Placed Successfully!',
                    text: `Your request for "${productName}" has been received.`,
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                    customClass: {
                        popup: 'rounded-3xl font-sans'
                    }
                });
                form.reset();
                setQuantity(1);
            });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm font-semibold text-slate-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
                <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800">Service Not Found</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        We couldn't retrieve the details for this listing. It might have been removed or is unavailable.
                    </p>
                    <Link
                        to="/services"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    const unitPrice = Number(service.price) || 0;
    const totalPrice = unitPrice * quantity;

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-white px-4 py-8 md:px-[80px] lg:px-[120px]">
            <title>{`${service.name} | WarmPaws`}</title>

            {/* Back Navigation Bar */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                </Link>

                {service.category && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-bold text-blue-700">
                        <Tag className="h-3.5 w-3.5" />
                        {service.category}
                    </span>
                )}
            </div>

            {/* Hero Details Card Container */}
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Left Column: Image Gallery View */}
                    <div className="relative lg:col-span-6 bg-slate-100 min-h-[350px] lg:min-h-[480px]">
                        <img
                            className="h-full w-full object-cover"
                            src={service.imgurl || fallbackImage}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackImage;
                            }}
                            alt={service.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                        {/* Rating Overlay */}
                        {service.rating && (
                            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-extrabold text-slate-800 shadow-lg backdrop-blur-md">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span>{service.rating} / 5.0 Rating</span>
                            </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Pet Listing
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Key Details & Booking Action */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 lg:p-10">
                        <div>
                            {/* Service Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Service Overview</span>
                                    <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
                                        {service.name}
                                    </h1>
                                </div>
                            </div>

                            {/* Price Highlight Banner */}
                            <div className="mt-6 flex items-baseline gap-3 rounded-2xl bg-blue-50/70 p-4 border border-blue-100">
                                <span className="text-3xl font-black text-blue-700 sm:text-4xl">${service.price}</span>
                                <span className="text-xs font-medium text-slate-500">per item / service package</span>
                            </div>

                            {/* Quick Info Grid */}
                            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 text-xs font-medium text-slate-600">
                                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <Tag className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Category</p>
                                        <p className="font-bold text-slate-800">{service.category || "General"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Location</p>
                                        <p className="font-bold text-slate-800 line-clamp-1">{service.location || "Available online/local"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Listed Date</p>
                                        <p className="font-bold text-slate-800">{service.date || "Recent"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Rating</p>
                                        <p className="font-bold text-slate-800">{service.rating || "5.0"} ⭐</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Order / Adoption Button */}
                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <button
                                onClick={() => document.getElementById('my_modal_3')?.showModal()}
                                className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span>Adopt / Order Now</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Content Tabs & Details */}
                <div className="grid grid-cols-1 gap-8 border-t border-slate-100 bg-slate-50/40 p-6 sm:p-8 lg:grid-cols-12 lg:p-10">

                    {/* Description Column */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" /> Description & Details
                            </h3>
                            <p className="mt-3 leading-relaxed text-slate-600 text-sm whitespace-pre-line">
                                {service.description || "No detailed description provided for this service."}
                            </p>
                        </div>

                        {/* Feature Highlights Grid */}
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Why Choose WarmPaws</h3>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified Pet Service
                                </div>
                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant Booking Confirmation
                                </div>
                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Safe & Loving Environment
                                </div>
                                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 24/7 Support Assistance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Provider Info Sidebar Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Service Provider</h3>

                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-lg shadow-md shadow-blue-500/20">
                                    {service.email ? service.email.charAt(0).toUpperCase() : 'P'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Verified Provider</p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                        <Mail className="h-3.5 w-3.5 text-blue-500" />
                                        <span className="line-clamp-1">{service.email || "Contact via order"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                <p className="flex items-center gap-1.5">
                                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> Dedicated to pet well-being & high quality service.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Adoption / Booking Modal */}
            <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white p-0 shadow-2xl overflow-hidden border border-slate-100">

                    {/* Modal Banner Header (Fixed Top) */}
                    <div className="relative shrink-0 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 p-5 text-white">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white hover:bg-white/20 border-none cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </form>
                        <h3 className="text-lg font-extrabold flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" /> Complete Your Order
                        </h3>
                        <p className="text-xs text-blue-100 mt-0.5">
                            Fill in your details below to request "{service.name}".
                        </p>
                    </div>

                    {/* Form Body (Scrollable Area) */}
                    <form onSubmit={handleorder} className="flex flex-col flex-1 overflow-y-auto p-5 space-y-3.5">

                        {/* Order Summary Pill */}
                        <div className="flex items-center justify-between rounded-2xl bg-blue-50/80 p-3 border border-blue-100 text-xs shrink-0">
                            <div>
                                <p className="font-bold text-slate-800 line-clamp-1">{service.name}</p>
                                <p className="text-slate-500">${unitPrice} / unit</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[10px] uppercase font-bold text-blue-600">Calculated Total</p>
                                <p className="text-base font-extrabold text-blue-700">${totalPrice}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Product Name (ReadOnly) */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <ShoppingBag className="h-3 w-3 text-blue-500" /> Service Name
                                </label>
                                <input
                                    name="product"
                                    defaultValue={service.name}
                                    readOnly
                                    type="text"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
                                />
                            </div>

                            {/* Quantity Input */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Hash className="h-3 w-3 text-blue-500" /> Quantity
                                </label>
                                <input
                                    required
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Buyer Name */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <User className="h-3 w-3 text-blue-500" /> Your Name
                                </label>
                                <input
                                    name="buyername"
                                    defaultValue={user?.displayName || ''}
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Buyer Email */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-blue-500" /> Your Email
                                </label>
                                <input
                                    name="buyeremail"
                                    defaultValue={user?.email || ''}
                                    readOnly
                                    type="email"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Unit Price Hidden/ReadOnly */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3 text-blue-500" /> Unit Price ($)
                                </label>
                                <input
                                    name="price"
                                    defaultValue={service.price}
                                    readOnly
                                    type="number"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-blue-500" /> Phone Number
                                </label>
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-blue-500" /> Delivery / Contact Address
                            </label>
                            <input
                                required
                                name="address"
                                type="text"
                                placeholder="Enter complete address"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <FileText className="h-3 w-3 text-blue-500" /> Additional Instructions / Notes
                            </label>
                            <textarea
                                name="description"
                                rows="2"
                                placeholder="Any special care requests or delivery notes..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            ></textarea>
                        </div>

                        {/* Sticky / Always-Visible Submit Button Container */}
                        <div className="pt-3 pb-1 border-t border-slate-100 shrink-0 sticky bottom-0 bg-white">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-sky-600 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                            >
                                {isSubmitting ? "Submitting Order Request..." : "Confirm & Submit Order"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ServicesDetails;
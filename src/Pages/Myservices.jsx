import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Link } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { catalogServices } from '../utils/initialServices';
import {
    Trash2, Edit3, Plus, Sparkles, Package, Tag, Calendar,
    ShieldCheck, CheckCircle2, Clock, User, Mail, Phone, MapPin,
    ShoppingBag, Check, Layers
} from 'lucide-react';

const Myservices = () => {
    const [myservices, setMyServices] = useState([]);
    const [receivedOrders, setReceivedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'orders'
    const { user } = useContext(AuthContext);

    // Fetch user's listings
    useEffect(() => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`https://warm-paws-backend-bysaiem.vercel.app/my-services?email=${user?.email}`)
            .then((res) => res.json())
            .then((data) => {
                const apiItems = Array.isArray(data) ? data : [];
                const localUserItems = catalogServices.filter(s => s.email === user?.email);
                const combined = [...apiItems];
                const existingIds = new Set(apiItems.map(s => s._id));

                localUserItems.forEach(item => {
                    if (!existingIds.has(item._id)) {
                        combined.push(item);
                    }
                });

                setMyServices(combined);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                const localUserItems = catalogServices.filter(s => s.email === user?.email);
                setMyServices(localUserItems);
                setLoading(false);
            });
    }, [user?.email]);

    // Fetch orders placed for user's listings
    useEffect(() => {
        if (!user?.email) return;

        const currentUserEmail = user?.email?.toLowerCase()?.trim();
        let deletedIds = new Set();
        let approvedIds = new Set();
        try {
            deletedIds = new Set(JSON.parse(localStorage.getItem('warmpaws_deleted_orders') || '[]'));
            approvedIds = new Set(JSON.parse(localStorage.getItem('warmpaws_approved_orders') || '[]'));
        } catch (e) {
            console.error(e);
        }

        const applyApprovedStatus = (order) => {
            if (approvedIds.has(order._id)) {
                return { ...order, status: 'Approved' };
            }
            return order;
        };

        fetch(`https://warm-paws-backend-bysaiem.vercel.app/orders`)
            .then((res) => res.json())
            .then((data) => {
                const allOrders = Array.isArray(data) ? data : [];
                const userListingIds = new Set(myservices.map(s => s._id));

                const filteredApi = allOrders
                    .filter(order => {
                        if (deletedIds.has(order._id)) return false;
                        const isSeller = order?.sellerEmail?.toLowerCase()?.trim() === currentUserEmail;
                        const matchesService = order?.productId && userListingIds.has(order.productId);
                        return isSeller || matchesService;
                    })
                    .map(applyApprovedStatus);

                // Merge with local storage orders
                try {
                    const localOrders = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
                    const filteredLocal = localOrders
                        .filter(order => {
                            if (deletedIds.has(order._id)) return false;
                            const isSeller = order?.sellerEmail?.toLowerCase()?.trim() === currentUserEmail;
                            const matchesService = order?.productId && userListingIds.has(order.productId);
                            return isSeller || matchesService;
                        })
                        .map(applyApprovedStatus);
                    const existingIds = new Set(filteredApi.map(o => o._id));
                    filteredLocal.forEach(lo => {
                        if (lo._id && !existingIds.has(lo._id)) {
                            filteredApi.push(lo);
                        }
                    });
                } catch (e) {
                    console.error("Local storage error in Myservices", e);
                }

                setReceivedOrders(filteredApi);
            })
            .catch(() => {
                const userListingIds = new Set(myservices.map(s => s._id));
                try {
                    const localOrders = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
                    const filteredLocal = localOrders
                        .filter(order => {
                            if (deletedIds.has(order._id)) return false;
                            const isSeller = order?.sellerEmail?.toLowerCase()?.trim() === currentUserEmail;
                            const matchesService = order?.productId && userListingIds.has(order.productId);
                            return isSeller || matchesService;
                        })
                        .map(applyApprovedStatus);
                    setReceivedOrders(filteredLocal);
                } catch (e) {
                    setReceivedOrders([]);
                }
            });
    }, [user?.email, myservices]);

    const handledelete = (id) => {
        Swal.fire({
            title: 'Delete Listing?',
            text: "Are you sure you want to remove this service listing? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'rounded-3xl font-sans'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/delete/${id}`)
                    .finally(() => {
                        setMyServices((current) => current.filter((service) => service._id !== id));
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your service listing has been removed.',
                            icon: 'success',
                            confirmButtonColor: '#2563eb',
                            customClass: {
                                popup: 'rounded-3xl font-sans'
                            }
                        });
                    });
            }
        });
    };

    // Approve received customer order
    const handleApproveOrder = (orderId) => {
        Swal.fire({
            title: 'Approve Customer Order?',
            text: 'Are you sure you want to approve this order request?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Approve Order',
            customClass: { popup: 'rounded-3xl font-sans' }
        }).then((result) => {
            if (result.isConfirmed) {
                // Save to approved IDs set in local storage
                try {
                    const approvedList = JSON.parse(localStorage.getItem('warmpaws_approved_orders') || '[]');
                    if (!approvedList.includes(orderId)) {
                        approvedList.push(orderId);
                        localStorage.setItem('warmpaws_approved_orders', JSON.stringify(approvedList));
                    }
                    const local = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
                    const updated = local.map(o => o._id === orderId ? { ...o, status: 'Approved' } : o);
                    localStorage.setItem('warmpaws_orders', JSON.stringify(updated));
                } catch (e) {
                    console.error("LS error", e);
                }

                setReceivedOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Approved' } : o));

                Swal.fire({
                    title: 'Order Approved!',
                    text: 'The order status has been updated to Approved.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                    customClass: { popup: 'rounded-3xl font-sans' }
                });
            }
        });
    };

    // Delete/Reject received customer order
    const handleDeleteReceivedOrder = (orderId) => {
        Swal.fire({
            title: 'Reject Order?',
            text: 'Are you sure you want to reject and delete this customer order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Reject Order',
            customClass: { popup: 'rounded-3xl font-sans' }
        }).then((result) => {
            if (result.isConfirmed) {
                // Update deleted IDs in local storage
                try {
                    const deleted = JSON.parse(localStorage.getItem('warmpaws_deleted_orders') || '[]');
                    if (!deleted.includes(orderId)) {
                        deleted.push(orderId);
                        localStorage.setItem('warmpaws_deleted_orders', JSON.stringify(deleted));
                    }
                    const local = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
                    const updated = local.map(o => o._id === orderId ? { ...o, status: 'Not Approved' } : o).filter(o => o._id !== orderId);
                    localStorage.setItem('warmpaws_orders', JSON.stringify(updated));
                } catch (e) {
                    console.error(e);
                }

                axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/orders/${orderId}`)
                    .catch(() => axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/delete/${orderId}`))
                    .finally(() => {
                        setReceivedOrders(prev => prev.filter(o => o._id !== orderId));
                        Swal.fire({
                            title: 'Order Rejected',
                            text: 'The customer order has been marked as Not Approved and removed from your listing section.',
                            icon: 'success',
                            confirmButtonColor: '#2563eb',
                            customClass: { popup: 'rounded-3xl font-sans' }
                        });
                    });
            }
        });
    };

    const visibleReceivedOrders = receivedOrders.filter(
        o => o?.status?.toLowerCase() !== 'not approved' && o?.status?.toLowerCase() !== 'rejected'
    );
    const pendingOrdersCount = visibleReceivedOrders.filter(o => o?.status?.toLowerCase() !== 'approved').length;

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-slate-50 to-white px-4 py-8 md:px-[80px] lg:px-[120px]">
            <title>My Listing & Orders | WarmPaws</title>

            <div className="mx-auto max-w-7xl">
                {/* Header Banner */}
                <div className="mb-8 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div className="flex flex-col gap-6 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-8 text-white md:p-10 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" /> Provider Dashboard
                            </span>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">My Listings & Received Orders</h1>
                            <p className="mt-2 max-w-xl text-xs leading-relaxed text-blue-100/90 sm:text-sm">
                                Manage your service listings and review, approve, or delete orders placed on your listings by other users.
                            </p>
                        </div>
                        <Link
                            to="/add-services"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-95 shrink-0"
                        >
                            <Plus className="h-4 w-4 text-blue-600" /> Add New Service
                        </Link>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-2xl font-extrabold text-slate-800">{myservices.length}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Active Listings</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-2xl font-extrabold text-blue-600">{receivedOrders.length}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Orders Received</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-2xl font-extrabold text-amber-600">{pendingOrdersCount}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">Pending Approvals</p>
                        </div>
                    </div>
                </div>

                {/* Section Navigation Tabs */}
                <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${activeTab === 'listings'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <Layers className="h-4 w-4" /> My Active Listings ({myservices.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`relative inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-extrabold transition cursor-pointer ${activeTab === 'orders'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <ShoppingBag className="h-4 w-4" /> Customer Orders on My Listings ({visibleReceivedOrders.length})
                        {pendingOrdersCount > 0 && (
                            <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                                {pendingOrdersCount} new
                            </span>
                        )}
                    </button>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {[1, 2].map((n) => (
                            <div key={n} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="h-48 w-full rounded-2xl bg-slate-200"></div>
                                <div className="mt-4 h-6 w-3/4 rounded-md bg-slate-200"></div>
                                <div className="mt-2 h-4 w-1/2 rounded-md bg-slate-200"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 1: LISTINGS VIEW */}
                {!loading && activeTab === 'listings' && (
                    <>
                        {myservices.length === 0 ? (
                            <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto mb-4">
                                    <Package className="h-8 w-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">No Services Listed Yet</h2>
                                <p className="mt-1 max-w-sm mx-auto text-xs text-slate-500">
                                    Create your first pet listing or add a service offering so pet owners can discover you.
                                </p>
                                <Link
                                    to="/add-services"
                                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" /> Create Your First Listing
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-6 lg:grid-cols-2">
                                {myservices.map((service) => (
                                    <article
                                        key={service._id}
                                        className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
                                    >
                                        <div className="h-52 overflow-hidden bg-slate-100 relative">
                                            <img
                                                src={service?.imgurl}
                                                alt={service?.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            {service?.category && (
                                                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md">
                                                    <Tag className="h-3 w-3 text-blue-500" />
                                                    {service.category}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{service?.name}</h3>
                                                    {service?.location && (
                                                        <p className="text-xs font-medium text-slate-500 mt-1">{service.location}</p>
                                                    )}
                                                </div>
                                                <span className="rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-extrabold text-blue-700 shrink-0">
                                                    ${service?.price}
                                                </span>
                                            </div>

                                            {service?.description && (
                                                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                                    {service.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                    <Calendar className="h-3 w-3 text-blue-500" /> {service?.date || 'Recently added'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 font-bold border border-emerald-200">
                                                    <ShieldCheck className="h-3 w-3" /> Live on Site
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                                                <button
                                                    onClick={() => handledelete(service?._id)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer active:scale-95"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Listing
                                                </button>
                                                <Link
                                                    to={`/update/${service?._id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 cursor-pointer active:scale-95"
                                                >
                                                    <Edit3 className="h-4 w-4" /> Edit Listing
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* TAB 2: RECEIVED CUSTOMER ORDERS */}
                {!loading && activeTab === 'orders' && (
                    <>
                        {visibleReceivedOrders.length === 0 ? (
                            <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto mb-4">
                                    <ShoppingBag className="h-8 w-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">No Customer Orders Received Yet</h2>
                                <p className="mt-1 max-w-sm mx-auto text-xs text-slate-500">
                                    When other users place orders or adoption requests on your listings, they will appear here for your review and approval.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                {visibleReceivedOrders.map((order, idx) => {
                                    const isApproved = order?.status?.toLowerCase() === 'approved';
                                    return (
                                        <div
                                            key={order._id || idx}
                                            className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition hover:shadow-xl"
                                        >
                                            {/* Order Card Header */}
                                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                                                    <span className="font-extrabold text-slate-800 text-sm">
                                                        {order.productName}
                                                    </span>
                                                </div>
                                                {isApproved ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
                                                        <CheckCircle2 className="h-3 w-3" /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-[11px] font-extrabold text-amber-700">
                                                        <Clock className="h-3 w-3" /> Pending Approval
                                                    </span>
                                                )}
                                            </div>

                                            {/* Order Details Body */}
                                            <div className="p-6 space-y-4">
                                                <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-4">
                                                    <div>
                                                        <p className="text-slate-400 text-[11px] font-semibold">Total Price</p>
                                                        <p className="text-base font-extrabold text-blue-700 mt-0.5">${order.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-[11px] font-semibold">Quantity</p>
                                                        <p className="text-sm font-bold text-slate-800 mt-0.5">{order.quantity || 1} unit(s)</p>
                                                    </div>
                                                </div>

                                                {/* Buyer Details */}
                                                <div className="space-y-2 text-xs text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                                    <p className="text-[11px] uppercase font-bold text-blue-600 tracking-wider">Buyer Details</p>

                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                                        <span className="font-bold text-slate-800">{order.buyername || 'N/A'}</span>
                                                    </div>

                                                    {order.buyeremail && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                                                            <span>{order.buyeremail}</span>
                                                        </div>
                                                    )}

                                                    {order.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                            <span>{order.phone}</span>
                                                        </div>
                                                    )}

                                                    {order.address && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{order.address}</span>
                                                        </div>
                                                    )}

                                                    {order.date && (
                                                        <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons: Approve & Delete */}
                                                <div className="flex items-center justify-end gap-3 pt-2">
                                                    <button
                                                        onClick={() => handleDeleteReceivedOrder(order._id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer active:scale-95"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete Order
                                                    </button>

                                                    {!isApproved ? (
                                                        <button
                                                            onClick={() => handleApproveOrder(order._id)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 cursor-pointer active:scale-95"
                                                        >
                                                            <Check className="h-4 w-4" /> Approve Order
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                                                            <CheckCircle2 className="h-4 w-4" /> Approved
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Myservices;
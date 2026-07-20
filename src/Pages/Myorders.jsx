import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import {
    ShoppingBag, Calendar, MapPin, Phone, DollarSign,
    Hash, Search, LayoutGrid, List, CheckCircle2,
    Package, Sparkles, ArrowRight, RefreshCw, User, Mail, Trash2, Clock
} from 'lucide-react';
import { motion } from 'motion/react';

const Myorders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const { user } = useContext(AuthContext);

    const getDeletedOrderIds = () => {
        try {
            return new Set(JSON.parse(localStorage.getItem('warmpaws_deleted_orders') || '[]'));
        } catch (e) {
            return new Set();
        }
    };

    const addDeletedOrderId = (id) => {
        try {
            const existing = JSON.parse(localStorage.getItem('warmpaws_deleted_orders') || '[]');
            if (!existing.includes(id)) {
                existing.push(id);
                localStorage.setItem('warmpaws_deleted_orders', JSON.stringify(existing));
            }
            const localOrders = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]');
            const updated = localOrders.filter(o => o._id !== id);
            localStorage.setItem('warmpaws_orders', JSON.stringify(updated));
        } catch (e) {
            console.error("Local storage error", e);
        }
    };

    useEffect(() => {
        if (!user?.email) {
            setMyOrders([]);
            setLoading(false);
            return;
        }

        const deletedIds = getDeletedOrderIds();
        let approvedIds = new Set();
        try {
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

        setLoading(true);
        axios.get(`https://warm-paws-backend-bysaiem.vercel.app/orders?email=${user?.email}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                const currentUserEmail = user.email.toLowerCase().trim();

                // Filter orders belonging ONLY to the logged in user & not deleted
                const userOnlyOrders = data
                    .filter(order =>
                        order?.buyeremail?.toLowerCase().trim() === currentUserEmail &&
                        !deletedIds.has(order._id)
                    )
                    .map(applyApprovedStatus);

                // Combine with local storage orders
                try {
                    const localOrders = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]')
                        .filter(o => o?.buyeremail?.toLowerCase().trim() === currentUserEmail && !deletedIds.has(o._id))
                        .map(applyApprovedStatus);
                    const existingIds = new Set(userOnlyOrders.map(o => o._id));
                    localOrders.forEach(o => {
                        if (o._id && !existingIds.has(o._id)) {
                            userOnlyOrders.push(o);
                        }
                    });
                } catch (e) {
                    console.error("Local storage read error", e);
                }

                setMyOrders(userOnlyOrders);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                const currentUserEmail = user.email.toLowerCase().trim();
                try {
                    const localOrders = JSON.parse(localStorage.getItem('warmpaws_orders') || '[]')
                        .filter(o => o?.buyeremail?.toLowerCase().trim() === currentUserEmail && !deletedIds.has(o._id))
                        .map(applyApprovedStatus);
                    setMyOrders(localOrders);
                } catch (e) {
                    setMyOrders([]);
                }
                setLoading(false);
            });
    }, [user?.email]);

    // Handle Order Deletion with SweetAlert2 confirmation
    const handleDeleteOrder = (id) => {
        if (!id) return;
        Swal.fire({
            title: 'Delete Order?',
            text: "Are you sure you want to cancel and remove this order?",
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
                addDeletedOrderId(id);
                setMyOrders((prev) => prev.filter((order) => order._id !== id));

                // Attempt standard REST endpoint
                axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/orders/${id}`)
                    .catch(() => axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/delete/${id}`))
                    .finally(() => {
                        Swal.fire({
                            title: 'Order Deleted!',
                            text: 'The order has been removed successfully.',
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

    // Client-side search filtering
    const filteredOrders = myOrders.filter(order =>
        order?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.phone?.includes(searchTerm) ||
        order?.buyername?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate metrics
    const totalSpent = filteredOrders.reduce((sum, order) => sum + (Number(order?.price) || 0), 0);
    const totalQuantity = filteredOrders.reduce((sum, order) => sum + (Number(order?.quantity) || 1), 0);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-slate-50 to-white px-4 py-8 md:px-[80px] lg:px-[120px]">
            <title>My Orders | WarmPaws</title>

            {/* Header Banner */}
            <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-8 md:p-10 text-white shadow-[0_20px_60px_rgba(37,99,235,0.22)]">
                <div className="absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-300/20 blur-xl" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 backdrop-blur-md">
                            <ShoppingBag className="h-3.5 w-3.5" /> Order History
                        </span>
                        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            My Orders & Adoptions
                        </h1>
                        <p className="mt-2 max-w-xl text-xs leading-relaxed text-blue-100/90 sm:text-sm">
                            Manage and review all your requested pet care services, supplies, and adoption orders in one place.
                        </p>
                    </div>

                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-blue-700 shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl active:scale-[0.98] shrink-0"
                    >
                        <Sparkles className="h-4 w-4 text-blue-600" /> Browse More Services
                    </Link>
                </div>

                {/* Metrics Stats Row */}
                <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 border-t border-white/20 pt-6 sm:grid-cols-3">
                    <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-white">{filteredOrders.length}</p>
                            <p className="text-[11px] font-medium text-blue-100">Total Orders</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                            <Hash className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-white">{totalQuantity}</p>
                            <p className="text-[11px] font-medium text-blue-100">Items Ordered</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-white">${totalSpent}</p>
                            <p className="text-[11px] font-medium text-blue-100">Total Expenditure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar: Search & View Mode Toggle */}
            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by service name, address, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* View Mode Toggle Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${viewMode === 'table'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <List className="h-4 w-4" /> Table View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${viewMode === 'grid'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <LayoutGrid className="h-4 w-4" /> Grid Cards
                    </button>
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex animate-pulse items-center justify-between border-b border-slate-100 pb-4">
                            <div className="h-10 w-1/3 rounded-xl bg-slate-200"></div>
                            <div className="h-8 w-1/6 rounded-xl bg-slate-200"></div>
                            <div className="h-8 w-1/6 rounded-xl bg-slate-200"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredOrders.length === 0 && (
                <div className="my-10 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Orders Found</h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                        {searchTerm
                            ? `No orders matching "${searchTerm}". Try resetting your search.`
                            : "You haven't placed any adoption or service requests yet."}
                    </p>
                    <div className="mt-6 flex gap-3">
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer"
                            >
                                <RefreshCw className="h-3.5 w-3.5" /> Clear Search
                            </button>
                        )}
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700"
                        >
                            Explore Services <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Table View */}
            {!loading && filteredOrders.length > 0 && viewMode === 'table' && (
                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="py-4 px-5">#</th>
                                    <th className="py-4 px-5">Product / Service</th>
                                    <th className="py-4 px-5">Buyer Info</th>
                                    <th className="py-4 px-5">Total Price</th>
                                    <th className="py-4 px-5">Qty</th>
                                    <th className="py-4 px-5">Delivery Address</th>
                                    <th className="py-4 px-5">Phone</th>
                                    <th className="py-4 px-5">Date</th>
                                    <th className="py-4 px-5 text-center">Status</th>
                                    <th className="py-4 px-5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                {filteredOrders.map((order, index) => (
                                    <tr key={order._id || index} className="transition-colors hover:bg-blue-50/40">
                                        <td className="py-4 px-5 font-bold text-slate-400">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                                                    <Package className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-slate-900 line-clamp-1">
                                                    {order?.productName || 'Unnamed Order'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="text-xs">
                                                <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                    <User className="h-3 w-3 text-slate-400" /> {order?.buyername || 'N/A'}
                                                </p>
                                                {order?.buyeremail && (
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Mail className="h-2.5 w-2.5" /> {order.buyeremail}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 font-extrabold text-blue-700">
                                            ${order?.price}
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                                {order?.quantity || 1}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 max-w-[180px]">
                                            <div className="flex items-center gap-1.5 text-slate-600 line-clamp-1">
                                                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                                <span>{order?.address || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                <span>{order?.phone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                <span>
                                                    {order?.date ? new Date(order.date).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            {order?.status?.toLowerCase() === 'approved' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="h-3 w-3" /> Order Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-extrabold text-rose-700 border border-rose-200">
                                                    <Clock className="h-3 w-3" /> Order Not Approved
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-5 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteOrder(order._id)}
                                                title="Cancel & Delete Order"
                                                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 hover:border-rose-300 cursor-pointer active:scale-95"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grid Cards View */}
            {!loading && filteredOrders.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order, index) => (
                        <motion.div
                            key={order._id || index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:shadow-xl hover:border-blue-200"
                        >
                            <div>
                                {/* Header badge */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    {order?.status?.toLowerCase() === 'approved' ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                            <CheckCircle2 className="h-3 w-3" /> Order Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                                            <Clock className="h-3 w-3" /> Order Not Approved
                                        </span>
                                    )}
                                    <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                                </div>

                                {/* Title & Price */}
                                <div className="mt-4 flex items-start justify-between gap-3">
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                        {order?.productName || 'Service Order'}
                                    </h3>
                                    <span className="rounded-xl bg-blue-50 px-3 py-1 text-sm font-extrabold text-blue-700 shrink-0">
                                        ${order?.price}
                                    </span>
                                </div>

                                {/* Order Info Grid */}
                                <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                                        <span className="text-slate-400 font-medium">Quantity:</span>
                                        <span className="font-bold text-slate-800">{order?.quantity || 1} units</span>
                                    </div>

                                    {order?.buyername && (
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                            <span className="font-medium text-slate-700">{order.buyername}</span>
                                        </div>
                                    )}

                                    {order?.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            <span>{order.phone}</span>
                                        </div>
                                    )}

                                    {order?.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">{order.address}</span>
                                        </div>
                                    )}

                                    {order?.date && (
                                        <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer Delete Action */}
                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400 font-medium">Order Item</span>
                                <button
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer active:scale-95"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete Order
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Myorders;
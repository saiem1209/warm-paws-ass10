import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../Provider/AuthProvider';
import {
    Stethoscope, HeartHandshake, ShieldCheck, Award,
    Star, PhoneCall, Sparkles, CheckCircle2, Heart, UserCheck,
    Calendar, Clock, User, Mail, Phone, MapPin, FileText, X, DollarSign
} from 'lucide-react';

const vets = [
    {
        id: 'vet-1',
        name: 'Dr. Sarah Jenkins',
        title: 'Senior Veterinary Surgeon',
        degree: 'DVM, BVSc (12+ Yrs Exp)',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop',
        rating: '4.9',
        specialty: 'Surgery & Critical Care',
        status: 'Available Today',
        fee: 49
    },
    {
        id: 'vet-2',
        name: 'Dr. Michael Chen',
        title: 'Pet Nutrition & Wellness Specialist',
        degree: 'PhD Veterinary Science',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop',
        rating: '5.0',
        specialty: 'Dietetics & Preventative Care',
        status: 'Available Today',
        fee: 45
    },
    {
        id: 'vet-3',
        name: 'Dr. Emily Rodriguez',
        title: 'Behavioral & Adoption Specialist',
        degree: 'DVM, Canine Behaviorist',
        image: 'https://images.unsplash.com/photo-1594824813566-78a933f2a3ba?q=80&w=600&auto=format&fit=crop',
        rating: '4.9',
        specialty: 'Therapy & Rehabilitation',
        status: 'Available Tomorrow',
        fee: 55
    }
];

const carePillars = [
    {
        icon: HeartHandshake,
        color: 'text-rose-500 bg-rose-50 border-rose-100',
        title: 'Ethical & Compassionate Choice',
        description: 'We fight animal overpopulation and ensure every adoption stops unethical breeding practices.'
    },
    {
        icon: ShieldCheck,
        color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        title: 'Full Health & Vet Assurance',
        description: 'Every pet is vaccinated, microchipped, spayed/neutered, and certified by licensed veterinarians.'
    },
    {
        icon: UserCheck,
        color: 'text-blue-500 bg-blue-50 border-blue-100',
        title: 'Complete Behavioral History',
        description: 'Our expert team evaluates temperament, personality, and medical background for a seamless match.'
    },
    {
        icon: PhoneCall,
        color: 'text-amber-500 bg-amber-50 border-amber-100',
        title: '24/7 Emergency Vet Support',
        description: 'Get round-the-clock telephone and telemedicine guidance from certified veterinary surgeons.'
    }
];

const ExpertVets = () => {
    const [selectedVet, setSelectedVet] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const openBookingModal = (vet) => {
        setSelectedVet(vet);
        const modal = document.getElementById('vet_appointment_modal');
        if (modal) modal.showModal();
    };

    const handleBookAppointment = (e) => {
        e.preventDefault();
        if (!selectedVet) return;

        setIsSubmitting(true);
        const form = e.target;
        const buyername = form.buyername.value;
        const buyeremail = form.buyeremail.value;
        const phone = form.phone.value;
        const address = form.address.value;
        const petInfo = form.petInfo.value;
        const appointmentDate = form.appointmentDate.value;
        const notes = form.description.value;

        const formdata = {
            productId: selectedVet.id || `vet-${selectedVet.name.toLowerCase().replace(/\s+/g, '-')}`,
            productName: `Vet Consultation: ${selectedVet.name} (${selectedVet.specialty})`,
            buyername,
            buyeremail,
            phone,
            address,
            quantity: 1,
            price: selectedVet.fee || 49,
            note: `Pet Info: ${petInfo}. Date: ${appointmentDate}. Notes: ${notes}`,
            date: new Date()
        };

        axios.post("https://warm-paws-backend-bysaiem.vercel.app/orders", formdata)
            .then(res => {
                setIsSubmitting(false);
                const modal = document.getElementById('vet_appointment_modal');
                if (modal) modal.close();

                Swal.fire({
                    title: 'Appointment Confirmed!',
                    text: `Your consultation with ${selectedVet.name} has been booked. You can view it in your My Orders page.`,
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                    customClass: {
                        popup: 'rounded-3xl font-sans'
                    }
                });
                form.reset();
            })
            .catch(err => {
                setIsSubmitting(false);
                console.error(err);
                Swal.fire({
                    title: 'Booking Failed',
                    text: 'Unable to process your appointment request right now. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            });
    };

    return (
        <section className="relative my-16 overflow-hidden rounded-[3rem] bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 px-6 py-16 text-white shadow-2xl md:px-12 lg:px-16">
            {/* Glowing Backdrop Accents */}
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                        <Stethoscope className="h-4 w-4 text-blue-400" />
                        Medical Excellence & Ethical Care
                    </span>

                    <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                        Meet Our <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">Expert Veterinarians</span>
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                        Our dedicated team of certified veterinary professionals ensures every pet is fully vaccinated, healthy, and receives compassionate 24/7 care before and after adoption.
                    </p>
                </div>

                {/* Stats Counter Bar */}
                <div className="mt-10 grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:grid-cols-4">
                    <div className="text-center border-r border-white/10 last:border-none">
                        <p className="text-2xl font-black text-blue-400 sm:text-3xl">100%</p>
                        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-1">Vet Inspected</p>
                    </div>
                    <div className="text-center border-r border-white/10 last:border-none">
                        <p className="text-2xl font-black text-sky-400 sm:text-3xl">12+ Yrs</p>
                        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-1">Avg Experience</p>
                    </div>
                    <div className="text-center border-r border-white/10 last:border-none">
                        <p className="text-2xl font-black text-amber-400 sm:text-3xl">4.9/5</p>
                        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-1">Client Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-emerald-400 sm:text-3xl">24/7</p>
                        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mt-1">Vet Helpline</p>
                    </div>
                </div>

                {/* Expert Vets Profile Cards */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {vets.map((vet, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/50 hover:bg-white/10 hover:shadow-[0_20px_50px_rgba(37,99,235,0.25)]"
                        >
                            <div>
                                {/* Profile Image with Badge */}
                                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-800">
                                    <img
                                        src={vet.image}
                                        alt={vet.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                                    {/* Rating badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md border border-amber-400/30">
                                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                                        <span>{vet.rating}</span>
                                    </div>

                                    {/* Availability tag */}
                                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur-md shadow-md">
                                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                        {vet.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">{vet.specialty}</span>
                                        <span className="text-sm font-extrabold text-emerald-400">${vet.fee} Fee</span>
                                    </div>
                                    <h3 className="mt-1 text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                                        {vet.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{vet.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">{vet.degree}</p>
                                </div>
                            </div>

                            {/* Book Appointment CTA Action Button */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <button
                                    onClick={() => openBookingModal(vet)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] cursor-pointer active:scale-95"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span>Book Appointment</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Core Care Pillars Grid */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Our Commitment</span>
                        <h3 className="text-2xl font-bold text-white mt-1">Why Pet Parents Trust WarmPaws Vets</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {carePillars.map((pillar, index) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={index}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-white/10 hover:border-white/20"
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${pillar.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="mt-4 text-base font-bold text-white">{pillar.title}</h4>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{pillar.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Book Vet Appointment Modal */}
            <dialog id="vet_appointment_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white text-slate-800 p-0 shadow-2xl overflow-hidden border border-slate-100">

                    {/* Modal Banner Header */}
                    <div className="relative shrink-0 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 p-5 text-white">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white hover:bg-white/20 border-none cursor-pointer">
                                <X className="h-4 w-4" />
                            </button>
                        </form>
                        <h3 className="text-lg font-extrabold flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" /> Book Vet Appointment
                        </h3>
                        <p className="text-xs text-blue-100 mt-0.5">
                            {selectedVet ? `Schedule consultation with ${selectedVet.name}` : 'Schedule consultation'}
                        </p>
                    </div>

                    {/* Modal Body Form */}
                    {selectedVet && (
                        <form onSubmit={handleBookAppointment} className="flex flex-col flex-1 overflow-y-auto p-5 space-y-3.5">

                            {/* Doctor Summary Pill */}
                            <div className="flex items-center justify-between rounded-2xl bg-blue-50/80 p-3 border border-blue-100 text-xs shrink-0">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedVet.image}
                                        alt={selectedVet.name}
                                        className="h-10 w-10 rounded-xl object-cover"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-900">{selectedVet.name}</p>
                                        <p className="text-slate-500 text-[11px]">{selectedVet.specialty}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] uppercase font-bold text-blue-600">Fee</p>
                                    <p className="text-base font-extrabold text-blue-700">${selectedVet.fee}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Doctor / Service Name (ReadOnly) */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <Stethoscope className="h-3 w-3 text-blue-500" /> Vet Specialist
                                    </label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={selectedVet.name}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
                                    />
                                </div>

                                {/* Pet Name & Breed */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <Heart className="h-3 w-3 text-rose-500" /> Pet Name & Breed
                                    </label>
                                    <input
                                        required
                                        name="petInfo"
                                        type="text"
                                        placeholder="e.g. Bella (Golden Retriever)"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Owner Name */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <User className="h-3 w-3 text-blue-500" /> Owner Name
                                    </label>
                                    <input
                                        required
                                        name="buyername"
                                        defaultValue={user?.displayName || ''}
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Owner Email */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-blue-500" /> Owner Email
                                    </label>
                                    <input
                                        readOnly
                                        name="buyeremail"
                                        defaultValue={user?.email || ''}
                                        type="email"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Phone Number */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-blue-500" /> Contact Phone
                                    </label>
                                    <input
                                        required
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Preferred Date */}
                                <div>
                                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-blue-500" /> Preferred Date
                                    </label>
                                    <input
                                        required
                                        name="appointmentDate"
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            {/* Address / Location */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-blue-500" /> Clinic Location / Contact Address
                                </label>
                                <input
                                    required
                                    name="address"
                                    type="text"
                                    placeholder="Enter clinic address or home visit location"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Reason for Visit / Notes */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-blue-500" /> Reason for Visit / Symptoms
                                </label>
                                <textarea
                                    name="description"
                                    rows="2"
                                    placeholder="Describe pet symptoms, routine checkup request, or questions..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                ></textarea>
                            </div>

                            {/* Sticky Confirm Appointment Submit Button */}
                            <div className="pt-3 pb-1 border-t border-slate-100 shrink-0 sticky bottom-0 bg-white">
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-sky-600 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                                >
                                    {isSubmitting ? "Confirming Appointment..." : "Confirm Appointment"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </section>
    );
};

export default ExpertVets;
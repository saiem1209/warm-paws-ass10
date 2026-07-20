import React, { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddServices = () => {
    const { user } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const category = form.category.value;
        const price = parseInt(form.price.value);
        const location = form.location.value;
        const description = form.description.value;
        const imgurl = form.image.value;
        const date = form.date.value;
        const email = form.email.value;

        const formdata = {
            name,
            category,
            price,
            location,
            description,
            imgurl,
            date,
            email,
        };

        axios.post('https://warm-paws-backend-bysaiem.vercel.app/services', formdata)
            .then(() => {
                Swal.fire({
                    title: 'Successfully added!',
                    text: 'Your service is now live for pet owners to discover.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb'
                });
                e.target.reset();
            })
            .catch(() => {
                Swal.fire({
                    title: 'Something went wrong',
                    text: 'Please try again in a moment.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            });
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] lg:flex-row">
                <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-8 text-white sm:p-10 lg:p-12">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">Add a service</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Share a new pet care offering</h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-blue-50/90 sm:text-base">
                        Fill in the details below to publish a fresh listing for pet parents looking for trusted support.
                    </p>
                </div>

                <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 sm:p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                        <div className="mb-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Listing details</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-800">Create a new service</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Service name</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Puppy Boarding"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
                                <select name="category" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white">
                                    <option value="Pets">Pets</option>
                                    <option value="Food">Food</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Care Products">Care Products</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Price</span>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    min="0"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Your location"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Date</span>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Image URL</span>
                                <input
                                    type="url"
                                    name="image"
                                    placeholder="https://example.com/image.jpg"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                                <textarea
                                    name="description"
                                    placeholder="Describe your service and what makes it special"
                                    rows="4"
                                    required
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                ></textarea>
                            </label>

                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                                />
                            </label>
                        </div>

                        <button type="submit" className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                            Publish service
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddServices;
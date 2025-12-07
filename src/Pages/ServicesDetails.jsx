/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';
// import toast from "react-hot-toast";

const ServicesDetails = () => {

    const { id } = useParams()
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        fetch(`https://warm-paws-backend-bysaiem.vercel.app/services/${id}`)
            .then(res => res.json())
            .then(data => {
                setService(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setService(null);
            });
    }, [id])

    const handleorder = (e) => {
        e.preventDefault();

        const form = e.target;

        const productName = form.product.value;
        const buyername = form.buyername.value;
        const buyeremail = form.buyeremail.value;
        const phone = form.phone.value;
        const address = form.address.value;
        const quantity = parseInt(form.quantity.value);
        const price = parseInt(form.price.value);
        const note = form.description.value;

        const formdata = {
            productId:id,
            productName,
            buyername,
            buyeremail,
            phone,
            address,
            quantity,
            price,
            note,
            date: new Date()
        }

        axios.post("https://warm-paws-backend-bysaiem.vercel.app/orders" , formdata)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        })

    }

    // useEffect(() => {
    //     const findresult = services.find(service => service.serviceId == id)
    //     setServicedetails(findresult)

    // }, [id, services])

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (!name.trim() || !email.trim()) {
    //         toast.error("Please fill out all fields.");
    //         return;
    //     }
    //     toast.success("Booking successful!");
    //     setName("");
    //     setEmail("");
    // }
    return (
        <div className='p-8 md:px-[120px]'>

            {loading && <p>Loading service details...</p>}


            {!loading && service ? (
                <div className='bg-white p-6 rounded-lg shadow-xl'>


                    <img className='h-[400px] w-full object-cover rounded-md mb-6' src={service?.imgurl} />


                    <h2 className='text-4xl font-extrabold mb-4'>
                        {service.name}
                    </h2>


                    <div className="space-y-2 text-gray-700 mb-6">

                        <p className="text-lg">
                            <span className='font-semibold text-gray-900'>Category:</span> {service.category || "N/A"}
                        </p>


                        <p className="text-2xl font-bold">
                            <span className='font-semibold text-gray-900'>Price:</span> ${service.price}
                        </p>


                        <p className="text-lg">
                            <span className='font-semibold text-gray-900'>Location:</span> {service.location}
                        </p>


                        <p className="text-lg">
                            <span className='font-semibold text-gray-900'>Provider Email:</span> {service.email}
                        </p>


                        <p className="text-lg">
                            <span className='font-semibold text-gray-900'>Rating:</span> {service.rating}
                        </p>
                    </div>


                    <div className=" pt-4 mt-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {service.description}
                        </p>
                    </div>

                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button className="btn" onClick={() => document.getElementById('my_modal_3').showModal()}>Adapt/order</button>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
                            </form>
                            <form onSubmit={handleorder} className='fieldset bg-base-200 border-bbase-300 rounded-box w-full border p-4 '>
                                <legend className='fieldset-legend'>Order details</legend>
                                <label className="label">Product Name</label>
                                <input name="product" defaultValue={service?.name} type="text" className="input" placeholder="product name" />

                                <label className="label">Buyer Name</label>
                                <input name="buyername" defaultValue={user?.displayName} type="text" className="input" placeholder="my-awesome-page" />

                                <label className="label">Buyer Email</label>
                                <input name="buyeremail" defaultValue={user?.email} readOnly type="email" className="input" placeholder="Email" />

                                <label className="label">Quantity</label>
                                <input required name="quantity" type="number" className="input" placeholder="Quantity" />

                                <label className="label">Price</label>
                                <input name="price" defaultValue={service?.price} type="number" className="input" placeholder="Price" />

                                <label className="label">Address</label>
                                <input name="address" type="text" className="input" placeholder="address"></input>

                                <label className="label">Phone</label>
                                <input name="phone" type="text" className="input" placeholder="Phone" />

                                <label className="label">Additional notes</label>
                                <textarea name="description" type="text" className="input" placeholder="text"></textarea>

                                <button className="btn">Submit</button>
                            </form>
                        </div>
                    </dialog>


                </div>
            ) : (

                !loading && <p className="text-red-600">Service details could not be loaded. Please check the ID and server connection.</p>
            )}

        </div>
    );
};

export default ServicesDetails;
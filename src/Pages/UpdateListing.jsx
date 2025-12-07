import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Navigate, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateListing = () => {

    const { user } = useContext(AuthContext);
    const { id } = useParams()
    const [service, setService] = useState();
    const [category, setCategory] = useState(service?.category)
    const navigation = useNavigate();

    useEffect(() => {
        axios.get(`https://warm-paws-backend-bysaiem.vercel.app/services/${id}`)
            .then(res => {
                setService(res.data)
                setCategory(res.data.category)
            })
    }, [id])

    console.log(service);

    const handleupdate = (e) => {
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
            createdAt:service?.createdAt,
        }
        axios.put(`https://warm-paws-backend-bysaiem.vercel.app/update/${id}`, formdata)
        .then(res=>{
            console.log(res.data);
            navigation('/my-services')
            toast.success("successfully updated!")
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div>
            <title>Update Listing</title>
            <form
                onSubmit={handleupdate}
                className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-center mb-4">Update listing</h2>

                {/* Product/Pet Name */}
                <label className='font-semibold py-2' >Product/ Pet Name</label>
                <input
                    defaultValue={service?.name}
                    type="text"
                    name="name"
                    placeholder="Product / Pet Name"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Category */}
                <label className='font-semibold py-2' >Category</label>
                <select
                    value={category}
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="Pets">Pets</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Care Products">Care Products</option>
                </select>

                {/* Price */}
                <label className='font-semibold py-2' >Price</label>
                <input
                    defaultValue={service?.price}
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="0"

                    className={`w-full border px-3 py-2 rounded`}
                />

                {/* Location */}
                <label className='font-semibold py-2' >Location</label>
                <input
                    defaultValue={service?.location}
                    type="text"
                    name="location"
                    placeholder="Location"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Description */}
                <label className='font-semibold py-2' >Description</label>
                <textarea
                    defaultValue={service?.description}
                    name="description"
                    placeholder="Description"
                    rows="3"
                    required

                    className="w-full border px-3 py-2 rounded"
                ></textarea>

                {/* Image URL */}
                <label className='font-semibold py-2' >Image URL</label>
                <input
                    defaultValue={service?.imgurl}
                    type="url"
                    name="image"
                    placeholder="Image URL"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Date (Pick Up) */}
                <label className='font-semibold py-2' >Date</label>
                <input
                    defaultValue={service?.date}
                    type="date"
                    name="date"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Email - Readonly */}
                <label className='font-semibold py-2' >Email</label>
                <input

                    type="email"
                    name="email"
                    value={user?.email}
                    readOnly
                    className="w-full border px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateListing;
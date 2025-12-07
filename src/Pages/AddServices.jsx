import React, { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';

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
        }
        console.log(formdata);
        axios.post('http://localhost:3000/services', formdata)
        .then(res=>{
            console.log(res);
        })
    }
    return (
        <div>
            <title>Add Service</title>
            <form
                onSubmit={handleSubmit}
                className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-center mb-4">Add Product / Pet</h2>

                {/* Product/Pet Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Product / Pet Name"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Category */}
                <select
                    name="category"

                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="Pets">Pets</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Care Products">Care Products</option>
                </select>

                {/* Price */}
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="0"

                    className={`w-full border px-3 py-2 rounded`}
                />

                {/* Location */}
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Description */}
                <textarea
                    name="description"
                    placeholder="Description"
                    rows="3"
                    required

                    className="w-full border px-3 py-2 rounded"
                ></textarea>

                {/* Image URL */}
                <input
                    type="url"
                    name="image"
                    placeholder="Image URL"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Date (Pick Up) */}
                <input
                    type="date"
                    name="date"
                    required

                    className="w-full border px-3 py-2 rounded"
                />

                {/* Email - Readonly */}
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
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddServices;
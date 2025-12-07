/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// import toast from "react-hot-toast";

const ServicesDetails = () => {

 const { id } = useParams()
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/services/${id}`)
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

         
                    <h2 className='text-4xl font-extrabold text-blue-800 mb-4'>
                        {service.name}
                    </h2>

      
                    <div className="space-y-2 text-gray-700 mb-6">
             
                        <p className="text-lg">
                            <span className='font-semibold text-gray-900'>Category:</span> {service.category || "N/A"}
                        </p>

          
                        <p className="text-2xl font-bold text-green-600">
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

                  
                    <div className="border-t pt-4 mt-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {service.description || "No detailed description provided for this service."}
                        </p>
                    </div>



                </div>
            ) : (
                
                !loading && <p className="text-red-600">Service details could not be loaded. Please check the ID and server connection.</p>
            )}

        </div>
    );
};

export default ServicesDetails;
import React, { useEffect, useState } from 'react';

const Services = () => {

    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('/services.json')
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(err => console.log(err))
    }, [])
    return (
        <div className='px-[120px] mb-4'>
            <div className='grid grid-cols-1 mt-12 md:grid-cols-3 gap-4'>
                {
                    services.map(service =>
                        <div className="card bg-base-100 w-80 shadow-sm">
                            <figure>
                                <img
                                    className='h-[200px] w-full object-cover'
                                    src={service?.image}
                                    alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-lg">{service?.serviceName}</h2>
                                <div className='flex justify-between'>
                                    <p>Rating:{service?.rating}</p>
                                    <p>Price:{service?.price}</p>
                                </div>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">View Details</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Services;
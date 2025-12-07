import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

const PopularSection = () => {

    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/services')
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(err => console.log(err))
    }, [])

    console.log(services);
    return (
        <div>
            <div className='mt-8 md:px-[120px] px-[50px]'>
                <div>
                    <h3 className='font-bold text-3xl text-center'>Popular Winter Care Services</h3>
                </div>
                <div className='grid grid-cols-1 mt-12 md:grid-cols-3 gap-4'>
                    {
                        services.slice(0, 3).map(service =>
                            <div className="card bg-base-100 w-full shadow-sm hover:shadow-xl transition">
                                <figure>
                                    <img
                                        className='h-[200px] w-full object-cover'
                                        src={service?.imgurl}
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-lg">{service?.name}</h2>
                                    <div className='flex justify-between'>
                                        <p>Date:{service?.date}</p>
                                        <p>Price:{service?.price}</p>
                                    </div>
                                    <div className="card-actions justify-end">
                                       <Link to={`/details/${service?._id}`}><button className="btn btn-primary">View Details</button></Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default PopularSection;
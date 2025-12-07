import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Link } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const Myservices = () => {
    const [myservices, setmyServices] = useState([]);

    const { user } = useContext(AuthContext);
    useEffect(() => {
        fetch(`https://warm-paws-backend-bysaiem.vercel.app/my-services?email=${user?.email}`)
            .then(res => res.json())
            .then(data => setmyServices(data))
            .catch(err => console.log(err))
    }, [user?.email])

    console.log(myservices)
    const handledelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://warm-paws-backend-bysaiem.vercel.app/delete/${id}`)
                    .then(res => {
                        console.log(res.data)
                        const filterData = myservices.filter(service => service._id != id)
                        // console.log(filterData)
                        setmyServices(filterData)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
            }
        });

    }
    return (
        <div className='flex flex-col mx-auto items-center'>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            myservices.map(service =>
                                <tr>

                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={service?.imgurl}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{service?.name}</div>
                                                <div className="text-sm opacity-50">{service?.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{service?.category}</p>
                                    </td>
                                    <td><p>{service?.price}</p></td>
                                    <td className='flex gap-2'>
                                        <button onClick={() => handledelete(service?._id)} className="btn btn-error btn-xs">Delete</button>
                                        <Link to={`/update/${service?._id}`}><button className="btn btn-primary btn-xs">Edit</button></Link>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Myservices;
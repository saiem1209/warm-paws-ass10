import React from 'react';
import { Link } from 'react-router';

const Registration = () => {
    return (
        <div>
            <div className="hero min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <fieldset className="fieldset">
                                <label className="label">Name</label>
                                <input type="text" className="input" placeholder="Enter Name" />
                                <label className="label">PhotoUrl</label>
                                <input type="text" className="input" placeholder="Enter Image URL" />
                                <label className="label">Email</label>
                                <input type="email" className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input type="password" className="input" placeholder="Password" />
                                <button className="btn btn-neutral mt-4">Register</button>
                                <div>
                                    <span>Already have an account?</span><Link to="/login">Login</Link>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
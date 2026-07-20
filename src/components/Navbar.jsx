import React, { useContext, useState } from 'react';
import logo from '../assets/pawmart.png';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { signOut } from 'firebase/auth';
import auth from '../Firebase/firebase.config';

const Navbar = () => {
    const [isChecked, setIschecked] = useState(true);

    const handletheme = () => {
        setIschecked(!isChecked);
        if (isChecked) {
            document.querySelector('html').setAttribute('data-theme', 'dark');
        } else {
            document.querySelector('html').setAttribute('data-theme', 'light');
        }
    };

    const { user } = useContext(AuthContext);

    const handlesignout = () => {
        signOut(auth);
    };

    return (
        <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-4 lg:px-6">
            <div className="navbar rounded-full border border-blue-100/80 bg-white/90 px-2 shadow-[0_10px_30px_rgba(59,130,246,0.12)] backdrop-blur md:px-4">
                <div className="navbar-start">
                    <div className="dropdown lg:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </label>
                        <ul tabIndex="-1" className="menu dropdown-content menu-sm z-[1] mt-3 w-56 rounded-2xl border border-blue-100 bg-base-100 p-2 shadow-xl">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/services">Pets & Supplies</Link></li>
                            {user && (
                                <>
                                    <li><Link to={'/profile'}>My Profile</Link></li>
                                    <li><Link to={'/add-services'}>Add Listing</Link></li>
                                    <li><Link to={'/my-services'}>My Listing</Link></li>
                                    <li><Link to={'/my-orders'}>My orders</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <Link to="/" className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-blue-50">
                        <img className="h-11 w-11 rounded-full object-cover" src={logo} alt="PawMart logo" />
                        <div className="leading-tight">
                            <h2 className="text-xl font-black tracking-tight text-blue-900">PawMart</h2>
                            <p className="text-xs font-medium text-blue-500">Pet care made easy</p>
                        </div>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal rounded-full bg-blue-50/70 px-1 py-1">
                        <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to="/">Home</Link></li>
                        <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to="/services">Pets & Supplies</Link></li>
                        {user && (
                            <>
                                <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to={'/profile'}>My Profile</Link></li>
                                <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to={'/add-services'}>Add Listing</Link></li>
                                <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to={'/my-services'}>My Listing</Link></li>
                                <li><Link className="rounded-full px-4 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700" to={'/my-orders'}>My orders</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="navbar-end flex items-center gap-2 sm:gap-3">
                    <label className="swap swap-rotate">
                        <input onClick={handletheme} type="checkbox" defaultChecked />
                        <svg className="swap-on h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M5.64 17.66A9 9 0 1 0 6.34 6.34 9 9 0 0 0 5.64 17.66Z" />
                        </svg>
                        <svg className="swap-off h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                        </svg>
                    </label>

                    {user ? (
                        <>
                            <div className="avatar tooltip tooltip-bottom" data-tip={user?.displayName || 'User'}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-2xl ring-2 ring-blue-500 ring-offset-2 ring-offset-white">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="profile" className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <span aria-label="cat profile placeholder">🐱</span>
                                    )}
                                </div>
                            </div>
                            <button onClick={handlesignout} className="btn btn-sm rounded-full border-0 bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link className="btn btn-sm rounded-full border-0 bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700" to="/login">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
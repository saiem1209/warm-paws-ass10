import React, { useContext, useState } from 'react';
import logo from '../assets/pawmart.png'
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { signOut } from 'firebase/auth';
import auth from '../Firebase/firebase.config';
const Navbar = () => {

    const [isChecked, setIschecked] = useState(true);
    const handletheme = () =>{
        setIschecked(!isChecked);
        if(isChecked){
            document.querySelector('html').setAttribute('data-theme', 'dark')
        }else{
            document.querySelector('html').setAttribute('data-theme', 'light')
        }
    }


    const { user } = useContext(AuthContext)

    const handlesignout = () => {
        signOut(auth)
    }
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </label>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/services">Pets & Supplies</Link></li>
                            {
                                user && (
                                    <>
                                        <li><Link to={'/profile'}>My Profile</Link></li>
                                        <li><Link to={'/add-services'}>Add Listing</Link></li>
                                        <li><Link to={'/my-services'}>My Listing</Link></li>
                                        <li><Link to={'/my-orders'}>My orders</Link></li>
                                    </>
                                )
                            }
                        </ul>
                    </div>
                    <div className='flex items-center'><img className="w-full h-12" src={logo} alt="" /> <h2 className='font-bold text-3xl text-blue-900'>PawMart</h2></div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link>Home</Link></li>
                        <li><Link to="/services">Pets & Supplies</Link></li>
                        {
                            user && (
                                <>
                                    <li><Link to={'/profile'}>My Profile</Link></li>
                                    <li><Link to={'/add-services'}>Add Listing</Link></li>
                                    <li><Link to={'/my-services'}>My Listing</Link></li>
                                    <li><Link to={'/my-orders'}>My orders</Link></li>
                                </>
                            )
                        }

                    </ul>
                </div>

                <input onClick={handletheme} type="checkbox"  defaultChecked className="toggle" />

                {
                    user && <div className="navbar-end flex items-center gap-3">
                        <div
                            className="avatar tooltip tooltip-bottom"
                            data-tip={user?.displayName || "User"}
                        >
                            <div className="w-8 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL} alt="profile" />
                            </div>
                        </div>

                        <div>
                            <button onClick={handlesignout} className="btn" to="/login">
                                Logout
                            </button>
                        </div>
                    </div>
                }
                {
                    !user && <div className="navbar-end">
                        <Link className="btn" to="/login">Login</Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default Navbar;
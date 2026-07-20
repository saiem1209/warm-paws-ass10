
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router';
import auth from '../Firebase/firebase.config';
import { useContext, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from "react-hot-toast";

const Login = () => {


    const { setUser, handlegooglesignin } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const[email, setEmail] = useState('');

    const handlesubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                toast.success("Login Successful!");
                navigate(location.state ? location.state : '/')
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    const googlesignin = () => {
        handlegooglesignin()
            .then(result => {
                const user = result.user
                setUser(user)
                toast.success("Login Successful!");
                navigate(location.state ? location.state : '/')
            })
            .catch(error => {
                toast.error(error.message);
            })
    }
    const handleforget = (e) => {
        e.preventDefault();
        navigate(`/forget/${email}`)
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_45%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] lg:flex-row">
                <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-8 text-white sm:p-10 lg:p-12">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c2.5 0 4.5 2 4.5 4.5 0 1.4-.6 2.7-1.6 3.6a5 5 0 0 0 2.1 8.3l-1.3 1.4a1 1 0 0 1-1.4 0l-1.4-1.4a5 5 0 0 0-2.8-.8 5 5 0 0 0-2.8.8l-1.4 1.4a1 1 0 0 1-1.4 0l-1.3-1.4a5 5 0 0 0 2.1-8.3A4.5 4.5 0 0 1 7.5 6.5 4.5 4.5 0 0 1 12 2Z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Sign in to your PawMart account</h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-blue-50/90 sm:text-base">
                        Manage appointments, discover trusted pet services, and stay connected with your furry favorites.
                    </p>
                </div>

                <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 sm:p-8 lg:p-10">
                    <div className="w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
                        <div className="mb-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Access portal</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-800">Login to continue</h2>
                            <p className="mt-2 text-sm text-slate-500">Use your email or Google account to get started.</p>
                        </div>

                        <form onSubmit={handlesubmit} className="space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                                <input onChange={(e) => setEmail(e.target.value)} name='email' type="email" className="input input-bordered w-full rounded-2xl border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white" placeholder="your@email.com" />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                                <input name='password' type="password" className="input input-bordered w-full rounded-2xl border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white" placeholder="Enter your password" />
                            </label>

                            <div className="flex items-center justify-between text-sm">
                                <button type="button" onClick={handleforget} className="font-medium text-blue-600 transition hover:text-blue-700">Forgot password?</button>
                                <Link className="font-medium text-slate-600 transition hover:text-blue-600" to="/registration">Create account</Link>
                            </div>

                            <button type="button" onClick={googlesignin} className="btn w-full rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50">
                                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                Login with Google
                            </button>

                            <button className="btn btn-primary w-full rounded-2xl border-0 bg-blue-600 text-white hover:bg-blue-700">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
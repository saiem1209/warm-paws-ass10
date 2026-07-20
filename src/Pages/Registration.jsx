import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import auth, { storage } from '../Firebase/firebase.config';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from "react-hot-toast";

const Registration = () => {
    const navigate = useNavigate();
    const { registerwitheEmalPassword, setUser, handlegooglesignin } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localPreviewUrl = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewUrl(localPreviewUrl);
            setSelectedFileName(file.name);
        }
    };

    const uploadProfileImage = async (file) => {
        const imageRef = ref(storage, `profile-images/${auth.currentUser?.uid || Date.now()}-${file.name}`);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value;

        const uppercase = /[A-Z]/;
        const lowercase = /[a-z]/;

        if (password.length < 6) {
            return alert("Password must be at least 6 characters");
        }
        if (!uppercase.test(password)) {
            return alert("Password needs an uppercase letter");
        }
        if (!lowercase.test(password)) {
            return alert("Password needs a lowercase letter");
        }

        try {
            const userCredential = await registerwitheEmalPassword(email, password);
            let photoURL = userCredential.user?.photoURL || previewUrl || '';

            // Safe profile updating without breaking main flow
            try {
                if (selectedImage) {
                    photoURL = await uploadProfileImage(selectedImage);
                }

                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, {
                        displayName: name,
                        photoURL: photoURL || null
                    });
                }
            } catch (profileError) {
                console.warn('Profile image update warning:', profileError);
            }

            // Set logged-in user in context
            setUser({
                ...userCredential.user,
                displayName: name,
                photoURL: photoURL || ''
            });

            toast.success("Registration Successful!");

            // Immediate Navigation to Home Page
            setTimeout(() => {
                window.location.replace('/');
            }, 300);

        } catch (error) {
            console.error('Registration Error:', error);
            toast.error(error.message || 'Registration failed');
        }
    };

    const googlesignup = () => {
        handlegooglesignin()
            .then(result => {
                const user = result.user;
                setUser(user);
                toast.success("Google Sign-In Successful!");
                setTimeout(() => {
                    window.location.replace('/');
                }, 300);
            })
            .catch(error => {
                console.error(error);
                toast.error(error.message || 'Google registration failed');
            });
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_45%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] lg:flex-row">
                <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-8 text-white sm:p-10 lg:p-12">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c2.5 0 4.5 2 4.5 4.5 0 1.4-.6 2.7-1.6 3.6a5 5 0 0 0 2.1 8.3l-1.3 1.4a1 1 0 0 1-1.4 0l-1.4-1.4a5 5 0 0 0-2.8-.8 5 5 0 0 0-2.8.8l-1.4 1.4a1 1 0 0 1-1.4 0l-1.3-1.4a5 5 0 0 0 2.1-8.3A4.5 4.5 0 0 1 7.5 6.5 4.5 4.5 0 0 1 12 2Z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">Join us</p>
                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Create your PawMart profile</h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-blue-50/90 sm:text-base">
                        Register to book trusted pet services, explore listings, and keep your pet care plan in one place.
                    </p>
                </div>

                <div className="flex flex-1 items-center justify-center bg-slate-50 p-6 sm:p-8 lg:p-10">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-800">Create an account</h2>
                            <p className="mt-2 text-sm text-slate-500">Sign up to manage your pet services and bookings</p>
                        </div>

                        <button
                            type="button"
                            onClick={googlesignup}
                            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative flex items-center justify-center">
                            <div className="w-full border-t border-slate-200" />
                            <span className="absolute bg-slate-50 px-3 text-xs uppercase tracking-wider text-slate-400">or</span>
                        </div>

                        <form onSubmit={handlesubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Enter your name"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Profile Picture (Optional)</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex flex-1 cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition hover:border-blue-400">
                                        <span className="truncate">{selectedFileName || 'Choose image file'}</span>
                                        <span className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Browse</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    {previewUrl && (
                                        <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded-2xl object-cover border border-blue-200 shadow-sm shrink-0" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-[0.99] cursor-pointer"
                            >
                                Register Account
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
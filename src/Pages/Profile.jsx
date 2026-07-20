import React, { useContext, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import auth, { storage } from '../Firebase/firebase.config';

const Profile = () => {
    const { setUser, user } = useContext(AuthContext);
    const [isopen, setIsopen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleOpenForms = () => {
        setIsopen(!isopen);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localPreviewUrl = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewUrl(localPreviewUrl);
        }
    };

    const uploadProfileImage = async (file) => {
        const imageRef = ref(storage, `profile-images/${auth.currentUser?.uid || Date.now()}-${file.name}`);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
    };

    const handleupdate = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;

        try {
            let photoURL = previewUrl || user?.photoURL || '';

            setUser({
                ...user,
                displayName: name,
                photoURL
            });

            let updateSucceeded = false;

            if (selectedImage) {
                try {
                    photoURL = await uploadProfileImage(selectedImage);
                    await updateProfile(auth.currentUser, {
                        displayName: name,
                        photoURL: photoURL || null
                    });
                    await auth.currentUser.reload();
                    const refreshedUser = auth.currentUser;

                    setUser({
                        ...user,
                        ...refreshedUser,
                        displayName: name,
                        photoURL: refreshedUser.photoURL || photoURL || ''
                    });
                    setPreviewUrl(refreshedUser.photoURL || photoURL || previewUrl);
                    updateSucceeded = true;
                } catch (uploadError) {
                    toast.error(uploadError.message || 'Image upload failed. Please check Firebase Storage rules.');
                    updateSucceeded = false;
                }
            } else {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photoURL || null
                });
                updateSucceeded = true;
            }

            setSelectedImage(null);
            setPreviewUrl('');

            if (updateSucceeded) {
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_45%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[2rem] border border-blue-100 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:flex-row lg:p-8">
                <div className="flex flex-1 min-w-0 flex-col items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-8 text-center text-white">
                    <div className="avatar mb-5">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/80 ring-offset-4 ring-offset-blue-500">
                            {previewUrl || user?.photoURL ? (
                                <img src={previewUrl || user?.photoURL} alt="profile" className="h-full w-full rounded-full object-cover" />
                            ) : (
                                <span className="text-6xl" aria-label="cat profile placeholder">🐱</span>
                            )}
                        </div>
                    </div>
                    <h2 className="w-full text-2xl font-bold break-words">{user?.displayName || 'Pet Parent'}</h2>
                    <p className="mt-2 w-full break-words text-sm text-blue-50">{user?.email || 'No email available'}</p>
                    <div className="mt-5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                        PawMart Member
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Profile</p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-800">Your account details</h3>
                        </div>
                        <button
                            onClick={handleOpenForms}
                            className="btn rounded-full border-0 bg-blue-600 px-4 text-white hover:bg-blue-700"
                        >
                            {isopen ? 'Close' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">Full Name</p>
                                <p className="mt-1 text-base font-medium text-slate-800">{user?.displayName || 'Not provided yet'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">Email</p>
                                <p className="mt-1 text-base font-medium text-slate-800">{user?.email || 'Not available'}</p>
                            </div>
                        </div>
                    </div>

                    {isopen && (
                        <form onSubmit={handleupdate} className="mt-6 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
                                    <input
                                        defaultValue={user?.displayName || ''}
                                        name="name"
                                        type="text"
                                        className="input input-bordered w-full rounded-2xl border-slate-300 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:bg-white"
                                        placeholder="Your Name"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">Profile Image</span>
                                    <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                                        />
                                    </div>
                                </label>
                            </div>

                            <button className="btn mt-5 w-full rounded-2xl border-0 bg-blue-600 text-white hover:bg-blue-700">
                                Save Changes
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
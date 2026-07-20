import React, { createContext, useEffect, useState } from 'react';
import auth from '../Firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

export const AuthContext = createContext();
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const registerwitheEmalPassword = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const handlegooglesignin = () => {
        return signInWithPopup(auth, provider);
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unSubscribe();
        };
    }, []);

    const authData = {
        registerwitheEmalPassword,
        setUser,
        user,
        handlegooglesignin,
        loading,
    };

    return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
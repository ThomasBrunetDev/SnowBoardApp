import React, { useEffect, useContext, useState } from "react";
import { auth, db } from "../Config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';

const authContext = React.createContext({
    user: null,
    signUp: () => { },
    signIn: () => { },
    signOut: () => { },
    isLoading: true,
    v_: 0,
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email, password, username) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                id: user.uid,
                email: user.email,
                username: username,
                admin: false,
                createdAt: new Date(),
                SnowDay : [],
                contacts : [],
                latitude : '',
                longitude : '',
                likedDestinations : [],
            });
            return '';
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                return "L'adresse email est déjà utilisée par un autre compte.";
            }
            else if (error.code === "auth/weak-password") {
                return "Le mot de passe doit contenir au moins 6 caractères.";
            }
            else if (error.code === "auth/invalid-email") {
                return "L'adresse email est mal formée.";
            }
            else{
                return "Erreur de création de compte. Réessayez.";
            }
        }
    };

    const signIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return '';
        } catch (error) {
            console.log("Erreur de connexion", error.code);
            if (error.code === "auth/user-not-found") {
                return "Aucun utilisateur ne correspond à l'adresse email donnée." ;
            }
            else if (error.code === "auth/invalid-credential") {
                return "Le mot de passe est incorrect." ;
            }
            else if (error.code === "auth/invalid-email") {
                return "L'adresse email est mal formée." ;
            }
            else{
                return "Erreur de connexion. Réessayez. ";
            }
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("Erreur de deconnexion", error);
        }
    };

    return (
        <authContext.Provider value={{ v_: 1, user, signUp, signIn, logOut, isLoading }}>
            {children}
        </authContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(authContext);
    if (context.v_ === 0) {
        console.error("Le contexte est utilisé en dehors de son provider");
    }
    return context;
}

export { AuthProvider, authContext, useAuth };

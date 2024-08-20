import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc, setDoc, collection, addDoc, deleteDoc, increment, getDocs } from "firebase/firestore";
import { db } from "../Config/firebase";
import React, { useEffect, useState, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth();

const userContext = React.createContext({
    notificationMessage: null,
    checkIfFriend: async (contactUid) => { },
    resetNotificationMessage: async () => { },
    addSnowDay: async (snowDay) => { },
    getDatabase: async (userID) => { },
    getAllSnowDayDatabase: async () => { },
    getAllDestinationDatabase: async () => { },
    addContact: async (contactUid) => { },
    addDestination: async (destination) => { },
    removeDestination: async (id) => { },
    removePostSnowDay: async (id) => { },
    likeDestination: async (destinationId) => { },
    checkIfLiked: async (destinationId) => { },
    getAllUserDatabase: async () => { },
    getUserLattitudeAndLongitude: async () => { },
    writeUserLattitudeAndLongitude: async (latitude, longitude) => { },
    v_: 0,
});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [snowDays, setSnowDays] = useState([]);
    const [likedDestinations, setLikedDestinations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const addSnowDay = async (snowDay) => {
        try {
            console.log(snowDay);
            if (!user) {
                console.error("aucun utilisateur connecté");
                return;
            }

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const newUniqueID = uuidv4();

            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, {
                    SnowDay: [
                        ...(userDocSnap.data().SnowDay || []),
                        {
                            id: newUniqueID,
                            userId: user.uid,
                            userEmail: user.email,
                            title: snowDay.title,
                            date: snowDay.date,
                        },
                    ],
                });
            } else {
                await setDoc(userDocRef, {
                    SnowDay: [
                        {
                            id: newUniqueID,
                            userId: user.uid,
                            userEmail: user.email,
                            title: snowDay.title,
                            date: snowDay.date,
                        }],
                });
            }
            console.log('Journée de ski/snow ajoutée');
            setNotificationMessage(`Sortie ${snowDay.public ? "publique" : "privée"} ajoutée`);
            addPublicSnowDay(snowDay, newUniqueID);
        } catch (error) {
            console.error('Erreur en ajoutant une journée de ski/snow', error);
        }
    };

    const addPublicSnowDay = async (snowDay, newUniqueID) => {
        try {
            const username = await getDatabase(user.uid);
            const publicSnowDayRef = doc(db, 'SnowDays', newUniqueID);
            await setDoc(publicSnowDayRef, {
                id: newUniqueID,
                userEmail: user.email,
                username: username.username,
                userId: user.uid,
                Title: snowDay.title,
                Date: snowDay.date,
                Emplacement: snowDay.emplacement,
                Time: snowDay.time,
                Distance: snowDay.distance,
                Track: snowDay.track,
                Public: snowDay.public
            });
            console.log('Journée de ski/snow publique ajoutée');
        } catch (error) {
            console.error('Erreur en ajoutant une journée de ski/snow publique', error);
        }
    };

    const addContact = async (contactUid) => {
        try {
            if (!user) {
                console.error("aucun utilisateur connecté");
                return;
            }

            if (user.uid === contactUid) {
                console.error("Impossible de s'ajouter soi-même en contact.");
                return;
            } else {

                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    let contacts = userDocSnap.data().contacts || [];

                    if (contacts.includes(contactUid)) {
                        console.log("retrait du contact");
                        contacts = contacts.filter(existingContactUid => existingContactUid !== contactUid);
                        setNotificationMessage("Contact retiré");
                    } else {
                        console.log("ajout du contact");
                        contacts.push(contactUid);
                        setNotificationMessage("Contact ajouté");
                    }
                    setContacts(contacts)
                    await updateDoc(userDocRef, { contacts });
                } else {
                    console.error("Document de l'utilisateur n'existe pas.");
                }
            }
        } catch (error) {
            console.error('Erreur en ajoutant un contact:', error);
        }
    };

    const likeDestination = async (destination) => {
        try {
            console.log(destination);
            if (!user) {
                console.error("Aucun utilisateur connecté");
                return;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                let likedDestinations = userDocSnap.data().likedDestinations || [];
                const existingDestinationIndex = likedDestinations.findIndex(item => item.id === destination.id);
                if (existingDestinationIndex !== -1) {
                    console.log("Retrait du like pour la destination:", destination.id);
                    likedDestinations.splice(existingDestinationIndex, 1);
                    setNotificationMessage("Favori retiré");
                } else {
                    console.log("Ajout du like pour la destination:", destination.id);
                    likedDestinations.push(destination);
                    setNotificationMessage("Favori ajouté");
                }
                setLikedDestinations(likedDestinations);
                await updateDoc(userDocRef, { likedDestinations });
            } else {
                console.error("Document de l'utilisateur n'existe pas.");
            }
        } catch (error) {
            console.error('Erreur lors de la gestion des likes de destination:', error);
        }
    };



    const checkIfLiked = async (destinationId) => {
        try {
            if (!user) {
                console.error("Aucun utilisateur connecté");
                return false;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const likedDestinations = userDocSnap.data().likedDestinations || [];
                const existingDestination = likedDestinations.find(item => item.id === destinationId);
                return !!existingDestination;
            } else {
                console.error("Document de l'utilisateur n'existe pas.");
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification si la destination est aimée:', error);
            return false;
        }
    };

    const checkIfFriend = async (contactUid) => {
        try {
            if (!user) {
                console.error("Aucun utilisateur connecté");
                return false;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const contacts = userDocSnap.data().contacts || [];
                return contacts.includes(contactUid);
            } else {
                console.error("Document de l'utilisateur n'existe pas.");
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la vérification si l\'utilisateur est un ami:', error);
            return false;
        }
    };


    const getDatabase = async (userID) => {
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                return userDocSnap.data();
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Erreur en récupérant la base de donnée', error);
        }
    };

    const getAllSnowDayDatabase = async () => {
        try {
            const snowDaysCollection = collection(db, "SnowDays");
            const querySnapshot = await getDocs(snowDaysCollection);
            const snowDays = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return snowDays;
        } catch (error) {
            console.error("Erreur en récupérant toutes les journées de ski/snow", error);
            return [];
        }
    };

    const getAllUserDatabase = async () => {
        try {
            const usersCollection = collection(db, "users");
            const querySnapshot = await getDocs(usersCollection);
            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(users);
            return users;
        } catch (error) {
            console.error("Erreur en récupérant tous les utilisateurs", error);
            return [];
        }
    };

    const getAllDestinationDatabase = async () => {
        try {
            const destinationCollection = collection(db, "Destinations");
            const querySnapshot = await getDocs(destinationCollection);
            const destinations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(destinations);
            return destinations;
        } catch (error) {
            console.error("Erreur en récupérant toutes les destinations de ski/snow", error);
            return [];
        }
    };

    const addDestination = async (destination) => {
        try {
            const destId = uuidv4();
            const destinationRef = doc(db, 'Destinations', destId);
            await setDoc(destinationRef, {
                name: destination.name,
                description: destination.description,
                latitude: destination.latitude,
                longitude: destination.longitude,
                url: destination.file,
                id: destId
            });
            setNotificationMessage("Destination ajoutée");
            console.log('Destination ajoutée');
        } catch (error) {
            console.error('Erreur en ajoutant une destination', error);
        }
    };

    const removeDestination = async (id) => {
        try {
            const destinationRef = doc(db, 'Destinations', id);
            await deleteDoc(destinationRef);
            console.log('Destination supprimée');
            setNotificationMessage("Destination supprimée");
            setDestinations(destinations => destinations.filter(destination => destination.id !== id));
        } catch (error) {
            console.error('Erreur en supprimant une destination', error);
        }
    };

    const removePostSnowDay = async (id, userID) => {
        console.log("id user : ", userID, "Id du post : ", id)
        try {
            const userDocRef = doc(db, 'users', userID);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                let snowDay = userDocSnap.data().SnowDay;
                snowDay = snowDay.filter(snowDay => snowDay.id !== id);
                await updateDoc(userDocRef, { SnowDay: snowDay });
            }
            const snowDayRef = doc(db, 'SnowDays', id);
            await deleteDoc(snowDayRef);
            console.log('Journée de ski/snow supprimée');
            setNotificationMessage("Publication supprimée");
            setSnowDays(snowDays => snowDays.filter(snowDay => snowDay.id !== id));
        } catch (error) {
            console.error('Erreur en supprimant une journée de ski/snow', error);
        }
    };

    const getUserLattitudeAndLongitude = async () => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                console.log(userDocSnap.data().latitude, userDocSnap.data().longitude)
                return { latitude: userDocSnap.data().latitude, longitude: userDocSnap.data().longitude };
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Erreur en récupérant la base de donnée', error);
        }
    };

    const writeUserLattitudeAndLongitude = async (latitude, longitude) => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                latitude: latitude,
                longitude: longitude
            });
            console.log('Latitude et longitude ajoutées');
        } catch (error) {
            console.error('Erreur en ajoutant la latitude et la longitude', error);
        }
    };

    const resetNotificationMessage = async () => {
        setNotificationMessage('')
    }


    return (
        <userContext.Provider value={{
            notificationMessage,
            checkIfFriend,
            resetNotificationMessage,
            removePostSnowDay,
            removeDestination,
            addDestination,
            addContact,
            addSnowDay,
            getDatabase,
            getAllDestinationDatabase,
            getAllSnowDayDatabase,
            likeDestination,
            checkIfLiked,
            getAllUserDatabase,
            getUserLattitudeAndLongitude,
            writeUserLattitudeAndLongitude,
            v_: 1
        }}>
            {children}
        </userContext.Provider>
    );
};

const useInfos = () => {
    const context = useContext(userContext);
    if (context.v_ === 0) {
        console.error("useInfos doit être utilisé dans un UserProvider");
    }
    return context;
};

export { UserProvider, userContext, useInfos };
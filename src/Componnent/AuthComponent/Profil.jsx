import { useEffect, useState } from "react";
import { auth } from "../../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../context/authContext";
import { useInfos } from "../../context/userContext";
import './AuthCss/Profil.css';
import SinglePost from "./SinglePost";
import SingleLike from "./SingleLike";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Profil = () => {
    const { logOut, user } = useAuth();
    const { getAllSnowDayDatabase, getDatabase, addDestination, getAllDestinationDatabase } = useInfos();

    const [authUser, setAuthUser] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [snowDaysUser, setSnowDaysUser] = useState([]);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return listen;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const databaseUser = await getDatabase(user.uid);
            setData(databaseUser);
        };
        fetchData();
    }, [getDatabase]);

    useEffect(() => {
        const fetchData = async () => {
            const snowDaysData = await getAllSnowDayDatabase();
            const sortedSnowDaysData = snowDaysData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            const resortedSnowDaysData = sortedSnowDaysData.filter(snowDay => snowDay.userId === user.uid);
            setSnowDaysUser(resortedSnowDaysData);
        };
        fetchData();
    }, [getAllSnowDayDatabase]);

    const userSignOut = () => {
        logOut();
    };

    setTimeout(() => {
        setLoading(false);
    }, 500);
    if (loading) return (
        <div className="spinner">
            <div className="loader"></div>
        </div>
    );
    return (
        <div className="profil">
            <Helmet>
                <title>Board Buddy | Profil</title>
            </Helmet>
            <div className="user">
                <div className="infos">
                    <h2>Profil</h2>
                    {data.admin ? <h3>Vous êtes administrateur</h3> : ""}
                    <p>Nom d'utilisateur : {data.username || "0"}</p>
                    <p>E-Mail : {authUser.email || "0"}</p>
                    <p>Nombre de personne suivies : {data.contacts ? data.contacts.length : "0"}</p>
                    <p>Nombre total de sorties : {snowDaysUser ? snowDaysUser.length : "0"}</p>
                    <p>Nombre de lieux aimés : {data.likedDestinations ? data.likedDestinations.length : "0"}</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.1 }}
                        className="deconnexion"
                        onClick={userSignOut}>Déconnexion
                    </motion.button>
                </div>
            </div>
            <div className="favoris">
                <h3>Vos favoris</h3>
                {data.likedDestinations.length !== 0 ? (
                    data.likedDestinations.map((destination, index) => (
                        <SingleLike
                            key={destination.id}
                            name={destination.name}
                            url={destination.url}
                            description={destination.description}
                            id={destination.id}
                            latitude={destination.latitude}
                            longitude={destination.longitude}
                            wait={index}
                        />
                    ))
                ) : (
                    <div className="PasFavoris">
                        <p><span>Vous n'avez aucun favori pour le moment ...</span><br /> Vous pouvez en ajouter dans la page d'Accueil!</p>
                    </div>
                )}
            </div>
            <div className="Sorties">
                <h3>Vos sorties</h3>
                <div className="sortie">
                    {snowDaysUser.length !== 0 ? (
                        snowDaysUser.map((snowDay, index) => (
                            <SinglePost
                                key={snowDay.id}
                                title={snowDay.Title}
                                date={snowDay.Date}
                                emplacement={snowDay.Emplacement}
                                time={snowDay.Time}
                                distance={snowDay.Distance}
                                track={snowDay.Track}
                                idPost={snowDay.id}
                                userEmail={snowDay.userEmail}
                                userId={snowDay.userId}
                                username={snowDay.username}
                                wait={index}
                            />
                        ))
                    ) : (
                        <div className="PasSortie">
                            <p><span>Vous n'avez aucune sortie pour le moment ...</span><br /> Vous pouvez en ajouter dans la page Sortie!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Profil;
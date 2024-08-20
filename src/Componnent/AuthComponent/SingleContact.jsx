import { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { IoPersonRemove } from "react-icons/io5";
import { useInfos } from "../../context/userContext";
import { motion } from "framer-motion";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

const SingleContact = ({ username, idUser, snowDays, wait }) => {
    const { getAllSnowDayDatabase, addContact, resetNotificationMessage } = useInfos();

    const [sortSnowDay, setSortSnowDay] = useState([]);
    const [loading, setLoading] = useState(true);

    const [allSnowDay, setAllSnowDay] = useState([]);
    const [popUpAllSnowDay, setPopUpAllSnowDay] = useState(false)

    const [popUp, setPopUp] = useState(false)

    useEffect(() => {
        const FetchData = async () => {
            const orderedSnowDays = snowDays.sort((a, b) => new Date(b.date) - new Date(a.date));
            const snowDay = await getAllSnowDayDatabase();
            const sortSnowDay = snowDay.filter(snowDay => snowDay.id === orderedSnowDays[0].id);
            setSortSnowDay(sortSnowDay[0]);
        };
        FetchData();
    }, [snowDays]);

    useEffect(() => {
        const fetchData = async () => {
            const snowDay = await getAllSnowDayDatabase();
            const sortedSnowDayUser = snowDay.filter(snowDay => snowDay.userId === idUser);
            const orderedSnowDay = sortedSnowDayUser.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            setAllSnowDay(orderedSnowDay);
        };
        fetchData();
    }, []);

    const removeFriend = () => {
        addContact(idUser);
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000)
    }

    const isHovering = () => {
        setPopUp(true);
    }

    const isNotHovering = () => {
        setPopUp(false);
    }

    const click = () => {
        setPopUpAllSnowDay(!popUpAllSnowDay);
    }

    setTimeout(() => {
        setLoading(false);
    }, 200);
    if (loading) return;
    return (
        <>
            <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: wait / 10 }}
                className={"contactSnowDay"}>
                <div className="contactInfo">
                    <h2><IoPerson /> {username}</h2>
                    <h3>Nombre de sortie{snowDays.length > 1 ? 's' : ''} : {snowDays.length}</h3>
                </div>
                {sortSnowDay ?
                    <>
                        <p>Sortie la plus récente : </p>
                        <div className="infosTitle">
                            <h4>{sortSnowDay.Title}</h4>
                            <div className="infos">
                                <p>Date : {sortSnowDay.Date}</p>
                                <p>Emplacement : {sortSnowDay.Emplacement}</p>
                                <p>Durée : {sortSnowDay.Time} heure{sortSnowDay.Time > 1 ? 's' : ''}</p>
                                <p>Distance (Descente) : {sortSnowDay.Distance} km</p>
                                <p>Nombre de pistes : {sortSnowDay.Track}</p>
                            </div>
                        </div>
                        <motion.p
                            whileHover={{ scale: 1.3 }}
                            onClick={click}
                            className="afficherPlus">
                            {!popUpAllSnowDay ? <>Afficher plus <MdOutlineKeyboardArrowDown /></> : <>Afficher moins <MdOutlineKeyboardArrowUp /></>}
                        </motion.p>
                    </> : null}
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="ami"
                    onClick={removeFriend}
                    onHoverStart={isHovering}
                    onHoverEnd={isNotHovering}>
                    <IoPersonRemove />
                    {popUp ?
                        <p className="infoBtn">Retirer le contact </p>
                        : null
                    }
                </motion.button>
            </motion.div>
            {popUpAllSnowDay ?
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="containerMoreSnowDay">
                    <h2 className="titleAllSnowDay">Tous les sorties publiques de {username}</h2>
                    <div className="popUpAll">
                        {allSnowDay.map((snowDay, index) => {
                            if (snowDay.Public) {
                                return (
                                    <div className="singlePost" key={index}>
                                        <h4>{snowDay.Title}</h4>
                                        <div className="infos">
                                            <p>Date : {snowDay.Date}</p>
                                            <p>Emplacement : {snowDay.Emplacement}</p>
                                            <p>Durée : {snowDay.Time} heure{snowDay.Time > 1 ? 's' : ''}</p>
                                            <p>Distance (Descente) : {snowDay.Distance} km</p>
                                            <p>Nombre de pistes : {snowDay.Track}</p>
                                        </div>
                                    </div>
                                )
                            }})}
                    </div>
                </motion.div>
                : null}
        </>
    )
};

export default SingleContact;
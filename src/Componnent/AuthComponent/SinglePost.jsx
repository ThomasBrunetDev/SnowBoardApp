import { useEffect, useState } from "react";
import "./AuthCss/SinglePost.css";

import { IoMdPersonAdd } from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";

import { useInfos } from "../../context/userContext";
import { useAuth } from "../../context/authContext";

import { motion } from "framer-motion";

const SinglePost = ({ date, distance, emplacement, time, title, track, idPost, userEmail, userId, username, wait }) => {
    const { addContact, getDatabase, removePostSnowDay, resetNotificationMessage, checkIfFriend } = useInfos();
    const { user } = useAuth();
    
    const [dataUser, setDataUser] = useState([]);
    const [popUpTrash, setPopUpTrash] = useState(false)
    const [popUpAmi, setPopUpAmi] = useState(false)
    const [friend, setFriend] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const databaseUser = await getDatabase(user.uid);
            setDataUser(databaseUser);
        };
        fetchData();
    }, [getDatabase]);

    const isHoveringTrash = () => {
        setPopUpTrash(true);
    }

    const isNotHoveringTrash = () => {
        setPopUpTrash(false);
    }
    const isHoveringAmi = () => {
        setPopUpAmi(true);
    }

    const isNotHoveringAmi = () => {
        setPopUpAmi(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const friend = await checkIfFriend(userId);
            setFriend(friend);
        };
        fetchData();
    }, []);

    const addFriend = (id) => {
        addContact(userId);
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000)
        setFriend(!friend)
    };
    const deletePost = (id) => {
        removePostSnowDay(id, userId);
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000)
    };
    const distanceDividedBy2 = distance / 2;
    return (
        <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: wait / 10 }}
            className="post">
            <h2>{title}</h2>
            <div className="infos">
                <p><span>Date</span> : {date}</p>
                <p><span>Emplacement</span> : {emplacement}</p>
                <p><span>Durée</span> : {time} heure{time > 1 ? 's' : ''}</p>
                <p><span>Distance (Descente)</span> : {distanceDividedBy2} km</p>
                <p><span>Nombre de pistes</span> : {track} piste{track > 1 ? 's' : ''}</p>
                <p><span>Posté par</span> : {username}</p>
            </div>
            {userId !== dataUser.id ?
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="ami"
                    onClick={() => addFriend(userId)}
                    onHoverStart={isHoveringAmi}
                    onHoverEnd={isNotHoveringAmi}>
                    {!friend ? <IoMdPersonAdd /> : <IoPersonRemove />}
                    {popUpAmi ?
                        <p className="infoBtnAmi">Ajouter le contact</p>
                        : null
                    }
                </motion.button>
                : <motion.button
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="trash"
                    onClick={() => deletePost(idPost)}
                    onHoverStart={isHoveringTrash}
                    onHoverEnd={isNotHoveringTrash}>
                    {<FaRegTrashCan />}
                    {popUpTrash ?
                        <p className="infoBtnTrash">Retirer la publication</p>
                        : null
                    }
                </motion.button>}
            {!dataUser.admin ?
                null
                : <motion.button
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="trash"
                    onClick={() => deletePost(idPost)}
                    onHoverStart={isHoveringTrash}
                    onHoverEnd={isNotHoveringTrash}>
                    <FaRegTrashCan />
                    {popUpTrash ?
                        <p className="infoBtnTrash">Retirer la publication</p>
                        : null
                    }
                </motion.button>}

        </motion.div>
    );
};

export default SinglePost;

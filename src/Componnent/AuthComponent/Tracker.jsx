import { useEffect, useState } from "react";
import { useInfos } from "../../context/userContext";
import "./AuthCss/Tracker.css"
import GeoLocTracker from "./GeoLocTracker";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Tracker = () => {
    const { addSnowDay, resetNotificationMessage } = useInfos();

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [emplacement, setEmplacement] = useState('');
    const [time, setTime] = useState('');
    const [distance, setDistance] = useState('');
    const [track, setTrack] = useState('');
    const [publicPost, setPublicPost] = useState(false);

    const [btnDisabled, setBtnDisabled] = useState(true);

    const [loading, setLoading] = useState(true);
    const [addSnowDayLoading, setAddSnowDayLoading] = useState(false);

    const addDay = () => {
        setAddSnowDayLoading(true);
        setTimeout(() => {
            setAddSnowDayLoading(false);
        }, 3000);
    };

    const addSnowDayByUser = (e) => {
        e.preventDefault();
        addDay();
        const snowDay = {
            'title': title,
            'date': date,
            'emplacement': emplacement,
            'time': time,
            'distance': distance,
            'track': track,
            'public': publicPost
        };
        addSnowDay(snowDay);
        setTitle('');
        setDate('');
        setEmplacement('');
        setTime('');
        setDistance('');
        setTrack('');
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000);
    };

    useEffect(() => {
        setBtnDisabled(
            title === '' ||
            date === '' ||
            emplacement === '' ||
            time === '' ||
            distance === '' ||
            track === '');
    }, [title, date, emplacement, time, distance, track, publicPost]);

    setTimeout(() => {
        setLoading(false);
    }, 500);
    if (loading) return (
        <div className="spinner">
            <div className="loader"></div>
        </div>
    );
    return (
        <div className="trackers">
            {addSnowDayLoading ? <div className="spinner-transparent">
                <div className="loader"></div>
            </div> : null}
            <Helmet>
                <title>Board Buddy | Sortie</title>
            </Helmet>
            <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0 }}
                className="tracker-geoloc">
                <GeoLocTracker addDay={addDay}/>
            </motion.div>
            <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="tracker-manualy">
                <h2>Vous avez oublié? <br />Entrez votre journée manuellement!</h2>
                <form onSubmit={addSnowDayByUser}>
                    <div className="radio">
                        <p>Type de Publication : </p>
                        <input type="radio" id="oui" name="publicPost" value={"1"}
                            checked={publicPost}
                            onChange={(e) => setPublicPost(e.target.value === "1")} />
                        <label htmlFor="oui">Publique</label>
                        <input type="radio" id="non" name="publicPost" value={"2"}
                            checked={!publicPost}
                            onChange={(e) => setPublicPost(e.target.value === "1")} />
                        <label htmlFor="non">Privée</label>
                    </div>
                    <div>
                        <label htmlFor=""> Titre de la sortie : </label>
                        <input type="text" placeholder="Titre" value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor=""> Date : </label>
                        <input type="Date" value={date}
                            onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor=""> Emplacement : </label>
                        <input type="text" placeholder="Nom" value={emplacement}
                            onChange={(e) => setEmplacement(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="" > Nombre de pistes descendues : </label>
                        <input type="number" min={0} placeholder="Nombre de pistes" value={track}
                            onChange={(e) => setTrack(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor=""> Durée (heure) : </label>
                        <input type="number" min={0} placeholder="Temps de sortie" value={time}
                            onChange={(e) => setTime(e.target.value)} step={"any"} />
                    </div>
                    <div>
                        <label htmlFor=""> Nombre de kilomètres : </label>
                        <input type="number" min={0} placeholder="Kilomètrage" value={distance}
                            onChange={(e) => setDistance(e.target.value)} step={"any"} />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        disabled={btnDisabled}
                        className={btnDisabled ? "disabled" : ""}
                        type="submit">
                        Enregister
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
};

export default Tracker;
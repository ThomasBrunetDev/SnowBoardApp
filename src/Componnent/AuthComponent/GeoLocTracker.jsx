import { useState, useEffect, useCallback } from "react";
import { useInfos } from "../../context/userContext";
import { motion } from "framer-motion";
import { set } from "firebase/database";

const GeoLocTracker = ({ addDay }) => {

    const { writeUserLattitudeAndLongitude, getUserLattitudeAndLongitude, addSnowDay, resetNotificationMessage } = useInfos();
    const [workoutStarted, setWorkoutStarted] = useState(false);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [workoutFinished, setWorkoutFinished] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [emplacement, setEmplacement] = useState('');
    const [track, setTrack] = useState('');
    const [publicPost, setPublicPost] = useState(false);
    const [setBtnDislabled, setBtnDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const calculateDistance = useCallback((lat1, long1, lat2, long2) => {
        const r = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(long2 - long1);

        const latitude1 = toRad(lat1);
        const latitude2 = toRad(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitude1) * Math.cos(latitude2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = r * c;

        setTotalDistance(prevTotalDistance => prevTotalDistance + d);
    }, []);

    useEffect(() => {
        let intervalTime;
        let intervalPosition;
        if (workoutStarted) {
            setWorkoutStartTime(Date.now());
            intervalTime = setInterval(() => {
                setCurrentTime(Date.now() - workoutStartTime);
            }, 1000);
            intervalPosition = setInterval(() => {
                getUserPosition();
            }, 20000);
            getUserStartPosition();
        } else {
            clearInterval(intervalTime);
            clearInterval(intervalPosition);
        }
        return () => {
            clearInterval(intervalTime);
            clearInterval(intervalPosition);
        }
    }, [workoutStarted, workoutStartTime, calculateDistance]);


    const startWorkout = () => {
        setWorkoutStarted(true);
        setWorkoutFinished(false)
    };

    const stopWorkout = () => {
        setWorkoutStarted(false);
        setWorkoutFinished(true);
    };

    const getUserStartPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                writeUserLattitudeAndLongitude(position.coords.latitude, position.coords.longitude);
            },
            (error) => setErrorMessage("Une erreur avec la localisation est survenue. La géolocalisation va reprendre dans 20 secondes.")
        );
    };

    const getUserPosition = async () => {
        const { latitude, longitude } = await getUserLattitudeAndLongitude();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setTimeout(() => {
                        calculateDistance(position.coords.latitude, position.coords.longitude, latitude, longitude);
                        writeUserLattitudeAndLongitude(position.coords.latitude, position.coords.longitude);
                        setErrorMessage('');
                    }, 1000);
                },
                (error) => setErrorMessage("Une erreur avec la localisation est survenue. La géolocalisation va reprendre dans 20 secondes.")
            );     
    };

    const toRad = (value) => {
        return (value * Math.PI) / 180;
    };

    const addSnowDayByUser = (e) => {
        addDay();
        e.preventDefault();
        var hours = currentTime / 3600000;
        const snowDay = {
            'title': title,
            'date': date,
            'emplacement': emplacement,
            'time': hours.toFixed(2),
            'distance': totalDistance.toFixed(2),
            'track': track,
            'public': publicPost
        }
        addSnowDay(snowDay);
        setTitle('');
        setDate('');
        setEmplacement('');
        setTrack('');
        setCurrentTime(0);
        setTotalDistance(0);
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000);
    }

    useEffect(() => {
        setBtnDisabled(
            title === '' ||
            date === '' ||
            emplacement === '' ||
            track === '');
    }, [title, date, emplacement, track, publicPost, setBtnDislabled]);

    return (
        <>
            <h2>Commencez votre journée <br /> de ski/snow!</h2>
            {errorMessage !== '' ? <p style={{ color: 'red', textAlign: "center" }}>{errorMessage}</p> : null}
            {workoutFinished ? (
                <form onSubmit={addSnowDayByUser}>
                    <div className="radio">
                        <p>Type de publication : </p>
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
                    <motion.button
                        className={setBtnDislabled ? "disabled" : ""}
                        disabled={setBtnDislabled}
                        whileHover={{ scale: 1.1 }}
                        type="submit">
                        Enregister
                    </motion.button>
                </form>
            ) : (
                null
            )}
            <div className="resultat">
                <p>Distance parcourue : {totalDistance.toFixed(2)} kilomètre{totalDistance > 1 ? 's' : ''}</p>
                <p>Temps écoulé : {formatTime(currentTime)}</p>
            </div>
            {workoutStarted ? (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="start-stop"
                    onClick={stopWorkout}>
                    Terminer la sortie
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={startWorkout}>
                    Commencer la sortie
                </motion.button>
            )}
        </>
    );
};

const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default GeoLocTracker;

import { useState, useEffect } from "react";
import { useInfos } from "../../context/userContext";
import LikeBtn from "./LikeBtn";
import './AuthCss/SingleLike.css';

import { motion } from "framer-motion";

const SingleLike = ({ url, description, id, latitude, longitude, name, userAdmin, wait }) => {
    const apiKey = "9TCWA9ASDVML2NFTD9ZRT4TUQ";

    const { likeDestination, resetNotificationMessage } = useInfos();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [popUpLike, setPopUpLike] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const fetchWeatherData = async () => {
        const currentDate = new Date().toISOString().slice(0, 10);
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/${currentDate}/${currentDate}?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const like = () => {
        const likeDest = {
            id: id,
            name: name,
            url: url,
            description: description,
            latitude: latitude,
            longitude: longitude
        }
        likeDestination(likeDest);
        setTimeout(() => {
            resetNotificationMessage();
        }, 4000)
    };

    const isHoveringLike = () => {
        setPopUpLike(true);
    }

    const isNotHoveringLike = () => {
        setPopUpLike(false);
    }

    const fahrenheitToCelsius = (fahrenheit) => {
        return (fahrenheit - 32) * (5 / 9);
    };

    return (
        <>
                <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: wait / 2 } }}
                    whileHover={{
                        scale: 1.03,
                        transition: { delay: 0 },
                    }}
                    className={'likeDestination'}
                    style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                    }}
                    key={url}
                    onClick={toggleDropdown}>
                    <h2>{name}</h2>
                </motion.div>
                {dropdownOpen && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="dropdown-content">
                        <p>{description}</p>
                        {weatherData && (
                            <div className="meteo">
                                <p>Météo maximal de la journée: {fahrenheitToCelsius(weatherData.days[0].tempmax).toFixed(1)} C°</p>
                                <p>Météo minimal de la journée: {fahrenheitToCelsius(weatherData.days[0].tempmin).toFixed(1)} C°</p>
                                <p>Précipitation de neige: {weatherData.days[0].snow} cm</p>
                            </div>
                        )}
                        <motion.div className="like"
                            onClick={like}
                            onHoverStart={isHoveringLike}
                            onHoverEnd={isNotHoveringLike}>
                            <LikeBtn id={id} />
                            {popUpLike ?
                                <p className="infoBtnLike">Ajouter aux favoris</p>
                                : null
                            }
                        </motion.div>
                    </motion.div>
                )}
        </>
    )
};

export default SingleLike;

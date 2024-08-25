import { useEffect, useState } from 'react';
import './AuthCss/AuthAccueil.css';
import { useInfos } from '../../context/userContext';
import { useAuth } from '../../context/authContext';
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../Config/firebase';

import { FiPlusCircle } from "react-icons/fi";

import { motion } from 'framer-motion';
import SingleDestination from './SingleDestination';

const AuthAccueil = () => {
    const { user } = useAuth();
    const { getAllDestinationDatabase, getDatabase, addDestination, resetNotificationMessage } = useInfos();

    const [dataUser, setDataUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageList, setImageList] = useState([]);
    const [addDestinationPopup, setAddDestinationPopup] = useState(false);
    const [addPopupInfos, setAddPopupInfos] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [file, setFile] = useState(null);
    const [canClick, setCanClick] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (file === null) {
            setErrorMessages('Veuillez ajouter un fichier');
            return;
        }
        if (isNaN(latitude) || isNaN(longitude)) {
            setErrorMessages('Veuillez entrer une latitude/longitude valide.');
            return;
        }

        if (latitude < -90 || latitude > 90) {
            setErrorMessages('La latitude doit être comprise entre -90 et 90 degrés.');
            return;
        }

        if (longitude < -180 || longitude > 180) {
            setErrorMessages('La longitude doit être comprise entre -180 et 180 degrés.');
            return;
        }
        
        if (file.size > 10000000) {
            setErrorMessages('Le fichier est trop lourd (10Mo max)');
            return;
        }
        const fileName = file.name + uuidv4();
        if (file.name.includes('.jpg') || file.name.includes('.jpeg') || file.name.includes('.png') || file.name.includes('.webp')) {
            setLoadingUpload(true);
            const imageRef = ref(storage, `images/${fileName}`);
            uploadBytes(imageRef, file).then(() => {
            });
            setErrorMessages('');
            setTimeout(() => {
                getDownloadURL(imageRef).then((url) => {
                    const newDestination = {
                        name: name,
                        description: description,
                        latitude: latitude,
                        longitude: longitude,
                        file: url
                    };
                    addDestination(newDestination);
                    setName('');
                    setDescription('');
                    setLatitude('');
                    setLongitude('');
                    setFile(null);
                    setLoadingUpload(false);
                    setTimeout(() => {
                        resetNotificationMessage();
                    }, 4000)
                }).catch((error) => {
                    console.error(error);
                });

            }, 3000);
        } else {
            setErrorMessages('Le fichier doit être un jpeg, png ou webp');
            // setName('');
            // setDescription('');
            // setLatitude('');
            // setLongitude('');
            // setFile(null);
            return;
        }

    };

    useEffect(() => {
        setCanClick(name === '' ||
            description === '' ||
            latitude === '' ||
            longitude === '' ||
            file === null)
    }, [name, description, latitude, longitude, file]);

    const isHoveringAdd = () => {
        setAddPopupInfos(true);
    };

    const isNotHoveringAdd = () => {
        setAddPopupInfos(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const databaseUser = await getDatabase(user.uid);
            setDataUser(databaseUser);
        };
        fetchData();
    }, [getDatabase]);

    useEffect(() => {
        const fetchData = async () => {
            const destinationData = await getAllDestinationDatabase();
            const sortedDestinationData = destinationData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setImageList(sortedDestinationData);
        };
        fetchData();
    }, [getAllDestinationDatabase]);


    setTimeout(() => {
        setLoading(false);
    }, 500);
    if (loading) return (
        <div className="spinner">
            <div className="loader"></div>
        </div>
    );

    return (


        <div className='accueil'>
            {loadingUpload ? <div className="spinner-transparent">
                <div className="loader"></div>
            </div> : null}

            <Helmet>
                <title>Board Buddy | Accueil</title>
            </Helmet>
            <h1 style={{ textAlign: "center" }}>Découvrez les plus belles montagnes!</h1>
            {dataUser && dataUser.admin ? <motion.div
                onClick={() => setAddDestinationPopup(!addDestinationPopup) || setErrorMessages('')}
                whileHover={{ scale: 1.1 }}
                className='plus'
                onHoverStart={isHoveringAdd}
                onHoverEnd={isNotHoveringAdd}>
                <FiPlusCircle />
                {addPopupInfos ?
                    <p className="infoBtnInfos">Ajouter une destination</p>
                    : null
                }
            </motion.div> : null}

            {addDestinationPopup ? (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="form">
                    <h2>Ajouter une destination de rève</h2>
                    {errorMessages ? <p style={{ paddingBottom: "1rem", paddingTop: "1rem", color: "red", textAlign: "center" }}>{errorMessages}</p> : null}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nom de la destination : </label>
                            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label>Description de la nouvelle destination : </label>
                            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div>
                            <label>Latitude de la destination : </label>
                            <input type="text" min={-90} max={90} placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                        </div>
                        <div>
                            <label>Longitude de la destination : </label>
                            <input type="text" min={-180} max={180} placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                        </div>
                        <div>
                            <label>Photo (JPEG/PNG/WEBP) : </label>
                            <input type="file" placeholder="Fichier" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <motion.button
                            className={canClick ? 'disabled' : ''}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.1 }}
                            disabled={canClick}
                            type="submit">Enregistrer
                        </motion.button>
                    </form>
                </motion.div>
            ) : null}
            {imageList.length > 0 ? (
                imageList.map((imageList, index) => (
                    <SingleDestination
                        key={imageList.id}
                        url={imageList.url}
                        description={imageList.description}
                        id={imageList.id}
                        latitude={imageList.latitude}
                        longitude={imageList.longitude}
                        name={imageList.name}
                        userAdmin={dataUser.admin}
                        wait={index} />
                ))
            ) : (
                <div className="PasDestination">
                    <p><span>Vous n'avez pas encore de destination ...</span><br /> Vous pouvez en ajouter!</p>
                </div>
            )}
        </div>
    )


};

export default AuthAccueil;

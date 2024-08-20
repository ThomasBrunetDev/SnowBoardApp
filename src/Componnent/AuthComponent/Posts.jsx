import { useState, useEffect } from "react";
import { useInfos } from "../../context/userContext";
import { useAuth } from "../../context/authContext";
import SinglePost from "./SinglePost";
import "./AuthCss/Posts.css";
import { Helmet } from "react-helmet";

const Posts = () => {
    const { getAllSnowDayDatabase, getDatabase } = useInfos();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [dataUser, setDataUser] = useState([]);

    const [snowDaysPublic, setSnowDaysPublic] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const databaseUser = await getDatabase(user.uid);
            setDataUser(databaseUser);
        };
        fetchData();
    }, [getDatabase]);

    useEffect(() => {
        const fetchData = async () => {
            const snowDaysData = await getAllSnowDayDatabase();
            const sortedSnowDaysData = snowDaysData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            const resortedSnowDaysData = sortedSnowDaysData.filter(snowDay => snowDay.Public === true);
            setSnowDaysPublic(resortedSnowDaysData);
        };
        fetchData();
    }, [getAllSnowDayDatabase]);

    setTimeout(() => {
        setLoading(false);
    }, 500);

    if (loading) return (
        <div className="spinner">
            <div className="loader"></div>
        </div>
    );
    return (
        <>
            <Helmet>
                <title>Board Buddy | Publication</title>
            </Helmet>
            <div className="publications-container">
                <h1 style={{textAlign:"center"}}>Publications publiques</h1>
                <div className="Publications">
                    {snowDaysPublic.length > 0 ? (
                        snowDaysPublic.map((snowDay, index) => (
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
                        <div className="PasPublication">
                            <p><span>Il n'y a pas de publications publiques dans l'aplication pour le moment ...</span><br /> Vous pouvez en ajouter une dans la page Sortie!</p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Posts;
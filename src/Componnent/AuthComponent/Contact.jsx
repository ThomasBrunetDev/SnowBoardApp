import { useEffect, useState } from "react"
import { useInfos } from "../../context/userContext";
import { useAuth } from "../../context/authContext";
import SingleContact from "./SingleContact";

import './AuthCss/Contact.css';
import { Helmet } from "react-helmet";

const Contact = () => {
    const { user } = useAuth();
    const { getDatabase, getAllUserDatabase } = useInfos();

    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const databaseUser = await getDatabase(user.uid);
            const allUserDatabase = await getAllUserDatabase();
            const contactUser = allUserDatabase.filter(
                user => databaseUser.contacts.includes(user.id));
            setContacts(contactUser);
        };
        fetchData();
    }, [getAllUserDatabase]);

    setTimeout(() => {
        setLoading(false);
    }, 500);

    if (loading) return (
        <div className="spinner">
            <div className="loader"></div>
        </div>
    );
    return (
        <div className="conteneur-contacts">
            <Helmet>
                <title>Board Buddy | Contact</title>
            </Helmet>
            <h1 >Contact</h1>
            <div className="contacts">
                {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <SingleContact
                            key={contact.id}
                            username={contact.username}
                            idUser={contact.id}
                            snowDays={contact.SnowDay}
                            wait={index}
                        />
                    ))
                ) : (
                    <div className="PasContact">
                        <p><span>Vous n'avez aucun contact pour le moment ...</span><br /> Vous pouvez en ajouter dans la page publication!</p>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Contact;

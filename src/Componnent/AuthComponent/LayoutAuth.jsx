import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInfos } from "../../context/userContext";

// React icons
import { IoIosContact } from "react-icons/io";
import { IoHomeSharp } from "react-icons/io5";
import { IoIosContacts } from "react-icons/io";

import { IoMdClose } from "react-icons/io"; //<IoMdClose />
import { IoReorderThreeOutline } from "react-icons/io5"; //<IoReorderThreeOutline />

import { IoNewspaper } from "react-icons/io5";
import { FaSnowboarding } from "react-icons/fa";

//Css
import "./AuthCss/LayoutAuth.css"

//Composante
import Notification from "./Notification.jsx"
import { useRef, useState } from "react";
import { set } from "firebase/database";

const LayoutAuth = () => {
    const { notificationMessage } = useInfos()
    const navigate = useNavigate();
    const navRef = useRef();
    const [toggle, setToggle] = useState(false);

    const showNavBar = () => {
        setToggle(!toggle);
    }

    const closeNavBar = () => {
        setToggle(false);
    }

    const navLinks = [
        {
            Name: "Accueil",
            Url: "/home",
            Icon: <IoHomeSharp />
        },
        {
            Name: "Sortie",
            Url: "/tracker",
            Icon: <FaSnowboarding />
        },
        {
            Name: "Publication",
            Url: "/posts",
            Icon: <IoNewspaper />
        },
        {
            Name: "Contact",
            Url: "/contact",
            Icon: <IoIosContacts />
        },
        {
            Name: "Profil",
            Url: "/profil",
            Icon: <IoIosContact />
        },
    ];
    return (
        <>
            {notificationMessage !== '' ? <Notification message={notificationMessage} /> : null}
            <div className="menu">
                <span className="logo" onClick={() => navigate("/home")}><img src="/LogoBlanc.svg" alt="" /></span>
                <nav className={toggle ? "responsive_nav" : "" }>
                    <ul>
                        {navLinks.map((link, index) => (
                            <motion.li
                                onClick={closeNavBar}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                key={index}>
                                <Link to={link.Url}>{link.Icon}  {link.Name}</Link>
                            </motion.li>
                        ))}
                        <button className="nav-btn nav-close-btn" onClick={showNavBar}>
                            <IoMdClose />
                        </button>
                    </ul>
                </nav>
                <button className="nav-btn" onClick={showNavBar}>
                    <IoReorderThreeOutline />
                </button>
            </div>
            <div className="contenu">
                <Outlet />
            </div>
        </>
    )
};

export default LayoutAuth;
import "./AuthCss/Notification.css";
import { motion } from "framer-motion";

const Notification = ({ message }) => {
    return (
            <motion.div
                initial={{ x: 30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="Notif">
                <p>{message}</p>
            </motion.div>
    )
}

export default Notification;
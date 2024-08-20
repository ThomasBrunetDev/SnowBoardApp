import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";

import { motion } from "framer-motion";

const SignIn = () => {
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormEmpty, setIsFormEmpty] = useState(true);

    const signUserIn = async (e) => {
        e.preventDefault();
        try {
            const message = await signIn(email, password);
            setErrorMessage(message);
        } catch (error) {
            console.error(error);
        }
        setEmail('');
        setPassword('');
    }
    useEffect(() => {
        setIsFormEmpty(email === '' || password === '' || !email.includes('@') || password.length < 6);
    }, [email, password])
    return (
        <form onSubmit={signUserIn}>
            <h2>Connectez vous à votre compte</h2>
            {errorMessage !== "" ? (<p style={{ color: 'red', textAlign: "center" }}>{errorMessage}</p>) : null}
            <input type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <motion.button
                className={isFormEmpty ? "disabled" : ""}
                whileHover={{ scale: 1.1 }}
                type="submit"
                disabled={isFormEmpty}>
                Connexion
            </motion.button>
        </form>
    );
};

export default SignIn;
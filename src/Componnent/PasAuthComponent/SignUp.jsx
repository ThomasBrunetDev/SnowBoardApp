import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { motion } from "framer-motion";

const SignUp = () => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormEmpty, setIsFormEmpty] = useState(true);

    const signUserUp = async (e) => {
        e.preventDefault();
        try {
            const message = await signUp(email, password, username);
            setErrorMessage(message);
        } catch (error) {
            console.error(error)
        }
        setEmail('');
        setPassword('');
        setUsername('');
    }
    useEffect(() => {
        setIsFormEmpty(email === '' || password === '' || username === '' || !email.includes('@') || password.length < 6);
    }, [email, password, username])

    return (
        <form onSubmit={signUserUp}>
            <h2>Créez vous un compte</h2>
            {errorMessage !== "" ? (<p style={{ color: 'red', textAlign: "center" }}>{errorMessage}</p>) : null}
            <input type="text" placeholder="Créez un nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Créez un mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <motion.button
                className={isFormEmpty ? "disabled" : ""}
                whileHover={{ scale: 1.1 }}
                type="submit"
                disabled={isFormEmpty}>
                Créer
            </motion.button>
        </form>
    );
};

export default SignUp;
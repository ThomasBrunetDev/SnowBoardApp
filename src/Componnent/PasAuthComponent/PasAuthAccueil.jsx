import SignIn from './SignIn';
import SignUp from './SignUp';
import { Helmet } from 'react-helmet';
import "./PasAuthCss/PasAuthAccueil.css";

import { motion } from 'framer-motion';

const PasAuthAccueil = () => {
    return (


        <div className="Container-form" style={{
                position: 'relative',
            }}>
            <Helmet>
                <title>Board Buddy | Connexion</title>
            </Helmet>
            <h1>Bienvenue sur BoardBuddy</h1>
            <motion.div
                initial={{ x: 20, y: 20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="sign-up">
                <h2 className='title'>Vous n'avez pas de compte? <br />Créez-en un!</h2>
                <SignUp />
            </motion.div>
            <motion.div
                initial={{ x: -20, y: -20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className='sign-in'>
                <h2 className='title'>Vous n'êtes pas connecté</h2>
                <SignIn />
            </motion.div>
        </div>

    )
};

export default PasAuthAccueil;
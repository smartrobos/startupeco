import React from 'react';
import '../css/Login.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { auth, provider, signInWithPopup } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/icon/google-icon.svg';

const Login = () => {
    const navigate = useNavigate();
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            localStorage.setItem("user", JSON.stringify(result.user.providerData[0]));
            navigate('/home');
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    }

    return (
        <div className='login-page'>
            <Card sx={{ minWidth: 345 }}>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div" style={{ textAlign: 'center' }}>
                        Login
                    </Typography>
                </CardContent>
                <CardActions>
                    <button onClick={() => loginWithGoogle()} className="btn-google">
                        <img
                            src={googleLogo}
                            alt="google-icon"
                            className="google-icon"
                        />
                        <span className="google-text">Sign in with Google</span>
                    </button>
                </CardActions>
            </Card>
        </div>
    );
}

export default Login;
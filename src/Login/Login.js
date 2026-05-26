import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { setAppMode } from '../utils/storage';
import LoginValidation from '../LoginValidation';
import { getFirebaseAuthErrorMessage, hasValidationErrors } from '../utils/authErrors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import googleLogo from '../assets/Google_G_Logo.png';

export default function Login(){
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    
    const login = async () => {
        const validationErrors = LoginValidation({
            email: loginEmail,
            password: loginPassword,
        });

        setError(validationErrors);

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setAppMode("user");
            navigate('/app/todos');        
            console.log(user);
        } catch(error){
            setError({ form: getFirebaseAuthErrorMessage(error.code) });
            console.log(error.message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const user = await signInWithPopup(auth, googleProvider);
            setAppMode("user");
            navigate('/app/todos');
            console.log(user);
        } catch(error){
            setError({ form: getFirebaseAuthErrorMessage(error.code) });
            console.log(error.message);
        }
    };
    
    return(
        <div>
            <div className="flex items-center justify-center h-screen m-0 p-6 -bg--surface-container-low">
                <div className='w-full md:min-w-[500px] md:w-3/5 lg:w-2/6 p-8 lg:p-24 rounded-lg bg-white drop-shadow-lg'>
                    <h1 className="text-2xl mb-8 font-medium">Login</h1>
                    <div>
                        <div>
                            <div className='flex flex-col h-20 h-'>
                                <label htmlFor='email'>Email</label>
                                <input
                                    id="email"
                                    className="border border-solid -border--outline rounded py-2 px-3"
                                    name='email' 
                                    type='email'
                                    autoComplete="email"
                                    aria-invalid={Boolean(error.email)}
                                    aria-describedby={error.email ? 'login-email-error' : undefined}
                                    onChange={(event)=>{setLoginEmail(event.target.value)}} 
                                    placeholder='youremail@example.com' 
                                />
                                {error.email && <p id="login-email-error" className='text-xs text-red-700'>{error.email}</p>}
                            </div>
                            <div className='pt-4 flex flex-col h-20'>
                                <label htmlFor='password'>Password</label>
                                <div className="flex items-center border border-solid -border--outline rounded">
                                    <input
                                        id="password"
                                        className="w-full border-0 rounded py-2 px-3 focus:ring-0 focus:outline-none focus-visible:outline-none" 
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        aria-invalid={Boolean(error.password)}
                                        aria-describedby={error.password ? 'login-password-error' : undefined}
                                        onChange={(event)=>{setLoginPassword(event.target.value)}} 
                                        placeholder='Your password'
                                    />
                                    <button
                                        type='button'
                                        className='px-3 py-2 text-sm -text--outline border-0 bg-transparent cursor-pointer'
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg"/>
                                    </button>
                                </div>
                                {error.password && <p id="login-password-error" className='text-xs text-red-700'>{error.password}</p>}
                            </div>
                            {error.form && <p className='mt-4 text-sm text-red-700' role="alert">{error.form}</p>}
                            <button 
                                type="button"
                                className='button w-full mt-8 -bg--primary -text--on-primary rounded'
                                onClick={login}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                className='button w-full mt-4 -bg--primary-container -text--on-primary-container rounded flex items-center justify-center gap-3'
                                onClick={loginWithGoogle}
                            >
                                <img src={googleLogo} alt="" className="w-5 h-5" aria-hidden="true"/>
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='mt-10'>Don't have an account yet?</p>
                        <Link to='/signup' 
                            className='button w-full my-4 -bg--primary-container -text--on-primary-container rounded'
                        >
                            Sign up
                        </Link>
                        <Link
                            to="/guest/todos"
                            className=" -text--main-font-color  underline mt-4"
                            onClick={() => setAppMode("guest")}
                        >
                            Enter as a guest
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

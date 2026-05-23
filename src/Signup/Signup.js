import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase.config';
import { setAppMode } from '../utils/storage';
import SignupValidation from '../SignupValidation';
import { getFirebaseAuthErrorMessage, hasValidationErrors } from '../utils/authErrors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function Signup(){
    const [registerEmail, setRegisterEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const register = async () => {
        const validationErrors = SignupValidation({
            name: registerName,
            email: registerEmail,
            password,
        });

        if (password !== registerPassword) {
            validationErrors.passwordConfirm = "Passwords do not match";
        }

        setError(validationErrors);

        if (hasValidationErrors(validationErrors)) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const user = userCredential.user;
            // Update user profile with the name
            await updateProfile(user, { displayName: registerName });
            setAppMode("user");
            navigate('/app/todos');
            
            // console.log(user);
        } catch(error){
            setError({ form: getFirebaseAuthErrorMessage(error.code) });
            // console.log(error.message);
        }
    };

    // console.log(registerEmail);
    // console.log(registerPassword);

    return(
        <div className="grid grid-cols-12 h-screen m-0 p-6 -bg--surface-container-low">
            <div className="col-span-12 md:col-start-5 md:col-end-9 w-full m-auto p-8 lg:p-24 rounded-lg bg-white drop-shadow-lg">
                <h1 className="text-2xl my-4 font-medium">Sign up</h1>
                <div>
                    <div>
                        <div className="pt-4 flex flex-col">
                            <label htmlFor='name'>Name</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="name"
                                type="text"
                                onChange={(event) => {
                                    setRegisterName(event.target.value)
                                }} 
                                placeholder="Your Name" 
                            />
                            {error.name && <p className='text-xs text-red-400'>{error.name}</p>}
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='email'>Email</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="email"
                                type='email'
                                onChange={(event) => {
                                    setRegisterEmail(event.target.value)
                                }} 
                                placeholder='youremail@example.com' 
                            />
                            {error.email && <p className='text-xs text-red-400'>{error.email}</p>}
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='password'>Password</label>
                            <div className="flex items-center border border-solid -border--outline rounded">
                                <input 
                                    className="w-full border-0 rounded py-2 px-3 focus:ring-0 focus:outline-none focus-visible:outline-none" 
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(event) => {
                                        setPassword(event.target.value)
                                    }} 
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
                            {error.password && <p className='text-xs text-red-400'>{error.password}</p>}
                        </div>
                        <div className='py-4 flex flex-col'>
                            <label htmlFor='password'>Confirm Password</label>
                            <div className="flex items-center border border-solid -border--outline rounded">
                                <input 
                                    className="w-full border-0 rounded py-2 px-3 focus:ring-0 focus:outline-none focus-visible:outline-none" 
                                    name="passwordConfirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={(event) => {
                                            setRegisterPassword(event.target.value)
                                    }}
                                    placeholder='Confirm your password' 
                                />
                                <button
                                    type='button'
                                    className='px-3 py-2 text-sm -text--outline border-0 bg-transparent cursor-pointer'
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} size="lg"/>
                                </button>
                            </div>
                            {error.passwordConfirm && <p className='text-xs text-red-400'>{error.passwordConfirm}</p>}
                        </div>
                        {error.form && <p className='mb-4 text-sm text-red-400'>{error.form}</p>}
                        <button
                            className='button button-primary mt-4 rounded w-full'
                            onClick={register}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
                <Link to='/' 
                    className='button button-secondary mt-4 rounded'
                >
                    Cancel
                </Link>
            </div>
        </div>
    )
}

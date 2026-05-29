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
    const [registerFirstName, setRegisterFirstName] = useState("");
    const [registerLastName, setRegisterLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const register = async () => {
        const validationErrors = SignupValidation({
            firstName: registerFirstName,
            lastName: registerLastName,
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
            await updateProfile(user, { displayName: `${registerFirstName} ${registerLastName}` });
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
                            <label htmlFor='firstName'>First Name</label>
                            <input
                                id="firstName"
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                aria-invalid={Boolean(error.firstName)}
                                aria-describedby={error.firstName ? 'signup-firstName-error' : undefined}
                                onChange={(event) => {
                                    setRegisterFirstName(event.target.value)
                                }} 
                                placeholder="Your First Name" 
                            />
                            {error.firstName && <p id="signup-firstName-error" className='text-xs text-red-700'>{error.firstName}</p>}
                            
                        </div>
                        <div className="pt-4 flex flex-col">
                        <label htmlFor='lastName'>Last Name</label>
                            <input
                                    id="lastName"
                                    className="border border-solid -border--outline rounded py-2 px-3" 
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    aria-invalid={Boolean(error.lastName)}
                                    aria-describedby={error.lastName ? 'signup-lastName-error' : undefined}
                                    onChange={(event) => {
                                        setRegisterLastName(event.target.value)
                                    }} 
                                    placeholder="Your Last Name" 
                                />
                                {error.lastName && <p id="signup-lastName-error" className='text-xs text-red-700'>{error.lastName}</p>}
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='email'>Email</label>
                            <input
                                id="email"
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="email"
                                type='email'
                                autoComplete="email"
                                aria-invalid={Boolean(error.email)}
                                aria-describedby={error.email ? 'signup-email-error' : undefined}
                                onChange={(event) => {
                                    setRegisterEmail(event.target.value)
                                }} 
                                placeholder='youremail@example.com' 
                            />
                            {error.email && <p id="signup-email-error" className='text-xs text-red-700'>{error.email}</p>}
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='password'>Password</label>
                            <div className="flex items-center border border-solid -border--outline rounded">
                                <input
                                    id="password"
                                    className="w-full border-0 rounded py-2 px-3 focus:ring-0 focus:outline-none focus-visible:outline-none" 
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(error.password)}
                                    aria-describedby={error.password ? 'signup-password-error' : undefined}
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
                            {error.password && <p id="signup-password-error" className='text-xs text-red-700'>{error.password}</p>}
                        </div>
                        <div className='py-4 flex flex-col'>
                            <label htmlFor='passwordConfirm'>Confirm Password</label>
                            <div className="flex items-center border border-solid -border--outline rounded">
                                <input
                                    id="passwordConfirm"
                                    className="w-full border-0 rounded py-2 px-3 focus:ring-0 focus:outline-none focus-visible:outline-none" 
                                    name="passwordConfirm"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(error.passwordConfirm)}
                                    aria-describedby={error.passwordConfirm ? 'signup-password-confirm-error' : undefined}
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
                            {error.passwordConfirm && <p id="signup-password-confirm-error" className='text-xs text-red-700'>{error.passwordConfirm}</p>}
                        </div>
                        {error.form && <p className='mb-4 text-sm text-red-700' role="alert">{error.form}</p>}
                        <button
                            type="button"
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
                <div className="mt-4 text-center">
                    <Link to="/privacy-policy" className="-text--main-font-color underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    )
}

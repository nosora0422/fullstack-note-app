import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase.config';


export default function Signup(){
    const [registerEmail, setRegisterEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        if (password !== registerPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const user = userCredential.user;
            // Update user profile with the name
            await updateProfile(user, { displayName: registerName });
            navigate('/');
            
            console.log(user);
        } catch(error){
            setError(error.message);
            console.log(error.message);
        }
    };

    console.log(registerEmail);
    console.log(registerPassword);

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
                            {/*error.email && <p className='text-xs text-red-400'>{error.email}</p>*/ }
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="password"
                                type='text'
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                }} 
                                placeholder='Your password' 
                            />
                            {/*error.password && <p className='text-xs text-red-400'>{error.password}</p> */}
                        </div>
                        <div className='py-4 flex flex-col'>
                            <label htmlFor='password'>Confirm Password</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="passwordConfirm"
                                type='text'
                                onChange={(event) => {
                                        setRegisterPassword(event.target.value)
                                }}
                                placeholder='Confirm your password' 
                            />
                            {error && <p className='text-xs text-red-400'>{error}</p>}
                        </div>
                        <button
                            className='button w-full mt-4 -bg--primary -text--on-primary rounded'
                            onClick={register}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
                <Link to='/' 
                    className='button w-full mt-4 -bg--primary-container -text--on-primary-container rounded'
                >
                    Cancel
                </Link>
            </div>
        </div>
    )
}
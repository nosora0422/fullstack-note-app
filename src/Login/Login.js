import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login(){
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            navigate('/app');        
            console.log(user);
        } catch(error){
            setError(error.message);
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
                                    className="border border-solid -border--outline rounded py-2 px-3"
                                    name='email' 
                                    type='email'
                                    onChange={(event)=>{setLoginEmail(event.target.value)}} 
                                    placeholder='youremail@example.com' 
                                />
                                {error&& <p className='text-xs text-red-400'>{error}</p> }
                            </div>
                            <div className='pt-4 flex flex-col h-20'>
                                <label htmlFor='password'>Password</label>
                                <input 
                                    className="border border-solid -border--outline rounded py-2 px-3" 
                                    name='password'
                                    type='password'
                                    onChange={(event)=>{setLoginPassword(event.target.value)}} 
                                    placeholder='Your password'
                                />
                                {error && <p className='text-xs text-red-400'>{error}</p> }
                            </div>
                            <button 
                                className='button w-full mt-8 -bg--primary -text--on-primary rounded'
                                onClick={login}
                            >
                                Log in
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
                        <Link to="/app" className=" -text--main-font-color  underline mt-4">Enter as a guest</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
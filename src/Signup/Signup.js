import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SignupValidation from '../SignupValidation';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Signup(){

    const [values, setValues] = useState({
        name:'',
        email:'',
        password:''
    });
    const [error, setError] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev,[event.target.name]: [event.target.value] }))
    }

    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const err = SignupValidation(values);
        setError(err);
        if(error.name === "" && error.email === "" && error.password === ""){
            Axios.post('http://localhost:3001/signup', values)
            .then(res => {
                navigate('/')
            })
            .catch(err => console.log('Error' + err));
        }

    }

    return(
        <div className="grid grid-cols-12 h-screen m-0 p-6 -bg--surface-container-low">
            <div className="col-span-12 md:col-start-4 md:col-end-10 w-full m-auto p-8 lg:p-24 rounded-lg bg-white drop-shadow-lg">
                <h1 className="text-2xl my-4 font-medium">Sign up</h1>
                <div>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="pt-4 flex flex-col">
                            <label htmlFor='name'>Name</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="name"
                                type="text"
                                onChange={handleInput} 
                                placeholder="Your Name" 
                            />
                            {error.name && <p className='text-xs text-red-400'>{error.name}</p> }
                        </div>
                        <div className='pt-4 flex flex-col'>
                            <label htmlFor='email'>Email</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="email"
                                type='email'
                                onChange={handleInput} 
                                placeholder='youremail@example.com' 
                            />
                            {error.email && <p className='text-xs text-red-400'>{error.email}</p> }
                        </div>
                        <div className='py-4 flex flex-col'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                className="border border-solid -border--outline rounded py-2 px-3" 
                                name="password"
                                type='password'
                                onChange={handleInput}  
                                placeholder='Your password' 
                            />
                            {error.password && <p className='text-xs text-red-400'>{error.password}</p> }
                        </div>
                        <button 
                            className='button w-full mt-4 -bg--primary -text--on-primary rounded'
                            type='submit'
                        >
                            Sign up
                        </button>
                    </form>
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
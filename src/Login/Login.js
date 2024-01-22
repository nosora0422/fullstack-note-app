import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Login(){
    //const [values, setValues] = useState({
        //email:'',
        //password:''
    //});
    // console.log(values);

    //const [error, setError] = useState({})
    //const [isLoggedIn, setIsLoggedIn] = useState(false);

    //update value when data entered in input box (email and password)
    //const handleInput = (event) => {
        //setValues(prev => ({...prev, [event.target.name]: [event.target.value] }))
    //}

    //validate input and check error 
    //const navigate = useNavigate();

    //useEffect(() => {
        // Check if the user is already logged in (e.g., from local storage)
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     if (user) {
    //       setIsLoggedIn(true);
    //     }
    //   }, []);

    // const handleLogin = () => {
    //     Axios.post('http://localhost:3001/login', values)
    //         .then((res) => {
    //         if (res.data.status === 'Success') {
    //             localStorage.setItem('user', JSON.stringify(res.data.user));
    //             setIsLoggedIn(true);
    //             navigate('/app');
    //         } else {
    //             alert('No account found');
    //         }
    //         })
    //         .catch((err) => console.log('Error' + err));
    // };

    // const handleLogout = () => {
    //     Axios.post('http://localhost:3001/logout')
    //         .then((res) => {
    //         if (res.data.status === 'Success') {
    //             localStorage.removeItem('user');
    //             setIsLoggedIn(false);
    //         } else {
    //             alert('Logout failed');
    //         }
    //         })
    //         .catch((err) => console.log('Error' + err));
    // };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     const err = LoginValidation(values);
    //     setError(err);

    //     if (!err.email && !err.password) {
    //         handleLogin();
    //     }
    // }; 
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
            <div className="grid grid-cols-12 h-screen m-0 p-6 -bg--surface-container-low">
                <div className='col-span-12 md:col-start-4 md:col-end-10 w-full m-auto p-8 lg:p-24 rounded-lg bg-white drop-shadow-lg'>
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
                    <p className='text-center mt-10'>Don't have an account yet?</p>
                    <Link to='/signup' 
                        className='button w-full mt-4 -bg--primary-container -text--on-primary-container rounded'
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
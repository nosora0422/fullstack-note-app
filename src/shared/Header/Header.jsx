import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faListCheck, faImages, faXmark, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

export default function Header(){
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleMNav = () => {
        setIsNavOpen(prev => !prev);
    }

    const handleLogout = () => {
        Axios.post('http://localhost:3001/logout')
            .then((res) => {
            if (res.data.status === 'Success') {
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                navigate('/');
            } else {
                alert('Logout failed');
            }
            })
            .catch((err) => console.log('Error' + err));
    };

    const cRoute = useLocation();
    return(
        <>
        <header>
            <nav className="w-full flex justify-between py-4 px-6 -bg--surface-container md:hidden">
                <div className="w-full flex justify-between cursor-pointer" onClick={handleMNav}>
                    <FontAwesomeIcon icon={faBars} />
                    <h1>Note App</h1>
                </div>
                <div className="w-full absolute top-0 left-0 z-10">
                    <ul className={isNavOpen ? "mobile-nav-items-open" : "mobile-nav-items"}>
                        <div className="pb-4 text-right cursor-pointer" onClick={handleMNav}> 
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                        <h1 className="text-3xl mb-8 md:mb-24">Note App</h1>
                        <li>
                            <Link to="/app/to-do-list" className={(cRoute.pathname === '/app' || cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}>      
                            <FontAwesomeIcon icon={faListCheck} className="mr-3"/>
                            To Do List
                            </Link>
                        </li>
                        <li>
                            <Link to="/app/note" className={(cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faNoteSticky} className="mr-3"/>
                            Note
                            </Link>
                        </li>
                        <li>
                            <Link to="/app/image" className={(cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faImages}className="mr-3"/>
                            Images
                            </Link>
                        </li>
                    </ul>
                </div>
                {isLoggedIn ? (<button onClick={handleLogout}>Logout</button>) : <></>}
            </nav>
            <nav className="hidden relative md:block h-screen py-10 px-4 -bg--surface-container drop-shadow-xl">
                <h1 className="text-3xl mb-12">Note App</h1>
                <ul className="flex flex-col justify-between h-40">
                    <li>
                        <Link to="/app/to-do-list" className={(cRoute.pathname === '/app' || cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}><FontAwesomeIcon icon={faListCheck} className="mr-3"/>To Do List
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/note" className={(cRoute.pathname === '/app/note') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faNoteSticky} className="mr-3"/>
                        Note
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/image" className={(cRoute.pathname === '/app/image') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faImages}className="mr-3"/>
                        Images
                        </Link>
                    </li>
                </ul>
                {isLoggedIn ? (<button className="button absolute bottom-9 -text--main-font-color -bg--surface-container-highest" onClick={handleLogout}><FontAwesomeIcon icon={faPowerOff} className="mr-2" />Logout</button>) : <></>}
            </nav>
        </header>
        </>
    )
}
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faListCheck, faImages, faXmark, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header(){
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    onAuthStateChanged(auth, (currentUser)=> {
        setUser(currentUser);
    })

    const logout = async () => {
        await signOut(auth)
        navigate('/');
    };

    const handleMNav = () => {
        setIsNavOpen(prev => !prev);
    }
    
    const cRoute = useLocation();
    return(
        <>
        <header>
            <nav className="w-full flex flex-col justify-between py-4 px-6 bg-white drop-shadow-sm md:hidden">
                <div className="w-full flex justify-between cursor-pointer" onClick={handleMNav}>
                    <FontAwesomeIcon icon={isNavOpen ? faXmark : faBars} />
                    <h1>Note App</h1>
                </div>
                    <ul className={isNavOpen ? "mobile-nav-items-open" : "mobile-nav-items"}>
                        {/* <li className="pb-4 text-right cursor-pointer" onClick={handleMNav}> 
                            <FontAwesomeIcon icon={faXmark} />
                        </li> */}
                        <li>
                            <Link to="/app/to-do-list" className={(cRoute.pathname === '/app' || cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}>      
                            <FontAwesomeIcon icon={faListCheck} className="mr-3"/>
                            To Do List
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
                        <button 
                            className="py-2 px-4 mt-3 rounded-full -text--main-font-color -bg--surface-container-highest"
                            onClick={logout}
                        >
                        <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                        Logout
                        </button>
                    </ul>
                    
            </nav>
            <nav className="fixed top-0 left-0 w-2/12 min-w-[164px] hidden md:block h-screen py-10 px-4 bg-white drop-shadow-xl">
                <h2 className="text-xl">Hi, {user ? user.displayName || "Guest" : "Guest"}!</h2>
                <h1 className="text-3xl mb-10">Note App</h1>
                <ul className="flex flex-col justify-between h-40">
                    <li>
                        <Link to="/app/to-do-list" className={(cRoute.pathname === '/app' || cRoute.pathname === '/app/to-do-list') ? 'nav-item-curr' : 'nav-item'}><FontAwesomeIcon icon={faListCheck} className="mr-2"/>To Do List
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/note" className={(cRoute.pathname === '/app/note') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faNoteSticky} className="mr-2"/>
                        Note
                        </Link>
                    </li>
                    <li>
                        <Link to="/app/image" className={(cRoute.pathname === '/app/image') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faImages}className="mr-2"/>
                        Images
                        </Link>
                    </li>
                </ul>
                <button className="button absolute bottom-9 -text--main-font-color -bg--surface-container-highest" onClick={logout}><FontAwesomeIcon icon={faPowerOff} className="mr-2" />Logout</button>
            </nav>
        </header>
        </>
    )
}
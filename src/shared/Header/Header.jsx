import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faListCheck, faImages, faXmark, faPowerOff, faGear } from '@fortawesome/free-solid-svg-icons'
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { clearAppMode, clearGuestData, getAppMode } from "../../utils/storage";

export default function Header(){
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const cRoute = useLocation();
    const isGuest = cRoute.pathname.startsWith('/guest') || getAppMode() === "guest";
    const displayName = isGuest ? "Guest" : user?.displayName || "Guest";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        if (isGuest) {
            clearGuestData();
            clearAppMode();
            navigate('/login');
            return;
        }

        await signOut(auth);
        clearAppMode();
        navigate('/login');
    };

    const handleMNav = () => {
        setIsNavOpen(prev => !prev);
    }
    
    const navBase = isGuest ? "/guest" : "/app";
    const todosPath = `${navBase}/todos`;
    const notesPath = `${navBase}/notes`;
    const imagesPath = `${navBase}/images`;
    return(
        <>
        <header>
            <nav className="w-full flex flex-col justify-between py-4 px-6 bg-white drop-shadow-sm md:hidden">
                <button
                    type="button"
                    className="w-full flex justify-between items-center cursor-pointer border-0 bg-transparent p-0 -text--main-font-color"
                    onClick={handleMNav}
                    aria-expanded={isNavOpen}
                    aria-controls="mobile-navigation"
                    aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                    <FontAwesomeIcon icon={isNavOpen ? faXmark : faBars} aria-hidden="true" />
                    <span className="font-medium">Note App</span>
                </button>
                    <ul id="mobile-navigation" className={isNavOpen ? "mobile-nav-items-open" : "mobile-nav-items"}>
                        <li>
                            <Link to={todosPath} className={(cRoute.pathname === '/app' || cRoute.pathname.endsWith('/todos')) ? 'nav-item-curr' : 'nav-item'}>      
                            <FontAwesomeIcon icon={faListCheck} className="mr-3"/>
                            To Do List
                            </Link>
                        </li>
                        <li>
                            <Link to={notesPath} className={(cRoute.pathname.endsWith('/notes')) ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faNoteSticky} className="mr-3"/>
                            Note
                            </Link>
                        </li>
                        <li>
                            <Link to={imagesPath} className={(cRoute.pathname.endsWith('/images')) ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faImages}className="mr-3"/>
                            Images
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className={(cRoute.pathname === '/settings') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faGear} className="mr-3"/>
                            Settings
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="py-2 px-4 mt-3 rounded-full -text--main-font-color -bg--surface-container-highest"
                                onClick={logout}
                            >
                            <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                            Logout
                            </button>
                        </li>
                    </ul>
                    
            </nav>
            <nav className="fixed top-0 left-0 w-2/12 min-w-[164px] hidden md:flex md:flex-col h-screen py-10 px-4 bg-white drop-shadow-xl">
                <p className="text-xl">
                    <span aria-hidden="true">👋 </span>
                    Hi, {displayName}!
                </p>
                <p className="text-3xl mb-10">Note App</p>
                <ul className="flex flex-col flex-grow h-40">
                    <li>
                        <Link to={todosPath} className={(cRoute.pathname === '/app' || cRoute.pathname.endsWith('/todos')) ? 'nav-item-curr' : 'nav-item'}><FontAwesomeIcon icon={faListCheck} className="mr-2"/>To Do List
                        </Link>
                    </li>
                    <li>
                        <Link to={notesPath} className={(cRoute.pathname.endsWith('/notes')) ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faNoteSticky} className="mr-2"/>
                        Note
                        </Link>
                    </li>
                    <li>
                        <Link to={imagesPath} className={(cRoute.pathname.endsWith('/images')) ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faImages}className="mr-2"/>
                        Images
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className={(cRoute.pathname === '/settings') ? 'nav-item-curr' : 'nav-item'}> <FontAwesomeIcon icon={faGear}className="mr-2"/>
                        Settings
                        </Link>
                    </li>
                </ul>
                <button type="button" className="button button-secondary w-full" onClick={logout}><FontAwesomeIcon icon={faPowerOff} className="mr-2" />Logout</button>
            </nav>
        </header>
        </>
    )
}

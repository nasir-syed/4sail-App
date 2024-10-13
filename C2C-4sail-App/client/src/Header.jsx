import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import Avatar from './Avatar';

function Header() {
    const { user, setUser } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        await axios.post('/logout');
        setUser(null);
        return <Navigate to="/login"/>
    };

    return (
        <header className="flex justify-between">
            <Link to={'/'} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 text-primary">
                    <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
                </svg>
                <span className="font-bold text-xl text-secondary">4sails</span>
            </Link>
            <div className='flex items-center gap-2 w-2/4 rounded-full py-1 px-3 ml-3 '>
                <input type="text" value={searchInput} className="border border-3 border-secondary"onChange={(e) => setSearchInput(e.target.value)} />
                <Link 
                    to={searchInput.trim() ? `/search/${searchInput}`:'/'} 
                    className='bg-secondary flex justify-center items-center text-primary p-2 rounded-full transition duration-300 ease-in-out hover:bg-primary hover:text-black'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
            
            <div className={`flex ${user? "w-48":''} items-center gap-2 bg-secondary text-primary border border-gray-300 rounded-full py-4 px-4 shadow-md shadow-gray-300`}>
                <div className="relative cursor-pointer" onMouseOver={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>   
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>  
                    {user && showDropdown && (
                        <div 
                            className="absolute text-primary mt-3 -ml-3 w-48 bg-secondary rounded-md shadow-lg z-30 "
                        >
                            <Link to="/account/forsale" className="block rounded-md px-4 py-2 text-sm transition duration-200 ease-in-out hover:bg-primary hover:text-secondary">
                                For Sale
                            </Link>
                            <Link to="/account/wishlist" className="block rounded-md px-4 py-2 text-sm transition duration-200 ease-in-out hover:bg-primary hover:text-secondary">
                                Wishlist
                            </Link>
                            <Link 
                                onClick={handleLogout} 
                                to="/login"
                                className="block w-full bg-transparent text-left rounded-md px-4 py-2 text-sm transition duration-200 ease-in-out hover:bg-primary hover:text-secondary"
                            >
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
                    {user && (
                        <Link to="/messages" className='mr-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>                
                        </Link>
                    )}
                    <div className='flex items-center gap-2'>
                        {!user && (
                            <Link to="/login">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                </svg>   
                            </Link>                       
                        )}
                        {user && (

                            <div className='flex items-center gap-2 text-tertiary'>
                                <Avatar name={user.name}/>
                                {user.name}
                            </div>
                        )}
                    </div>
                </div>
                
        </header>
    );
}

export default Header;

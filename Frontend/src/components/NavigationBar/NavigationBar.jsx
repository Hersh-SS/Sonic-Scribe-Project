import React, { useContext, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import Logo from '../../images/logo.png';
import { logout } from '../../services/auth';
import { UserContext } from '../../contexts/user';

// styles
import "./NavigationBar.css";

const handleLogoutEvent = () => {
    logout();
    navigate('/');
}

const NavigationBar = () => {
    const { user } = useContext(UserContext);
    useEffect(() => {}, [user]);

    return (
        <nav id="navbar" >
            <div className='navbar-sonic-scribe'>
                <img src={Logo} alt="logo" />
                <h3>SonicScribe</h3>
            </div>
            <ul className='navbar-list'>
                <div className='navbar-options'>
                    <li>
                        <Link to='/' className='navbar-link'>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to='/transcribe' className='navbar-link'>
                            Transcribe
                        </Link>
                    </li>
                    <li>
                        <Link to='/search' className='navbar-link'>
                            Search
                        </Link>
                    </li>
                    <li>
                        <Link to='/resources' className='navbar-link'>
                            Resources
                        </Link>
                    </li>
                </div>
                <li>
                    {
                        !user ? 
                        (
                            <Link to='/login' className='navbar-link'>
                                Login
                            </Link>
                        ) : (
                            <div style={{textAlign: 'center'}}>
                                <Link to='/account' className='navbar-user'>
                                    {user.email.split('@')[0]}
                                </Link>
                                <div onClick={handleLogoutEvent} className='navbar-link'>
                                    Logout
                                </div>
                            </div>
                        )
                    }
                </li>
            </ul>
        </nav >
    );
}

export default NavigationBar;

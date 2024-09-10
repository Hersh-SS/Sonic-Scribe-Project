import React, { useContext, useEffect, useState, useRef } from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import AccountSongs from '../components/AccountSongs/AccountSongs';
import AccountFavourites from '../components/AccountFavourites/AccountFavourites';
import AccountUpload from '../components/AccountUpload/AccountUpload';
import { UserContext } from '../contexts/user';
import { navigate } from 'gatsby';

// styles
import '../styles/account.css';

const AccountPage = () => {
    const { user } = useContext(UserContext);
    const [content, setContent] = useState("My Songs");
    const [refreshSongs, setRefreshSongs] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            // Adjust 'userId' and 'isPublic' as necessary based on your application's requirements
            formData.append('userId', user ? user.id : ''); // Assuming 'user' has an 'id' property
            formData.append('isPublic', true); // This could also be dynamic based on user input

            try {
                const response = await fetch(`${process.env.BACKEND_API_ENDPOINT}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log('Upload successful');
                setRefreshSongs(prev => !prev); // Trigger refresh of the song list
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
    };

    return (
        <>
            <NavigationBar />
            <div className='account-main'>
                <div className='account-header'>
                    <h1>{user?.email.split('@')[0]}</h1>
                </div>
                <div className='account-navbar'>
                    <div className='account-navbar-container'>
                        <div onClick={() => setContent("My Songs")} className={`account-navbar-link ${content === "My Songs" ? "active" : ""}`}>
                            <div>My Songs</div>
                        </div>
                        <div onClick={() => setContent("Favourites")} className={`account-navbar-link ${content === "Favourites" ? "active" : ""}`}>
                            <div>Favourites</div>
                        </div>
                    </div>
                    <div className='account-navbar-container'>
                        <div 
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            className="account-navbar-upload"
                        >
                            <span>+</span>
                            <div>Upload</div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange} 
                            accept=".xml,.mxl,.musicxml" 
                            style={{ display: 'none' }} 
                        />
                    </div>
                </div>
                {content === "My Songs" && <AccountSongs refresh={refreshSongs} />}
                {content === "Favourites" && <AccountFavourites />}
                {content === "Upload" && <AccountUpload />}
            </div>
        </>
    );
};

export default AccountPage;

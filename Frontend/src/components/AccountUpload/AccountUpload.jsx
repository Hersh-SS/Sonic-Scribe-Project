import React, { useContext, useRef } from 'react';
import { UserContext } from '../../contexts/user';

// styles
import './AccountUpload.css';

const AccountUpload = () => {
    const { user } = useContext(UserContext);
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && user) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.id); // Assuming 'user' includes an 'id' field
            formData.append('isPublic', true); // Adjust based on your application's needs

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData, // No need to explicitly set 'Content-Type' header for FormData with fetch
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const result = await response.json();
                console.log(result); // Handle success
            } catch (error) {
                console.error('Error uploading file:', error); // Handle error
            }
        }
    };

    return (
        <>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".mp3,.wav,.mid,.midi"
                style={{ display: 'none' }} 
            />
            <div className='upload-button' onClick={() => fileInputRef.current.click()}>
                + Upload File
            </div>
        </>
    );
};

export default AccountUpload;

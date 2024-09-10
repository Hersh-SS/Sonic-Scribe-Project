import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { handlePasswordReset } from '../services/auth';

import '../styles/login.css'
import { navigate } from 'gatsby';

function LoginPage() {
	const [email, setEmail] = useState('');

	const handleLoginEvent = (event) => {
		event.preventDefault();
		handlePasswordReset(email);
        navigate("/");
	};

	return (
		<div className='login-main'>
			<NavigationBar />
			<div className='login-div'>
				<div className='login-container'>
					<h2 className='login-header'>Password Reset</h2>
					<form onSubmit={handleLoginEvent}>
						<label className='login-label'>
							Email:
							<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='login-input' />
						</label>
						<input type="submit" value="Submit" className='login-submit' />
					</form>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { handleLogin } from '../services/auth';
import { navigate } from 'gatsby';

import '../styles/login.css'

function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginEvent = (event) => {
		event.preventDefault();
		handleLogin({ email: email, password: password }).then((success) => {
			if(success) navigate('/');
		});
	};

	return (
		<div className='login-main'>
			<NavigationBar />
			<div className='login-div'>
				<div className='login-container'>
					<h2 className='login-header'>Login Page</h2>
					<form onSubmit={handleLoginEvent}>
						<label className='login-label'>
							Email:
							<input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className='login-input' />
						</label>
						<label className='login-label'>
							Password:
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='login-input' />
						</label>
						<input type="submit" value="Login" className='login-submit' />
					</form>
					<br/>
					<p className='login-p'>
						Forgot your password? <a href="/passwordReset" style={{ color: '#007BFF' }}>Reset Password</a>
					</p>
					<p className='login-p'>
						Don't have an account? <a href="/signup" style={{ color: '#007BFF' }}>Sign up</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
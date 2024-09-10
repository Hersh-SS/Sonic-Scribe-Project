import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import { navigate } from 'gatsby';

import { handleSignUp } from '../services/auth';
import '../styles/login.css'

function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordLengthValid, setPasswordLengthValid] = useState(null);
	const [passwordsMatch, setPasswordMatch] = useState(null);

	useEffect(() => {
		if (password) {
			setPasswordLengthValid(password.length >= 6)
		}
		if (password && confirmPassword) {
			setPasswordMatch(password === confirmPassword)
		}
		
	}, [password, confirmPassword]);

	const handleSignUpRequest = (event) => {
		event.preventDefault();
		if (!passwordLengthValid || !passwordsMatch) {
			alert("Passwords don't match");
			return;
		}
		handleSignUp({email: email, password: password}).then((success) => {
			if(success) {
				alert('success!')
				navigate('/');
			}
		}).catch((error) => {
			console.error(error);
			alert(error.message);
		});
		console.log(`Email: ${email}, Password: ${password}`);
	};

	return (
		<div className='login-main'>
			<NavigationBar />
			<div className='login-div'>
				<div className='login-container'>
					<h2 className='login-header'>Sign Up Page</h2>
					<form onSubmit={handleSignUpRequest}>
						<label className='login-label'>
							Email:
							<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='login-input' />
						</label>
						<br />
						<label className='login-label'>
							Password:
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={password ? (passwordLengthValid ? 'login-input green' : 'login-input red') : 'login-input'} />
						</label>
						<p className='login-p' style={{display: password && !passwordLengthValid ? 'block' : 'none', color: 'red'}}>
							Password length must be 6 or more.
						</p>
						<br />
						<label className='login-label'>
							Confirm Password:
							<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={password && confirmPassword ? (passwordsMatch ? 'login-input green' : 'login-input red') : 'login-input'} />
						</label>
						<p className='login-p' style={{display: password && confirmPassword && !passwordsMatch ? 'block' : 'none', color: 'red'}}>
							Passwords do not match.
						</p>
						<br />
						<input type="submit" value="Sign Up" className='login-submit' />
					</form>
				</div>
			</div>
		</div>
	);
}

export default SignUpPage;
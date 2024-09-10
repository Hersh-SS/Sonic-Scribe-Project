import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";

class User {
	email;
	id;

	constructor(email, id) {
		this.email = email;
		this.id = id;
	}
}

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () => (isBrowser() && window.localStorage.getItem("user") ? JSON.parse(window.localStorage.getItem("user")) : {});

const setUser = (user) => {
    window.localStorage.setItem("user", JSON.stringify(user));
};

export const handleLogin = async ({ email, password }) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		setUser(new User(user.email, user.uid));
		return true;
	} catch (error) {
		console.error(error);
		alert(error.message);
		return false;
	}
};

export const isAuthenticated = () => {
	const user = getUser();
	return !!user.email;
};

export const logout = async () => {
	try {
		await signOut(auth);
		setUser({});
	} catch (error) {
		console.error(error);
	}
};

export const handleSignUp = async ({ email, password }) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		console.log(userCredential);
		const user = userCredential.user;
		setUser(new User(user.email, user.uid));
		return true;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const handlePasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

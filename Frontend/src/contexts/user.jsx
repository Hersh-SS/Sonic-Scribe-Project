import React, { createContext, useState, useEffect } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

class User {
	email;
	id;

	constructor(email, id) {
		this.email = email;
		this.id = id;
	}
}

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = new User(firebaseUser.email, firebaseUser.uid);
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
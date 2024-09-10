import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user';

// styles
import './AccountFavourites.css';

const AccountFavourites = () => {
    const { user } = useContext(UserContext);
    useEffect(() => {}, [user]);

    return (
        <>
          <p>Favourites</p>  
        </>
    );
}

export default AccountFavourites;

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user';
import AccountSongSearch from '../AccountSongsSearch/AccountSongSearch';

// styles
import './AccountSongs.css';

const AccountSongs = ({ refresh, setRefreshSongs }) => {

//   const toggleVisibility = async (songId, isPublic) => {
//     try {
//         const response = await fetch(`${process.env.BACKEND_API_ENDPOINT}/music/${songId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 isPublic: !isPublic, // Toggle the visibility
//             }),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Update songs state to reflect the change
//         setSongs(songs.map(song => {
//             if (song.id === songId) {
//                 return {...song, isPublic: !song.isPublic}; // Update the isPublic status for the toggled song
//             }
//             return song;
//         }));

//     } catch (error) {
//         console.error('Failed to toggle visibility:', error);
//     };
// };



return (
  <div>
      <h2>My Songs</h2>
      <AccountSongSearch refresh={refresh} />
  </div>
);
};

export default AccountSongs;

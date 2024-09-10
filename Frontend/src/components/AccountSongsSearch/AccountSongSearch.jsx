import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../contexts/user';
import axios from 'axios';

import "./AccountSongSearch.css";
import SearchSelector from "../SearchSelector/SearchSelector";

const AccountSongSearch = ({refresh}) => {
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async (searchTerm) => {
        axios.get(`${process.env.BACKEND_API_ENDPOINT}/music?searchTerm=${searchTerm}&userId=${user.id}&limit=100`)
            .then(res => setSearchResults(res.data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if(user) handleSearch("");
    }, [user, refresh]);


    return (
        <div>
            <form>
                <div class="d-flex form-inputs">
                    <input className="form-control" type="text" placeholder="Search for music..." value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                    }} />
                </div>
            </form>

            <h2>Search Results</h2>
            <div className="searchPage-center">
                <div className="searchPage-container">
                    {searchResults.map((item, i) => <SearchSelector key={i} id={item.id} xml={item.xmlFile} title={item.title} />)}
                </div>
            </div>
        </div>
    );
};

export default AccountSongSearch;

export const Head = () => <title>SonicScribe</title>;
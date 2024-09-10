import * as React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import axios from 'axios';

import "./SearchPage.css";
import SearchSelector from "../SearchSelector/SearchSelector";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async (searchTerm) => {
        axios.get(`${process.env.BACKEND_API_ENDPOINT}/music?searchTerm=${searchTerm}&isPublic=1&limit=100`)
            .then(res => setSearchResults(res.data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        handleSearch("");
    }, []);

    return (
        <div>
            <NavigationBar />
            <form>
                <h1>Search</h1>
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

export default SearchPage;

export const Head = () => <title>SonicScribe</title>;
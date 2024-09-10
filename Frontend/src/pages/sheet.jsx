import React, { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import MusicXMLParser from "../components/MusicXMLParser/MusicXMLParser";
import { UserContext } from '../contexts/user';
import axios from 'axios';
import "../styles/sheet.css";

function Sheet({ location }) {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState();
    const [data, setData] = useState();
    const [noteSequence, setNoteSequence] = useState();
    const [isPublic, setIsPublic] = useState(false); // Add this line

    useEffect(() => {}, [isPublic, title]); // force reload when these change

    const saveChanges = () => {
        axios.put(`${process.env.BACKEND_API_ENDPOINT}/music/${location.state.id}`, {
            title: title,
            isPublic: isPublic
        })
            .then((res) => {
                alert("Success!");
            })
            .catch(error => console.log(error));
    }

    const handleFavourite = () => {

    }

    const handleTitleChange = (newTitle) => { // Add this function
        setTitle(newTitle);
    }

    const handlePublicChange = (newIsPublic) => { // Add this function
        setIsPublic(newIsPublic);
    }

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`${process.env.BACKEND_API_ENDPOINT}/music/${location.state.id}`)
                .then(async (res) => {
                    setData(res.data[0]);
                    setTitle(res.data[0].title);
                    setIsPublic(res.data[0].isPublic);
                    // setNoteSequence(await xmlToNoteSequence(res.data[0]));
                })
                .catch(error => console.log(error));
        }

        fetchData();
    }, []);

    const getSidebarContent = () => {
        if (data && user) {
            if (data.userId === user.id) { // if this is the users you can edit
                return (
                    <div className="sheet-selector">
                        <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
                        <label>
                            Is Public:
                            <input type="checkbox" checked={isPublic} onChange={(e) => handlePublicChange(e.target.checked)} />
                        </label>
                        <button class="sheet-favouriteButton" onClick={() => saveChanges()}>Save Changes</button>
                        {user ? <button class="sheet-favouriteButton" onClick={() => handleFavourite()}>Favourite!</button> : ""}
                    </div>
                );
            }
        }
        return (
            <div className="sheet-selector">
                <h1>{title}</h1>
                {user ? <button class="sheet-favouriteButton" onClick={() => handleFavourite()}>Favourite!</button> : ""}
            </div>
        );
    }


    return (
        <>
            {data ?
                <>
                    <NavigationBar />
                    <div className="sheet-container">
                        <MusicXMLParser sourceFileURL={data.xmlFile} preview={true} width={"80vw"} height={"100%"} drawTitle={true} color={"black"} />
                        {getSidebarContent()}
                    </div>
                </> : ""}
        </>
    );
};

export default Sheet;

export const Head = () => <title>SonicScribe</title>;


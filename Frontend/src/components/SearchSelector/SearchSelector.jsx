import React from "react";
import tempImage from "../../images/blurredSheet.png";
import { navigate } from "gatsby";

import './SearchSelector.css';

export default function SearchSelector({ id, title, handleClick }) {
    const handleNavigate = () => {
        navigate("/sheet", { state: { id: id } });
    }

    return (
        <div className="searchSelector-container" onClick={handleNavigate}>
            <div className="searchSelector-image">
                <img src={tempImage} width={"100%"} height={"100%"}></img>
            </div>
            <p className="searchSelector-title">{title}</p>
        </div>
    );
}

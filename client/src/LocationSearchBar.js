import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LocationSearchBar.css"; 

const LocationSearchBar = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const navigate = useNavigate();

    const fetchSuggestions = async (text) => {
        if (!text.trim()) {
            setSuggestions([]);
            return;
        }

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
        );
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
    };

    const handleSelect = (place) => {
        setSelectedPlace(place);
        setQuery(place.display_name);
        setSuggestions([]);
    };

    const handleGo = () => {
        const place = selectedPlace;
        if (place) {
            navigate(
                `/Plan?Location=${encodeURIComponent(place.display_name)}`
            );
        } else {
            alert("Please select a location from suggestions first.");
        }
    };

    return (
        <div className="full-container">
        <div className="search-container">
            <button className="but"
                onClick={() => navigate("/profile")}
            >
                Go to Profile
            </button>
            <h1>Hi,Harshiith</h1>
            <h4>Search for the Location and click ok for plans</h4>
            <div className="search">
            <input
                type="text"
                placeholder="Search location..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                }}
                className="search-input"
            />
            <button onClick={handleGo} className="search-button">
                OK
                </button>
            </div>
            {suggestions.length > 0 && (
                <ul className="suggestion-list">
                    {suggestions.map((place, index) => (
                        <li
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSelect(place)}
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
};

export default LocationSearchBar;

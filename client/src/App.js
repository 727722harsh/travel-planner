import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import LocationSearchBar from "./LocationSearchBar";
import Plan from "./Plan";
import ProfilePage from "./ProfilePage";

function App() {
    const [user, setUser] = useState(localStorage.getItem("authToken") || null);
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const uid = localStorage.getItem("userId");
        if (token && uid) {
            setUser(token);
            setUserId(uid);
        }
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/search"
                    element={user ? <LocationSearchBar /> : <Login setUser={setUser} />}
                />
                <Route path="/Plan" element={<Plan />} />
                <Route path="/profile" element={<ProfilePage userId={userId} />} />
            </Routes>
        </div>
    );
}


export default App;

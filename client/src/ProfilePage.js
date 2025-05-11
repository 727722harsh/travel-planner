import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [locations, setLocations] = useState([]);
    const [expandedLocation, setExpandedLocation] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        axios
            .get(`http://localhost:5000/api/plans/getProfile/${userId}`)
            .then((res) => {
                setUser(res.data.user);
                setLocations(res.data.locations);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
            });
    }, [userId]);

    return (
        <div className="profile-container">
            <div className="header">
                <h2>{user.name}</h2>
            </div>

            <div className="content">
                <div className="sidebar">
                    {locations.map((loc, index) => (
                        <div key={index}>
                            <div
                                className={`location-block ${expandedLocation === index ? "active" : ""}`}
                                onClick={() =>
                                    setExpandedLocation(expandedLocation === index ? null : index)
                                }
                            >
                                {loc.name}
                            </div>

                            {expandedLocation === index && (
                                <div className="plans-nested">
                                    {loc.plans?.length > 0 ? (
                                        loc.plans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className="plan-block"
                                                onClick={() => setSelectedPlan(plan)}
                                            >
                                                {plan.title}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-plans">No plans</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="details">
                    <div className="details-card">
                    {selectedPlan ? (
                        <>
                            <h3>{selectedPlan.title}</h3>
                            <p><strong>Description:</strong> {selectedPlan.description}</p>
                            <p><strong>Phone:</strong> {selectedPlan.phone}</p>
                            <p><strong>From:</strong> {selectedPlan.fromDate} {selectedPlan.fromTime}</p>
                            <p><strong>To:</strong> {selectedPlan.toDate} {selectedPlan.toTime}</p>
                        </>
                    ) : (
                        <p>Select a plan to view details</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

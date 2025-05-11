import React, { useState } from "react";
import "./Plan.css";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Plan() {
  const [text, setText] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const [searchParams] = useSearchParams();
  const Location = searchParams.get("Location");
  const userId = localStorage.getItem("userId") 
  const navigate = useNavigate();
  const handleOk = () => {
    if (text.trim() === "") return;
    setBlocks([...blocks, text]);
    setText("");
  };

  const handleDelete = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingText("");
    }
    if (selectedBlock === index) {
      setSelectedBlock(null);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(blocks[index]);
  };

  const confirmEdit = () => {
    if (editingText.trim() === "") return;
    const updated = [...blocks];
    updated[editingIndex] = editingText;
    setBlocks(updated);
    setEditingIndex(null);
    setEditingText("");
  };

  const handleSelectBlock = (index) => {
    setSelectedBlock(index);
  };

  const savePlanToDB = async () => {
    if (selectedBlock === null) return;

    if (
      !blocks[selectedBlock].trim() ||
      !description.trim() ||
      !phone.trim() ||
      !fromDate ||
      !toDate ||
      !fromTime ||
      !toTime
    ) {
      alert("Please fill in all the fields before saving.");
      return;
    }

    const plan = {
      title: blocks[selectedBlock],
      description,
      phone,
      fromDate,
      toDate,
      fromTime,
      toTime,
    };

    try {
      const res = await fetch("http://localhost:5000/api/plans/addPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, location: Location, plan }),
      });

      const data = await res.json();
      console.log("Saved:", data);
      alert("Plan saved successfully!");
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save plan.");
    }
  };

  const filteredBlocks = blocks.filter((block) =>
    block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-layout">
      <div className="container">
        
        <div className="block-wrapper">
          <p className="move">PLANS</p>
          {filteredBlocks.map((block, index) => {
            const realIndex = blocks.indexOf(block);
            return (
              <div
                key={realIndex}
                className={`block ${selectedBlock === realIndex ? "active-block" : ""}`}
                onClick={() => handleSelectBlock(realIndex)}
              >
                {editingIndex === realIndex ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)} 
                    />
                    <button className="confirm-button" onClick={confirmEdit}>
                      ✔
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="block-content" data-fulltext={block}>
                      {block}
                    </div>
                    <div className="actions">
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(realIndex);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(realIndex);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="input-section">
          <input
            type="text"
            value={text}
            placeholder="Type the plan name..."
            onChange={(e) => setText(e.target.value)} 
          />
          <button onClick={handleOk}>OK</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      
        <button className="but"
          onClick={() => navigate("/profile")}
        >
          Go to Profile
          </button>
          
      </div>

      {selectedBlock !== null && (
        <div className="details-panel">
          
          <h2>Plan name: {blocks[selectedBlock]}</h2>
          <p><b>Location: </b>{Location}</p>

          <b>Phone Number:</b>
          <label>
            <input
              type="tel"
              value={phone}
              placeholder="Enter phone number..."
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPhone(value);
                }
              }}
              maxLength={10}
              required
            />
          </label>

          <div className="date-time-group">
            <label>
              <b>From Date:</b>
              <input type="date" onChange={(e) => setFromDate(e.target.value)} required />
            </label>
            <label>
              <b>To Date:</b>
              <input type="date" onChange={(e) => setToDate(e.target.value)} required />
            </label>
          </div>

          <div className="date-time-group">
            <label>
              <b>From Time:</b>
              <input type="time" onChange={(e) => setFromTime(e.target.value)} required />
            </label>
            <label>
              <b>To Time:</b>
              <input type="time" onChange={(e) => setToTime(e.target.value)} required />
            </label>
          </div>

            <b>Description:</b>
          <label>
            <textarea
              placeholder="Enter description..."
              rows={10}
              cols={50}
              onChange={(e) => setDescription(e.target.value)} required
            />
          </label>

          <button type="submit" onClick={savePlanToDB}>Save Plan</button>
          {selectedBlock !== null && (
            <div className="navigation-buttons">
              <button
                onClick={() => setSelectedBlock((prev) => (prev > 0 ? prev - 1 : prev))}
                disabled={selectedBlock === 0}
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setSelectedBlock((prev) => (prev < blocks.length - 1 ? prev + 1 : prev))
                }
                disabled={selectedBlock === blocks.length - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Plan;

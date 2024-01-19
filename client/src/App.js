import { useState } from "react";
import classes from "./app.module.css";

function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id, setId] = useState("");
  const [date, setDate] = useState("");
  const [isIdUnique, setIsIdUnique] = useState(true); // New state for ID uniqueness

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the ID is unique and 13 characters long before submitting
    if (!isIdUnique) {
      alert("Please enter a unique ID.");
      return;
    }

    if (id.length !== 13) {
      alert("ID must be 13 characters long.");
      return;
    }

    // Additional validation for name and surname
    const nameCheck = /^[A-Za-z]+$/;
    const surnameCheck = /^[A-Za-z]+$/;

    if (!name.match(nameCheck) || !surname.match(surnameCheck)) {
      alert("Name and surname should contain only letters.");
      return;
    }

    const formattedDate = formatDateToDBFormat(date);
    const details = { name, surname, id, date: formattedDate };

    try {
      const response = await fetch("http://localhost:4001/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success
        console.log("User created:", data);
        setName("");
        setSurname("");
        setId("");
        setDate("");
        setIsIdUnique(true); // Reset ID uniqueness state after successful submission
      } else if (response.status === 409) {
        // ID conflict, set uniqueness state to false
        setIsIdUnique(false);
        alert("ID has already been used. Please enter a different ID.");
        setId("");
      } else {
        // Handle other HTTP errors from the server
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        // Display an error message to the user
      }
    } catch (err) {
      console.error("Error during request:", err);
    }
  };

  const formatDateToDBFormat = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleCancel = () => {
    setName("");
    setSurname("");
    setDate("");
    // Keep the existing ID without resetting it
    setIsIdUnique(true); // Reset ID uniqueness state on cancel
  };

  return (
    <div className="input-container">
      <div className="input-section">
        <h1>Please enter your details</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            type="text"
            placeholder="ID number (13 characters)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onBlur={() => setIsIdUnique(true)} // Reset ID uniqueness on blur
          />
          <input
            type="text"
            placeholder="Date of birth (DD/MM/YYYY)"
            value={date}
            onChange={handleDateChange}
          />
          <button type="submit">POST</button>
          <button type="button" onClick={handleCancel}>
            CANCEL
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

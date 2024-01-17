import { useState } from "react";
import classes from "./app.module.css";

function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id, setId] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formatDateToDBFormat(date);
    const details = { name, surname, id, date: formattedDate };
    try {
      // check if the id is a number and 13 characters long
      const isIdValid = /^\d{13}$/.test(id);

      if (!isIdValid) {
        alert("Please enter a valid ID Number!");
        return;
      }

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
      } else {
        // Handle HTTP errors from the server
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
    setId("");
  };

  const checkIdAndDate = (id, date) => {
    const yearFromId = id.substring(0, 2);
    const monthFromId = id.substring(2, 4);
    const dayFromId = id.substring(4, 6);

    const dateYear = date.substring(8, 10);
    const dateMonth = date.substring(3, 5);
    const dateDay = date.substring(0, 2);

    return (
      yearFromId === dateYear &&
      monthFromId === dateMonth &&
      dayFromId === dateDay
    );
  };

  return (
    <div className="input-container">
      <div className="input-section">
        <h1>Please enter you details</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <input
            type="number"
            placeholder="ID number"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Date of birth (DD/MM/YYYY)"
            value={date}
            onChange={handleDateChange}
          />
          <button type="submit">POST</button>
          <button onClick={handleCancel}>CANCEL</button>
        </form>
      </div>
    </div>
  );
}

export default App;

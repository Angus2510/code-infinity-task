const express = require("express");
const cors = require("cors");
const User = require("./model/User"); // Assuming you have a User model defined
const mongoose = require("mongoose");
require("dotenv/config");
require("dotenv").config();
const { MONGO_URI } = process.env;
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB setup connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Function to format date to dd/mm/yyyy
function formatDateToDBFormat(dateString) {
  const [day, month, year] = dateString.split("/");
  return `${day}/${month}/${year}`;
}

// POST endpoint for details
app.post("/submit", async (req, res) => {
  try {
    const { name, surname, id, date } = req.body;

    // Validation
    if (!(name && surname && id && date)) {
      return res.status(400).send("All input fields are required");
    }

    // Check if ID exists
    const existingId = await User.findOne({ id });

    if (existingId) {
      return res
        .status(409)
        .send("ID has already been used. Please try again!");
    }

    // Format date to dd/mm/yyyy
    const formattedDate = formatDateToDBFormat(date);

    // Create new user
    const newUser = new User({
      name: name,
      surname: surname,
      id: id,
      date: formattedDate, // Store date as String in dd/mm/yyyy format
    });

    await newUser.save();
    return res.status(201).json(newUser); // Return the newly created user
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Server error. Please try again later.");
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

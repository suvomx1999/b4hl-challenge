require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { parseEntries, buildHierarchies } = require('./processor');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const USER_ID = process.env.USER_ID || "shubashismete_14082003";
const EMAIL_ID = process.env.EMAIL_ID || "<your_srmist_email>";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "<your_roll_number>";

app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input: 'data' must be an array." });
  }

  const { valid_edges, invalid_entries, duplicate_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);

  let currentUserId = USER_ID;
  let currentEmailId = EMAIL_ID;
  let currentRollNumber = ROLL_NUMBER;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bfhl-secret-key');
      if (decoded.user_id) currentUserId = decoded.user_id;
      if (decoded.email_id) currentEmailId = decoded.email_id;
      if (decoded.college_roll_number) currentRollNumber = decoded.college_roll_number;
    } catch (err) {
      console.warn("Invalid or missing JWT signature. Falling back to ENV variables.");
    }
  }

  res.json({
    user_id: currentUserId,
    email_id: currentEmailId,
    college_roll_number: currentRollNumber,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary
  });
});

// For Render health check or basic GET
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

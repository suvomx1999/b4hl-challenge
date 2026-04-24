const express = require('express');
const cors = require('cors');
const { parseEntries, buildHierarchies } = require('./processor');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const USER_ID = process.env.USER_ID || "shubashismete_<your_ddmmyyyy>";
const EMAIL_ID = process.env.EMAIL_ID || "<your_srm_email>";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "<your_roll_number>";

app.post('/bfhl', (req, res) => {
  const { data } = req.body;
  
  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input: 'data' must be an array." });
  }

  const { valid_edges, invalid_entries, duplicate_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);

  res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: ROLL_NUMBER,
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

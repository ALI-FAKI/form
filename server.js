require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
// Use the port provided by the hosting environment, or 3000 if not available
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from a 'public' directory
// It's a best practice to put your client-side files (HTML, CSS, JS) in a dedicated folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle member registration
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, birthPlace, residence, gender, maritalStatus, familyStatus } = req.body;

    // Validate required fields
    if (!fullName || !birthPlace || !residence || !gender || !maritalStatus) {
      return res.status(400).json({
        success: false,
        message: 'Tafadhali jaza sehemu zote zinazohitajika.'
      });
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          full_name: fullName,
          birth_place: birthPlace,
          residence: residence,
          gender: gender,
          marital_status: maritalStatus,
          family_status: familyStatus,
          registration_date: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: `Hitilafu katika kuwasilisha data: ${error.message}`
      });
    }

    res.json({
      success: true,
      message: 'Umefanikiwa kusajiliwa! Asante.'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Hitilafu ya ndani ya server.'
    });
  }
});

// A catch-all route to serve the main HTML file for single-page applications
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
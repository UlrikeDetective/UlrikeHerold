const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Declare PORT only once

// PostgreSQL connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Check the database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client:', err.stack);
    }
    console.log('Database connected successfully!');
    release(); // Release the client back to the pool
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Render the main page
app.get('/', async (req, res) => {
    try {
        console.log('Fetching places from the database...');
        const places = await pool.query('SELECT * FROM places');
        console.log('Places fetched successfully:', places.rows);
        res.render('index', { places: places.rows });
    } catch (err) {
        console.error('Error fetching places:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle adding a new place
app.post('/add-place', async (req, res) => {
    const { city, country, year } = req.body;
    console.log('Received data:', { city, country, year });
    const location = await getLatLng(city, country);

    if (location) {
        try {
            console.log('Inserting new place into the database...');
            await pool.query(
                'INSERT INTO places (city, country, year, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
                [city, country, year, location.lat, location.lng]
            );
            console.log('Place inserted successfully!');
        } catch (err) {
            console.error('Error inserting place:', err);
        }
    } else {
        console.error('Failed to fetch location for:', { city, country });
    }
    res.redirect('/');
});


// Fetch latitude and longitude
async function getLatLng(city, country) {
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: `${city}, ${country}`,
                key: process.env.OPENCAGE_API_KEY,
            },
        });
        const data = response.data.results[0].geometry;
        return { lat: data.lat, lng: data.lng };
    } catch (err) {
        console.error('Error fetching coordinates:', err);
        return null;
    }
}

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

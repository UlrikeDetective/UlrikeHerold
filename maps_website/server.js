const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Render the main page
app.get('/', async (req, res) => {
    const places = await pool.query('SELECT * FROM places');
    res.render('index', { places: places.rows });
});

// Handle adding a new place
app.post('/add-place', async (req, res) => {
    const { city, country, year } = req.body;
    const location = await getLatLng(city, country);

    if (location) {
        await pool.query(
            'INSERT INTO places (city, country, year, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
            [city, country, year, location.lat, location.lng]
        );
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

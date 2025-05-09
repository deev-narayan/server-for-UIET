const cors = require('cors');
const express = require('express');

// Middleware setup
const app = express();
app.use(cors());
app.use(express.json());

// Function to convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = degToRad(lat1);
    const φ2 = degToRad(lat2);
    const Δφ = degToRad(lat2 - lat1);
    const Δλ = degToRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Location check
function isWithin34m(lat1, lon1, lat2, lon2) {
    return haversineDistance(lat1, lon1, lat2, lon2) <= 34;
}

// Reference location
const referenceLat = 26.7657106262875;
const referenceLon = 80.92795402611215;

app.post('/api/markattendence', (req, res) => {
    const { studentId, locationlat, locationlong, timestamp } = req.body;

    if (isWithin34m(referenceLat, referenceLon, locationlat, locationlong)) {
        res.json({ success: true, message: 'Attendance marked!' });
    } else {
        res.json({ success: false, message: 'Class meai jao' });
    }
});

// Export the handler
module.exports = app;

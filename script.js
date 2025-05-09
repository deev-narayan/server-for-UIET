const express = require('express');
const cors = require('cors');


const app = express();
const port = 8888;

// Function to convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Haversine formula to calculate distance between two lat/lng in meters
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = degToRad(lat1);
    const φ2 = degToRad(lat2);
    const Δφ = degToRad(lat2 - lat1);
    const Δλ = degToRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
}

// Function to check if a point is within 34m radius
function isWithin34m(lat1, lon1, lat2, lon2) {
    const distance = haversineDistance(lat1, lon1, lat2, lon2);
    console.log(distance);
    return distance <= 34; // Check if within 34 meters
}

// Given reference location
const referenceLat = 26.7657106262875; // Latitude
const referenceLon = 80.92795402611215; // Longitude


// Enable CORS for all routes
app.use(cors());
app.use(express.json());
// Optional: If you want to allow only a specific origin

// Basic GET endpoint
app.post('/markattendence', (req, res) => {
  console.log(req.body.studentId,req.body.locationlong,req.body.locationlat,req.body.timestamp);
  console.log(`${req.body.locationlong},${req.body.locationlat}`)
if (isWithin34m(referenceLat, referenceLon, req.body.locationlat, req.body.locationlong)){
  res.json({ success: true, message: 'Attendance marked!' });
}else{
  res.json({ success: false, message: 'Class meai jao' });
}

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

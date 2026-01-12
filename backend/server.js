require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

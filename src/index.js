const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./models/User');
require('./models/Track');

const requireAuth = require('./middlewares/requireAuth');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://admin:MyM0ng0869@cluster0-y2uws.gcp.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb instance.');
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongodb: ', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email is: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
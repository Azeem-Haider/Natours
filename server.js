const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connection successfull'))
    .catch((err) => {
        console.log('Error');
    });
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`app running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('unhandledRejection shutting down');
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('uncaughtexception shutting down');
    process.exit(1);
});
//console.log(x);

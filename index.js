require("dotenv").config();
const {createServer} = require('http');
const {app} = require('./src/app');
const connectDatabase = require('./src/utils/db.connection');

const port = parseInt(process.env.PORT);

connectDatabase()
    .then(() => {
        createServer(app).listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    });


  
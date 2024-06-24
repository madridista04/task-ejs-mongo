const {connect, connection} = require('mongoose');

const connectDatabase = () =>{
    return connect("mongodb://127.0.0.1:27017/task-api");
};

connection.on("connected", ()=>{
    console.log("Database Connected");
});

module.exports = connectDatabase;
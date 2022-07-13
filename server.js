const app = require('./app');
const mongoose = require('mongoose');

process.on('uncoughtException', err => {
    console.log("uncought exception occured");
    console.log(err.name, err.message);
    process.exit(1);
})

mongoose.connect('mongodb+srv://Prince:zUM4bKNkIpUagsWZ@learningcluster.tlmnfrp.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => {
    console.log("Connection to database succesful 🌍🌍");
})

const server = app.listen(3000, '127.0.0.1', () => {
    console.log("server started on port 3000 🙂")
})

process.on('unhandledRejection', err => {
    console.log("unhandleed rejection occured");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})
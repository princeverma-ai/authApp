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

const server = app.listen(process.env.PORT, () => {
    console.log("server started 🙂")
})

process.on('unhandledRejection', err => {
    console.log("unhandleed rejection occured");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})
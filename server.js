const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Prince:zUM4bKNkIpUagsWZ@learningcluster.tlmnfrp.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => {
    console.log("Connection to database succesful 🌍🌍");
})

app.listen(3000, '127.0.0.1', () => {
    console.log("server started on port 3000 🙂")
})


const mongoose = require('mongoose');


async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/QLHS',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                family: 4
            });
        console.log("Connect successfully")
    } catch (error) {
        //console.log("Connect failer");
        console.log(error)
    }

}

module.exports = { connect };

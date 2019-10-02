const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactDetails = new Schema({
    businessLineName: String,
    teamName: String,
});

module.exports = mongoose.model('ContactDetails', contactDetails);

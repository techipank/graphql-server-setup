const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lifeCycleDates = new Schema({
    activeDate: String,
	deprecatedDate: String,
	sunsetDate: String,
	notSupportedDate: String,
	deletedDate: String,
	
});

module.exports = mongoose.model('LifeCycleDates', lifeCycleDates);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productionSupportDetails = new Schema({
    commonName: String,
	proxyName: String,
	hasPCIData: String,
	informationCategory: String,
	serviceNowAssignementGroup: String,
	interfaceStandardsException: String,
	interfaceStandardsExceptionReasoning: String,
	proxyStandardsException: String,
	proxyStandardsExceptionReasoning: String,
	consumerSecurityException: String,
	consumerSecurityExceptionReason: String,
	backendSecurityException: String ,
	backendSecurityExceptionReason: String,
});

module.exports = mongoose.model('ProductionSupportDetails', productionSupportDetails);

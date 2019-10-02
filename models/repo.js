const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repo = new Schema({
    majorVersion: String,
	minorVersion: String,
	riskRating: String,
	apiType: String,
	gateway: String,
	isDormant: String,
	governanceModel: String,
	migrationPlan: String,
	sourceSystem: String,
	governanceTeam: String,
	industryClassification: String,
	monetizationModel: String ,
	proxyCurrentStatus: String,
	configurationItem: String,
	serviceNowAssignmentGroup: String,
	carIds:[Number],
	productionSupportID:String,
	apiCategory: String,
	apiDescription: String,
	lifecycleDatesID: String,
	deploymentDetailsID: String,
	contactDetailsID: String,

});

module.exports = mongoose.model('Repo', repo);

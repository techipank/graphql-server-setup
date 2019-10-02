const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deploymentDetails = new Schema({
    requestedDate: String,
    approvedDate: String,
    deploymentDate: String,
    deployedArtifacts: [String],
    environment: String,
    changeTaskId: String,
    changeTicket: String,
    deploymentTag: String,
    gitBranch: String,
    branchOrTag: String,
    deploymentStatus: String,
    cicdPipelineURL: String,
	
});

module.exports = mongoose.model('DeploymentDetails', deploymentDetails);

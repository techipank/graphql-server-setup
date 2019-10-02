const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const Repo = require('../models/repo');
const ProductionSupportDetails = require('../models/productionSupportDetails');
const LifecycleDates = require('../models/lifecycleDates');
const DeploymentDetails = require('../models/deploymentDetails');
const ContactDetails = require('../models/contactDetails');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   
const ContactDetailsType = new GraphQLObjectType({
    name: 'ContactDetails',
    fields: () => ({
        id: { type: GraphQLID  },
        businessLineName: { type: GraphQLString },
        teamName: { type: GraphQLString },
    })
}); 
const DeploymentDetailsType = new GraphQLObjectType({
    name: 'DeploymentDetails',
    fields: () => ({
        id: { type: GraphQLID  },
        requestedDate: { type: GraphQLString },
        approvedDate: { type: GraphQLString },
        deploymentDate: { type: GraphQLString },
        deployedArtifacts: {type: GraphQLList(GraphQLString)},
        environment: { type: GraphQLString },
        changeTaskId: { type: GraphQLString },
        changeTicket: { type: GraphQLString },
        deploymentTag: { type: GraphQLString },
        gitBranch: { type: GraphQLString },
        branchOrTag: { type: GraphQLString },
        deploymentStatus: { type: GraphQLString },
        cicdPipelineURL: { type: GraphQLString },        
    })
    
});
const LifecycleDatesType = new GraphQLObjectType({
    name: 'LifecycleDates',
    fields: () => ({
        id: { type: GraphQLID  },
        activeDate: { type: GraphQLString },
        deprecatedDate: { type: GraphQLString },
        sunsetDate: { type: GraphQLString },
        notSupportedDate: { type: GraphQLString },
        deletedDate: { type: GraphQLString },        
    })
    
});
const ProductionSupportDetailsType = new GraphQLObjectType({
    name: 'ProductionSupportDetails',
    fields: () => ({
        id: { type: GraphQLID  },
        commonName: { type: GraphQLString },
        proxyName: { type: GraphQLString },
        hasPCIData: { type: GraphQLString },
        informationCategory: { type: GraphQLString },
        serviceNowAssignementGroup: { type: GraphQLString },
        interfaceStandardsException: { type: GraphQLString },
        interfaceStandardsExceptionReasoning: { type: GraphQLString },
        proxyStandardsException: { type: GraphQLString },
        proxyStandardsExceptionReasoning: { type: GraphQLString },
        consumerSecurityException: { type: GraphQLString },
        consumerSecurityExceptionReason: { type: GraphQLString },
        backendSecurityException: { type: GraphQLString } ,
        backendSecurityExceptionReason: { type: GraphQLString },
    })
    
});

const RepoType = new GraphQLObjectType({
    name: 'Repo',
    fields: () => ({
        id: { type: GraphQLID  },
        majorVersion: { type: GraphQLString }, 
        minorVersion: { type: GraphQLString },
        riskRating: { type: GraphQLString },
        apiType: { type: GraphQLString },
        gateway: { type: GraphQLString },
        isDormant: { type: GraphQLString },
        governanceModel: { type: GraphQLString },
        migrationPlan: { type: GraphQLString },
        sourceSystem: { type: GraphQLString },
        governanceTeam: { type: GraphQLString },
        industryClassification: { type: GraphQLString },
        monetizationModel: { type: GraphQLString },
        proxyCurrentStatus: { type: GraphQLString },
        configurationItem: { type: GraphQLString },
        serviceNowAssignmentGroup: { type: GraphQLString },
        carIds: {type: GraphQLList(GraphQLInt)},
        productionSupport: {
            type: ProductionSupportDetailsType,
            resolve(parent,args){
                return ProductionSupportDetails.findById(parent.productionSupportID)
            }},
        apiCategory: {type: GraphQLString},
        apiDescription: {type: GraphQLString},
        lifeCycle: {
                type: LifecycleDatesType,
                resolve(parent,args){
                    return LifecycleDates.findById(parent.lifecycleDatesID)
            }},
        deploymentDetails: {
            type: DeploymentDetailsType,
            resolve(parent,args){
                return DeploymentDetails.findById(parent.deploymentDetailsID)
            }},
        contactDetails: {
            type: ContactDetailsType,
            resolve(parent,args){
                return ContactDetails.find(teamName=== args.teamName)
            }},
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        pages: { type: GraphQLInt },
        author: {
        type: AuthorType,
        resolve(parent, args) {
            return Author.findById(parent.authorID);
        }
    }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({ authorID: parent.id });
            }
        }
    })
})

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        repo: {
            type: RepoType,            
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Repo.findById(args.id);
            }
        },
        repos: {
            type: new GraphQLList(RepoType),            
            args: { proxyCurrentStatus: { type: GraphQLString },teamName: { type: GraphQLString }},
            resolve(parent, args) {
                return Repo.find({});
            }
        },
        book: {
            type: BookType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Book.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        author:{
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});
 
//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addAuthor: {
            type: AuthorType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type:BookType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},
                pages: { type: new GraphQLNonNull(GraphQLInt)},
                authorID: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    pages:args.pages,
                    authorID:args.authorID
                })
                return book.save()
            }
        },
        addContactDetails:{
            type:ContactDetailsType,
            args:{
                businessLineName: { type: new GraphQLNonNull(GraphQLString)}, 
                teamName: { type: new GraphQLNonNull(GraphQLString)}, 
            },
            resolve(parent,args){
                let contactDetails = new ContactDetails({
                    businessLineName: args.businessLineName, 
                    teamName: args.teamName
                })
                return contactDetails.save()
            }
        },
        addDeploymentDetails:{
            type:DeploymentDetailsType,
            args:{
                requestedDate: { type: new GraphQLNonNull(GraphQLString)},                
                approvedDate: { type: new GraphQLNonNull(GraphQLString) },
                deploymentDate: { type: new GraphQLNonNull(GraphQLString) },
                deployedArtifacts: {type: new GraphQLNonNull(GraphQLList(GraphQLString))},
                environment: { type: new GraphQLNonNull(GraphQLString) },
                changeTaskId: { type: new GraphQLNonNull(GraphQLString) },
                changeTicket: { type: new GraphQLNonNull(GraphQLString) },
                deploymentTag: { type: new GraphQLNonNull(GraphQLString) },
                gitBranch: { type: new GraphQLNonNull(GraphQLString) },
                branchOrTag: { type: new GraphQLNonNull(GraphQLString) },
                deploymentStatus: { type: new GraphQLNonNull(GraphQLString) },
                cicdPipelineURL: { type: new GraphQLNonNull(GraphQLString) },       
            },
            resolve(parent,args){
                let deploymentDetails= new DeploymentDetails({
                    requestedDate: args.requestedDate,                
                    approvedDate: args.approvedDate,
                    deploymentDate: args.deploymentDate,
                    deployedArtifacts: args.deployedArtifacts,
                    environment: args.environment,
                    changeTaskId: args.changeTaskId,
                    changeTicket: args.changeTicket,
                    deploymentTag: args.deploymentTag,
                    gitBranch: args.gitBranch,
                    branchOrTag: args.branchOrTag,
                    deploymentStatus: args.deploymentStatus,
                    cicdPipelineURL: args.cicdPipelineURL,       
                })
                return deploymentDetails.save()
            }
        },
        addlifecycleDates:{
            type:LifecycleDatesType,
            args:{
                activeDate: { type: new GraphQLNonNull(GraphQLString)},
                deprecatedDate: { type: new GraphQLNonNull(GraphQLString)},
                sunsetDate: { type: new GraphQLNonNull(GraphQLString)},
                notSupportedDate: { type: new GraphQLNonNull(GraphQLString)},
                deletedDate: { type: new GraphQLNonNull(GraphQLString)},  
            },
            resolve(parent,args){
                let lifecycleDates= new LifecycleDates({
                    activeDate: args.activeDate,
                    deprecatedDate: args.deprecatedDate,
                    sunsetDate: args.sunsetDate,
                    notSupportedDate: args.notSupportedDate,
                    deletedDate: args.deletedDate,
                })
                return lifecycleDates.save()
            }
        },
        addProductionSupportDetails:{
            type:ProductionSupportDetailsType,
            args:{
                commonName: { type: new GraphQLNonNull(GraphQLString)},
                proxyName: { type: new GraphQLNonNull(GraphQLString)},
                hasPCIData: { type: new GraphQLNonNull(GraphQLString)},
                informationCategory: { type: new GraphQLNonNull(GraphQLString)},
                serviceNowAssignementGroup: { type: new GraphQLNonNull(GraphQLString)},
                interfaceStandardsException: { type: new GraphQLNonNull(GraphQLString)},
                interfaceStandardsExceptionReasoning: { type: new GraphQLNonNull(GraphQLString)},
                proxyStandardsException: { type: new GraphQLNonNull(GraphQLString)},
                proxyStandardsExceptionReasoning: { type: new GraphQLNonNull(GraphQLString)},
                consumerSecurityException: { type: new GraphQLNonNull(GraphQLString)},
                consumerSecurityExceptionReason: { type: new GraphQLNonNull(GraphQLString)},
                backendSecurityException: { type: new GraphQLNonNull(GraphQLString)},
                backendSecurityExceptionReason: { type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                let productionSupportDetails=new ProductionSupportDetails({
                    commonName: args.commonName,
                    proxyName: args.proxyName,
                    hasPCIData: args.hasPCIData,
                    informationCategory: args.informationCategory,
                    serviceNowAssignementGroup: args.serviceNowAssignementGroup,
                    interfaceStandardsException: args.interfaceStandardsException,
                    interfaceStandardsExceptionReasoning: args.interfaceStandardsExceptionReasoning,
                    proxyStandardsException: args.proxyStandardsException,
                    proxyStandardsExceptionReasoning: args.proxyStandardsExceptionReasoning,
                    consumerSecurityException: args.consumerSecurityException,
                    consumerSecurityExceptionReason: args.consumerSecurityExceptionReason,
                    backendSecurityException: args.backendSecurityException,
                    backendSecurityExceptionReason: args.backendSecurityExceptionReason,
                })
                return productionSupportDetails.save()
            }
        },
        addRepo:{
            type:RepoType,
            args:{
                majorVersion: { type: new GraphQLNonNull(GraphQLString)},
                minorVersion: { type: new GraphQLNonNull(GraphQLString)},
                riskRating: { type: new GraphQLNonNull(GraphQLString)},
                apiType: { type: new GraphQLNonNull(GraphQLString)},
                gateway: { type: new GraphQLNonNull(GraphQLString)},
                isDormant: { type: new GraphQLNonNull(GraphQLString)},
                governanceModel: { type: new GraphQLNonNull(GraphQLString)},
                migrationPlan: { type: new GraphQLNonNull(GraphQLString)},
                sourceSystem: { type: new GraphQLNonNull(GraphQLString)},
                governanceTeam: { type: new GraphQLNonNull(GraphQLString)},
                industryClassification: { type: new GraphQLNonNull(GraphQLString)},
                monetizationModel: { type: new GraphQLNonNull(GraphQLString)},
                proxyCurrentStatus: { type: new GraphQLNonNull(GraphQLString)},
                configurationItem: { type: new GraphQLNonNull(GraphQLString)},
                serviceNowAssignmentGroup: { type: new GraphQLNonNull(GraphQLString)},
                carIds:{type: new GraphQLNonNull(GraphQLList(GraphQLInt)) },
                productionSupportID: {type: new GraphQLNonNull(GraphQLID)},
                apiCategory: {type: new GraphQLNonNull(GraphQLString)},
                apiDescription: {type: new GraphQLNonNull(GraphQLString)},
                lifecycleDatesID: {type: new GraphQLNonNull(GraphQLID)},
                deploymentDetailsID:{type: new GraphQLNonNull(GraphQLID)},
                contactDetailsID: {type: new GraphQLNonNull(GraphQLID)},

            },
            resolve(parent,args){
                let repo = new Repo({
                    majorVersion:args.majorVersion,
                    minorVersion:args.minorVersion,
                    riskRating:args.riskRating,
                    apiType:args.apiType,
                    gateway:args.gateway,
                    isDormant:args.isDormant,
                    governanceModel:args.governanceModel,
                    migrationPlan:args.migrationPlan,
                    sourceSystem:args.sourceSystem,
                    governanceTeam:args.governanceTeam,
                    industryClassification:args.industryClassification,
                    monetizationModel:args.monetizationModel,
                    proxyCurrentStatus:args.proxyCurrentStatus,
                    configurationItem:args.configurationItem,
                    serviceNowAssignmentGroup:args.serviceNowAssignmentGroup,
                    carIds:args.carIds,
                    productionSupportID: args.productionSupportID,
                    apiCategory: args.apiCategory,
                    apiDescription: args.apiDescription,
                    lifecycleDatesID: args.lifecycleDatesID,
                    deploymentDetailsID: args.deploymentDetailsID,
                    contactDetailsID: args.contactDetailsID,
                })
                return repo.save()
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});

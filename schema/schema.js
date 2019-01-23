const graphql = require('graphql');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLSchema,
    GraphQLList 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

//Dummy Data
var books = [
    { name:"Book 1", pages:432 , id:1, authorID:2},
    { name: "Book 2", pages: 32, id: 2, authorID: 1},
    { name: "Book 3", pages: 532, id: 3, authorID: 3},
    { name: "Book 4", pages: 432, id: 2, authorID: 1 },
    { name: "Book 5", pages: 542, id: 3, authorID: 3}
]

var authors = [
    { name: 'Author 1', age: 44, id: 1 },
    { name: 'Author 2', age: 42, id: 2 },
    { name: 'Author 3', age: 66, id: 3 }
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString }, 
        pages: { type: GraphQLInt },
        author: {
        type: AuthorType,
        resolve(parent, args) {
            return authors.find((item) => { return item.id == parent.authorID });
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
                return books.filter((item) => { return item.authorID == 1 });
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
        book: {
            type: BookType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument by the user
                return books.find((item) => { return item.id == args.id});
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        author:{
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return authors.find((item) => { return item.id == args.id });
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});
 
//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery
});
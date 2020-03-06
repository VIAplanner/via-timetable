const { gql, ApolloServer } = require('apollo-server');
var mongoose = require('mongoose');
const { Schema } = require("mongoose");
const username = 'user_1'
const password = 'coursetools'
const dbName = 'UofT'
const uri = `mongodb+srv://${username}:${password}@coursetoolscluster-wjb51.mongodb.net/test?retryWrites=true&w=majority`;
const connection = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const uoftDb = connection.useDb(dbName)
const typeDefs = gql`
    type Course {
        id: String, 
        code: String,
        name: String,
        description: String,
        division: String,
        department: String,
        prerequisites: String,
        exclusions: String, 
        level: Int,
        campus: String, 
        term: String,
     }
     type Program {
        name: String,
        degrees: [String],
     }

     type Query {
         courses: [Course]
         programs: [Progam]
     }
    `;



    // Still have to implement meeting section, breadths and programs in programs
const CourseSchema = new Schema({
    id: String,
    code: String,
    name: String,
    description: String,
    division: Array,
    department: Object,
    prerequisites: String,
    exclusions: String,
    level: Number,
    campus: String,
    term: String,
    breadths: Array,
    meeting_sections: Array
});
const ProgramSchema = new Schema({
    name: String,
    degrees: Array,
    notes: Array,
    programs: Array,
});

const CoursesModel = uoftDb.model('Course', CourseSchema, "Courses");
const ProgramModel = uoftDb.model('Program', ProgramSchema, "Subjects");


const resolvers = {
    Query: {
        courses: () => {
            return CoursesModel.find();
        },
        programs: () => {
            return ProgramModel.find();
        },
    },
};

/**
 * With our schema, resolvers, and mock data defined - we can now create our Apollo 
 * Server instance. To do so, we'll import and use the ApolloServer constructor
 * function from the apollo-server library.
 */
const server = new ApolloServer({ typeDefs, resolvers });

/**
 * With the Apollo server instance now available to us, we can start 
 * our web server by running the listen() function available as a 
 * property of the Apollo server. 
 * 
 * The server.listen() function is a promise that when resolved receives a 
 * serverInfo object which has the url of the running server. We'll log a 
 * message to the console with this url value.
 */
server.listen().then((serverInfo) => {
    console.log(`Server is running at ${serverInfo.url}`);
});


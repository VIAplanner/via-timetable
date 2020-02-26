//  var MeetingSection = mongoose.model('MeetinSection', MeetingSectionSchema);

//  var Times = mongoose.model('Course', Time);

//  var Course = mongoose.model('Course', CoursesSchema);

//  var Course = mongoose.model('Course', CoursesSchema);

//  var Course = mongoose.model('Course', CoursesSchema);

//  var Course = mongoose.model('Course', CoursesSchema);

//  async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };




// const server = new ApolloServer({ typeDefs, resolvers });

// const app = express();
// server.applyMiddleware({ app });

// app.listen({ port: 4000 }, () =>
//     console.log('Now browse to http://localhost:4000' + server.graphqlPath)
// );


    // try {
    //     // Connect to the MongoDB cluster
    //     await client.connect();

    //     // Make the appropriate DB calls
    //     await  listDatabases(client);

    // } catch (e) {
    //     console.error(e);
    // } finally {
    //     await client.close();
    // }



    

    // const exampleQuery = new QueryModel({name: 'Arsala'})
    // exampleQuery.save().then(doc => console.log(doc)).catch(err => {
    //     console.error(err)
    //   })
    
    
    // console.log(db.collections)
    // const CourseModel = db.model('Course', CourseSchema);

    // mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // const databaseConnection = mongoose.connection;
    // databaseConnection.on('error', console.error.bind(console, 'connection error:'));
    // databaseConnection.once('open', async function () {
    //     console.log('connected');
    //     // databaseConnection.db.collection("courses", function (err, collections) {
    //     //     collections.find({}).toArray(function (err, data) {
    //     //         console.log(data); // it will print your collection data
    //     //     })
    //     // });

    //     // Object.keys(databaseConnection.models).forEach((collection) => {
    //     //     // You can get the string name.
    //     //     console.info(collection);
    //     //   });
    //     // databaseConnection.db.listCollections()
    //     Courses.findOne({ 'code': 'ANT101H5S' })
    //         .then(doc => console.log(doc))
    //         .catch(e => console.log(e))
    // });

    const TimeSchema = new Schema({
        day: String,
        start: Number,
        end: Number,
        duration: Number,
        location: String
    
    });
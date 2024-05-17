const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://sundayever:${password}@phone-books1.u1vbag3.mongodb.net/phonebooksApp?retryWrites=true&w=majority&appName=phone-books1`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((peroson) => {
      console.log(peroson);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
}

// Adding more options to the connection
// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
//   };
// mongoose
//   .connect(url, options)
//   .then(() => {
//     console.log("Connected to MongoDB");

//     const personSchema = new mongoose.Schema({
//       name: String,
//       number: String,
//     });

//     const Person = mongoose.model("Person", personSchema);

//     Person.find({})
//       .then((result) => {
//         result.forEach((person) => {
//           console.log(person);
//         });
//         mongoose.connection.close();
//       })
//       .catch((err) => {
//         console.error("Error finding persons:", err);
//         mongoose.connection.close();
//       });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

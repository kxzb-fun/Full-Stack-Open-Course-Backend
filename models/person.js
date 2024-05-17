const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
// 处理返回数据的 _id __v
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // 尽管Mongoose对象的_id属性看起来像一个字符串，但它实际上是一个对象，需要将其转换为字符串
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// const Person = mongoose.model("Person", personSchema);
module.exports = mongoose.model('Person', personSchema)


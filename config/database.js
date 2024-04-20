// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/statesDB')
//   .then(() => {
//   })
//   .catch(err => {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   });

const mongoose = require('mongoose');

const connectDB = async () => {
  try{
      await mongoose.connect(process.env.DATABASE_URI, {
          useUnifiedTopology: true,
          useNewUrlParser: true
      });
  } catch (err){
      console.error(err);
  }
}

module.exports = connectDB
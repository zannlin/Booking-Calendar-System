const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://zanderlindeque1:G3tS3tS0ftw@re@cluster0.alxvhah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
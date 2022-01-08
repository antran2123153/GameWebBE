const mongoose = require("mongoose");

const connector = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://admin:KIXUIkuRzOGiFMiG@cluster0.lpznb.mongodb.net/gamevv?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("[MongoDB Connector] Connected successfully.");
  } catch (error) {
    console.log("[MongoDB Connector] Something goes wrong. Could not connect");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connector;

const mongoose = require('mongoose');

const uri = "mongodb://KiitNexus:ChandanMukherjee@ac-m8pyl3l-shard-00-01.8jwwtgh.mongodb.net:27017,ac-m8pyl3l-shard-00-00.8jwwtgh.mongodb.net:27017,ac-m8pyl3l-shard-00-02.8jwwtgh.mongodb.net:27017/recruitment?ssl=true&replicaSet=atlas-bf6b08-shard-0&authSource=admin&tlsInsecure=true";

async function testConnection() {
  try {
    console.log(`Testing standard connection with tlsInsecure=true...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`CONNECTED SUCCESSFULLY`);
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error(`ERROR:`, error.message);
    return false;
  }
}

testConnection();


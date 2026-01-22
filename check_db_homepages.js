
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sust-cse';

async function checkDb() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const HomePages = mongoose.connection.db.collection('homepages');
    const content = await HomePages.find({}).toArray();
    
    console.log('Found', content.length, 'documents in homepages');
    if (content.length > 0) {
      console.log('First document structure:', JSON.stringify(content[0], null, 2));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDb();

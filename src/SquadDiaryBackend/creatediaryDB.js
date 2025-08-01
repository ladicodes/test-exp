require('dotenv').config();
const mongoose = require('mongoose');

// Define a simple schema
const diaryEntrySchema = new mongoose.Schema({
  userId: String,
  whatWorkedOn: String,
  whatLearned: String,
});

// Create the model
const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

// Connect and save a test entry
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const entry = new DiaryEntry({
      userId: 'dummy-user-id',
      whatWorkedOn: 'Creating diaryDB',
      whatLearned: 'Mongo auto-creates databases',
    });

    await entry.save();
    console.log('✅ Test diary entry saved. DB is now created.');

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating DB:', err.message);
  }
})();

const mongoose = require('mongoose');

const DiaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, default: 'My Title #1' },
  date: { type: Date, default: Date.now },
  whatWorkedOn: String,
  whatLearned: String,
  whatCouldBeBetter: String,
  howIFeel: String,
  goalsForNextTime: String
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);

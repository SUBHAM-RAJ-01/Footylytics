import mongoose from 'mongoose';

const cachedDataSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['live', 'standings', 'team', 'fixtures', 'other'], required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }
});

export default mongoose.model('CachedData', cachedDataSchema);

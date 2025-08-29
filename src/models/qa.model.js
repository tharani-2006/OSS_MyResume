import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    index: true, // Regular index for faster queries
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'general',
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
});

// Create text index on question field for full-text search
qaSchema.index({ 
  question: 'text', 
  answer: 'text',
  tags: 'text' 
}, {
  weights: {
    question: 10,  // Higher weight for question matches
    answer: 5,     // Medium weight for answer matches
    tags: 3        // Lower weight for tag matches
  },
  name: 'qa_text_index'
});

// Create compound index for category and question
qaSchema.index({ category: 1, question: 1 });

// Pre-save middleware to update the updatedAt field
qaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to find similar questions
qaSchema.methods.findSimilar = function() {
  return this.model('QA').find({
    $text: { $search: this.question },
    _id: { $ne: this._id }
  }).limit(5);
};

// Static method to search questions
qaSchema.statics.searchQuestions = function(query, limit = 5) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

// Static method for regex-based search (fallback)
qaSchema.statics.regexSearch = function(query, limit = 5) {
  const regex = new RegExp(query.split(' ').join('|'), 'i');
  return this.find({
    $or: [
      { question: { $regex: regex } },
      { answer: { $regex: regex } },
      { tags: { $in: [regex] } }
    ]
  }).limit(limit);
};

const QA = mongoose.models.QA || mongoose.model('QA', qaSchema);

export default QA;

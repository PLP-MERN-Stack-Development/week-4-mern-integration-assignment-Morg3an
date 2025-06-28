// Category.js - Mongoose model for categories

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug from name
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')  // remove special characters
    .replace(/ +/g, '-');     // replace spaces with hyphens

  next();
});

// Virtual for category URL (optional)
CategorySchema.virtual('url').get(function () {
  return `/categories/${this.slug}`;
});

module.exports = mongoose.model('Category', CategorySchema);
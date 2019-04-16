const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredient: [{
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }],
  notes: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toObject: {virtuals: true}
})

// recipeSchema.virtual('ingredientsList').get(function () {
//   return this.ingredients.length
// })

recipeSchema.virtual('ingredients', {
  ref: 'Ingredient',
  localField: '_id',
  foreignField: 'recipe'
})

recipeSchema.virtual('username', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id'
})

module.exports = mongoose.model('Recipe', recipeSchema)

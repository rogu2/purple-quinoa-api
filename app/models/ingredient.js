const mongoose = require('mongoose')

// name: 'Purple Quinoa'
// food_group: 'grain'
// food_type: 'quinoa'
// column: 'T'
// row: '21'

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  foodgroup: {
    type: String,
    required: true
  },
  foodtype: {
    type: String,
    required: true
  },
  column: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  }
  // ,
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
}, {
  // collection: 'ingredients'
  toObject: {virtuals: true}
})

// ingredientSchema.virtual('chef', {
//   ref: 'User',
//   localField: 'owner',
//   foreignField: '_id'
// })

module.exports = mongoose.model('Ingredient', ingredientSchema)

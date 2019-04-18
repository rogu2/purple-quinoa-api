const mongoose = require('mongoose')

// name: 'Purple Quinoa'
// food_group: 'grain'
// food_type: 'quinoa'
// column: 'T'
// row: '21'

const ingredientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
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
}, {
  collection: 'ingredients'
})

module.exports = mongoose.model('Ingredient', ingredientSchema)

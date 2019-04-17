const express = require('express')
const passport = require('passport')
const Recipe = require('../models/recipe')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
router.get('/recipes', requireToken, (req, res, next) => {
  Recipe.find().populate('ingredients').populate('chef').populate({path: 'ingredients', populate: {path: 'chef', select: 'chef'}})
    .then(recipes => {
      return recipes.map(recipe => recipe.toObject())
    })
    .then(recipes => res.status(200).json({ recipe: recipes }))
    .catch(next)
})

// SHOW
router.get('/recipes/:id', requireToken, (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => res.status(200).json({ recipe: recipe.toObject() }))
    .catch(next)
})

// CREATE
// post recipes with ingredients collection
router.post('/recipes', requireToken, (req, res, next) => {
  req.body.recipe.owner = req.user.id
  //   Recipe.create(req.body.recipe)
  //     .then(recipe => {
  //       res.status(201).json({ recipe: recipe.toObject() })
  //     })
  //     .catch(next)
  // })

  // const select = req.body.recipe.ingredient
  // delete req.body.recipe

  // <---Working Uption --->
  Recipe.findOneAndUpdate(
    {ingredient: req.body.recipe.ingredient},
    {$set: {
      'title': req.body.recipe.title,
      'ingredient': req.body.recipe.ingredient,
      'owner': req.body.recipe.owner
    }},
    { upsert: true, new: true }
  ).populate(('ingredients'))
  // <--- Working Option --->
    // .then(recipe => {
    //   const pick = recipe.ingredient.some(ingredient => {
    //     return ingredient.toString() === select
    //   })
    //   if (pick) {
    //     return recipe.update({$pull: {ingredient: select}})
    //   } else {
    //     return recipe.update({$push: {ingredient: select}})
    //   }
    // })
  // const select = req.body.recipe.ingredient
  // delete req.body.recipe
  //
  // Recipe.findById(req.params.id)
  //   .then(handle404)
  //   .then(recipe => {
  //     const pick = recipe.ingredient.some(ingredient => {
  //       return ingredient.toString() === select
  //     })
  //     if (pick) {
  //       return recipe.update({$pull: {ingredient: select}})
  //     } else {
  //       return recipe.update({$push: {ingredient: select}})
  //     }
  //   })
    .then(recipe => {
      res.status(201).json({ recipe: recipe.toObject() })
    })
    .catch(next)
})

// UPDATE
// patch recipes with ingredients collection
router.patch('/recipes/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.recipe.owner
  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => {
      requireOwnership(req, recipe)
      return recipe.update(req.body.recipe)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// Alternative Patch:
router.patch('/ingredients/:id', requireToken, removeBlanks, (req, res, next) => {
  const select = req.body.recipe.ingredient
  delete req.body.recipe

  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => {
      const pick = recipe.ingredient.some(ingredient => {
        return ingredient.toString() === select
      })
      if (pick) {
        return recipe.update({$pull: {ingredient: select}})
      } else {
        return recipe.update({$push: {ingredient: select}})
      }
    })
    .then(recipe => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/recipes/:id', requireToken, (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => {
      requireOwnership(req, recipe)
      recipe.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router

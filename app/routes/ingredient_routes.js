const express = require('express')
const passport = require('passport')
const Ingredient = require('../models/ingredient')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// INDEX
router.get('/ingredients', requireToken, (req, res, next) => {
  Ingredient.find()
    .then(ingredients => {
      return ingredients.map(ingredient => ingredient.toObject())
    })
    .then(ingredients => res.status(200).json({ ingredients: ingredients }))
    .catch(next)
})

// SHOW
router.get('/ingredients/:id', requireToken, (req, res, next) => {
  Ingredient.findById(req.params.id)
    .then(handle404)
    .then(ingredient => res.status(200).json({ ingredient: ingredient.toObject() }))
    .catch(next)
})

// CREATE
// POST /examples
router.post('/ingredients', requireToken, (req, res, next) => {
  req.body.ingredient.owner = req.user.id

  Ingredient.create(req.body.ingredient)
    .then(ingredient => {
      res.status(201).json({ ingredient: ingredient.toObject() })
    })
    .catch(next)
})

// UPDATE
router.patch('/ingredients/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.ingredient.owner

  Ingredient.findById(req.params.id)
    .then(handle404)
    .then(ingredient => {
      requireOwnership(req, ingredient)
      return ingredient.update(req.body.ingredient)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/ingredients/:id', requireToken, (req, res, next) => {
  Ingredient.findById(req.params.id)
    .then(handle404)
    .then(ingredient => {
      requireOwnership(req, ingredient)
      ingredient.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router

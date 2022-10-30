const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
// const {log} = require('../../middlewares/logger.middleware')
const {addReviews,getReviews} = require('./review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/' ,getReviews)
router.post('/', addReviews)
// router.delete('/:id',  requireAuth, deleteReview)

module.exports = router
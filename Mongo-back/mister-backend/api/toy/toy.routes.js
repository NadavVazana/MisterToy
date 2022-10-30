const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys,getById, removeToy ,addToy,updateToy} = require('./toy.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getToys)
router.get('/:id', getById)
router.post('/', requireAuth, addToy)
// router.post('/', addToy)
router.put('/:id', requireAuth, updateToy)
// router.put('/',updateToy)
router.delete('/:id', requireAuth, requireAdmin, removeToy)
// router.delete('/:id',  removeToy)

module.exports = router

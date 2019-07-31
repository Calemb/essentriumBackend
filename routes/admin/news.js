const express = require('express');
const router = express.Router()
const gameplay = require('../../gameplay/admin/news')

router.delete('/:id', gameplay.delete)
router.post('/', gameplay.post)
router.get('/', gameplay.get)

module.exports = router
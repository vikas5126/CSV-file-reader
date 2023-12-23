const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.home);
router.post('/submit', homeController.submit);
router.get('/show', homeController.show);
router.get('/delete/:id', homeController.delete)
module.exports = router;
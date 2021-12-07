const express = require('express');
const router = express.Router();
const DomainController = require('../Controllers/DomainController');

router.get('/domain/search/:domain', DomainController.checkAvailability);
module.exports = router;
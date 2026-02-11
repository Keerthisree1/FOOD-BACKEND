const express = require('express');
const router = express.Router();

const { getContests } = require('../controllers/externalContestController');

router.get('/contests', getContests);

module.exports = router;

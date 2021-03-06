var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '로그인' });
});

router.get('/version', (req, res, next) => {
  res.status(200).json({ version: '1.2' });
});

module.exports = router;

const { Login } = require('../controller/Login');
const { Register } = require('../controller/Register');

const router = require('express').Router();

router.post('/signup', Register);
router.post('/signin', Login);


module.exports = router;

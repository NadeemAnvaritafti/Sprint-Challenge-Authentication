const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('./auth-model');

router.post('/register', validate, (req, res) => {
  let userData = req.body;
  const hash = bcrypt.hashSync(userData.password, 8);
  userData.password = hash;

  Users.add(userData)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: 'Failed to register user' })
  })
});


router.post('/login', validate, (req, res) => {
  let { username, password } = req.body;
  
  Users.findBy({ username })
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = signToken(user);
      res.status(200).json({
        message: `${user.username} logged in!`,
        token
      });
    } else {
      res.status(401).json({ message: 'you shall not pass!' });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: 'Failed to retrieve credentials' });
  })
});




// ---------- Function for creating and signing token ----------- //

function signToken(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET || 'super secret code';

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options); 
}



// ----------------------- CUSTOM MIDDLEWARE ------------------------ //

function validate(req, res, next) {
  const data = req.body;
  if (!data) {
      res.status(400).json({ error: 'missing username and password' })
  } else if (!data.username) {
      res.status(400).json({ error: 'missing required username' })
  } else if (!data.password) {
      res.status(400).json({ error: 'missing required password' })
  } else {
      next();
  }
}
module.exports = router;

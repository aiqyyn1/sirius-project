const Router = require('express');
const {
  Registration,
  getUser,
  Login,
  refresh,
  logout,
  resetSend,
  resetChange,
  UpdateUser,
  deleteUser
} = require('../Controllers/auth.controller');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/getUser.middleware');
const getRefreshToken = require('../middleware/getRefreshToken.middleware');
const upload = require('../middleware/imageUpload.middleware');
const authCheckMiddleware = require('../middleware/authCheck.middleware');
const router = Router();
router.post(
  '/register',
  upload.single('image'),
  [
    check('username', 'Username must not be empty').notEmpty(),
    check('email', 'Email is not correct').isEmail(),
    check('email', 'Email must not be empty').notEmpty(),
    check('image').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Image must not be empty');
      }
      return true;
    }),
    check('description', 'Description must not be empty').notEmpty(),
    check('re_password', 'Confirmation password must not be empty').notEmpty(),
  ],

  Registration
);

router.post('/login', Login);
router.put(
  '/updateUser/:id',
  authCheckMiddleware,
  upload.single('image'),
  UpdateUser
);
router.delete('/delete/:id', authCheckMiddleware, deleteUser)
router.post('/logout', authCheckMiddleware, logout);
router.get('/user', authMiddleware, getUser);
router.get('/refresh', getRefreshToken, refresh);
router.post(
  '/reset',

  [check('email').isEmail()],

  resetSend
);
router.post('/reset/:link', resetChange);

module.exports = router;

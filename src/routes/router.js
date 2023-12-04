const Router = require('express');
const {
  Registration,
  Login,
  refresh,
  logout,
  resetSend,
  resetChange,
  UpdateUser,
  deleteUser,
} = require('../Controllers/auth.controller');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/user/getUser.middleware');
const getRefreshToken = require('../middleware/user/getRefreshToken.middleware');
const upload = require('../middleware/user/imageUpload.middleware');
const authCheckMiddleware = require('../middleware/user/authCheck.middleware');
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
} = require('../Controllers/user.controller');
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
// router.put(
//   '/updateUser/:id',
//   authCheckMiddleware,
//   upload.single('image'),
//   UpdateUser
// );
router.delete('/delete/:id', authCheckMiddleware, deleteUser);
router.post('/logout', authCheckMiddleware, logout);
router.get('/user', authMiddleware, getUser);
router.get('/refresh', getRefreshToken, refresh);
router.post(
  '/reset',

  [check('email').isEmail()],

  resetSend
);
router.post('/reset/:link', resetChange);

router.get('/users', authCheckMiddleware, getUsers);
router.get('/users/:id', authCheckMiddleware, getUser);
router.put('/users/:id', authCheckMiddleware, updateUser);
router.delete('/users/:id', authCheckMiddleware, deleteUser);
router.post('/users/:id',  authCheckMiddleware, createUser)
module.exports = router;

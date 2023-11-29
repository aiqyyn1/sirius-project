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
} = require('../src/Controllers/auth.controller');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/getUser.middleware');
const getRefreshToken = require('../middleware/getRefreshToken.middleware');
const upload = require('../middleware/imageUpload.middleware');
const authCheckMiddleware = require('../middleware/authCheck.middleware');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - re_password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         re_password:
 *           type: string
 *           description: The confirmation password of the user.
 */

/**
 * @swagger
 * tags:
 *   - name: Sirius
 *     description: Sirius
 * /auth/register:
 *   post:
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         description: User registration data
 *         schema:
 *           $ref: '#/components/schemas/Registration'
 *     summary: User Registration
 *     tags:
 *       - Sirius  # Adjusted to match the tag name in the Swagger definition
 *     responses:
 *       200:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 */

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
router.put('/updateUser/:id',authCheckMiddleware, upload.single("image") , UpdateUser)
router.post('/logout', authCheckMiddleware, logout);
router.get('/user', authMiddleware , getUser);
router.get('/refresh', getRefreshToken, refresh);
router.post(
  '/reset',

  [check('email').isEmail()],

  resetSend
);
router.post('/reset/:link', resetChange);

module.exports = router;

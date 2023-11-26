const Router = require('express');
const {
  Registration,
  getUser,
  Login,
  refresh,
  logout,
  resetSend,
  resetChange,
} = require('./src/Controllers/auth.controller');
const { check } = require('express-validator');
const authMiddleware = require('./middleware/auth.middleware');
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
  [
    check('username', 'Username must not be empty').notEmpty(),
    check('email', 'Email is not correct').isEmail(),
    check('re_password', 'Confirmation password must not be empty').notEmpty(),
  ],
  Registration);

router.post('/login', Login);
router.post('/logout',logout);
router.get('/user', authMiddleware, getUser);
router.get('/refresh', refresh);
router.post('/reset', 
      [
            check('email').isEmail()
      ],
      resetSend);
router.post('/reset/:link', resetChange);

module.exports = router;

const express = require('express');

const routes = express.Router();

/**
 * middlewares
 */
const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');

/**
 * Controllers
 */
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const categoryController = require('./controllers/categoryController');

/**
 * Flash messages
 */
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

/**
 * Auth
 */
routes.get('/', guestMiddleware, authController.signin);
routes.get('/signup', guestMiddleware, authController.sigup);
routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);
routes.get('/signout', authController.signout);

/**
 * Dashboard
 */
routes.use('/app', authMiddleware);
routes.get('/app/dashboard', dashboardController.index);

/**
 * Category
 */
routes.post('/app/categories/create', categoryController.store);

routes.use((req, res) => res.render('errors/404'));

routes.use((err, req, res, _next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;

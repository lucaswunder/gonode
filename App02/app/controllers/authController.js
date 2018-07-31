const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports = {
  signin(req, res) {
    return res.render('auth/signin');
  },

  sigup(req, res) {
    return res.render('auth/signup');
  },

  async register(req, res, next) {
    try {
      const { email } = req.body;
      if (await User.findOne({ where: { email } })) {
        req.flash('error', 'E-mail já cadastrado');
        return res.redirect('back');
      }

      const password = await bcrypt.hash(req.body.password, 5);

      await User.create({ ...req.body, password });
      req.flash('success', 'Usuário cadastrado com sucesso');
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error', 'Usuário inexistete');
        return res.redirect('/');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        req.flash('error', 'Senha inválida');
        return res.redirect('back');
      }

      req.session.user = user;

      return req.session.save(() => {
        res.redirect('app/dashboard');
      });
    } catch (err) {
      return next(err);
    }
  },
  // com calback
  signout(req, res) {
    return req.session.destroy(() => res.redirect('/'));
  },
};

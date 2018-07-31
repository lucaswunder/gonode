module.exports = {
  signin(req, res) {
    return res.render('auth/signin');
  },

  sigup(req, res) {
    return res.render('auth/signup');
  },
};

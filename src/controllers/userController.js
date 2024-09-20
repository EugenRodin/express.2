import users from '../models/userModel.js';

export const getUsers = (req, res) => {
  res.render('users/index', { users });
};

export const getUserDetails = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (user) {
    res.render('users/details', { user });
  } else {
    res.status(404).send('Користувача не знайдено');
  }
}
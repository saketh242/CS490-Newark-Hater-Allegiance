const User = require("../models/User")

const insertUser = async (req, res, next) => {
  try {
      const {uid} = req;
      const { firstName, lastName, email } = req.body;

      const existingUser = await User.findOne({ uid: uid });

      if (existingUser) {
          return res.status(409).json({ error: 'User already exists' });
      }

      const newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          uid: uid
      };

      console.log('Received user information:', { firstName, lastName, email, uid });

      const inserted = await User.create(newUser);
      res.status(200).json({ message: 'User information received successfully' });
  } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
  

  const getUserId = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid: uid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.send(user);
    } catch (error) {
        console.error('Error fetching user by uid:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getUserId = getUserId
module.exports.insertUser = insertUser
const User = require("../models/User")

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        console.log("All users:", users);
        res.send(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
};

const insertUser = async (req, res, next) => {
    try {
      const { firstName, lastName, email, uid } = req.body;
  
      console.log('Received user information:', { firstName, lastName, email, uid });
  
      
      res.status(200).json({ message: 'User information received successfully' });
    } catch (error) {
      
      console.error('Error inserting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const getUserId = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    res.send(user)
}

module.exports.getAllUsers = getAllUsers
module.exports.getUserId = getUserId
module.exports.insertUser = insertUser
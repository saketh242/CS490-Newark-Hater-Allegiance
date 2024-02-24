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

const getUserId = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    res.send(user)
}

module.exports.getAllUsers = getAllUsers
module.exports.getUserId = getUserId
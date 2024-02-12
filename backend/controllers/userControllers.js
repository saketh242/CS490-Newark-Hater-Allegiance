const getAllUsers = async (req, res, next) => {
    const users = await User.find()
    res.send(users)
}

const getUserId = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    res.send(user)
}

module.exports.getAllUsers = getAllUsers
module.exports.getUserId = getUserId
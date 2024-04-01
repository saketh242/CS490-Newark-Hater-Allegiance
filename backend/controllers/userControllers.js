const User = require("../models/User");
const Feedback = require("../models/Feedback");
const History = require("../models/History");

const validateUserInput = (firstName, lastName, email, uid) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !emailRegex.test(email) || !uid) {
        throw new Error('Invalid input data');
    }

    return true;
};

const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req;
        const user = await User.findOne({ uid });

        if (!user) return res.status(404).json({ error: 'User not found' });

        await Feedback.deleteMany({ user: user._id });
        await History.deleteMany({ user: user._id });
        await User.deleteOne({ uid });

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting user' });
    }
};

const insertUser = async (req, res, next) => {
    try {
        const { uid } = req;
        const { firstName, lastName, email } = req.body;

        validateUserInput(firstName, lastName, email, uid);

        if (await User.exists({ $or: [{ uid }, { email }] })) 
            return res.status(409).json({ error: 'User already exists' });

        await User.create({ firstName, lastName, email, uid });
        res.status(200).json({ message: 'User information received successfully' });
    } catch (error) {
        if (error.message === 'Invalid input data') {
            return res.status(400).json({ error: 'Invalid user input data' });
        }
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'An error occurred while inserting user' });
    }
};

const getUserId = async (req, res, next) => {
    try {
        const { uid } = req;
        const user = await User.findOne({ uid });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.send(user);
    } catch (error) {
        console.error('Error fetching user by uid:', error);
        res.status(500).json({ error: 'An error occured while getting user ID' });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { uid } = req;
        const { email, firstName, lastName, newEmailFlag, newFirstNameFlag, newLastNameFlag } = req.body;

        validateUserInput(firstName, lastName, email, uid);

        const updateData = {};
        if (newFirstNameFlag) updateData.firstName = firstName;
        if (newLastNameFlag) updateData.lastName = lastName;
        if (newEmailFlag) updateData.email = email;

        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: 'User not found' });

        await User.findOneAndUpdate({ uid }, updateData, { new: true });

        res.status(200).json({ message: "User details updated successfully!" });
    } catch (error) {
        if (error.message === 'Invalid input data') {
            return res.status(400).json({ error: 'Invalid user input data' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: "An error occurred while updating user" });
    }
};

module.exports = { getUserId, insertUser, updateUser, deleteUser };

const User = require("../models/User")

const validateUserInput = (firstName, lastName, email, uid) => {
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !emailRegex.test(email) || !uid) {
        throw new Error('Invalid input data');
    }

    return true;
};

const insertUser = async (req, res, next) => {
    try {
        const { uid } = req;
        const { firstName, lastName, email } = req.body;

        // Validate user input
        try {
            validateUserInput(firstName, lastName, email, uid);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

        const userExists = await User.findOne({ $or: [{ uid: uid }, { email: email }] });

        if (userExists) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newUser = { firstName, lastName, email, uid };

        console.log('Received user information:', newUser);

        const inserted = await User.create(newUser);
        res.status(200).json({ message: 'User information received successfully' });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getUserId = async (req, res, next) => {
    try {
        const { uid } = req;

        // Validate uid is not empty
        if (!uid) {
            return res.status(400).json({ error: 'UID is missing in the request' });
        }

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


module.exports.getUserId = getUserId;
module.exports.insertUser = insertUser;

const User = require("../models/User")
const admin = require("../config/firebase")

const validateUserInput = (firstName, lastName, email, uid) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
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

const updateUser = async (req, res, next) => {
    // right now I am only trying to update email in fire base, 
    // karam will update the email on MongoDB and the names accordingly
    // I hope it works :)

    try {
        const { uid } = req;
        const { email, firstName, lastName } = req.body;

        await admin.auth().updateUser(uid, {
            email: email,
            emailVerified: false,
            displayName: `${firstName} ${lastName}`
        })

        // getting the user data and sending him the 
        const user = await admin.auth().getUser(uid);
        
        console.log("Email updated and verification sent :)");
        res.status(200).json(user)


    } catch (e){
        console.log(e);
        res.status(500).json({ error: "An error occurred while updating user or triggering verification email" });

    }
}


module.exports.getUserId = getUserId;
module.exports.insertUser = insertUser;
module.exports.updateUser = updateUser;

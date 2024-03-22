const User = require("../models/User")
const admin = require("../config/firebase")
const Feedback = require("../models/Feedback")
const History = require("../models/History")

const validateUserInput = (firstName, lastName, email, uid) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !emailRegex.test(email) || !uid) {
        throw new Error('Invalid input data');
    }

    return true;
};

const deleteUser = async (req, res, next) => {
    const { uid } = req;
    // Validate uid is not empty
    try {
        if (!uid) {
            return res.status(400).json({ error: 'UID is missing in the request' });
        }

        // Find the user
        const user = await User.findOne({ uid: uid });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find user's history
        const history = await History.find({ user: user._id });

        // Check if the user has histories to delete
        if (history) {
            // Delete all feedback associated with the user
            await Feedback.deleteMany({ user: user._id });

            // Delete the user's history
            await History.deleteMany({ user: user._id });
        }

        // Delete the user
        await User.deleteOne({ uid: uid });

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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
        const { email, firstName, lastName, newEmailFlag, newFirstNameFlag, newLastNameFlag } = req.body;
        // commented this the email update happens in front end now
        
        // if (newEmailFlag) {
        //     await admin.auth().updateUser(uid, {
        //         email: email,
        //         emailVerified: false,
        //     })
        // }
        const updateData = {};

        if (newFirstNameFlag) {
            updateData.firstName = firstName;
        }

        if (newLastNameFlag) {
            updateData.lastName = lastName;
        }

        if (newEmailFlag) {
            updateData.email = email;
        }

        console.log(updateData)

        // unsure what this is for anymore as it is unused now, keep it for later 
        //const user = await admin.auth().getUser(uid);

        await User.findOneAndUpdate({ uid: uid }, updateData, { new: true })

        res.status(200).json("User details updated sucessfully!")


    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "An error occurred while updating user" });

    }
}


module.exports.getUserId = getUserId;
module.exports.insertUser = insertUser;

module.exports.updateUser = updateUser;

module.exports.deleteUser = deleteUser;


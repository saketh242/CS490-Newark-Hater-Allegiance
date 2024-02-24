const History = require("../models/History")

const getAllHistory = async (req, res, next) => {
    try {
        const {id} = req.params
        const histories = await History.find({user: id});
        console.log("All users:", histories);
        res.send(histories);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
};

const postHistory = async(req, res, next) => {
    try {
        const post = {
            original_code: "printf(\"beep\", beep);",
            language: "Java",
            converted_code: "System.out.println(\"beep\")",
            user: "65d9438c578bf61525aa4f62"
        }
        const inserted = await History.create(post);
        res.status(200).send("Inserted History");
    } catch(error) {
        console.error("Error fetching all users:", error);
        res.status(500).send("Internal Server Error");
    }
}



module.exports.getAllHistory = getAllHistory
module.exports.postHistory = postHistory
import React, { useState } from 'react'
import StarGroup from "./StarGroup"
const Feedback = () => {
    const [translation, setTranslation] = useState(-1);

    const [feedback, setUserExperience] = useState(-1);

    const [textBox, setTextBox] = useState(-1);

    return (
        <div className="feedback">
            <StarGroup setRating={setTranslation} />
            <br />
            <p>
                Translation Quality
            </p>
            <br />

            <StarGroup setRating={setUserExperience}/>
            <br />
            <p>
                User Experience
            </p>

            <br />
            <textarea 
                className="feedbackArea" 
                placeholder="Enter any additional feedback here"
                onChange={(e) => setTextBox(e.target.value)} />
            <br />
            <button className="feedbackButton">
                Submit Feedback
            </button>

        </div>
    );
    // make sure postId is not empty

    //pass user as a parameter to feedback to pass it along to postFeedback method from the service 
};
export default Feedback;
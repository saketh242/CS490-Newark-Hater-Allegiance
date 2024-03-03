import PropTypes from 'prop-types';
import React, { useState } from 'react';
import StarGroup from "./StarGroup";
import nhaService from '../services/nhaService';
import useAuth from '../useAuth';

const Feedback = ({ postId }) => {
    const [translation, setTranslation] = useState(-1);
    const [userExperience, setUserExperience] = useState(-1); 
    const [textBox, setTextBox] = useState(""); 
    const {user} = useAuth();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitted = async () => {
        if (!postId || translation === -1 || userExperience === -1) {
            console.error("Error: postId, translation, or userExperience not provided.");
            return; 
        } else {
            await nhaService.postFeedback(user, postId, translation, userExperience, textBox);
            
            setTranslation(-1);
            setUserExperience(-1);
            setIsSubmitted(true);
            
            setTimeout(() => {
                setIsSubmitted(false);
            }, 2000);
        }
    };

    return (
        <div className="feedback">
            <StarGroup setRating={setTranslation} />
            <br />
            <p>Translation Quality</p>
            <br />

            <StarGroup setRating={setUserExperience} />
            <br />
            <p>User Experience</p>

            <br />
            <textarea
                className="feedbackArea"
                placeholder="Enter any additional feedback here"
                value={textBox}
                onChange={(e) => setTextBox(e.target.value)}
            />
            <br />
            <button className="feedbackButton" onClick={submitted} disabled={isSubmitted}>
                Submit Feedback
            </button>

            {isSubmitted && <p>Feedback submitted successfully!</p>}
        </div>
    );
};


Feedback.propTypes = {
    postId: PropTypes.string.isRequired,
};

export default Feedback;

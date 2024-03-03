import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import StarGroup from "./StarGroup";
import nhaService from '../services/nhaService';
import useAuth from '../useAuth';
import {  toast } from 'react-toastify';

const Feedback = ({ postId }) => {
    const [translation, setTranslation] = useState(-1);
    const [userExperience, setUserExperience] = useState(-1); 
    const [textBox, setTextBox] = useState(""); 
    const {user} = useAuth();
    const textAreaRef = useRef(null);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitted = async () => {
        if (!postId || translation === -1 || userExperience === -1) {
            console.error("Error: postId, translation, or userExperience not provided.");
            return; 
        } else {
            setIsSubmitted(true);
            await nhaService.postFeedback(user, postId, translation, userExperience, textBox);
            
            const msg = () => toast("Feedback Submitted!");
            msg();

            setTranslation(-1);
            setUserExperience(-1);
            setTextBox("");

            if (textAreaRef.current) {
                textAreaRef.current.value = "";
            }
            
            setTimeout(() => {
                setIsSubmitted(false);
            }, 2000);
        }
    };

    return (
        <div className="feedback">
            <StarGroup setRating={setTranslation} isSubmitted={isSubmitted}/>
            <br />
            <p>Translation Quality</p>
            <br />

            <StarGroup setRating={setUserExperience} isSubmitted={isSubmitted}/>
            <br />
            <p>User Experience</p>

            <br />
            <textarea
                className="feedbackArea"
                placeholder="Enter any additional feedback here"
                value={textBox}
                onChange={(e) => setTextBox(e.target.value)}
                ref={textAreaRef}
            />
            <br />
            <button className={isSubmitted ? "greyedOutButton" : "feedbackButton"} onClick={submitted} disabled={isSubmitted}>
                Submit Feedback
            </button>
            </div>
    );
};

Feedback.propTypes = {
    postId: PropTypes.string.isRequired,
};

export default Feedback;
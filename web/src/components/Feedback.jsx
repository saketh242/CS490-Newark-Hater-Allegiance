import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import StarGroup from "./StarGroup";
import nhaService from '../services/nhaService';
import useAuth from '../useAuth';
import { toast } from 'react-toastify';

const Feedback = ({ postId }) => {
    const [translation, setTranslation] = useState(-1);
    const [userExperience, setUserExperience] = useState(-1);
    const [textBox, setTextBox] = useState("");
    const { user } = useAuth();
    const textAreaRef = useRef(null);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const submitted = async () => {
        if (!postId || translation === -1 || userExperience === -1 || textBox.trim() === '') {
            setError("Please fill out all fields.");
            // toast("Please fill out all fields.");
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
            <h1 id="rateHeader">Rate this translation! We'd love to hear your feedback!</h1>

            <StarGroup setRating={setTranslation} isSubmitted={isSubmitted} />
            <br />
            <p>Translation Quality</p>
            <br />

            <StarGroup setRating={setUserExperience} isSubmitted={isSubmitted} />
            <br />
            <p>User Experience</p>

            <br />
            <textarea
                className="feedbackArea"
                placeholder={error || "Enter additional feedback here"}
                value={textBox}
                onChange={(e) => {
                    setTextBox(e.target.value);
                    setError("");
                }}
                style={{
                    borderColor: error ? 'red' : '#0ac6c0',
                    transition: 'border-color 0.3s ease'
                }}
                ref={textAreaRef}
            />
            {error && <Alert variant="danger">{error}</Alert>}
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

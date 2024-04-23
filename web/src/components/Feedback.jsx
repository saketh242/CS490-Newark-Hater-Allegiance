import PropTypes from 'prop-types'
import React, { useState, useRef, lazy, Suspense } from 'react'
import Alert from 'react-bootstrap/Alert'
import nhaService from '../services/nhaService'
import { toast } from 'react-toastify'
import { auth } from '../firebase'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const StarGroup = lazy( () => import('./StarGroup'))

const Feedback = ({ postId }) => {
    const dbUserFromRedux = useSelector((state) => state.user.dbUser)
    const [translation, setTranslation] = useState(-1)
    const [userExperience, setUserExperience] = useState(-1)
    const [textBox, setTextBox] = useState("")
    const user = auth.currentUser
    const textAreaRef = useRef(null)

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const [feedbackError, setFeedbackError] = useState('')

    const submitted = async () => {
        if (!postId || translation === -1 || userExperience === -1 || textBox === '') {
            setError("Please fill out all fields.")
            return
        } else {
            try {
                setFeedbackError('')
                await nhaService.postFeedback(user, dbUserFromRedux, postId, translation, userExperience, textBox)
                setIsSubmitted(true)

                toast("Feedback Submitted!")

                setTranslation(-1)
                setUserExperience(-1)
                setTextBox("")

                if (textAreaRef.current) textAreaRef.current.value = ""

                setTimeout(() => { setIsSubmitted(false) }, 2000)
            }
            catch (error) {
                setFeedbackError('Unable to post feedback.')
            }
        }
    }

    return (
        <div className="feedback">
            <h1 id="rateHeader">Rate this translation! We'd love to hear your feedback!</h1>
            <div className="starGroups">
                <div className="feedbackStarGroup">
                    <Suspense><StarGroup setRating={setTranslation} isSubmitted={isSubmitted} /></Suspense>
                    <br />
                    <p>Translation Quality</p>
                    <br />
                </div>

                <div className="feedbackStarGroup">
                    <Suspense><StarGroup setRating={setUserExperience} isSubmitted={isSubmitted} /></Suspense>
                    <br />
                    <p>User Experience</p>
                </div>
            </div>

            <div id="feedbackErrorAndInput">
                {feedbackError !== '' &&
                    <div className="feedbackError" data-testid="feedback-error">
                        <FontAwesomeIcon icon={faCircleExclamation} id="errorIcon" size="2x" />
                        <p>{feedbackError}</p>
                    </div>}

                <textarea
                    className="feedbackArea"
                    placeholder={error || "Enter additional feedback here"}
                    value={textBox}
                    onChange={(e) => {
                        setTextBox(e.target.value)
                        setError(null)
                    }}
                    style={{
                        borderColor: error ? 'red' : '#0ac6c0',
                        transition: 'border-color 0.3s ease'
                    }}
                    ref={textAreaRef}
                />
                {error && <Alert variant="danger">{error}</Alert>}
                <br />
            </div>
            <button
                className={isSubmitted ? "greyedOutButton" : "feedbackButton"}
                onClick={submitted}
                disabled={isSubmitted}
                data-testid="submit-feedback"
            >
                Submit Feedback
            </button>
        </div>
    )
}

Feedback.propTypes = {
    postId: PropTypes.string.isRequired,
}

export default Feedback

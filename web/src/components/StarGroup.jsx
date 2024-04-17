import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const StarGroup = ({ setRating, isSubmitted }) => {
  const [clickedId, setClickedId] = useState(-1)

  useEffect(() => {
    if (isSubmitted) setClickedId(-1)
  }, [isSubmitted])

  const handleClick = (id) => {
    const rating = id + 1
    setClickedId(id)
    setRating(rating)
  }

  const [hoverId, setHoverId] = useState(-1)
  const setHover = (id) => {setHoverId(id)}
  const buttons = ["One", "Two", "Three", "Four", "Five"]

  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          onMouseOver={() => setHover(i)}
          onMouseOut={() => setHover(-1)}
          className={
            i <= clickedId
              ? "starClicked"
              : i <= hoverId
                ? "starHover"
                : "star"
          }
          name={buttonLabel}
        >
          <FontAwesomeIcon icon={faStar} size="3x" />
        </button>
      ))}
    </>
  )
}

StarGroup.propTypes = {
  setRating: PropTypes.func.isRequired,
}

export default StarGroup

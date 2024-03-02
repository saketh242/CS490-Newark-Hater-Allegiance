import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
const ButtonGroup = () => {
    const [clickedId, setClickedId] = useState(-1);
    const handleClick = (id) => { setClickedId(id); };
    
    const [hoverId, setHoverId] = useState(-1);
    const setHover = (id) => { setHoverId(id); };
    
    const buttons = ["One", "Two", "Three", "Four", "Five"];

    return (
      <>
        {buttons.map((buttonLabel, i) => (
          <button 
            key={i}
            onClick={() => handleClick(i)}
            onMouseOver={() => {setHover(i)}}
            onMouseOut={() => {setHover(-1)}}
            className={
                    i <= clickedId ? "starClicked" 
                    : i <= hoverId ? "starHover"
                    : "star"
            }
            name={buttonLabel}>
            <FontAwesomeIcon icon={faStar} size="2x"/>
          </button>
        ))}
      </>
    );
};
export default ButtonGroup;
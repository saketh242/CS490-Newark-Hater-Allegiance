import React from 'react'

const Home = () => {
  return (
    <div>
      <h1 className="title">NHA</h1>
      <h1 className="title title2">GPT</h1>
      <p className='subtitle'>Easy code translation in minutes!</p>

      <div className='box features'>
        <p>Key features</p>
        <div className="features-flexbox">
          <p>Powered by GPT-3</p>
          <p>Faster Code Translation</p>
          <p>User Friendly Interface</p>
          <p>Precision Perfected Code</p>
        </div>
      </div>

      <div className='box'>
        <p>Getting Started</p>
        <ul className='instructions'>
          <li>Copy code into the text area or upload a file</li>
          <li>Enter the source and destination languages</li>
          <li>Click "Convert", and that's it!</li>
          <li>Download or copy the code to save it</li>
        </ul>
      </div>

      <div className='reviews-box'></div>

      <div className='box'>
        <p>Designed and Developed by</p>
        <div className='authors'>
          <p>Saketh Puramsetti</p>
          <p>John Cena</p>
          <p>Medina Dzhatdoyev</p>
          <p>Karam Assaf</p>
          <p>Ausberto Colon Jr</p>
        </div>
      </div>

    </div>
  )
}

export default Home

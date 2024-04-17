import spongebobGif from '../memeGifs/spongebob.gif';

const PageNotFound = () => {
  return (
    <div className="not-found-div">
      <h1>404 Page not found</h1>
      <img className='meme' src={spongebobGif} alt="spongebobgif" loading="lazy"></img>
    </div>
  )
}

export default PageNotFound

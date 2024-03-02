import spongebobGif from '../../memeGifs/spongebob.gif';

const PageNotFound = () => {
  return (
    <div class="not-found-div">
      <h1>404 Page not found</h1>
      <img className='meme' src={spongebobGif} alt="spongebobgif"></img>
    </div>
  )
}

export default PageNotFound

import { Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import classes from './Index.module.css'
import MusicContext from '../store/music-context'
import musics from '../data/music.json'
import select from '../assets/sounds/perfect.wav'
import background from '../assets/background.gif'
import Play from './Play'

const Index = () => {
  const selectSound = new Audio(select)

  const [musicFile, setMusicFile] = useState(null)
  const [bgBlack, setBgBlack] = useState(false)

  const navigate = useNavigate()

  const goPlay = (dataMusic) => {
    setMusicFile(dataMusic)
    setBgBlack(true)
    selectSound.volume = 0.6
    selectSound.play()
    setTimeout(() => {
      navigate('/play')
      setBgBlack(false)
    }, 500)
  }

  const musicSelect = () => {
    return musics.map((music, index) => {
      return (
        <div
          className="w-full flex justify-between p-2 cursor-pointer hover:bg-blue-500 rounded-lg"
          key={index}
          onClick={() => goPlay(music)}
        >
          <div>
            {music.name} - {music.band}
          </div>
          <div>{music.bpm} BPM</div>
        </div>
      )
    })
  }

  const delayNextPage = () => {
    return (
      <div
        className={`${classes.toBlack} absolute top-0 left-0 w-screen h-screen z-20`}
      ></div>
    )
  }

  return (
    <MusicContext.Provider value={{ musicFile: musicFile }}>
      <div className="container h-screen mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {bgBlack && delayNextPage()}
                <div className="absolute top-0 left-0 w-screen h-screen">
                  <img
                    className="w-full h-full object-cover"
                    src={background}
                    alt="background"
                  />
                </div>
                <div className="relative z-10 p-10">
                  <div className="text-center font-extrabold text-white text-4xl mt-4 mb-10">
                    Type Rhythm
                    <div className="font-semibold text-base">
                      Music Typing Game
                    </div>
                  </div>
                  <div className="rounded-lg bg-black bg-opacity-30 mx-auto p-5 text-white w-screen max-w-[500px] text-center">
                    <div className="font-semibold text-lg mb-3">Quick Play</div>
                    {musicSelect()}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/play" element={<Play />} />
        </Routes>
      </div>
    </MusicContext.Provider>
  )
}

export default Index

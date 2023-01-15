import { useContext, useCallback, useEffect, useMemo, useState } from 'react'
import CountUp from 'react-countup'
import MusicContext from '../store/music-context'
import background from '../assets/background.gif'
import classes from './Play.module.css'

import setting from '../data/setting.json'

import usePlay from '../hooks/usePlay'

import wordsLevel1 from '../data/words/wordsLevel1.json'
import wordsLevel2 from '../data/words/wordsLevel2.json'
import wordsLevel3 from '../data/words/wordsLevel3.json'

import perfect from '../assets/sounds/perfect.wav'
import grate from '../assets/sounds/grate.wav'
import bad from '../assets/sounds/bad.wav'
import miss from '../assets/sounds/miss.wav'

import 'css-doodle'

const perfectSound = new Audio(perfect)
const grateSound = new Audio(grate)
const badSound = new Audio(bad)
const missSound = new Audio(miss)

function Play() {
  const [start, setStart] = useState(false)

  const [musicSound, setMusicSound] = useState(null)
  const ctx = useContext(MusicContext)
  const [pass, setPass] = useState(ctx.musicFile.startRoom)
  useEffect(() => {
    const music = require(`../assets/music/${ctx.musicFile.file}`)
    setMusicSound(new Audio(music))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useMemo(() => {
    setInterval(() => {
      const element = document.getElementById('tempo')
      const style = window.getComputedStyle(element)
      const scorex = style.transform.split(' ')[4].replace(',', '')
      setMiss(() => {
        if (scorex < 10) return true
        return false
      })
      if (scorex > 10 && scorex < 20) {
        setIsSpace(false)
        document.getElementById('inputWord').focus()
      }
    }, 45)
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && pass > 0) {
        scoreHandler()
      }
      // if (event.code === 'Enter' && pass > 0) {
      //   setUpLevelState((prev) => !prev)
      // }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pass])

  const [combo, setCombo] = useState(0)
  const [isSpace, setIsSpace] = useState(false)
  const [scoreStatus, setScoreStatus] = useState('')
  const [score, setScore] = useState(0)
  const [scorePrev, setScorePrev] = useState(0)
  const [upScore, setUpScore] = useState(0)
  const [transformx, setTransformx] = useState(0)
  const scoreHandler = useCallback(async () => {
    const element = document.getElementById('tempo')
    const style = window.getComputedStyle(element)
    const scorex = style.transform.split(' ')[4].replace(',', '')
    setTransformx(scorex - 255)
    if (scorex > 100) {
      await check()
      setWordCorrect((checkPrev) => {
        if (!checkPrev) {
          setScoreHandler('Incorrect', 0, missSound)
          setScoreStatus('Incorrect')
        } else {
          setScoreStatus((prev) => {
            if (prev !== '') {
              return prev
            }
            if (
              setting.perfect.minPerfect <= scorex - 255 &&
              scorex - 255 <= setting.perfect.maxPerfect
            ) {
              perfectSound.currentTime = 0
              perfectSound.volume = 0.6
              perfectSound.play()
              setIsSpace(true)
              setCombo((prev) => {
                setScore((scorePrev) => {
                  setScorePrev(scorePrev)
                  return scorePrev + setting.perfect.scorePerfect * (prev + 1)
                })
                setUpScore(645 * (prev + 1))
                return prev + 1
              })
              return `Perfect`
            } else if (
              setting.grate.minGrate <= scorex - 255 &&
              scorex - 255 <= setting.grate.maxGrate
            ) {
              return setScoreHandler(
                'Grate',
                setting.grate.scoreGrate,
                grateSound
              )
            } else if (
              setting.bad.minBad <= scorex - 255 &&
              scorex - 255 <= setting.bad.maxBad
            ) {
              return setScoreHandler('Bad', setting.bad.scoreBad, badSound)
            } else {
              return setScoreHandler('Miss', 0, missSound)
            }
          })
        }
        return false
      })
    }
  }, [])

  const setScoreHandler = (text, upScore, sound) => {
    sound.currentTime = 0
    sound.play()
    setScore((prev) => {
      setScorePrev(prev)
      return prev + upScore
    })
    setUpScore(upScore)
    setIsSpace(true)
    setCombo(0)
    return text
  }

  const [input, setInput] = useState('')
  const [wordCorrect, setWordCorrect] = useState(false)
  const check = () => {
    setInput((inputPrev) => {
      setWord((wordPrev) => {
        if (inputPrev.trim() === wordPrev.trim()) {
          setWordCorrect(true)
        }
        return ''
      })
      return ''
    })
  }

  const [miss, setMiss] = useState(false)
  useEffect(() => {
    if (miss === true) {
      if (pass > 0 && isSpace === false) {
        setCombo(0)
        setScoreStatus('Time Out')
        missSound.currentTime = 0
        missSound.play()
      }
      setInput('')
      newWord()
      setTimeout(() => {
        setScoreStatus('')
        setUpScore(0)
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [miss])

  const holdLevel = setting.holdLevel
  const [inHoldLevel, setInHoldLevel] = useState(0)
  const [isLevel, setIsLevel] = useState(1)
  const [word, setWord] = useState('')
  const levelstat = document.getElementById('expLevel')
  const newWord = () => {
    if (holdLevel === inHoldLevel) {
      setUpLevelState((prev) => !prev)
    }
    switch (isLevel) {
      case 1:
        setWord(wordsLevel1[Math.floor(Math.random() * wordsLevel1.length)])
        if (upScore !== 0) {
          if (inHoldLevel <= holdLevel - 1) {
            setInHoldLevel((prev) => {
              levelstat.style.width = ((prev + 1) * 100) / holdLevel + '%'
              return prev + 1
            })
          }
        } else {
          if (inHoldLevel > 0) {
            setInHoldLevel((prev) => {
              levelstat.style.width = ((prev - 1) * 100) / holdLevel + '%'
              if (prev - 1 < 0 && isLevel > 1) {
                setIsLevel((prev) => {
                  return prev - 1
                })
                return 0
              }
              return prev - 1
            })
          }
        }
        break
      case 2:
        setWord(wordsLevel2[Math.floor(Math.random() * wordsLevel2.length)])
        if (upScore !== 0) {
          if (inHoldLevel <= holdLevel - 1) {
            setInHoldLevel((prev) => {
              levelstat.style.width = ((prev + 1) * 100) / holdLevel + '%'
              return prev + 1
            })
          }
        } else {
          setInHoldLevel((prev) => {
            levelstat.style.width = ((prev - 1) * 100) / holdLevel + '%'
            if (prev - 1 < 0 && isLevel > 1) {
              setIsLevel((prev) => prev - 1)
              return 0
            }
            return prev - 1
          })
        }
        break
      case 3:
        setWord(wordsLevel3[Math.floor(Math.random() * wordsLevel3.length)])
        if (upScore !== 0) {
          if (inHoldLevel <= holdLevel - 1) {
            setInHoldLevel((prev) => {
              levelstat.style.width = ((prev + 1) * 100) / holdLevel + '%'
              return prev + 1
            })
          }
        } else {
          setInHoldLevel((prev) => {
            levelstat.style.width = ((prev - 1) * 100) / holdLevel + '%'
            if (prev - 1 < 0 && isLevel > 1) {
              setIsLevel((prev) => prev - 1)
              return 0
            }
            return prev - 1
          })
        }
        break
      default:
        setIsLevel(1)
    }
  }

  const [upLevelState, setUpLevelState] = useState(false)
  useEffect(() => {
    if (parseInt(inHoldLevel) === parseInt(holdLevel)) {
      setIsLevel((prev) => prev + 1)
      levelstat.style.width = (0 * 100) / holdLevel + '%'
      setInHoldLevel(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upLevelState])

  const {
    start: gameStart,
    tempoRoom,
    tempoAnimation,
    tempoSlide,
    bpmMs,
    time,
    currentTime,
    passer,
  } = usePlay(
    ctx.musicFile.bpm,
    musicSound,
    ctx.musicFile.musicDelay1,
    ctx.musicFile.musicDelay2,
    ctx.musicFile.musicDelay3,
    ctx.musicFile.startRoom
  )

  useEffect(() => {
    setPass(passer)
  }, [passer])

  const makeDoodle = (params) => {
    return `
			<css-doodle grid="100x1">
				:doodle {
					grid-col-gap: 1px;
					width: 100vw;
					height: 5em;

				}
				background: white;
				height: @rand(5%, 100%);
			</css-doodle>
		`
  }

  const CssDoodle = useMemo(() => {
    const dangerousInnerHtml = { __html: makeDoodle() }
    return (
      <div
        className="css-doodle-wrapper"
        dangerouslySetInnerHTML={dangerousInnerHtml}
      />
    )
  }, [])

  const [load, setLoad] = useState(true)
  const loading = () => {
    setTimeout(() => {
      setLoad(false)
    }, 3000)
    if (load) {
      return (
        <div className="absolute top-0 left-0 w-screen h-screen bg-white z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl">
            <div className="m-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Loading
            </div>
            <div className="flex justify-center items-center h-full">
              <div
                className="bg-pink-500 w-4 h-4 rounded-full animate-bounce p-2"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="bg-purple-500 w-4 h-4 rounded-full animate-bounce p-2 ml-1"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="bg-purple-600 w-4 h-4 rounded-full animate-bounce p-2 ml-1"
                style={{ animationDelay: '0.3s' }}
              ></div>
              <div
                className="bg-purple-600 w-4 h-4 rounded-full animate-bounce p-2 ml-1"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div
          className={`${classes.load} absolute top-0 left-0 w-screen h-screen z-20`}
        />
      )
    }
  }

  const expLevel = () => {
    if (pass > 0) {
      return (
        <div className="flex gap-2 mx-auto leading-3 items-center">
          <div className="block text-[10px]">EXP</div>
          <div className="h-1 w-20 rounded-lg mx-auto bg-white overflow-hidden">
            <div id="expLevel" className="h-1 w-0 rounded-lg bg-yellow-500" />
          </div>
        </div>
      )
    }
  }

  // const levelUpShow = () => {
  //   return (
  //     <div className="absolute left-1/2 -translate-x-1/2 ml-[65px] mt-[-6px] animate-bounce">
  //       <div>[ Press Enter ]</div>
  //     </div>
  //   )
  // }

  const showAdmin = true
  const adminControl = () => {
    if (showAdmin) {
      return (
        <div className="fixed left-0 top-0 m-3 text-left bg-black z-10 bg-opacity-30 p-4">
          <div className="font-bold text-lg">:: STATE (Admin Control) ::</div>
          <div>tempoRoom: {tempoRoom.toString()}</div>
          <div>tempoAnimation: {tempoAnimation.toString()}</div>
          <div>tempoSlide: {tempoSlide.toString()}</div>
          <div>bpmMs: {bpmMs.toString()}</div>
          <div>time: {time.toString()}</div>
          <div>currentTime: {currentTime.toString()}</div>
          <div>start: {start.toString()}</div>
          <div>pass: {pass.toString()}</div>
          <div>combo: {combo.toString()}</div>
          <div>isSpace: {isSpace.toString()}</div>
          <div>scoreStatus: {scoreStatus.toString()}</div>
          <div>score: {score.toString()}</div>
          <div>upScore: {upScore.toString()}</div>
          <div>input: {input.toString()}</div>
          <div>wordCorrect: {wordCorrect.toString()}</div>
          <div>miss: {miss.toString()}</div>
          <div>holdLevel: {holdLevel.toString()}</div>
          <div>inHoldLevel: {inHoldLevel.toString()}</div>
          <div>isLevel: {isLevel.toString()}</div>
          <div>word: {word.toString()}</div>
          <div>transformx: {transformx.toString()}</div>
        </div>
      )
    }
  }

  return (
    <div>
      {loading()}
      <div className="absolute top-0 left-0 w-screen h-screen">
        <img
          className="w-full h-full object-cover"
          src={background}
          alt="background"
        />
      </div>
      <div className="absolute left-0 top-0 mb-10 z-10">{CssDoodle}</div>
      <div className="container flex flex-col justify-center items-center mx-auto text-center h-screen text-white">
        <div className="font-bold text-4xl h-9 z-10">
          {scoreStatus}
          {scoreStatus && combo > 1 && ` x${combo}`}
        </div>
        <div className="h-5 mb-3"></div>
        <div className="bg-white w-[320px] mx-auto my-2 rounded-xl p-1 z-10">
          <div
            className={`${
              tempoAnimation ? 'bg-red-400' : 'bg-red-300'
            } absolute translate-x-[255px] rounded-xl w-4 h-4`}
          ></div>
          <div
            id="tempo"
            className={`${
              tempoSlide ? classes.tempoSlide : ''
            } translate-x-[255px] bg-blue-700 w-4 h-4 rounded-xl`}
            style={{ animationDuration: `${bpmMs}ms` }}
          ></div>
        </div>
        <div className="text-base leading-3 text-white h-10 mt-2 mb-10 font-bold z-10">
          <div>score</div>
          <CountUp
            className="text-2xl"
            start={scorePrev}
            end={score}
            duration={2}
            useEasing={true}
          />
        </div>
        <div className="text-base font-bold z-10">
          {pass > 0 && `Level ${isLevel}`}
          {/* {holdLevel === inHoldLevel && levelUpShow()} */}
          {expLevel()}
        </div>
        <div className="m-10 mt-4 h-5 font-bold text-3xl z-10">
          {!isSpace && pass > 0 && word}
        </div>
        <div className="h-5 z-10 text-black text-2xl">
          <input
            id="inputWord"
            className="border-b-2 text-center w-[200px] bg-transparent text-white font-bold focus:outline-none disabled:hidden"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={pass <= -1 || isSpace ? true : false}
          ></input>
        </div>
        <div className="absolute bottom-0 left-0  m-4 p-3 w-[300px] text-[12px] rounded-lg bg-black bg-opacity-30 text-white">
          [{ctx.musicFile.bpm} BPM] - {ctx.musicFile.name} -{' '}
          {ctx.musicFile.band}
          <div>
            {parseInt(currentTime)}s in {time}s
          </div>
        </div>
        {!start && !load && (
          <button
            className="z-30 font-bold text-3xl animate-bounce"
            onClick={() => {
              perfectSound.volume = 0.6
              perfectSound.play()
              setStart(true)
              gameStart()
            }}
          >
            start
          </button>
        )}
        {adminControl()}
      </div>
    </div>
  )
}

export default Play

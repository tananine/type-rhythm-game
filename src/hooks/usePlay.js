import { useState } from 'react';

const ac = new AudioContext();

const usePlay = (
	bpm,
	music,
	musicDelay1,
	musicDelay2,
	musicDelay3,
	starter
) => {
	const [tempoRoom, setTempoRoom] = useState(0);
	const [tempoAnimation, setTempoAnimation] = useState(false);
	const [tempoSlide, setTempoSlide] = useState(false);
	const [time, setTime] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [musicPlay, setMusicPlay] = useState(false);
	const [passer, setPasser] = useState(starter);

	const bpmMs = (60000 / bpm) * 4;

	const noteDurationToMs = (bpm, dur, type) => {
		return (60000 * 4 * dur * type) / bpm;
	};

	let lastNote = ac.currentTime;
	const step = noteDurationToMs(bpm, 1 / 4, 1) / 1000;
	const lookAhead = step / 2;

	const timer = () => {
		const diff = ac.currentTime - lastNote;
		if (music) {
			setCurrentTime(music.currentTime);
		}
		if (diff >= lookAhead) {
			if (!musicPlay) {
				setTimeout(() => {
					setTimeout(() => {
						setTimeout(() => {
							music.play();
							setTime(parseInt(music.duration));
						}, musicDelay3);
					}, musicDelay2);
				}, musicDelay1);
			}
			setMusicPlay(true);
			const nextNote = lastNote + step;
			const doodle = document.querySelector('css-doodle');
			doodle.update();
			setTempoRoom((prev) => {
				if (prev === 4) {
					setTempoSlide(false);
					setTempoSlide(true);
					return 1;
				}
				return prev + 1;
			});
			setPasser((prev) => {
				if (prev < 1) {
					return prev + 1;
				}
				return prev;
			});
			setTempoAnimation((prev) => !prev);
			lastNote = nextNote;
		}
	};

	const start = () => {
		ac.resume();
		setInterval(timer, 15);
	};

	return {
		start,
		tempoRoom,
		tempoAnimation,
		tempoSlide,
		bpmMs,
		time,
		currentTime,
		passer,
	};
};

export default usePlay;

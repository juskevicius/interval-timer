import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useLayoutEffect, useState } from 'react';
import useSound from 'use-sound';
import beep from './assets/beep.mp3';
import './styles/timerPlayer.css';
import { secondsToMMSS } from './utils';

const CountdownTimer = ({ play, setPlay, remaining }) => (
  <div className="countdown-timer">
    <Typography onClick={() => setPlay(!play)} color={remaining > 3 ? 'textPrimary' : '#ea7e31'} variant="body1">
      {secondsToMMSS(remaining)}
    </Typography>
  </div>
);

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(window.screen.orientation.type);
  useEffect(() => {
    function updateOrientation() {
      setOrientation(window.screen.orientation.type);
    }
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);
  return orientation;
};

export function TimerPlayer({ setPage, timers, activeTimerIndex }) {
  const activeTimer = timers[activeTimerIndex];
  const [play, setPlay] = useState(false);
  const [activeIntervalIndex, setActiveIntervalIndex] = useState(0);
  const [remaining, setRemaining] = useState(activeTimer.intervals[0].duration || 0);
  const [playSound] = useSound(beep);
  const orientation = useScreenOrientation();

  const activeInterval = activeTimer.intervals[activeIntervalIndex];
  const nextInterval = activeTimer.intervals[activeIntervalIndex + 1];
  const isHorizontal = orientation === 'landscape-primary';

  useEffect(() => {
    let timer;

    if (!play) {
      return;
    }

    if (remaining > 0) {
      if (remaining < 4) {
        playSound();
      }
      timer = setInterval(() => {
        setRemaining(remaining - 1);
      }, 1000);
    }

    if (remaining === 0) {
      const newActiveIntervalIndex = activeTimer.intervals.findIndex(
        (interval, index) => index > activeIntervalIndex && Number(interval.duration) > 0
      );
      if (activeTimer.intervals[newActiveIntervalIndex]) {
        const newDuration = activeTimer.intervals[newActiveIntervalIndex].duration;
        timer = setInterval(() => {
          setActiveIntervalIndex(newActiveIntervalIndex);
          setRemaining(newDuration);
        }, 1000);
      }
    }

    return () => clearInterval(timer);
  }, [remaining, play]);

  useEffect(() => {
    let wakeLock;
    navigator.wakeLock
      ?.request('screen')
      .then((wl) => {
        wakeLock = wl;
      })
      .catch((err) => console.error(`Error when getting wakeLock: ${err.name}, ${err.message}`));

    return () => wakeLock?.release();
  }, []);

  const skip = (n) => {
    setPlay(false);
    const newActiveIntervalIndex = activeIntervalIndex + n;
    if (activeTimer.intervals[newActiveIntervalIndex]) {
      const newDuration = activeTimer.intervals[newActiveIntervalIndex].duration;
      setActiveIntervalIndex(newActiveIntervalIndex);
      setRemaining(newDuration);
    } else {
      const newDuration = n < 1 ? activeTimer.intervals[activeIntervalIndex].duration : 0;
      setRemaining(newDuration);
    }
  };

  return (
    <div className="timer-player-container">
      {/* Timer name and navigation buttons*/}
      <div className="top-bar">
        <IconButton onClick={() => setPage('timers-list')}>
          <FormatListBulletedIcon color="primary" />
        </IconButton>
        <Typography variant="body1" color="textPrimary">
          {activeTimer.name}
          <IconButton onClick={() => setPage('timer-editor')}>
            <EditIcon color="primary" />
          </IconButton>
        </Typography>
      </div>

      <div className="content">
        {/* Countdown timer (in horizontal view) : */}
        {isHorizontal && <CountdownTimer play={play} setPlay={setPlay} remaining={remaining} />}

        <div className={`interval-names-and-controls ${isHorizontal ? 'inc-horizontal' : 'inc-vertical'}`}>
          {/* Interval count and current interval name: */}
          <Typography variant="h4" color="textPrimary" className={isHorizontal ? 'interval-horizontal' : ''}>
            {isHorizontal && (
              <div className="interval-counter">
                <Typography variant="h4" color="textPrimary">
                  {`${activeIntervalIndex + 1}/${activeTimer.intervals.length}`}
                </Typography>
              </div>
            )}
            {activeInterval.name}
          </Typography>

          {/* Countdown timer (in vertical view): */}
          {!isHorizontal && (
            <div>
              <CountdownTimer play={play} setPlay={setPlay} remaining={remaining} />
            </div>
          )}

          {/* Controls - next, play/pause, previous: */}
          <div>
            <IconButton onClick={() => skip(-1)}>
              <SkipPreviousIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => setPlay(!play)}>
              {play ? <PauseIcon color="primary" /> : <PlayArrowIcon color="primary" />}
            </IconButton>
            <IconButton onClick={() => skip(+1)}>
              <SkipNextIcon color="primary" />
            </IconButton>
          </div>

          {/* Next interval name: */}
          <Typography variant="h4" color="textPrimary" className={isHorizontal ? 'interval-horizontal' : ''}>
            next: {nextInterval?.name || '---'}
          </Typography>
        </div>
      </div>
    </div>
  );
}

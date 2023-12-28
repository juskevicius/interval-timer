import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { produce } from 'immer';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import './styles/timerEditor.css';

export function TimerEditor({ setPage, timers, setTimers, activeTimerIndex }) {
  const bottomRef = useRef();
  const activeTimer = timers[activeTimerIndex];
  const checkedCount = activeTimer?.intervals.filter((interval) => interval.isChecked).length;

  useEffect(() => {
    return () =>
      setTimers((prevTimers) =>
        produce(prevTimers, (draftTimers) => {
          draftTimers[activeTimerIndex].intervals.forEach((interval) => delete interval.isChecked);
        })
      );
  }, []);

  const changeWorkoutName = (event) => {
    setTimers(
      produce(timers, (draftTimers) => {
        draftTimers[activeTimerIndex].name = event.target.value;
      })
    );
  };

  const changeIntervalSelection = (event, index) => {
    setTimers(
      produce(timers, (draftTimers) => {
        draftTimers[activeTimerIndex].intervals[index].isChecked = event.target.checked;
      })
    );
  };

  const changeIntervalName = (event, index) => {
    setTimers(
      produce(timers, (draftTimers) => {
        draftTimers[activeTimerIndex].intervals[index].name = event.target.value;
      })
    );
  };

  const changeIntervalDuration = (luxonDuration, index) => {
    setTimers(
      produce(timers, (draftTimers) => {
        const durationInSeconds = luxonDuration.minute * 60 + luxonDuration.second;
        draftTimers[activeTimerIndex].intervals[index].duration = durationInSeconds;
      })
    );
  };

  const scrollToBottom = () => {
    setTimeout(
      () =>
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        }),
      100
    );
  };

  const addNewInterval = () => {
    setTimers(
      produce(timers, (draftTimers) => {
        draftTimers[activeTimerIndex].intervals.push({});
      })
    );
    scrollToBottom();
  };

  const copyIntervals = () => {
    setTimers(
      produce(timers, (draftTimers) => {
        const intervalsToCopy = draftTimers[activeTimerIndex].intervals
          .filter((i) => i.isChecked)
          .map((i) => ({
            ...i,
            isChecked: false,
          }));
        draftTimers[activeTimerIndex].intervals.push(...intervalsToCopy);
      })
    );
    scrollToBottom();
  };

  const deleteIntervals = () => {
    setTimers(
      produce(timers, (draftTimers) => {
        draftTimers[activeTimerIndex].intervals = draftTimers[activeTimerIndex].intervals.filter(
          (interval) => !interval.isChecked
        );
      })
    );
  };

  return (
    <div className="timer-editor-container">
      <div className="workout-name">
        {/* Workout name and navigation buttons: */}
        <IconButton onClick={() => setPage('timers-list')}>
          <FormatListBulletedIcon color="primary" />
        </IconButton>
        <Input
          value={activeTimer?.name || ''}
          onChange={(event) => changeWorkoutName(event)}
          placeholder="workout name"
        />
        <IconButton onClick={() => setPage('timer-player')}>
          <PlayArrowIcon color="primary" />
        </IconButton>
      </div>

      {activeTimer?.intervals.map((interval, index) => (
        <div key={index} className="interval">
          {/* Interval checkbox, name and duration: */}
          <Checkbox
            checked={interval.isChecked || false}
            onChange={(event) => changeIntervalSelection(event, index)}
            size="large"
          />
          <Input
            value={interval.name || ''}
            onChange={(event) => changeIntervalName(event, index)}
            placeholder="exercise name"
          />
          <TimeField
            value={DateTime.fromMillis((interval.duration || 0) * 1000)}
            onChange={(newValue) => changeIntervalDuration(newValue, index)}
            label="duration"
            format="mm:ss"
          />
        </div>
      ))}

      <div ref={bottomRef} className="bottom-controls">
        {/* Add, copy and delete interval buttons: */}
        <IconButton onClick={addNewInterval}>
          <AddCircleIcon color="primary" />
        </IconButton>
        {checkedCount > 0 && (
          <IconButton onClick={copyIntervals}>
            <ContentCopyIcon color="primary" />
          </IconButton>
        )}
        {checkedCount > 0 && (
          <IconButton onClick={deleteIntervals}>
            <DeleteIcon color="primary" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

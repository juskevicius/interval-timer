import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import './styles/timerEditor.css';

export function TimerEditor({ setPage, timers, setTimers, activeTimer, setActiveTimer }) {
  const bottomRef = useRef();
  const checkedCount = activeTimer?.intervals.filter((interval) => interval.isChecked).length;

  useEffect(() => {
    return () => {
      setTimers(
        timers.map((timer) => {
          if (timer.id === activeTimer.id) {
            return {
              ...activeTimer,
              intervals: activeTimer.intervals.map((interval) => {
                const { isChecked, ...rest } = interval;
                return rest;
              }),
            };
          }
          return timer;
        })
      );
    };
  }, [activeTimer]);

  const changeWorkoutName = (event) => {
    setActiveTimer({
      ...activeTimer,
      name: event.target.value,
    });
  };

  const changeIntervalSelection = (event, index) => {
    setActiveTimer({
      ...activeTimer,
      intervals: activeTimer.intervals.map((interval, idx) => {
        if (idx === index) {
          interval.isChecked = event.target.checked;
        }
        return interval;
      }),
    });
  };

  const changeIntervalName = (event, index) => {
    setActiveTimer({
      ...activeTimer,
      intervals: activeTimer.intervals.map((interval, idx) => {
        if (idx === index) {
          interval.name = event.target.value;
        }
        return interval;
      }),
    });
  };

  const changeIntervalDuration = (luxonDuration, index) => {
    const durationInSeconds = luxonDuration.minute * 60 + luxonDuration.second;
    setActiveTimer({
      ...activeTimer,
      intervals: activeTimer.intervals.map((interval, idx) => {
        if (idx === index) {
          interval.duration = durationInSeconds;
        }
        return interval;
      }),
    });
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
    setActiveTimer({
      ...activeTimer,
      intervals: [...activeTimer.intervals, {}],
    });
    scrollToBottom();
  };

  const copyIntervals = () => {
    const intervalsToCopy = activeTimer.intervals
      .filter((i) => i.isChecked)
      .map((i) => ({
        ...i,
        isChecked: false,
      }));
    setActiveTimer({
      ...activeTimer,
      intervals: [...activeTimer.intervals, ...intervalsToCopy],
    });
    scrollToBottom();
  };

  const deleteIntervals = () => {
    setActiveTimer({
      ...activeTimer,
      intervals: activeTimer.intervals.filter((interval) => !interval.isChecked),
    });
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

      {activeTimer?.intervals.map(
        (interval, index) =>
          !interval.nonEditable && (
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
          )
      )}

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

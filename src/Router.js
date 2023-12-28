import { useState, useEffect } from 'react';
import { TimersList } from './pages/TimersList';
import { TimerEditor } from './pages/TimerEditor';
import { Welcome } from './pages/Welcome';
import { TimerPlayer } from './pages/TimerPlayer';

const findSavedTimers = () => {
  const localStorageItem = localStorage.getItem('timers');
  if (!localStorageItem) {
    return;
  }
  const timers = JSON.parse(localStorageItem);
  if (!timers.length) {
    return;
  }
  return timers;
};

const savedTimers = findSavedTimers();

export function Router() {
  const [page, setPage] = useState(savedTimers ? 'timers-list' : 'welcome');
  const [timers, setTimers] = useState(savedTimers || []);
  const [activeTimerIndex, setActiveTimerIndex] = useState(null);
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);
  return (
    <>
      {page === 'welcome' && <Welcome setPage={setPage} />}
      {page === 'timers-list' && (
        <TimersList setPage={setPage} timers={timers} setTimers={setTimers} setActiveTimerIndex={setActiveTimerIndex} />
      )}
      {page === 'timer-editor' && (
        <TimerEditor setPage={setPage} timers={timers} setTimers={setTimers} activeTimerIndex={activeTimerIndex} />
      )}
      {page === 'timer-player' && <TimerPlayer setPage={setPage} timers={timers} activeTimerIndex={activeTimerIndex} />}
    </>
  );
}

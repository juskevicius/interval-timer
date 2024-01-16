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
  const [activeTimer, setActiveTimer] = useState(null);
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);
  return (
    <>
      {page === 'welcome' && <Welcome setPage={setPage} />}
      {page === 'timers-list' && (
        <TimersList setPage={setPage} timers={timers} setTimers={setTimers} setActiveTimer={setActiveTimer} />
      )}
      {page === 'timer-editor' && (
        <TimerEditor
          setPage={setPage}
          timers={timers}
          setTimers={setTimers}
          activeTimer={activeTimer}
          setActiveTimer={setActiveTimer}
        />
      )}
      {page === 'timer-player' && <TimerPlayer setPage={setPage} timers={timers} activeTimer={activeTimer} />}
    </>
  );
}

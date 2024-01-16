import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import './styles/timersList.css';
import { calculateTotalDuration, sortByName } from './utils';

export function TimersList({ setPage, timers, setTimers, setActiveTimer }) {
  const useTimer = (timer) => {
    setActiveTimer(timer);
    setPage('timer-player');
  };

  const editTimer = (timer) => {
    setActiveTimer(timer);
    setPage('timer-editor');
  };

  const deleteTimer = (timerToDelete) => {
    setTimers(timers.filter((timer) => timer.id !== timerToDelete.id));
  };

  const addNewTimer = () => {
    const newTimer = {
      id: crypto.randomUUID(),
      name: '',
      intervals: [
        {
          name: 'Prepare',
          duration: 3,
          nonEditable: true
        },
      ],
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    setActiveTimer(newTimer);
    setPage('timer-editor');
  };

  return (
    <div className="timers-list-container">
      {[...timers].sort(sortByName).map((timer) => (
        <Card key={timer.id} variant="outlined">
          {/* Timer name and navigation to player button: */}
          <CardContent onClick={() => useTimer(timer)}>
            <Typography variant="body1" color="textPrimary">
              {timer.name}
            </Typography>
            <IconButton>
              <PlayArrowIcon color="primary" />
            </IconButton>
          </CardContent>

          {/* Timer total duration and edit/delete buttons: */}
          <CardActions>
            <Typography variant="body1" color="textPrimary">
              {calculateTotalDuration(timer.intervals)}
            </Typography>
            <span>
              <IconButton onClick={() => editTimer(timer)}>
                <EditIcon fontSize="large" color="primary" />
              </IconButton>
            </span>
            <IconButton onClick={() => deleteTimer(timer)}>
              <DeleteIcon fontSize="large" color="primary" />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      {/* Add new timer button: */}
      <div className="add-new-timer">
        <IconButton onClick={addNewTimer}>
          <AddCircleIcon color="primary" />
        </IconButton>
      </div>
    </div>
  );
}

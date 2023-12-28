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
import { calculateTotalDuration } from './utils';

export function TimersList({ setPage, timers, setTimers, setActiveTimerIndex }) {
  const useTimer = (index) => {
    setActiveTimerIndex(index);
    setPage('timer-player');
  };

  const editTimer = (index) => {
    setActiveTimerIndex(index);
    setPage('timer-editor');
  };

  const deleteTimer = (index) => {
    setTimers(timers.filter((_timer, idx) => index !== idx));
  };

  const addNewTimer = () => {
    const newTimer = {
      name: '',
      intervals: [{}],
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    setActiveTimerIndex(updatedTimers.length - 1);
    setPage('timer-editor');
  };

  return (
    <div className="timers-list-container">
      {timers.map((timer, index) => (
        <Card key={index} variant="outlined">
          {/* Timer name and navigation to player button: */}
          <CardContent onClick={() => useTimer(index)}>
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
              <IconButton onClick={() => editTimer(index)}>
                <EditIcon fontSize="large" color="primary" />
              </IconButton>
            </span>
            <IconButton onClick={() => deleteTimer(index)}>
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

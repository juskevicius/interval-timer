import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./styles/welcome.css";

export function Welcome({ setPage }) {
  return (
    <div className="welcome-container">
      <Typography variant="h1" color="textPrimary">
        timer51
      </Typography>
      <Button
        onClick={() => setPage("timers-list")}
        variant="contained"
        size="large"
      >
        <Typography variant="h5" color="textPrimary">
          begin
        </Typography>
      </Button>
    </div>
  );
}

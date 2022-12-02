import {makeStyles} from "@mui/styles";
import GameBoard from "./components/GameBoard";


const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a',
    }
})
function App() {

    const classes = useStyles();

  return (
    <div className={classes.container}>
      <GameBoard />
    </div>
  );
}

export default App;

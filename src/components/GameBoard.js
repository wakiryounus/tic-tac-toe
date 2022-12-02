import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import x from '../assets/x.png'
import o from '../assets/o.png'
import xs from '../assets/xs.png'
import os from '../assets/os.png'
import {useMediaQuery} from "@mui/material";

const useStyles = makeStyles({
    container: {
        width: p => p.boardSize,
        height: p => p.boardSize,
        background: '#1a1a1a',
        border: '6px solid #1a1a1a',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gridGap: '6px',
        '& .box': {
            background: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all .5s',
            '& img': {
                width: '60px'
            },
            '&:hover': {
                background: '#ccc'
            }
        },
    },
    '@keyframes rotateContainer': {
        '0%': {
            transform: 'rotate(0deg)',
            width: p => p.boardSize,
            height: p => p.boardSize,
        },
        "100%": {
            transform: 'rotate(360deg)',
            width: '0px',
            gridGap: '0px',
            height: '0px',
        }
    },
    '@keyframes rotateImage': {
        '0%': {
            transform: 'rotate(0deg)',
            width: '60px',
            height: '60px',
        },
        '50%': {
            display: 'none'
        },
        "100%": {
            transform: 'rotate(360deg)',
            width: '0px',
            height: '0px',
        }
    },
    animateContainer: {
        animation: '$rotateContainer 2s ease-in-out',
        '& .box': {
            '& img': {
                animation: '$rotateImage 2s ease-in-out',
            }
        },
    }
})

const boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Box = ({number, isGameOver, victorBoxes, clickedBoxes, isXTurn, setIsXTurn, setClickedBoxes}) => {

    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        let filteredBoxes = clickedBoxes.filter(b => b.number === number);
        if (filteredBoxes.length !== 0) {
            setIsClicked(true)
        } else {
            setIsClicked(false)
        }
    }, [clickedBoxes, number]);

    const onBoxClick = () => {
        if (!isGameOver) {
            let filteredBoxes = clickedBoxes.filter(b => b.number === number);
            if (filteredBoxes.length === 0) {
                setClickedBoxes([...clickedBoxes, {number, isXTurn}])
                setIsXTurn(prev => !prev)
            }
        }
    }

    const getDisplayValue = () => {
        if (isClicked) {
            let filteredBoxes = clickedBoxes.filter(b => b.number === number);
            if (filteredBoxes.length > 0) {
                return filteredBoxes[0].isXTurn ? 'X' : '0'
            }
            return ''
        }
        return ''
    }

    const getDisplayImage = () => {

        let xImage = x;
        let oImage = o;

        const filteredBoxes = victorBoxes.filter(boxes => boxes === number);

        if (filteredBoxes.length > 0) {
            xImage = xs;
            oImage = os;
        }

        return getDisplayValue() === 'X' ? <img src={xImage} alt={'X'}/> : getDisplayValue() === '0' ?
            <img src={oImage} alt={'o'}/> : '';
    }

    return (
        <div key={number} onClick={onBoxClick} className={'box'}
             style={{color: getDisplayValue() === 'X' ? 'red' : 'black'}}>
            {getDisplayImage()}
        </div>
    )
}

const winningBoxes = [
    [1, 2, 3],
    [3, 6, 9],
    [9, 8, 7],
    [7, 4, 1],
    [2, 5, 8],
    [4, 5, 6],
    [1, 5, 9],
    [3, 5, 7],
]
const GameBoard = () => {

    const [boardSize, setBoardSize] = useState('25vw');

    const is500pxBelow = useMediaQuery('(max-width:500px)');
    const is800pxBelow = useMediaQuery('(max-width:800px)');

    const classes = useStyles({boardSize});

    const [isXTurn, setIsXTurn] = useState(true);

    const [clickedBoxes, setClickedBoxes] = useState([]);

    const [isGameOver, setIsGameOver] = useState(false);

    const [victorBoxes, setVictorBoxes] = useState([]);


    useEffect(() => {
        if (is500pxBelow) {
            setBoardSize('80vw')
        } else if (is800pxBelow) {
            setBoardSize('70vw')
        } else {
            setBoardSize('25vw')
        }
    }, [is500pxBelow, is800pxBelow]);


    const isCompleted = useCallback(
        (checkedBoxes) => {
            let completed = false;
            winningBoxes.forEach(wBox => {
                if (!completed) {
                    completed = wBox.every(val => checkedBoxes.includes(val));
                    if (completed) {
                        setVictorBoxes(wBox);
                    }
                }
            })
            return completed;
        },
        [],
    );

    useEffect(() => {
        if (isGameOver) {
            setTimeout(() => {
                setClickedBoxes([]);
                setIsXTurn(true)
                setIsGameOver(false)
                setVictorBoxes([])
            }, 2000)
        }
    }, [isGameOver]);


    useEffect(() => {
        const xBoxes = clickedBoxes.filter(b => b.isXTurn).map(b => b.number);
        const oBoxes = clickedBoxes.filter(b => !b.isXTurn).map(b => b.number);

        if (xBoxes.length >= 3) {
            if (isCompleted(xBoxes)) {
                setIsGameOver(true)
            }
        }

        if (oBoxes.length >= 3) {
            if (isCompleted(oBoxes)) {
                setIsGameOver(true)
            }
        }

    }, [clickedBoxes, isCompleted]);


    return (
        <div className={`${classes.container} ${isGameOver && classes.animateContainer}`}>
            {
                boxes.map(number => (
                    <Box number={number} key={number}
                         setIsXTurn={setIsXTurn}
                         victorBoxes={victorBoxes}
                         clickedBoxes={clickedBoxes}
                         isXTurn={isXTurn} isGameOver={isGameOver}
                         setClickedBoxes={setClickedBoxes}/>
                ))
            }
        </div>
    );
};

export default GameBoard;
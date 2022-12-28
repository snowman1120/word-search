import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useStateContext } from 'contexts/ContextProvider';
import CAlert from 'layouts/CAlert';
import { getWords } from 'actions/play';

import $ from 'jquery';

import {drawLine, getPosElement, reverseString} from 'utils/helper';

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const letters = [];

const rowCount = 20;
const colCount = 35;

const spotWidth = 27;
const spotHeight = 27;

const lineWidth = 20;

let foundWords = [];

const putRandomLetters = () => {
    for(let i = 0; i < rowCount; i ++) {
        letters.push([]);
        for(let j = 0; j < colCount; j ++) {
            const letterIdx = Math.round(Math.random() * (alphabets.length - 1));
            letters[i].push(alphabets[letterIdx]);
        }
    }
}

putRandomLetters();

/**
 * Put words into letters
 */

const putWordsIntoLetters = (words) => {
    // direct - EA, SO, SE, NE
    const direct = ['EA', 'SO', 'SE', 'NE'];
    let track = [];
    const isConflict = (r, c, letter) => {
        const idx = track.findIndex(t => t.row === r && t.col === c);
        if(idx < 0) return false;
        if(track[idx].letter === letter) return false;
        return true;
    }
    words.forEach(word => {
        let conflict = false;
        do {
            const d = direct[Math.round(Math.random() * 3.4)];
            let row = 0, col = 0;
            if(d === 'EA') {
                row = Math.round(Math.random() * rowCount * 0.9);
                col = Math.round(Math.random() * (colCount - word.length));
            } else if(d === 'SO') {
                row = Math.round(Math.random() * (rowCount - word.length));
                col = Math.round(Math.random() * colCount * 0.9);
            } else if(d === 'SE') {
                row = Math.round(Math.random() * (rowCount - word.length));
                col = Math.round(Math.random() * (colCount - word.length));
            } else if(d === 'NE') {
                row = Math.round(Math.random() * (rowCount - word.length) + word.length - 1);
                col = Math.round(Math.random() * (colCount - word.length));
            }
    
            conflict = false;
            for(let i = 0; i < word.length; i ++) {
                conflict = isConflict(row, col, word[i]);
                if(conflict) break;
                try {
                    letters[row][col] = word[i];
                } catch(err) {
                    debugger
                }
                
                track.push({row, col, letter: word[i]});
                if(d === 'EA') {
                    col ++;
                } else if(d === 'SO') {
                    row ++;
                } else if(d === 'SE') {
                    row ++;
                    col ++;
                } else if(d === 'NE') {
                    row --;
                    col ++;
                }
            }
        } while (conflict);
    });
}

const Main = () => {
    const { isConnected, words, setWords, setMessage, isLoggedin } = useStateContext();

    let fromSpot = null;
    const setFromSpot = (spot) => fromSpot = spot;
    let downPos = null;

    let color = 'rgba(0, 0, 0, 0.3)';
    const setColor = (c) => color = c;
    
    const [lineList, setLineList] = useState([]);
    const [playing, setPlaying] = useState(false);
    
    function drawListLines() {
        const canvas = document.querySelector('#canvas');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // do your drawing stuff here
            lineList.forEach(line => drawLine(ctx, 
                [line.from.pos.x, line.from.pos.y], [line.to.pos.x, line.to.pos.y], line.color, lineWidth));
        }
    }

    const findFitSpot = (p) => {
        const spotEls = $('.letter-spot');
        for(let i = 0; i < spotEls.length; i ++) {
            const spotEl = spotEls[i];
            const spotPos = getPosElement(spotEl, 'center');
            if(Math.abs(spotPos.x - p.x - window.scrollX) <= (spotWidth / 2) && Math.abs(spotPos.y - p.y - window.scrollY) <= (spotHeight / 2)) 
                return {
                    row: spotEl.id.split('-')[1],
                    col: spotEl.id.split('-')[2],
                    pos: getPosElement(spotEl, 'center')
                }
        }
        return null;
    }

    const findWord = (from, to) => {
        from = {
            row: parseInt(from.row),
            col: parseInt(from.col)
        };
        to = {
            row: parseInt(to.row),
            col: parseInt(to.col)
        }
        const rowSign = from.row < to.row ? 1 : (
                        from.row === to.row ? 0 : -1
        );
        const colSign = from.col < to.col ? 1 : (
            from.col === to.col ? 0 : -1
        );
        let row = from.row;
        let col = from.col;
        let word = letters[row][col];
        while(row !== to.row || col !== to.col) {
            if(row >= rowCount || col >= colCount) {
                alert('Error'); 
                break;
            }
            row += 1 * rowSign;
            col += 1 * colSign;
            word += letters[row][col];
        }
        return word;
    }

    const setCanvas = () => {
        const canvas = document.querySelector('#canvas');
        const letterContainer = $('.letter-container')[0];
        canvas.width = window.innerWidth;
        if(letterContainer) {
            const rect = letterContainer.getBoundingClientRect();
            canvas.height = rect.height + rect.top + window.scrollY;
        } else {
            canvas.height = window.innerHeight * 2;
        }
    }

    const init = () => {
        const canvas = document.querySelector('#canvas');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');

            // resize the canvas to fill browser window dynamically
            window.addEventListener('resize', resizeScreen, false);

            window.addEventListener("keydown",function (e) {
                if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70) || (e.ctrlKey && e.keyCode === 71)) { 
                    e.preventDefault();
                    setMessage("Please don't press Ctrl + F. Disable the function.");
                }
            });
                    
            function resizeScreen() {
                setCanvas();                        
                const spotEls = $('.letter-spot');
                const t_lineList = lineList.map(line => {
                    line.from = {
                        row: parseInt(line.from.row),
                        col: parseInt(line.from.col),
                        pos: line.from.pos
                    };
                    line.to = {
                        row: parseInt(line.to.row),
                        col: parseInt(line.to.col),
                        pos: line.to.pos
                    };
                    line.from.pos = getPosElement(spotEls[line.from.row * colCount + line.from.col], 'center');
                    line.to.pos = getPosElement(spotEls[line.to.row * colCount + line.to.col], 'center');
                    return line;
                });
                setLineList(t_lineList);
                drawListLines(); 
            }
            
            resizeScreen();
                    
            window.addEventListener('mousedown', (e) => {
                setMessage(null);
                const fitSpot = findFitSpot({x: e.clientX, y: e.clientY});
                if(fitSpot) setFromSpot(fitSpot);

                downPos = {x: e.clientX + window.scrollX, y: e.clientY + window.scrollY};

                let r = 0, g = 0, b = 0;
                do {
                    r = Math.random() * 255;
                    g = Math.random() * 255;
                    b = Math.random() * 255;
                } while ((r + g + b) > 600 || (r + g + b) < 60);
                const c = `rgba(${r}, ${g}, ${b}, 0.8)`;
                setColor(c);
            });
            window.addEventListener('mousemove', (e) => {
                if(!downPos || !fromSpot) return;
                drawListLines();
                drawLine(ctx, [downPos.x, downPos.y], [e.clientX + window.scrollX, e.clientY + window.scrollY], color, lineWidth);
            });
            window.addEventListener('mouseup', (e) => {
                setMessage(null);
                if(!downPos || !fromSpot || !fromSpot.pos) return;
                const toSpot = findFitSpot({x: e.clientX, y: e.clientY});
                if(!toSpot || 
                    (fromSpot.pos.x === toSpot.pos.x && fromSpot.pos.y === toSpot.pos.y) ||
                    (fromSpot.row !== toSpot.row && fromSpot.col !== toSpot.col && (Math.abs(fromSpot.pos.x - toSpot.pos.x) !== Math.abs(fromSpot.pos.y - toSpot.pos.y)))
                ) {
                    drawListLines();
                    setFromSpot(null);
                    return;
                }
                downPos = null;
                
                const word = findWord({row: fromSpot.row, col: fromSpot.col}, {row: toSpot.row, col: toSpot.col});
                if(words.findIndex(w => w === word) >= 0 || words.findIndex(w => w === reverseString(word)) >= 0) {
                    foundWords.push(word);
                    $(`#word__${word}`).addClass('opacity-0');

                    let t_list = lineList;
                    t_list.push({
                        from: fromSpot, 
                        to: toSpot,
                        color: color
                    });
                    setLineList(t_list);
                }
                drawListLines(); 
                setFromSpot(null);
            });
        }
    }

    useEffect(() => {
        getWords(words => {
            putWordsIntoLetters(words);
            setWords(words);
        });
    }, []);

    useEffect(() => {
        init();
    }, [words]);

    useEffect(() => {
        setCanvas();
    }, [playing]);

    const onStart = (e) => {
        setPlaying(true);
    }

    return (
        <div className='main'>
            <CAlert />
            <canvas id="canvas"></canvas>
            <div className='text-center'>
                {
                    isConnected && isLoggedin ? (<Button variant="primary" className='btn-start' onClick={onStart}>START</Button>) : 
                    <Button variant="primary" className='btn-start' disabled onClick={onStart}>START</Button>
                }
            </div>
            
            <div className="letter-container">
            {
                playing ? 
                    letters.map((row, rowIdx) => {
                        const items = row.map((spot, colIdx) => <div key={`${rowIdx}_${colIdx}`} className="letter-spot" id={`spot-${rowIdx}-${colIdx}`}>{spot}</div>);
                        return <div key={`row_${rowIdx}`} className="letter-row">{items}</div>
                    }) : <h2 className='w-100 pt-lg-4 pb-lg-4 ps-lg-4 pe-lg-4'>Are you ready?</h2>
            }
            </div>

            <Container>
                <div className='word-container'>
                    <div className='row'>
                        {
                            words.map(word => <div key={`word__${word}`} className='col-3'><div className='word' id={`word__${word}`}>{word}</div></div>)
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Main;
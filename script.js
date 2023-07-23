const gameBoard = (() => {
    const cells = new Array(9).fill('');

    const storeMark = (index, mark) => cells[index] = mark;
    const returnCells = () => cells;
    const clearCells = () => cells.fill('');

    return { storeMark, returnCells, clearCells };
})();

const createPlayer = (name, mark, color) => {
    return { name, mark, color };
};

const firstPlayer = createPlayer('', '🞮', '#a8dacd');
const secondPlayer = createPlayer('', '🞉', '#eb68a0');

const scores = (() => {
    let firstPlayerScore = secondPlayerScore = numberOfTies = 0;

    const increaseFirstPlayerScore = () => firstPlayerScore += 1;
    const increaseSecondPlayerScore = () => secondPlayerScore += 1;
    const increaseNumberOfTies = () => numberOfTies += 1;
    const returnFirstPlayerScore = () => firstPlayerScore;
    const returnSecondPlayerScore = () => secondPlayerScore;
    const returnNumberOfTies = () => numberOfTies;
    const reset = () => firstPlayerScore = secondPlayerScore = numberOfTies = 0;

    return {
        increaseFirstPlayerScore,
        increaseSecondPlayerScore,
        increaseNumberOfTies,
        returnFirstPlayerScore,
        returnSecondPlayerScore,
        returnNumberOfTies,
        reset
    };
})();

const game = (() => {
    let currentMark = nextMark = color = '';

    const finish = () => {
        const cells = document.querySelectorAll('.game-board > .cell');

        cells.forEach(cell => { cell.classList.add('locked'); });
    };

    const refresh = () => {
        const cells = document.querySelectorAll('.game-board > .cell');
        const next = document.querySelector('.next-mark');

        cells.forEach(cell => {
            cell.removeAttribute('style');
            cell.textContent = '';
            cell.classList.remove('locked');
        });
        
        next.textContent = firstPlayer.mark;
        gameBoard.clearCells();

        currentMark = nextMark = color = '';
    };

    const reset = () => {
        const board = document.querySelector('.game-board');
        const next = document.querySelector('.next-mark');

        let cell = board.lastElementChild;
        while (cell) {
            board.removeChild(cell);
            cell = board.lastElementChild;
        }

        firstPlayer.name = secondPlayer.name = '';

        refresh();
        scores.reset();
        actions.goBack();
    };

    const chooseWinner = (mark) => {
        if (mark === firstPlayer.mark) return firstPlayer.name;
        if (mark === secondPlayer.mark) return secondPlayer.name;
    };

    const checkGameOver = (mark) => {
        const cells = gameBoard.returnCells();
        let winner = '';

        if (cells[0] !== '' && cells[0] === cells[1] && cells[1] === cells[2]) winner = chooseWinner(mark);
        if (cells[3] !== '' && cells[3] === cells[4] && cells[4] === cells[5]) winner = chooseWinner(mark);
        if (cells[6] !== '' && cells[6] === cells[7] && cells[7] === cells[8]) winner = chooseWinner(mark);
        if (cells[0] !== '' && cells[0] === cells[3] && cells[3] === cells[6]) winner = chooseWinner(mark);
        if (cells[1] !== '' && cells[1] === cells[4] && cells[4] === cells[7]) winner = chooseWinner(mark);
        if (cells[2] !== '' && cells[2] === cells[5] && cells[5] === cells[8]) winner = chooseWinner(mark);
        if (cells[0] !== '' && cells[0] === cells[4] && cells[4] === cells[8]) winner = chooseWinner(mark);
        if (cells[2] !== '' && cells[2] === cells[4] && cells[4] === cells[6]) winner = chooseWinner(mark);

        if (
            cells[0] !== '' && cells[1] !== '' && cells[2] !== '' &&
            cells[3] !== '' && cells[4] !== '' && cells[5] !== '' &&
            cells[6] !== '' && cells[7] !== '' && cells[8] !== ''
        ) winner = 'none';

        return winner;
    };

    const play = (event) => {
        const cell = event.target;
        const index = cell.id;

        if (currentMark !== firstPlayer.mark) {
            currentMark = firstPlayer.mark;
            color = firstPlayer.color;
            cell.style.color = color;
            cell.textContent = currentMark;
            nextMark = secondPlayer.mark;
        } else {
            currentMark = secondPlayer.mark;
            color = secondPlayer.color;
            cell.style.color = color;
            cell.textContent = currentMark;
            nextMark = firstPlayer.mark;
        }

        gameBoard.storeMark(index, currentMark);

        const winner = checkGameOver(currentMark);

        if (winner !== '') {
            finish();

            if (winner !== 'none') {
                actions.displayFinalResult(winner, currentMark, color);
                if (winner === firstPlayer.name) scores.increaseFirstPlayerScore();
                if (winner === secondPlayer.name) scores.increaseSecondPlayerScore();
            } else {
                actions.displayFinalResult(winner);
                scores.increaseNumberOfTies();
            }

            currentMark = nextMark = color = '';
        } else {
            const next = document.querySelector('.next-mark');

            next.textContent = nextMark;
        }
    };

    const start = () => {
        const firstPlayerName = document.querySelector('#first-player-name');
        const secondPlayerName = document.querySelector('#second-player-name');

        if (firstPlayerName.value !== '' && secondPlayerName.value !== '') {
            const playersForm = document.querySelector('.players');
            const gameDeck = document.querySelector('.deck');
            const gameBoard = document.querySelector('.game-board');
            const nextMark = document.querySelector('.next-mark');

            firstPlayer.name = firstPlayerName.value;
            secondPlayer.name = secondPlayerName.value;
            nextMark.textContent = firstPlayer.mark;

            for (let index = 0; index < 9; index++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = index;
                gameBoard.append(cell);
            }

            playersForm.classList.add('hidden');
            gameDeck.classList.remove('hidden');

            const refreshBtn = document.querySelector('.refresh-btn');
            const statsBtn = document.querySelector('.stats-btn');
            const backBtn = document.querySelector('.back-btn');
            const okBtn = document.querySelector('.stats-modal > button');
            const quitBtn = document.querySelector('.btns > .quit');
            const cells = document.querySelectorAll('.game-board > .cell');
    
            statsBtn.addEventListener('click', actions.displayStats);
            okBtn.addEventListener('click', actions.hideStats);
            quitBtn.addEventListener('click', actions.hideFinalResult);
            refreshBtn.addEventListener('click', refresh);
            backBtn.addEventListener('click', reset);
            cells.forEach(cell => cell.addEventListener('click', play));
        } else {
            if (firstPlayerName.value === '') {
                firstPlayerName.focus();
            } else {
                secondPlayerName.focus();
            }
        }
    };

    return { start };
})();

(() => {
    window.addEventListener('load', () => {
        const firstPlayerName = document.querySelector('#first-player-name');

        firstPlayerName.focus();
    });

    const startBtn = document.querySelector('.players > button');

    startBtn.addEventListener('click', game.start);
})();
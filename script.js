const gameBoard = (() => {
    const cells = ['', '', '', '', '', '', '', '', ''];

    storeMark = (index, mark) => cells[index] = mark;
    returnCells = () => cells;

    return { storeMark, returnCells };
})();

const createPlayer = (name, mark) => {
    return { name, mark };
};

const firstPlayer = createPlayer('Foo', '🞮');
const secondPlayer = createPlayer('Bar', '🞉');
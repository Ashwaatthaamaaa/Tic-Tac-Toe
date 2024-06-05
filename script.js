function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const markCell = (row, column, player) => {
        if (board[row][column] !== undefined && board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
            return 1;
        } else {
            return 0;
        }
    };

    return {
        getBoard,
        printBoard,
        markCell
    };
}

function Cell() {
    let Value = 0;

    const getValue = () => Value;

    const addToken = (player) => {
        Value = player;
    };

    return {
        getValue,
        addToken
    };
}

function GameController(display, PlayerOneName = "Player One", PlayerTwoName = "Player Two",roundCnt = 0) {
    let windisplay = document.querySelector('.display')
    let board = GameBoard();
    const players = [
        {
            name: PlayerOneName,
            token: 1,
            win: 0
        },
        {
            name: PlayerTwoName,
            token: 2,
            win: 0
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;


    const getRoundCount = () => roundCnt;

    const getWinCnt = () => [players[0].win,players[1].win];

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const winCheck = () => {
        let currBoard = board.getBoard();
        let size = currBoard.length;

        const allPositive = currBoard.every(row => row.every(cell => cell.getValue() > 0));
        if (allPositive) {
            return 3;
        }

        for (let row of currBoard) {
            const firstValue = row[0].getValue();
            if ((firstValue === 1 || firstValue === 2) && row.every(cell => cell.getValue() === firstValue)) {
                return true;
            }
        }

        for (let col = 0; col < size; col++) {
            const firstValue = currBoard[0][col].getValue();
            if (firstValue === 1 || firstValue === 2) {
                let allMatch = true;
                for (let row = 1; row < size; row++) {
                    if (currBoard[row][col].getValue() !== firstValue) {
                        allMatch = false;
                        break;
                    }
                }
                if (allMatch) {
                    return true;
                }
            }
        }

        const firstDiagonalValue = currBoard[0][0].getValue();
        if ((firstDiagonalValue === 1 || firstDiagonalValue === 2) && currBoard.every((row, idx) => row[idx].getValue() === firstDiagonalValue)) {
            return true;
        }

        const secondDiagonalValue = currBoard[0][size - 1].getValue();
        if ((secondDiagonalValue === 1 || secondDiagonalValue === 2) && currBoard.every((row, idx) => row[size - 1 - idx].getValue() === secondDiagonalValue)) {
            return true;
        }

        return false;
    };

    const playRound = (row, column) => {
        if (board.markCell(row, column, getActivePlayer().token) === 0) {
            console.log(`INVALID MOVE!!!`);
        } else {
            console.log(`marking ${getActivePlayer().name}'s move`);
            const winStatus = winCheck();
            if (winStatus === true) {
                getActivePlayer().win += 1;
                board.printBoard();
                console.log(`Winner is ${getActivePlayer().name} with ${getActivePlayer().win} wins`);
                if (getActivePlayer().win >= 3) {
                    windisplay.textContent = `Winner is ${getActivePlayer().name} with ${getActivePlayer().win} wins`;
                    console.log(`${getActivePlayer().name} has won the game!`);
                    return;
                }
                resetGame();
                return;
            } else if (winStatus === 3) {
                board.printBoard();
                windisplay.textContent ="TIE!!!!!!!";
                console.log(`TIE!!!`);
                resetGame();
                return;
            }
            switchPlayerTurn();
            printNewRound();
        }
    };

    const resetGame = () => {
        roundCnt+=1;
        board = GameBoard();
        activePlayer = players[0];
        windisplay.textContent =""
        console.log("The game has been reset.");
        printNewRound();
        console.log(roundCnt);
    };

    return {
        playRound,
        getActivePlayer,
        resetGame,
        getRoundCount,
        getWinCnt,
        getBoard: () => board.getBoard()
    };
}

function ScreenController(game, playerOne, playerTwo) {
    const boardContainer = document.querySelector('.board');
    const playerOneUpdate = document.querySelector('#playerOneName');
    const playerTwoUpdate = document.querySelector('#playerTwoName');
    const roundUpdate = document.querySelector('#roundNumber');
    const playerOneWin = document.querySelector("#playerOneScore");
    const playerTwoWin = document.querySelector("#playerTwoScore");

    const renderDisplay = (board) => {
        boardContainer.innerHTML = "";
        playerOneUpdate.textContent = playerOne;
        playerTwoUpdate.textContent = playerTwo;
        roundUpdate.textContent = game.getRoundCount();
        [playerOneWin.textContent, playerTwoWin.textContent]= game.getWinCnt();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("gameCards");
                cellElement.textContent = cell.getValue() === 0 ? "" : (cell.getValue() === 1 ? "X" : "O");

                cellElement.dataset.row = rowIndex;
                cellElement.dataset.column = colIndex;

                boardContainer.appendChild(cellElement);
            });
        });
    };

    const clickHandler = (e) => {
        const cellElement = e.target;
        if (!cellElement.classList.contains("gameCards")) return;
        const row = parseInt(cellElement.dataset.row);
        const column = parseInt(cellElement.dataset.column);
        game.playRound(row, column);
        renderDisplay(game.getBoard());
    };

    boardContainer.addEventListener("click", clickHandler);

    renderDisplay(game.getBoard());

    return {
        renderDisplay
    };
}

let startBtn = document.querySelector('.startBtn');
startBtn.addEventListener('click', () => {
    let playerOne = document.querySelector("#playerOne").value;
    let playerTwo = document.querySelector('#playerTwo').value;
    startBtn.textContent = startBtn.textContent === "START"? "RESET":"START";
    const game = GameController(ScreenController, playerOne, playerTwo);
    ScreenController(game, playerOne, playerTwo);
    
});

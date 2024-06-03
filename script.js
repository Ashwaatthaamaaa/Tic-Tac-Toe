function GameBoard() {
    // initialization
    const rows = 3;
    const columns = 3;
    const board = [];
    // constructing 2d array
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // methods

    // (1) getting the current board status
    const getBoard = () => board;

    // (2) printing the board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // (3) marking the cell
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


//defining cell function
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


//defining the flow of the game

function GameController(PlayerOneName = "Player One", PlayerTwoName = "Player Two") {
    let board = GameBoard();
    let display = gameDisplay(board);
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

    // methods

    // switching players turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // getting the active player
    const getActivePlayer = () => activePlayer;

    // new round
    const printNewRound = () => {
        board.printBoard();
        gameDisplay(board).renderDisplay();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    // winner check
    const winCheck = () => {
        let currBoard = board.getBoard();
        let size = currBoard.length;

        const allPositive = currBoard.every(row => row.every(cell => cell.getValue() > 0));
        if(allPositive){
            return 3;
        }
        // Check horizontal wins
        for (let row of currBoard) {
            const firstValue = row[0].getValue();
            if ((firstValue === 1 || firstValue === 2) && row.every(cell => cell.getValue() === firstValue)) {
                return true;
            }
        }

        // Check vertical wins
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

        // Check top-left to bottom-right diagonal
        const firstDiagonalValue = currBoard[0][0].getValue();
        if ((firstDiagonalValue === 1 || firstDiagonalValue === 2) && currBoard.every((row, idx) => row[idx].getValue() === firstDiagonalValue)) {
            return true;
        }

        // Check top-right to bottom-left diagonal
        const secondDiagonalValue = currBoard[0][size - 1].getValue();
        if ((secondDiagonalValue === 1 || secondDiagonalValue === 2) && currBoard.every((row, idx) => row[size - 1 - idx].getValue() === secondDiagonalValue)) {
            return true;
        }

        return false;
    };

    // playing one round
    const playRound = (row, column) => {

    
        if (board.markCell(row, column, getActivePlayer().token) === 0) {
            console.log(`INVALID MOVE!!!`);
        } else {
            console.log(`marking ${getActivePlayer().name}'s`);
            if (winCheck() === true) {
                getActivePlayer().win += 1;
                display.renderDisplay(board);
                board.printBoard();
                console.log(`Winner is ${getActivePlayer().name} with ${getActivePlayer().win} wins`);
                if (getActivePlayer().win >= 3) {
                    console.log(`${getActivePlayer().name} has won the game!`);
                    return;
                }
                resetGame();
                return;
            }
            else if(winCheck() === 3){
                display.renderDisplay();
                board.printBoard();
                console.log(`TIE!!!`);
                resetGame();
                return;
            }
            switchPlayerTurn();
            printNewRound();
        }
    };
    // resetting the game
    const resetGame = () => {
        board = GameBoard(); // Reinitialize the game board
        activePlayer = players[0]; // Reset to Player One
        console.log("The game has been reset.");
        printNewRound(); // Print the initial state of the new game
    };

    return {
        playRound,
        getActivePlayer
    };
}


function gameDisplay(board){
    board = board.getBoard()
    const renderDisplay = () => {
        let boardContainer = document.querySelector('.board');
        boardContainer.innerHTML = "";

        board.forEach((row, rowIndex) => {

            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("gameCards");
                cellElement.textContent = cell.getValue(); // Fill with cell value
                boardContainer.appendChild(cellElement);
            });

        });
    }


    return{
        renderDisplay
    };
}








const game = GameController();

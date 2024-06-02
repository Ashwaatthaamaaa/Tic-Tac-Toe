function Gameboard(){
    //initialization
    const rows = 3;
    const columns =3;
    const board = [];

    //constructing 2d array

    for(let i=0;i<rows;i++){
        board[i]=[];
        for(let j = 0;j < columns;j++){
            board[i].push(Cell());
        }
    }

    //methods

    //(1) getting the current board status
    const getBoard = () => board;


    //(2)printing the board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues); 
    }


    //(3)marking the cell
    const markCell = (row,column,player) => {

        if (board[row][column] != undefined && board[row][column].getValue() == 0){
            board[row][column].addToken(player);
            return 1;
        }else{
            return 0;
        }

    }

    return{
        getBoard,
        printBoard,
        markCell
    };

}


function Cell(){
    let Value = 0;

    let getValue = () => {
        return Value;
    }


    let addToken = (player) => {
        Value = player;
    }

    return{
        getValue,
        addToken
    };
}
    
function GameController (
    PlayerOneName = "Player One",
    PlayerTwoName = "Player Two"
){

    const board = Gameboard();

    const players = [
        {
            name: PlayerOneName,
            token: 1
        },
        {
            name: PlayerTwoName,
            token:2
        }
    ];


    let activePlayer = players[0];


    //methods

    //switching players turn

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    }


    //getting the active player

    const getActivePlayer = () => activePlayer;

    //new round

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    //playing one round

    const playRound = (row,column) =>{
        if (board.markCell(row,column,getActivePlayer().token) == 0){
            console.log(`INVALID MOVE!!!`)
        }
        else{
            console.log(`marking   ${getActivePlayer().name}'s `)
            switchPlayerTurn();
            printNewRound();
        }

    }


    printNewRound();

    return{
        playRound,
        getActivePlayer
    };
}


const game = GameController();
const chessBoard = document.querySelector('.chess-board');
const BOARD_SIZE = 8;
const GREEN = 'rgb(118, 150, 86)';
const BROWN = 'rgb(194, 194, 33)';
const EMPTY_BOARD = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];

class Game{
    constructor(board){
        this.board = board;
    }

    startGame(){
        setBoardColor(this.board);
        setBoardPieces(this.board);
    }
}

const game = new Game(EMPTY_BOARD);

class DOT{
    constructor(){
        /** DOT config */
        this.DOM = document.createElement('div');
        this.DOM.className = 'DOT';
        this.DOM.style.height = '100%';
        this.DOM.style.zIndex = '-1';
        this.DOM.style.aspectRatio = '1';
        this.DOM.style.borderRadius = '40%';


        const innerDOM = document.createElement('div');
        innerDOM.style.position = 'absolute';
        innerDOM.style.height = '30px';
        innerDOM.style.aspectRatio = '1';
        innerDOM.style.opacity = '1';
        innerDOM.style.backgroundColor =  'rgb(255, 255, 255, 0.4)';
        innerDOM.style.boxShadow =  '0px 0px 25px 0px rgb(0, 0, 0, 0.5)';
        innerDOM.style.borderRadius = '50%';
        innerDOM.style.marginTop = '23px';
        innerDOM.style.marginLeft = '24px';
        innerDOM.style.cursor ='pointer';

        this.DOM.appendChild(innerDOM);
        /**     */
    }
}

class Piece{
    constructor(name, color, squareIDX){
        this.name = name;
        this.color = color;
        this.squareIDX = squareIDX;
        this.imageURL = './assets/' + name + color + '.png';
        this.DOMelement = null;

        this.DOTed = false; 
        this.moved = false; // for pawn
        this.castled = false; // for king
    }

    create(){
        if (this.name === null) return;
        this.DOMelement = document.createElement('img');
        this.DOMelement.classList.add('piece');
        this.DOMelement.id = this.color;
        this.DOMelement.src = this.imageURL;
        chessBoard.children[this.squareIDX].appendChild(this.DOMelement);
        this.DOMelement.addEventListener('click', selectPiece(this, game.board));
    }

    destroy(){
        if (this.name === null) return;
        chessBoard.children[this.squareIDX].removeChild(this.DOMelement);
    }

    move(nextSquareIDX){
        if (this.name === null) return;
        let coord = convertIDX(this.squareIDX);
        removeDOTS();
        this.destroy();

        if (game.board[nextSquareIDX.x][nextSquareIDX.y] instanceof Piece ){
            game.board[nextSquareIDX.x][nextSquareIDX.y].DOMelement.classList.remove('piece');
            game.board[nextSquareIDX.x][nextSquareIDX.y].DOMelement.classList.add('score-icon');
            score[game.board[coord.x][coord.y].color].appendChild(game.board[nextSquareIDX.x][nextSquareIDX.y].DOMelement);

            if (game.board[nextSquareIDX.x][nextSquareIDX.y].name === "king"){
                gameOver(this.color);
            }
        }


        game.board[coord.x][coord.y] = null;
        this.squareIDX = nextSquareIDX.x*BOARD_SIZE + nextSquareIDX.y;
        game.board[nextSquareIDX.x][nextSquareIDX.y] = this;
        this.moved = true;
        clearSquare(chessBoard.children[this.squareIDX]);
        this.create();
    }

    pattern() {
        let coord = convertIDX(this.squareIDX);
        let arr = [];
        let idx, jdx;
        switch(this.name){ // Patterns for each piece in chess 
            case 'pawn':
                if (this.color === 'W'){
                    if (!this.moved){
                        arr.push({x: coord.x - 1, y: coord.y});
                        arr.push({x: coord.x - 2, y: coord.y});
                    } else {
                        arr.push({x: coord.x - 1, y: coord.y});
                    }

                    arr.forEach( (coord, index) => { // checking if it's blocked by another piece or square not available
                        if (isInBoard(coord)){
                            if (game.board[coord.x][coord.y] instanceof Piece){
                                arr.splice(index, arr.length - index);
                            }
                        } else {
                            arr.splice(index, 1);
                        }
                    });

                    if (isInBoard({x: coord.x - 1, y: coord.y + 1}) && 
                        game.board[coord.x - 1][coord.y + 1] instanceof Piece && 
                        game.board[coord.x - 1][coord.y + 1].color === 'B'){
                        arr.push({x: coord.x - 1, y: coord.y + 1});
                    }

                    if(isInBoard({x: coord.x - 1, y: coord.y - 1}) && 
                        game.board[coord.x - 1][coord.y - 1] instanceof Piece && 
                        game.board[coord.x - 1][coord.y - 1].color === 'B'){

                        arr.push({x: coord.x - 1, y: coord.y - 1});
                    }

                } else {
                    if (!this.moved){
                        arr.push({x: coord.x + 1, y: coord.y});
                        arr.push({x: coord.x + 2, y: coord.y});
                    } else {
                        arr.push({x: coord.x + 1, y: coord.y});
                    }

                    arr.forEach( (coord, index) => { // checking if it's blocked by another piece
                        if (isInBoard(coord)){
                            if (game.board[coord.x][coord.y] instanceof Piece){
                                arr.splice(index, arr.length - index);
                            }
                        } else {
                            arr.splice(index, 1);
                        }
                    });

                    if (isInBoard({x: coord.x + 1, y: coord.y + 1}) && 
                            game.board[coord.x + 1][coord.y + 1] instanceof Piece && 
                            game.board[coord.x + 1][coord.y + 1].color === 'W'){

                        arr.push({x: coord.x + 1, y: coord.y + 1});
                    }

                    if(isInBoard({x: coord.x + 1, y: coord.y - 1}) && 
                            game.board[coord.x + 1][coord.y - 1] instanceof Piece && 
                            game.board[coord.x + 1][coord.y - 1].color === 'W'){

                        arr.push({x: coord.x + 1, y: coord.y - 1});
                    }
                }

                return arr;
            case 'knight':
                arr.push(
                    {x: coord.x - 2, y: coord.y - 1}, 
                    {x: coord.x - 2, y: coord.y + 1}, 
                    {x: coord.x - 1, y: coord.y + 2}, 
                    {x: coord.x - 1, y: coord.y - 2}, 
                    {x: coord.x + 2, y: coord.y - 1}, 
                    {x: coord.x + 2, y: coord.y + 1}, 
                    {x: coord.x + 1, y: coord.y - 2}, 
                    {x: coord.x + 1, y: coord.y + 2});
                
                let i = 0;
                while ( i < arr.length){ // checking if it's blocked by another piece or square not available
                    if (!isInBoard(arr[i])) {
                        arr.splice(i, 1);
                        i = 0;
                    } else if (game.board[arr[i].x][arr[i].y] instanceof Piece && game.board[arr[i].x][arr[i].y].color === this.color){
                        arr.splice(i, 1);
                        i = 0;
                    }
                    i++;
                }
                
                i = 0;
                while ( i < arr.length){ // checking twice because of a bug ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
                    if (!isInBoard(arr[i])) {
                        arr.splice(i, 1);
                        i = 0;
                    } else if (game.board[arr[i].x][arr[i].y] instanceof Piece && game.board[arr[i].x][arr[i].y].color === this.color){
                        arr.splice(i, 1);
                        i = 0;
                    }
                    i++;
                }

                return arr;
            case 'bishop':
                idx = coord.x - 1;
                jdx = coord.y - 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                    jdx--;
                }

                idx = coord.x + 1;
                jdx = coord.y + 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                    jdx++;
                }

                idx = coord.x - 1;
                jdx = coord.y + 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                    jdx++;
                }

                idx = coord.x + 1;
                jdx = coord.y - 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                    jdx--;
                }

                idx = 0;
                while ( idx < arr.length){
                    if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }

                while ( idx < arr.length){ // checking twice because of a bug ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
                     if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }

                return arr;
            case 'rook':
                idx = coord.x - 1;
                jdx = coord.y;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                }

                idx = coord.x + 1;
                jdx = coord.y;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                }

                jdx = coord.y - 1;
                idx = coord.x;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    jdx--;
                }

                jdx = coord.y + 1;
                idx = coord.x;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    jdx++;
                }

                idx = 0;
                while ( idx < arr.length){
                    if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }

                while ( idx < arr.length){ // checking twice because of a bug ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
                     if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }
                return arr;
            case 'queen':
                idx = coord.x - 1;
                jdx = coord.y - 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                    jdx--;
                }

                idx = coord.x + 1;
                jdx = coord.y + 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                    jdx++;
                }

                idx = coord.x - 1;
                jdx = coord.y + 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                    jdx++;
                }

                idx = coord.x + 1;
                jdx = coord.y - 1;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                    jdx--;
                }

                idx = coord.x - 1;
                jdx = coord.y;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx--;
                }

                idx = coord.x + 1;
                jdx = coord.y;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    idx++;
                }

                jdx = coord.y - 1;
                idx = coord.x;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    jdx--;
                }

                jdx = coord.y + 1;
                idx = coord.x;

                while (isInBoard({x: idx, y:jdx})){
                    if (game.board[idx][jdx] && game.board[idx][jdx] instanceof Piece) {
                        if (game.board[idx][jdx].color !== this.color){
                            arr.push({x: idx, y: jdx});
                            break;
                        } else {
                            break;
                        }
                    }
                    arr.push({x: idx, y: jdx});
                    jdx++;
                }

                idx = 0;
                while ( idx < arr.length){
                    if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }

                while ( idx < arr.length){ // checking twice because of a bug ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
                     if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }
                return arr;
            case 'king':
                arr.push(
                    {x: coord.x - 1, y: coord.y - 1}, 
                    {x: coord.x, y: coord.y + 1}, 
                    {x: coord.x, y: coord.y - 1}, 
                    {x: coord.x + 1, y: coord.y + 1}, 
                    {x: coord.x + 1, y: coord.y}, 
                    {x: coord.x - 1, y: coord.y},
                    {x: coord.x - 1, y: coord.y + 1}, 
                    {x: coord.x + 1, y: coord.y - 1}
                    );
                
                idx = 0;
                while ( idx < arr.length){ // checking if it's blocked by another piece or square not available
                    if (!isInBoard(arr[idx])) {
                        arr.splice(idx, 1);
                        idx = 0;
                    } else if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }
                
                idx = 0;
                while ( idx < arr.length){ // checking twice because of a bug ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
                    if (!isInBoard(arr[idx])) {
                        arr.splice(idx, 1);
                        idx = 0;
                    } else if (game.board[arr[idx].x][arr[idx].y] instanceof Piece && game.board[arr[idx].x][arr[idx].y].color === this.color){
                        arr.splice(idx, 1);
                        idx = 0;
                    }
                    idx++;
                }

                return arr;
            default:
                return arr;
            }
    }
}

function isInBoard(coord){
    return coord.x < BOARD_SIZE && coord.x >= 0 && coord.y < BOARD_SIZE && coord.y >= 0;
}

function clearSquare(square){
    square.innerHTML = "";
}

function convertIDX(IDX, acc = 0){
    if (IDX >= BOARD_SIZE){
        return convertIDX(IDX - BOARD_SIZE, acc + 1)
    } else {
        return {x: acc, y: IDX};
    }
}

function createDOTS(arr = []){
    if (arr.length !== 0 ){
        arr.forEach( (position) => {
            let currentSquare =  chessBoard.children[position.x*BOARD_SIZE + position.y];
            let newDOT = new DOT();

            if (game.board[position.x][position.y] instanceof Piece){
                newDOT.DOM.style.backgroundColor = 'red';
                newDOT.DOM.style.opacity = '.3';
                newDOT.DOM.style.boxShadow =  '0px 0px 35px 0px rgb(0, 0, 0, 0.8)';

            }

            currentSquare.appendChild(newDOT.DOM);
            newDOT.DOM.addEventListener('click', () => {
                selectedPiece.move({x: position.x, y: position.y});
            });

            if ( currentSquare.firstChild.className === 'DOT'){
                gsap.to(currentSquare.firstChild.style, .2, {
                    opacity : 1
                });
            }

            if (game.board[position.x][position.y] instanceof Piece){
                game.board[position.x][position.y].DOTed = true;
            }
        });
    }
    
}

function removeDOTS(){
    game.board.forEach( (row, rowIndex) => {
        row.forEach( (piece, index) => {
            let currentSquare = chessBoard.children[rowIndex*BOARD_SIZE + index];
            if (piece === null){
                clearSquare(currentSquare);
            } else if (piece.DOTed){
                clearSquare(currentSquare);
                piece.create();
                piece.DOTed = false;
            }
        });
    });
}

let selectedPiece = new Piece(null, null, null); // null piece

function deselectPieces(board){
    board.forEach( (row, rowIndex) => {
        row.forEach( (piece, index) => {
            if (piece !== null && !(piece instanceof DOT)){
                piece.DOMelement.classList.remove('isSelected');
            }
        });
    });
    removeDOTS();
}

function selectPiece(piece, board){
    return () => {
        if (piece.DOMelement.classList[1] === 'isSelected'){ // deselection
            piece.DOMelement.classList.remove('isSelected');
            removeDOTS();
        } else {
            deselectPieces(board);
            piece.DOMelement.classList.add('isSelected');
            selectedPiece = piece;
            let arrDOT = selectedPiece.pattern();
            createDOTS(arrDOT);
        }
    }
}

function setBoardColor(){
    for (let idx = 0; idx < BOARD_SIZE; idx++){
        for(let jdx = 0; jdx < BOARD_SIZE; jdx++){
            let currentSquare = chessBoard.children[idx*BOARD_SIZE + jdx]
            if( idx % 2 === 0){
                if ( jdx % 2 === 0) {
                    currentSquare.style.backgroundColor = BROWN;
                } else {
                    currentSquare.style.backgroundColor = GREEN; 
                }
            } else{
                if ( jdx % 2 === 0) {
                    currentSquare.style.backgroundColor = GREEN; 
                } else {
                    currentSquare.style.backgroundColor = BROWN;         
                }
            }
            
        } 
    }
}

function setBoardPieces(board){
    board.forEach( (row, rowIndex) => {
        row.forEach((square, index) => {
            if (rowIndex === 1){
                board[rowIndex][index] = new Piece('pawn', 'B', rowIndex * 8 + index);
            }

            if (rowIndex === 6){
                board[rowIndex][index] = new Piece('pawn', 'W', rowIndex * 8 + index);
            }

            if (rowIndex === 0){
                switch(index){
                    case 0: case 7:
                        board[rowIndex][index] = new Piece('rook', 'B', rowIndex * 8 + index);
                        break;
                    case 1: case 6:
                        board[rowIndex][index] = new Piece('knight', 'B', rowIndex * 8 + index);
                        break;
                    case 2: case 5:
                        board[rowIndex][index] = new Piece('bishop', 'B', rowIndex * 8 + index);
                        break;
                    case 3:
                        board[rowIndex][index] = new Piece('king', 'B', rowIndex * 8 + index);
                        break;
                    case 4:
                        board[rowIndex][index] = new Piece('queen', 'B', rowIndex * 8 + index);
                        break;
                    default:
                        break;
                }
            } 
            
            if (rowIndex === 7){
                switch(index){
                    case 0: case 7:
                        board[rowIndex][index] = new Piece('rook', 'W', rowIndex * 8 + index);
                        break;
                    case 1: case 6:
                        board[rowIndex][index] = new Piece('knight', 'W', rowIndex * 8 + index);
                        break;
                    case 2: case 5:
                        board[rowIndex][index] = new Piece('bishop', 'W', rowIndex * 8 + index);
                        break;
                    case 3:
                        board[rowIndex][index] = new Piece('king', 'W', rowIndex * 8 + index);
                        break;
                    case 4:
                        board[rowIndex][index] = new Piece('queen', 'W', rowIndex * 8 + index);
                        break;
                    default:
                        break;
                }
            }
        });
    });

    board.forEach( row => {
        row.forEach( piece => {
            if (piece !== null ){
                piece.create();
            }
        });
    });
}

function gameOver(winnerColor){
    UI_screen.classList.remove('isNotActive');

    setTimeout( () => {
        document.querySelector('.gameOverText').classList.add('show');
    }, 300);

    setTimeout( () => {
        document.querySelector('.gameOverText').classList.remove('show');
    }, 1500);

    setTimeout( () => {
        document.querySelector('.resultsText').classList.add('show');
    }, 2500);

    setTimeout( () => {
        document.querySelector('.resultsText').classList.add('show');
        document.querySelector('.right-zone-B').classList.add('isOver');
        document.querySelector('.right-zone-W').classList.add('isOver');
        document.querySelector('.piece#B.results').classList.add('show');
        document.querySelector('.piece#W.results').classList.add('show');
    }, 3000);

    setTimeout( () => {
        document.querySelector('.winner'+ winnerColor).classList.add('show');
        document.querySelector('.end-game').classList.add('show');
    }, 4000);
}


game.startGame();










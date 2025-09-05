//Globar variables
var default_size = 20;
var small_size = 10;
var big_size = 40;
var currentSize = default_size; // default starting size

var FIELD_SIZE_X; //rows
var FIELD_SIZE_Y; //columns
var SNAKE_SPEED = 300; //snake movement interval
var snake = []; //snake itself
var direction = 'y+'; //direction of snake movement
var gameIsRunning = false; //Is game started?
var snake_timer; //snake timer
var food_timer; //food timer
var score = 0; //result

function init() {
    prepareGameField(currentSize); //field generation

    var wrap = document.getElementsByClassName('wrap')[0];

    wrap.style.width = '400px';
    //Start and New Game buttons events
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);

    document.getElementById('big-map').addEventListener('click', function() {
        prepareGameField(big_size);
        wrap.style.width = '800px';
        currentSize = big_size;
    });
    document.getElementById('small-map').addEventListener('click', function() {
        prepareGameField(small_size);
        wrap.style.width = '400px';
        currentSize = small_size;
    });
    document.getElementById('default').addEventListener('click', function() {
        prepareGameField(default_size);
        wrap.style.width = '400px';
        currentSize = default_size;
    });

    //Keys tracking
    addEventListener('keydown', changeDirection);
}

/*
Field generation function
*/
function prepareGameField(size) {
    // Remove existing game table if it exists
    var oldTable = document.querySelector('.game-table');
    if (oldTable) {
        oldTable.remove(); // Remove old table
    }

    FIELD_SIZE_X = size;
    FIELD_SIZE_Y = size;

    //table creation
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    //gaming table cells generation
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        //row generation
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            //cell creation
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;

            row.appendChild(cell); //cell addition
        }
        game_table.appendChild(row); //row addition
    }

    document.getElementById('snake-field').appendChild(game_table); //table addition
}

/*
Game Start
*/
function startGame() {
    gameIsRunning = true;
    respawn(); //snake creation

    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 5000);
}

/*
Snake location on a game field function
*/
function respawn() {
    //snake - array of td
    //starting lenght of a snake = 2

    //snake respawn from the center
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    //snake's head
    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    //snake's body
    var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y - 1) + '-' + start_coord_x)[0];
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    snake.push(snake_head);
    snake.push(snake_tail);
}

/*
Snake movement
*/
function move() {
    // console.log('move', direction);
    //classes compilation
    var snake_head_classes = snake[snake.length - 1].getAttribute('class').split(' ');

    //head move
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    //new point calculation
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
    }
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
    }
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
    }
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
    }

    //Checks
    // 1) new_unit not part of a snake
    // 2) snake didn't cross borders of a field
    //console.log(new_unit);
    if (!isSnakeUnit(new_unit) && new_unit !== undefined) {
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        //check if a tail should be moved
        if(!haveFood(new_unit)) {
            //find tail
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');

            //remove tail
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    }
    else {
        finishTheGame();
    }
}

/*
check for snake
@param unit
@returns {boolean}
*/
function isSnakeUnit(unit) {
    var check = false;

    if (snake.includes(unit)) {
        check = true;
    }
    return check;
}

/*
check for food
@param unit
@returns {boolean}
*/

function haveFood(unit) {
    var check = false;

    var unit_classes = unit.getAttribute('class').split(' ');

    //if food
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();

        // score++;
        updateSnakeSpeed();
        if (score >= 3 && score <=6 ) {
            changeFieldColor('darkblue');
        }
        else if (score >= 7 && score <=10 ) {
            changeFieldColor('darkgreen');
        }
        else if (score >= 11) {
            changeFieldColor('darkpink');
        }
    }
    return check;
}

/*
Food creation
*/
function createFood() {
    var foodCreated = false;

    while (!foodCreated) {
        //random
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        //check for a snake
        if (!food_cell_classes.includes('snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }

            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}

/*
cheange of snake direction
@param e - event
*/
function changeDirection(e) {
    console.log(e);
    switch (e.keyCode) {
        case 37: //left key
            if(direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: //up key
            if(direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: //right key
            if(direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: //down key
            if(direction != 'y+') {
                direction = 'y-'
            }
            break;
    }
}

/*
End Game function
*/
function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('You lost! Your score: ' + score.toString());
}

/*
New Game
*/
function refreshGame() {
    location.reload();
}

//Initialization
window.onload = init;


//Speed increase
function updateSnakeSpeed() {
    score ++;

    //Double the speed every 5 food pieces
    if (score % 3 == 0) {

        SNAKE_SPEED = SNAKE_SPEED / 2;

        // Clear the old interval
        clearInterval(snake_timer);

        // Set a new interval
        snake_timer = setInterval(move, SNAKE_SPEED);
    }
}
//Color change of the field
function changeFieldColor(color) {

    document.querySelectorAll('.game-table').forEach(function(unit) {
        unit.style.backgroundColor = color;
    });
}
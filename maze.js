var ctxs, wid, hei, cols, rows, mazes, stacks = [];
const quadSteps=[{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
const octSteps=[{dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}, {dx: 1, dy: 0}, {dx: 1, dy: 1}, {dx: 0, dy: 1}, {dx: -1, dy: 1}, {dx: -1, dy: 0}];
var start = [{x:-1, y:-1}, {x:-1, y:-1}], end = [{x:-1, y:-1}, {x:-1, y:-1}];
const grid = 8, padding = 16, count = 2;
var s, density = 0.5;

// Constants for cell types
const CELL_TYPES = {
    WALL: 0,
    PATH: 1,
    CURRENT: 2,
    SOLUTION: 3,
    VISITED: 4,
    TARGET: 8,
    START: 9
};

// Color mapping for different cell types
function getCellColor(cellType) {
    switch(cellType) {
        case CELL_TYPES.WALL: return "black";
        case CELL_TYPES.PATH: return "gray";
        case CELL_TYPES.CURRENT: return "red";
        case CELL_TYPES.SOLUTION: return "yellow";
        case CELL_TYPES.VISITED: return "#500000";
        case CELL_TYPES.TARGET: return "blue";
        case CELL_TYPES.START: return "gold";
        default: return "gray";
    }
}

// Calculate Euclidean distance between two points
function calculateDistance(x1, y1, x2, y2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

// Check if position is within maze bounds
function isValidPosition(x, y) {
    return x >= 0 && x < cols && y >= 0 && y < rows;
}

// Handle maze completion - converts path cells to solution cells
function handleMazeCompletion(index) {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            if( mazes[index][i][j] === CELL_TYPES.CURRENT ) {
                mazes[index][i][j] = CELL_TYPES.SOLUTION;
            }
        }
    }
    drawMaze(index);
}

function drawMaze(index) {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            ctxs[index].fillStyle = getCellColor(mazes[index][i][j]);
            ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

function drawBlock(ctx, sx, sy, a) {
    ctx.fillStyle = getCellColor(a);
    ctx.fillRect( grid * sx, grid * sy, grid, grid  );
}

function getNextStepForMaze1( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < quadSteps.length; i++) {
        const step = quadSteps[i];
        
        if(sx + step.dx > 0 && sx + step.dx < cols - 1 && sy + step.dy > 0 && sy + step.dy < rows - 1 &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});

            break;
        }
    }
    return n;
}

function getOptimizedNextStepForMaze1(index, sx, sy, a) {
    var n = [];
    var min = cols > rows ? cols : rows;
    min =  2 * min * min;
    var pos = -1;

    for (let i = 0; i < quadSteps.length; i ++) {
        const step = quadSteps[i];
        const newX = sx + step.dx;
        const newY = sy + step.dy;

        if(isValidPosition(newX, newY) && mazes[index][newX][newY] % 8 == a){
            var distance = calculateDistance(newX, newY, end[index].x, end[index].y);
    
            if (distance < min) {
                pos = i;
                min = distance;
            }
        }
    }

    if (pos > -1) {
        n.push({x: sx + quadSteps[pos].dx, y: sy + quadSteps[pos].dy});
    }

    return n; 
}

function getNextStepForMaze2( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < octSteps.length; i++) {
        const step = octSteps[i];
        
        if(sx + step.dx > -1 && sx + step.dx < cols && sy + step.dy > -1 && sy + step.dy < rows &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});

            break;
        }
    }
    return n;
}

function getOptimizedNextStepForMaze2(index, sx, sy, a) {
    var n = [];
    var min = cols > rows ? cols : rows;
    min = 2 * min * min;
    var pos = -1;

    for (let i = 0; i < octSteps.length; i ++) {
        const step = octSteps[i];
        const newX = sx + step.dx;
        const newY = sy + step.dy;

        if(isValidPosition(newX, newY) && mazes[index][newX][newY] % 8 == a){
            var distance = calculateDistance(newX, newY, end[index].x, end[index].y);
    
            if (distance < min) {
                pos = i;
                min = distance;
            }
        }
    }

    if (pos > -1) {
        n.push({x: sx + octSteps[pos].dx, y: sy + octSteps[pos].dy});
    }

    return n; 
}

function solveMaze1(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        handleMazeCompletion(index);
        return;
    }

    var neighbours = getNextStepForMaze1( 0, start[index].x, start[index].y, CELL_TYPES.WALL );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.CURRENT;
    } else {
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.VISITED;
        start[index] = stacks[index].pop();
    }

    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1(index);
    } );
}

function solveMaze1Optimized(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        handleMazeCompletion(index);
        return;
    }

    var neighbours = getOptimizedNextStepForMaze1( 1, start[index].x, start[index].y, CELL_TYPES.WALL );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.CURRENT;
    } else {
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.VISITED;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1Optimized(index);
    } );
}

function solveMaze2(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        handleMazeCompletion(index);
        return;
    }
    var neighbours = getNextStepForMaze2( 0, start[index].x, start[index].y, CELL_TYPES.WALL );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.CURRENT;
    } else {
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.VISITED;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze2(index);
    } );
}

function solveMaze2Optimized(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        handleMazeCompletion(index);
        return;
    }
    var neighbours = getOptimizedNextStepForMaze2( 1, start[index].x, start[index].y, CELL_TYPES.WALL );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.CURRENT;
    } else {
        mazes[index][start[index].x][start[index].y] = CELL_TYPES.VISITED;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze2Optimized(index);
    } );
}
function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    
    if(end[0].x != -1) {
        onClear();
    }

    if( mazes[0][x][y] ) return;
    if( start[0].x == -1 ) {
        start[0] = { x: x, y: y };
        start[1] = { x: x, y: y };
        mazes[0][start[0].x][start[0].y] = CELL_TYPES.START;
        mazes[1][start[1].x][start[1].y] = CELL_TYPES.START;
        
        for(var i = 0; i < count; i++) {
            drawMaze(i); 
        }
    } else {
        end[0] = { x: x, y: y };
        end[1] = { x: x, y: y };
        mazes[0][end[0].x][end[0].y] = CELL_TYPES.TARGET;
        mazes[1][end[1].x][end[1].y] = CELL_TYPES.TARGET;

        if(document.getElementById("sltType").value == "Maze1") {
            solveMaze1(0);
            solveMaze1Optimized(1);    
        } else {

            solveMaze2(0);
            solveMaze2Optimized(1);
        }
    }
}

function getNeighbours( index, sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] == a && sx - 2 > 0 && mazes[index][sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] == a && sx + 2 < cols - 1 && mazes[index][sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] == a && sy - 2 > 0 && mazes[index][sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] == a && sy + 2 < rows - 1 && mazes[index][sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}

function createArray( c, r ) {
    var m = new Array( count );
    for( var i = 0; i < count; i++ ) {
        m[i] = new Array( c );
        for( var j = 0; j < c; j++ ) {
            m[i][j] = new Array(r);
            for(var k = 0; k < r; k++) {
                m[i][j][k] = 1;
            }
        }
    }
    return m;
}

function createMaze1() {
    var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stacks[0].length < 1 ) {

            for(var i = 0; i < count; i++) {
                drawMaze(i); 
            }

            stacks = new Array(count);
            stacks[0] = []
            stacks[1] = [];
            
            start[0].x = start[0].y = -1;
            document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");

            return;
        }
        start[0] = stacks[0].pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        mazes[0][l.x][l.y] = CELL_TYPES.WALL;
        mazes[1][l.x][l.y] = CELL_TYPES.WALL;

        l = neighbours[i + 1]; 
        mazes[0][l.x][l.y] = CELL_TYPES.WALL;
        mazes[1][l.x][l.y] = CELL_TYPES.WALL;

        start[0] = l

        stacks[0].push( start[0] )
    }
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }
    
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni(ctx) {

    while(true) {

        var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stacks[0].length < 1 ) {
                for(var i = 0; i < count; i++) {
                    drawMaze(i); 
                }
    
                stacks = new Array(count);
                stacks[0] = []
                stacks[1] = [];
                
                start[0].x = start[0].y = -1;
                document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
    
                return;
            }
            start[0] = stacks[0].pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            mazes[0][l.x][l.y] = CELL_TYPES.WALL;    
            mazes[1][l.x][l.y] = CELL_TYPES.WALL;

            l = neighbours[i + 1]; 
            mazes[0][l.x][l.y] = CELL_TYPES.WALL;
            mazes[1][l.x][l.y] = CELL_TYPES.WALL;
    
            start[0] = l
            stacks[0].push( start[0] )
        }    
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createMaze2(ctx) {

    var r = Math.random();

    mazes[0][start[0].x][start[0].y] = r < density ? CELL_TYPES.WALL : CELL_TYPES.PATH;
    mazes[1][start[0].x][start[0].y] = r < density ? CELL_TYPES.WALL : CELL_TYPES.PATH;
    
    drawMaze(0);
    drawMaze(1);

    if(start[0].x == (cols - 1) && start[0].y == (rows - 1)){

        start[0].x = start[0].y = -1;
        document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
        document.getElementById("btnCreateMaze").removeAttribute("disabled");

        return;
    }

    start[0].x = start[0].x + 1;
    if(start[0].x == cols){
        start[0].x = 0;
        start[0].y = start[0].y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            var flag = Math.random();
            mazes[0][i][j] = flag < density ? CELL_TYPES.WALL : CELL_TYPES.PATH;    
            mazes[1][i][j] = flag < density ? CELL_TYPES.WALL : CELL_TYPES.PATH;    
        }
    }

    drawMaze(0);
    drawMaze(1);

    start[0].x = start[0].y = -1;

    document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createCanvas(count) {

    ctxs = new Array(count);
    mazes = new Array(count);

    for(var i = 0; i < count; i++) {
        var canvas = document.createElement( "canvas" );
        wid = document.getElementById("maze" + (i + 1)).offsetWidth - padding; 
        hei = 400;
        
        canvas.width = wid; canvas.height = 400;
        canvas.id = "canvas" + (i + 1);
        ctxs[i] = canvas.getContext( "2d" );
        ctxs[i].fillStyle = "gray"; 
        var div = document.getElementById("maze" + (i + 1))
        div.appendChild( canvas );    
    }
    
    for(var i = 0; i < count; i++) {
        ctxs[i].fillRect( 0, 0, wid, hei );
    }
}

function init() {
    createCanvas(count);
}

function onCreate() {

    stacks = new Array(count);
    stacks[0] = []
    stacks[1] = [];

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze1").offsetWidth - padding; 
    hei = 400;

    cols = parseInt(document.getElementById("cols").value, 10); 
    rows = parseInt(document.getElementById("rows").value, 10);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    mazes = createArray( cols, rows );

    for(var i = 0; i < count; i++) {

        var canvas = document.getElementById("canvas" + (i + 1));
        canvas.width = wid;
        canvas.height = hei;
        s = canvas.width / (grid * cols);
        canvas.height = s * grid * rows;
        ctxs[i].scale(s, s);
    }

    if(mazeType == "Maze1") {

        start[0].x = Math.floor( Math.random() * ( cols / 2 ) );
        start[0].y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start[0].x & 1 ) ) start[0].x++; if( !( start[0].y & 1 ) ) start[0].y++;
        
        for(var i = 0; i < count; i++) {
            mazes[i][start[0].x][start[0].y] = CELL_TYPES.WALL;
        }

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
        }
        else {

            createMaze1NonAni();
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start[0].x = 0;
        start[0].y = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze2();
        }
        else {

            createMaze2NonAni();
        }
    }
}

function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        document.getElementById("density").removeAttribute("disabled");
    }
    else {
        document.getElementById("density").setAttribute("disabled", "disabled");
    }
}

function onClear() {
    
    for(var i = 0; i < count; i++){
        for(var j = 0; j < cols; j++){
            for( var k = 0; k < rows; k++) {
                if(mazes[i][j][k] == CELL_TYPES.SOLUTION || mazes[i][j][k] == CELL_TYPES.VISITED || 
                   mazes[i][j][k] == CELL_TYPES.TARGET || mazes[i][j][k] == CELL_TYPES.START) {
                    mazes[i][j][k] = CELL_TYPES.WALL;
                }    
            }
        }
    }

    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }

    stacks = new Array(count);
    stacks[0] = []
    stacks[1] = [];

    start[0].x = start[0].y = -1;
    start[1].x = start[1].y = -1;

    end[0].x = end[0].y = -1;
    end[1].x = end[1].y = -1;

}
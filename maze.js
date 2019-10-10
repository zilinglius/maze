var ctx, wid, hei, cols, rows, maze, stack = [], start = {x:-1, y:-1}, end = {x:-1, y:-1}, grid = 8, padding = 16, s, density=0.5;
function drawMaze() {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( maze[i][j] ) {
                case 0: ctx.fillStyle = "black"; break;
                case 1: ctx.fillStyle = "gray"; break;
                case 2: ctx.fillStyle = "red"; break;
                case 3: ctx.fillStyle = "yellow"; break;
                case 4: ctx.fillStyle = "#500000"; break;
                case 8: ctx.fillStyle = "blue"; break;
            }
            ctx.fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

function drawBlock(sx, sy, a) {
    switch( a ) {
        case 0: ctx.fillStyle = "black"; break;
        case 1: ctx.fillStyle = "gray"; break;
        case 2: ctx.fillStyle = "red"; break;
        case 3: ctx.fillStyle = "yellow"; break;
        case 4: ctx.fillStyle = "#500000"; break;
        case 8: ctx.fillStyle = "blue"; break;
    }
    ctx.fillRect( grid * sx, grid * sy, grid, grid  );
}

function getFNeighbours( sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && maze[sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx + 1 < cols - 1 && maze[sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy - 1 > 0 && maze[sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy + 1 < rows - 1 && maze[sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}
function solveMaze1() {
    if( start.x == end.x && start.y == end.y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( maze[i][j] ) {
                    case 2: maze[i][j] = 3; break;
                    case 4: maze[i][j] = 0; break;
                }
            }
        }
        drawMaze();
        return;
    }
    var neighbours = getFNeighbours( start.x, start.y, 0 );
    if( neighbours.length ) {
        stack.push( start );
        start = neighbours[0];
        maze[start.x][start.y] = 2;
    } else {
        maze[start.x][start.y] = 4;
        start = stack.pop();
    }
 
    drawMaze();
    requestAnimationFrame( solveMaze1 );
}
function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    if( maze[x][y] ) return;
    if( start.x == -1 ) {
        start = { x: x, y: y };
        maze[start.x][start.y] = 8;
        drawMaze();
    } else {
        end = { x: x, y: y };
        maze[end.x][end.y] = 8;
        solveMaze1();
    }
}
function getNeighbours( sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}
function createArray( c, r ) {
    var m = new Array( c );
    for( var i = 0; i < c; i++ ) {
        m[i] = new Array( r );
        for( var j = 0; j < r; j++ ) {
            m[i][j] = 1;
        }
    }
    return m;
}
function createMaze1() {
    var neighbours = getNeighbours( start.x, start.y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stack.length < 1 ) {
            drawMaze(); stack = [];
            start.x = start.y = -1;
            document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");

            return;
        }
        start = stack.pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        maze[l.x][l.y] = 0;

        l = neighbours[i + 1]; 
        maze[l.x][l.y] = 0;

        start = l
        stack.push( start )
    }
    drawMaze();
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni() {

    while(true) {

        var neighbours = getNeighbours( start.x, start.y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stack.length < 1 ) {
                drawMaze(); stack = [];
                start.x = start.y = -1;
                document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
    
                return;
            }
            start = stack.pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            maze[l.x][l.y] = 0;
    
            l = neighbours[i + 1]; 
            maze[l.x][l.y] = 0;
    
            start = l
            stack.push( start )
        }    
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}
function createMaze2() {

    var r = Math.random();

    maze[start.x][start.y] = r < density ? 0 : 1;
    
    drawMaze();

    if(start.x == (cols - 1) && start.y == (rows - 1)){

        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        return;
    }

    start.x = start.x + 1;
    if(start.x == cols){
        start.x = 0;
        start.y = start.y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            maze[i][j] = Math.random() < density ? 0 : 1;
    
            drawBlock(i, j, maze[i][j]);
        }
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}
function createCanvas() {
    var canvas = document.createElement( "canvas" );
    wid = document.getElementById("maze").offsetWidth - padding; 
    hei = 400;
    
    canvas.width = wid; canvas.height = 400;
    canvas.id = "canvas";
    ctx = canvas.getContext( "2d" );
    ctx.fillStyle = "gray"; ctx.fillRect( 0, 0, wid, hei );
    var div = document.getElementById("maze")
    div.appendChild( canvas ); 
}

function init() {
    createCanvas();
}

function onCreate() {

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze").offsetWidth - padding; 
    hei = 400;

    cols = eval(document.getElementById("cols").value); 
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    maze = createArray( cols, rows );

    var canvas = document.getElementById("canvas");
    canvas.width = wid;
    canvas.height = hei;
    s = canvas.width / (grid * cols);
    canvas.height = s * grid * rows;

    ctx.scale(s, s);

 
    if(mazeType == "Maze1") {

        start.x = Math.floor( Math.random() * ( cols / 2 ) );
        start.y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start.x & 1 ) ) start.x++; if( !( start.y & 1 ) ) start.y++;
        maze[start.x][start.y] = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
        }
        else {

            createMaze1NonAni();
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start.x = 0;
        start.x = 0;

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
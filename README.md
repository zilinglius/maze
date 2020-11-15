# maze
## The assignment in lecture 2.
- in branch: optimizer.

#### main optimizeation methods:
- DFS: very slow;
- BFS: shortest, not suitable;
- Heuristic search: faster. I used to use priority queue. (js doesn't have stl?) <A algorithm and A* algorithm>
- Jump point search: skip many "uniform points". but to draw a maze and update two of them simultaneously, I give up this algorithm.
- a small opimizer: 
  1. use an array to record last X distance.
  2. check x every time before update maze array.
  3. if x<=5, step back 5 steps.
 
 code:
```
var opt = { cnt: 0, length: [] };

//in the func  getNextStepForMaze1

    if (opt.cnt != 0 && opt.length[cnt - 1] <= min && pos > -1) {//if current min distance>=length max, push it in.
        ++opt.cnt;
        opt.length.push(min);
    }
    else {
        if (opt.cnt != 0 && opt.length[cnt - 1] > min && pos > -1) {//if current min distance < length, pop all elements out.
            for (var i = 0; i < opt.cnt; ++i) opt.length.pop();
            opt.cnt = 0;
        }
        else if (opt.cnt <= 0 && pos > -1) {//if cleared just now, push current distance in.
            opt.cnt = 1;
            opt.length.push(min);
        }
    }
    
   //in the func solveMaze1
       if (opt.cnt >= 5) {//if progressive increase over 5 times, abondon this path.
        for (var i = 0; i < opt.cnt; ++i) {
            opt.length.pop();
            mazes[index][start[index].x][start[index].y] = 4;
            start[index] = stacks[index].pop();
            drawMaze(index);
        }
        opt.cnt = 0;
        requestAnimationFrame(function () {
            solveMaze1(index);
        });
    }
    else {
        if (neighbours.length) {//队里面还有东西1
            stacks[index].push(start[index]);
            start[index] = neighbours[0];
            mazes[index][start[index].x][start[index].y] = 2;
        } else {
            mazes[index][start[index].x][start[index].y] = 4;
            start[index] = stacks[index].pop();
        }


        drawMaze(index);
        requestAnimationFrame(function () {
            solveMaze1(index);
        });
    }
```

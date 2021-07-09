console.log('hi')

let { Engine, Render, Runner, World, Bodies, Body, Events} = Matter

let cellsHorizontal = 18
let cellsVertical = 10


let width = window.innerWidth
let height = window.innerHeight

let unitLengthX = width/cellsHorizontal
let unitLengthY = height/cellsVertical


let engine = Engine.create()
engine.world.gravity.y = 0
let {world} = engine
let render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        wireframes: false,
        width: width,
        height: height
    }
})

Render.run(render)
Runner.run(Runner.create(),engine)

// Walls
let walls = [
    Bodies.rectangle(width/2,0,width,2, {isStatic: true}),
    Bodies.rectangle(width/2,height,width,2, {isStatic: true}),
    Bodies.rectangle(0,height/2,2,height, {isStatic: true}),
    Bodies.rectangle(width,height/2,2,height, {isStatic: true})
]
World.add(world,walls)

// Maze Generation
let shuffle = (arr) =>{
    let counter = arr.length;

    while(counter > 0){
        let index = Math.floor(Math.random() * counter)

        counter--

        let temp = arr[counter]
        arr[counter] = arr[index]
        arr[index] = temp
    }

    return arr
}

let grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false))
let verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal-1).fill(false))
let horizontals = Array(cellsVertical-1).fill(null).map(() => Array(cellsHorizontal).fill(false))

let startRow = Math.floor(Math.random() * cellsVertical)
let startColumn = Math.floor(Math.random() * cellsHorizontal)

let stepCells = (row,column) =>{

    if(grid[row][column]){
        return;
    }

    grid[row][column] = true

    let neighbors = shuffle([
        [row - 1,column, 'up'],
        [row,column + 1, 'right'],
        [row + 1,column, 'down'],
        [row,column - 1, 'left']
    ])
    
    for (let neighbor of neighbors){
        let [nextRow, nextColumn, direction] = neighbor

        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue
        }

        if (grid[nextRow][nextColumn]) {
            continue
        }

        if (direction === 'left') {
            verticals[row][column-1] = true
        }
        else if (direction === 'right'){
            verticals[row][column] = true
        }
        else if (direction === 'up'){
            horizontals[row - 1][column] = true
        }
        else if (direction === 'down'){
            horizontals[row][column] = true
        }

        stepCells(nextRow,nextColumn)
    }

}

stepCells(startRow,startColumn)


horizontals.forEach((row, rowIndex)=>{
    row.forEach((open, columnIndex) =>{
        if (open){
            return 
        }

        let wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX/2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            10,
            {
                label: 'wall',
                isStatic: true,
                render:{
                    fillStyle: 'pink'
                }
            }
        )

        World.add(world,wall)

    })
})

verticals.forEach((row, rowIndex)=>{
    row.forEach((open, columnIndex) =>{
        if (open){
            return 
        }

        let wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY/2,
            10,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true,
                render:{
                    fillStyle: 'pink'
                }
            }
        )

        World.add(world,wall)

    })
})

// Goal
let goal = Bodies.rectangle(
    width - unitLengthX/2,
    height - unitLengthY/2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        label: 'goal',
        isStatic: true,
        render:{
            fillStyle: 'green'
        }
    }
)
World.add(world,goal)

// Ball
let ballRadius = Math.min(unitLengthX,unitLengthY)/4

let ball = Bodies.circle(
    unitLengthX/2,
    unitLengthY/2,
    ballRadius,
    {
        label: 'ball',
        render:{
            fillStyle: 'cyan'
        }
    }
)

document.addEventListener('keydown', event =>{
    let {x,y} = ball.velocity 
    if (event.keyCode === 87) {
        Body.setVelocity(ball,{x,y:y-5})
    }

    if (event.keyCode === 68) {
        Body.setVelocity(ball,{x:x+5,y})

    }

    if (event.keyCode === 83) {
        Body.setVelocity(ball,{x,y:y+5})

    }

    if (event.keyCode === 65) {
        Body.setVelocity(ball,{x:x-5,y})

    }
})
World.add(world,ball)

// Win Condition
Events.on(engine, 'collisionStart', event =>{
    event.pairs.forEach(collision => {
        let labels = ['ball','goal']

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            document.querySelector('.winner').classList.remove('hidden')
            world.gravity.y = 1

            world.bodies.forEach(body => {
                if(body.label === 'wall'){
                    Body.setStatic(body,false)
                }
            });

        }
    });
})
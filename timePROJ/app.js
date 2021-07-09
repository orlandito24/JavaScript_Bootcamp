
let duration = document.querySelector('#duration')
let start = document.querySelector('#start')
let pause = document.querySelector('#pause')
let circle = document.querySelector('circle')

let peri = circle.getAttribute('r') * 2 * Math.PI
circle.setAttribute('stroke-dasharray',peri)

let timeLeft;

let beginApp = new Timer(duration,start,pause,{
    onStart(totalDuration){

        timeLeft = totalDuration
        console.log('timer started')
    },
    onTick(timeRemaining){

        circle.setAttribute('stroke-dashoffset', 
        (peri * timeRemaining)/timeLeft - peri)

    },
    onComplete(){
        
        console.log('compelete started')

    }
})
// beginApp.start()
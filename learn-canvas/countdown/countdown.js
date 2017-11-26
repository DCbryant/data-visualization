let WINDOW_WIDTH = 1024
let WINDOW_HEIGHT = 560
let RADIUS = 8
let MARGIN_TOP = 60
let MARGIN_LEFT = 30

const balls = []
const colors = ['#d5a','#ac1','#a23','#f55','#a44','#a5f','#cc9','#d8d','#e9e','#b77']

const endTime = new Date(2017,10,27,0,0,0)
// 实现倒计时效果
// endTime.setTime(endTime.getTime() + 3600 * 1000)
// 当前结束需要的毫秒数
let curShowTimeSeconds = getCurShowTimeSeconds()

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

resize()

function resize(){
    WINDOW_WIDTH = document.documentElement.clientWidth 
    WINDOW_HEIGHT = document.documentElement.clientHeight
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 7)
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1
    canvas.width = WINDOW_WIDTH
    canvas.height = WINDOW_HEIGHT
}

window.onresize = resize

setInterval(() => {
    render(context)
    update()
},50)


render(context)

// 倒计时
// function getCurShowTimeSeconds(){
//     let cur = new Date()
//     let ret = endTime.getTime() - cur.getTime()
//     ret = Math.round(ret / 1000)
//     return ret >= 0 ? ret : 0
// }

// 时钟效果
function getCurShowTimeSeconds(){
    let cur = new Date()
    let ret = cur.getHours() * 3600 + cur.getMinutes() * 60 + cur.getSeconds() 
    return ret 
}

function update(){
    // nextShowTimeSeconds一个每隔50毫秒就变化一次的值
    let nextShowTimeSeconds = getCurShowTimeSeconds()
    let nextHours = parseInt(nextShowTimeSeconds / 3600)
    let nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600)/60)
    let nextSeconds = parseInt(nextShowTimeSeconds % 60)

    // curShowTimeSeconds是一个固定值,只要不刷新页面，curShowTimeSeconds的值就不会变
    let curHours = parseInt(curShowTimeSeconds / 3600)
    let curMinutes = parseInt((curShowTimeSeconds - nextHours * 3600)/60)
    let curSeconds = parseInt(curShowTimeSeconds % 60)

    // 不停改变当前时间
    if(nextSeconds !== curSeconds){
        if(parseInt(curHours / 10) !== parseInt(nextHours / 10)){
            addBalls(MARGIN_LEFT + 0,MARGIN_TOP,parseInt(curHours / 10))
        }

        if(parseInt(curHours % 10) !== parseInt(nextHours % 10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(curHours / 10))
        }

        if(parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes / 10))
        }

        if(parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes % 10))
        }

        if(parseInt(curSeconds / 10) !== parseInt(nextMinutes / 10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds / 10))
        }

        if(parseInt(curSeconds % 10) !== parseInt(nextMinutes % 10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds % 10))
        }
        curShowTimeSeconds = nextShowTimeSeconds
    }
    updateBalls()
}

function updateBalls(){
    for(let i=0;i<balls.length;i++){
        balls[i].x += balls[i].vx
        balls[i].y += balls[i].vy
        balls[i].vy += balls[i].g

        if(balls[i].y >= WINDOW_HEIGHT){
            balls[i].y = WINDOW_HEIGHT - RADIUS
            balls[i].vy = -balls[i].vy * 0.75
        }
    }

    let count = 0
    for(let i=0;i<balls.length;i++){
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[count++] = balls[i]
        }
    }
    while(balls.length > Math.min(300,count)){
        balls.pop()
    }
}


function addBalls(x,y,num){
    for(let i=0;i<digit[num].length;i++){
        for(let j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j] === 1){
                const ball = {
                    x:x+2*j*(RADIUS+1)+(RADIUS+1),
                    y:y+2*i*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000)) * 4, //4|-4
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(ball)
            }
        }
    }
}


function render(ctx){
    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    
    let hours = parseInt(curShowTimeSeconds / 3600)
    let minutes = parseInt((curShowTimeSeconds - hours * 3600)/60)
    let seconds = parseInt(curShowTimeSeconds % 60)
    // 数字：2*7+1
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctx)
    renderDigit(MARGIN_LEFT+15*RADIUS,MARGIN_TOP,parseInt(hours%10),ctx)
    renderDigit(MARGIN_LEFT+30*RADIUS,MARGIN_TOP,10,ctx)
    // 冒号：2*4 + 1
    renderDigit(MARGIN_LEFT+39*RADIUS,MARGIN_TOP,parseInt(minutes/10),ctx)
    renderDigit(MARGIN_LEFT+54*RADIUS,MARGIN_TOP,parseInt(minutes%10),ctx)
    renderDigit(MARGIN_LEFT+69*RADIUS,MARGIN_TOP,10,ctx)

    renderDigit(MARGIN_LEFT+78*RADIUS,MARGIN_TOP,parseInt(seconds/10),ctx)
    renderDigit(MARGIN_LEFT+93*RADIUS,MARGIN_TOP,parseInt(seconds%10),ctx)

    for(let i=0;i<balls.length;i++){
        ctx.fillStyle = balls[i].color
        ctx.beginPath()
        ctx.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true)
        ctx.closePath()
        ctx.fill()
    }
}

function renderDigit(x,y,num,ctx){
    ctx.fillStyle = '#0C8'
    for(let i=0;i<digit[num].length;i++){//行
        for(let j=0;j<digit[num][i].length;j++){//列
            if(digit[num][i][j] === 1){
                ctx.beginPath()
                ctx.arc(x+2*j*(RADIUS+1)+(RADIUS+1),y+2*i*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}


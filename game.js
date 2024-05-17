var mag = []
var life1 = 0
var life2 = 0
var p1Actions = [1, 1]
var p2Actions = [1, 1]
var turn = 1

function customAlert(message) {
    const alert = document.createElement('div');
    const alertButton = document.createElement('button');
    alertButton.innerText = 'OK';
    alert.classList.add('alert');
    alertButton.classList.add('alert-button')
    alert.innerHTML = `<span style="padding: 10px">${message}</span>`;
    alert.appendChild(alertButton);
    document.body.appendChild(alert);
    return new Promise((resolve) => {
        alertButton.addEventListener('click', () => {
            alert.remove();
            resolve();
        });
    });
};



function display() {
    const lives = document.querySelector('.lives')
    const start = document.querySelector('.start')
    const buttons = document.querySelector('.buttons')
    const player = document.querySelector('.player')
    const revolver = document.querySelector('.revolver')
    const lives1 = document.querySelector('.life1')
    const lives2 = document.querySelector('.life2')
    const action = document.querySelectorAll('.action')
    if (mag.length === 0) {
        reset()
        return
    }
    for(var i = 0; i < action.length; i++) {
        if (turn === 1 && p1Actions[i] === 0 || turn === 2 && p2Actions[i] === 0) {
            action[i].disabled = true
        } else {
            action[i].disabled = false
        }
    }
        
    revolver.src = turn === 1 ? 'images/revolver-right.png' : 'images/revolver-left.png'
    const playerName = turn === 1 ? 'Player 1' : 'Player 2'
    player.innerHTML = `${playerName}'s Turn`
    lives1.textContent = lives2.textContent = ''
    for (var i = 0; i < life1; i++) {
        lives1.innerHTML += '&hearts;'
    } 
    for (var i = 0; i < life2; i++) {
        lives2.innerHTML += '&hearts;'
    } 
    player.style.display ='block'
    lives.style.display = 'flex'
    start.style.display = 'none'
    buttons.style.display = 'flex'
}

function reset() {
    const lives = document.querySelector('.lives')
    const start = document.querySelector('.start')
    const buttons = document.querySelector('.buttons')
    const player = document.querySelector('.player')
    const revolver = document.querySelector('.revolver')
    const lives1 = document.querySelector('.life1')
    const lives2 = document.querySelector('.life2')
    revolver.src = 'images/revolver-right.png'
    lives1.textContent = ''
    lives2.textContent = ''
    start.style.display = 'flex'
    player.style.display ='none'
    buttons.style.display = 'none'
    lives.style.display = 'none'
    life1 = life2 = 0
    p1Actions = [1, 1]
    p2Actions = [1, 1]
    mag = []
    turn = 1
}

function init() {
    const spinSound = document.querySelector('#spinSound')
    const blankTB = document.querySelector('#blank')
    const liveTB = document.querySelector('#live')
    const blank = parseInt(blankTB.value, 10)
    const live = parseInt(liveTB.value, 10)
    console.log('Blank: ' + blank + ' Live: ' + live)
    if (isNaN(blank) || isNaN(live)) {
        customAlert("Please enter numbers!")
        blankTB.value = ""
        liveTB.value = ""
        return
    }
    spinSound.play()
    life1 = life2 = Math.round(live / 2) 
    const order = {}
    for (var i = 1; i <= blank; i++){
        mag.push(i)
        order[i] = Math.random()
    }
    for (var i = 1; i <= live; i++){
        mag.push(i + 100)
        order[i + 100] = Math.random()
    }
    for (var i = 0; i < mag.length; i++) {
        for (var j = 0; j < mag.length; j++) {
            if (order[mag[i]] > order[mag[j]]) {
                temp = mag[i]
                mag[i] = mag[j]
                mag[j] = temp
            }
        }
    }
    console.log(order)
    console.log(mag)
    display()
}

async function shootOpp() {
    const player = turn === 1 ? 'Player 2' : 'Player 1'
    const blankSound = document.querySelector('#blankSound')
    const shootSound = document.querySelector('#shootSound')
    const deadSound = document.querySelector('#deadSound')
    const bullet = mag.pop()
    if (bullet >= 100) {
        shootSound.play()
        if (player === 'Player 1') {
            life1 -= 1
            if (life1 == 0) {
                deadSound.play()
                await customAlert('Player 2 wins!')
                reset()
            } else {
                await customAlert(`${player} loses a life!`)
            }
        } else {
            life2 -= 1
            if (life2 == 0) {
                deadSound.play()
                await customAlert('Player 1 wins!')
                reset()
            } else {
                await customAlert(`${player} loses a life!`)
            }
        }
    } else{
        blankSound.play()
        await customAlert(`Oh no! It was a blank :(`)
        turn = 3 - turn
    }
    display()
}

async function shootYou() {
    const player = turn === 1 ? 'Player 1' : 'Player 2';
    const shootSound = document.querySelector('#shootSound');
    const blankSound = document.querySelector('#blankSound');
    const deadSound = document.querySelector('#deadSound');
    const bullet = mag.pop();

    if (bullet >= 100) {
        shootSound.play();
        if (player === 'Player 1') {
            life1 -= 1;
            if (life1 == 0) {
                deadSound.play();
                await customAlert('Player 2 wins!');
                reset();
            } else {
                await customAlert(`${player} loses a life!`);
            }
        } else {
            life2 -= 1;
            if (life2 == 0) {
                deadSound.play();
                await customAlert('Player 1 wins!');
                reset();
            } else {
                await customAlert(`${player} loses a life!`);
            }
        }
        turn = 3 - turn;
    } else {
        blankSound.play();
        await customAlert("It's a blank!");
    }
    display();
}

async function checkNext() {
    if (turn === 1) {
        p1Actions[0] -= 1
    } else {
        p2Actions[0] -= 1
    }
    const checked = mag[mag.length - 1] >= 100 ? 'live' : 'blank'
    await customAlert(`The bullet is ${checked}`);
    display()
}

async function getProbability() {
    if (turn === 1) {
        p1Actions[1] -= 1
    } else {
        p2Actions[1] -= 1
    }
    let live = 0
    mag.forEach((bullet) => {
        if (bullet >= 100) {
            live++
        }
    })
    const liveProbability = (live / mag.length * 100).toFixed(2)
    await customAlert(`Chance for a live bullet is ${liveProbability}%`);
    display()
}
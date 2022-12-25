const roll = document.querySelectorAll('.roll'),
hold = document.querySelectorAll('.hold'),
p1 = document.querySelector('.p1'),
p2 = document.querySelector('.p2'),
totalScoreP1 = document.querySelector('.p1 .total .content'),
totalScoreP2 = document.querySelector('.p2 .total .content'),
scoreP1 = document.querySelector('.p1 .score'),
scoreP2 = document.querySelector('.p2 .score'),
popup = document.querySelector('.popup'),
popupData = document.querySelector('.popup .data'),
overlay = document.querySelector('.overlay'),
menu = document.querySelector('.menu'),
popupName = document.querySelector('.popup .name'),
gmaeBoxBtnGrpBtns = document.querySelectorAll('.game-box .btn-grp button'),
menuHow = document.querySelector('.menu-how'),
menuContent = document.querySelector('.menu-content'),
pNumP2 = document.querySelector('.p2 .p-num'),
btnsP2 = document.querySelector('.p2 .btns'),
btnGrpP2 = document.querySelector('.p2 .btn-grp'),
newGameBtn = document.querySelector('.newGameBtn'),
settingsWrapper = document.querySelector('.settings'),
settingsOverlay = document.querySelector('.settings_overlay');
let number;
let aiNumbersPassed = [0]
let moves,
moved,
WIN_SCORE = 69;
let numbersPassed = [];

const WINDOW_PARAMETER = (new URL(document.location)).searchParams;
const WINDOW_PARAMETER_SCORE = WINDOW_PARAMETER.get('win_score');

if (WINDOW_PARAMETER_SCORE) {
    WIN_SCORE = Number(WINDOW_PARAMETER_SCORE);
}

function settingsWinScore(target) {
    const t = document.querySelector('.settings #win_score').value;
    if (!t=='' && t.match(/^[0-9]+$/) != null) {
        WIN_SCORE = Number(t);
        target.innerText='✅ Changed';
        WINDOW_PARAMETER.set('win_score', 'aefaef')
        window.location = window.origin + window.location.pathname + '?win_score=' + t;
        setTimeout(() => {
            target.innerText='Change';
        }, 3000)
    } else {
        target.innerText='❌ Invalid'
        setTimeout(() => {
            target.innerText='Change';
        }, 2000)
    }
}

function openSettings() {
    if (settingsOverlay.style.display == 'block') {
        settingsOverlay.style.display = 'none';
        settingsWrapper.style.display = 'none';
        settingsOverlay.removeEventListener('click', openSettings);
    } else {
        settingsOverlay.style.display = 'block';
        settingsWrapper.style.display = 'block';
        settingsOverlay.addEventListener('click', openSettings);
    }
}

function howToPlayPopup() {
    if (menuHow.style.display == 'block') {
        menuHow.style.display = 'none';
        menuContent.style.display='block';
    } else {
        menuHow.style.display = 'block';
        menuContent.style.display='none';
    }
}

function newGame() {
    totalScoreP1.innerText = 0;
    totalScoreP2.innerText = 0;
    scoreP1.innerText1 = 0;
    scoreP2.innerText = 0;
    p2.classList.remove('active');
    p1.classList.add('active');
    document.querySelectorAll('.game-box .score').forEach(e => {
        e.innerText=0;
    })
    closePopup();
    menu.style.display = 'none';
    gmaeBoxBtnGrpBtns.forEach(e => {
        e.disabled = false;
    });
    pNumP2.innerText = 'Player 2';
    hold.forEach(e => {
        e.setAttribute('onclick', 'holdScore()')
    });
    newGameBtn.setAttribute('onclick', 'newGame()');
    btnsP2.classList.remove('text');
    btnGrpP2.style.display = null;
}

function newGameAI() {
    newGame();
    pNumP2.innerText = 'AI';
    hold.forEach(e => {
        e.setAttribute('onclick', 'holdScoreAI()');
    })
    newGameBtn.setAttribute('onclick', 'newGameAI()');
}

function holdScoreAI() {
    holdScore();
    if (!p1.classList.contains('active')) {
        btnsP2.classList.add('text');
        btnGrpP2.style.display = 'none';
        moves = genNum(1, 4);
        moved = 1;
        const aiPlay = setInterval(() => {
            console.log('moved: '+moved + ' out of ' + moves)
            number = genNum(2, 3);
            aiNumbersPassed.push(number);
            if(number == 7) {
                number = genNum(2, 6);
                aiNumbersPassed.push(number);
            } else {
                if (p1.classList.contains('active')) {
                    rollScoreIncrement(scoreP1);
                } else {
                    rollScoreIncrement(scoreP2);
                }
            }
            if (moved > moves) {
                clearInterval(aiPlay);
                btnsP2.classList.remove('text');
                holdScore();
            }
            moved++;
        }, 1000);
    }
}

function goToMenu() {
    menu.style.display = 'block';
}

function openPopup(win) {
    popup.style.display = 'block';
    overlay.style.display = 'block';
    if (win == 'p1') {
        popupName.innerText = 'Player 1 wins!'
    } else {
        if (pNumP2.innerText == 'AI') {
            popupName.innerText = 'AI wins!'
        } else {
            popupName.innerText = 'Player 2 wins!'
        }
    }
}

function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

roll.forEach(e => {
    e.addEventListener('click', () => {
        rollDice();
    })
})

function genNum(start = 1, end = 6) {
    return Math.floor(Math.random() * end) + start;
}

function rollDice() {
    number = genNum();
    console.log(number)
    numbersPassed.push(number);
    console.log(numbersPassed)

    if (numbersPassed[0] == 1) {
        numbersPassed = [];
        rollDice();
    } else {
        if (number == 1) {
            console.log('main hit: true')
            rollExit();
        } else {
            if (p1.classList.contains('active')) {
                rollScoreIncrement(scoreP1);
            } else {
                rollScoreIncrement(scoreP2);
            }
        }
    }
}

function holdScoreLogic(target) {
    const totalScoreTarget = document.querySelector(`.${target} .total .content`);
    const targetSelector = document.querySelector(`.${target}`)
    const scoreTarget = document.querySelector(`.${target} .score`)
    targetSelector.classList.remove('active');
    if (pNumP2.innerText == 'AI' && target.includes('2')) {
        totalScoreTarget.innerText = (Number(totalScoreTarget.innerText) +  Number(scoreTarget.innerText)) - Number(aiNumbersPassed[aiNumbersPassed.length - 1]);
    } else {
        totalScoreTarget.innerText = Number(totalScoreTarget.innerText) +  Number(scoreTarget.innerText);
    }
    scoreTarget.innerText = 0;
    if (target.includes('1')) {
        p2.classList.add('active');
    } else {
        p1.classList.add('active');
    }
    if (Number(totalScoreTarget.innerText) >= WIN_SCORE) {
        openPopup(target);
        gmaeBoxBtnGrpBtns.forEach(e => {
            e.disabled = true;
        });
    }
}

function holdScore() {
    if (p1.classList.contains('active')) {
        holdScoreLogic('p1');
        console.log('send req to p1')
    } else {
        holdScoreLogic('p2');
        console.log('send req to p2')
    }
}

function rollExit() {
    if (p1.classList.contains('active')) {
        scoreP1.innerText = 0;
    } else {
        scoreP2.innerText = 0;
    }
    if (pNumP2.innerText == 'AI') {
        moved = Number(moves) + 1;
        holdScoreAI();
    } else {
        holdScore();
    }
}

function rollScoreIncrement(target) {
    if (target.innerText > 49) {
        number = genNum(1, number);
        console.log('reducer: ' + number)

        if (number == 6) {
            number = 5;
        }

        if (number == 1) {
            console.log('reducer hit: true')
            rollExit();
        } else {
            target.innerText = Number(target.innerText) + Number(number);
        }
    } else {
        target.innerText = Number(target.innerText) + Number(number);
        console.log(number)
    }
}

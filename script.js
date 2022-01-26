import axies from "./shared/axiemoves.js"; 
import bgcolor from "./shared/bgcolor.js";

const selectButton = document.querySelectorAll('i.fa-arrow-right');
const axieBox =  document.querySelectorAll('.axie-box');
const calculatorSection = document.querySelector('.calculator-section');
const calImages = document.querySelector('.cal-image-box');
const calMoves = document.querySelector('.cal-moves');
const calTotal = document.querySelector('.cal-total');
const calEnemies = document.querySelector('.cal-enemies');
const calBuff = document.querySelector('.cal-buff');
// const calCrit = document.querySelector('.cal-crit');
const calResult = document.querySelector('.cal-result');
const calContent = document.querySelector('.cal-content-box');

let count = 0;
let chosenOne;


for (let i=0;i<=2;i++){
    selectButton[i].addEventListener('mouseenter', function(){
        selectButton[i].classList.remove('fa-2x');
        selectButton[i].classList.add('fa-3x');
        axieBox[i].classList.add('axie-box-green');
    
    })

    selectButton[i].addEventListener('mouseleave', function(){
        selectButton[i].classList.remove('fa-3x');
        selectButton[i].classList.add('fa-2x');
        axieBox[i].classList.remove('axie-box-green');
    })

    selectButton[i].addEventListener('click', function(){
        switchingAxie();
        calImages.innerHTML = `<img src='${axies[i].img_src}'>`;
        chosenOne = i;
        console.log(chosenOne);
        calMoves.innerHTML = `SKILLS: 
                                <button type="button" id='move-0' class="btn ${bgcolor[axies[i].moves[0].type]} axie-moves">${axies[i].moves[0].move}</br>${axies[i].moves[0].damage} dmg</button>
                                <button type="button" id='move-1' class="btn ${bgcolor[axies[i].moves[1].type]} axie-moves">${axies[i].moves[1].move}</br>${axies[i].moves[1].damage} dmg</button>
                                <button type="button" id='move-2' class="btn ${bgcolor[axies[i].moves[2].type]} axie-moves">${axies[i].moves[2].move}</br>${axies[i].moves[2].damage} dmg</button>
                                <button type="button" id='move-3' class="btn ${bgcolor[axies[i].moves[3].type]} axie-moves">${axies[i].moves[3].move}</br>${axies[i].moves[3].damage} dmg</button>
                                `;
        calEnemies.innerHTML = `
                                <div class="btn-group" role="group">
                                ENEMIES:\xa0 
                                    <button type="button" id='ene-0' class="btn bg-color-plant active bd-none-r">Plant-Reptile</button>    
                                    <button type="button" id='ene-1' class="btn bg-color-aqua bd-none-l bd-none-r">Aqua-Bird</button>    
                                    <button type="button" id='ene-2' class="btn bg-color-bug bd-none-l">Beast-Bug</button>    
                                <div>
        `;
        calBuff.innerHTML = `
                                <div class="btn-group" role="group">
                                BUFFs:\xa0 
                                    <button type="button" id='buff-0' class="btn bg-color-down bd-none-r">-2Attack</button>    
                                    <button type="button" id='buff-1' class="btn bg-color-down bd-none-l bd-none-r">-Attack</button>    
                                    <button type="button" id='buff-3' class="btn bg-color-up bd-none-l bd-none-r">+Attack</button>    
                                    <button type="button" id='buff-4' class="btn bg-color-up bd-none-l">+2Attack</button>    
                                <div>
        `;
        // calResult.innerHTML = `DMG for this: <span id='cal-result'></span>`;

    }) 
}

let moveStacks =[];
let buffCheck = false;
const switchingAxie = () =>{
    moveStacks =[];
    calTotal.innerHTML = "";
    calResult.innerHTML = '';
    count = 0;
    // totalDmg =0;
}

calMoves.addEventListener('click', (e)=>{
    if (e.target && e.target.matches('.axie-moves')){
        for (let i=0;i<=3;i++){
            calBuff.children[0].children[i].classList.remove('active')
        }
        let numberofMove = e.target.id.match(/(\d+)/)[0];
        let move = axies[chosenOne].moves[numberofMove];
        move.buff =1;
        if (count<=3){
            moveStacks.push(move);
            count ++;
        }
        console.log(moveStacks);
    }
})

calEnemies.addEventListener('click',(e)=>{
    if (e.target && e.target.matches('button')){
        for (let i=0;i<=2;i++){
            calEnemies.children[0].children[i].classList.remove('active')
        }
        e.target.classList.add('active')
        // console.log(e.target);
    }
})

calBuff.addEventListener('click',(e)=>{
    if (e.target && e.target.matches('button')){
        
        let currentMove = moveStacks[moveStacks.length-1];
        if (e.target.matches('.active')){
            for (let i=0;i<=3;i++){
                calBuff.children[0].children[i].classList.remove('active')
            }
            currentMove.buff = 1;
        }
        else {
            for (let i=0;i<=3;i++){
                calBuff.children[0].children[i].classList.remove('active');
                e.target.classList.add('active');
            }
            currentMove.buff = getBuffMulti();
        }
    }
})

const getEnemyMulti = ()=>{
    const enemy = document.querySelector('.cal-enemies .active');
    if (enemy){
        return typeAdvantage(typeOf(axies[chosenOne].type), enemy.id);
    }
    else{
        return 1;
    }
}


const getBuffMulti = () => {
    const buff = document.querySelector('.cal-buff .active');
    if (buff){
        let multify = buff.id.match(/(\d+)/)[0];
        return 1+ (multify-2)*0.2;
    }
    else {
        return 1;
    }
}

const getComboBonus = (moveDmg)=>{
    return (1+(axies[chosenOne].skill*0.55-12.25)/100*0.985);
}

const getSameClassMulti = (move)=>{
    return axies[chosenOne].type==move.type?1.1:1;
}


calContent.addEventListener('click',(e)=>{
    if (e.target && e.target.matches('button')){
        let stackHtml = `COMBO:  `;
        let totalDmg =0;
        for (let i=0;i<moveStacks.length;i++){
            // console.log(moveStacks.length);
            let dmg = (moveStacks[i].damage*moveStacks[i].buff*getEnemyMulti()*getSameClassMulti(moveStacks[i]));
            if (moveStacks.length>1){
                dmg *= getComboBonus(moveStacks[i].damage);
            }
            dmg = Math.floor(dmg);
            let len = moveStacks.length;
            stackHtml = stackHtml.concat(`<div class='move-stacks ${bgcolor[moveStacks[i].type]} '>${moveStacks[i].move}: ${dmg}</div>`);
            totalDmg += dmg;
        }
        // console.log(stackHtml);
        calResult.innerHTML = stackHtml;
        calTotal.innerHTML = ` Total Damage: ${totalDmg} `;      
    }
})

const typeOf = (e) => {
    let teamPlant = ['plant', 'rep', 'dusk'];
    let teamAqua = ['aqua', 'bird', 'dawn'];
    let teamBeast = ['bug', 'beast', 'mech'];
    
    if (teamPlant.includes(e)) return 'ene-0';
    if (teamAqua.includes(e)) return 'ene-1';
    if (teamBeast.includes(e)) return 'ene-2';
}

const typeAdvantage = (a, b)=>{
    const x = a.match(/(\d+)/)[0];
    const y = b.match(/(\d+)/)[0];

    const result = Math.abs(x-y);
    if (result===0) {return 1}
    else if (result===1){
        return Math.max(x,y)==x?0.85:1.15;
    }
    else {
        return Math.max(x,y)==x?1.15:0.85;      
    }
}


console.log(axies);


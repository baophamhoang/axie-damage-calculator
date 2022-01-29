import bgcolor from "./shared/bgcolor.js";
import getData from "./getAxieData.js";
const response = await fetch('./shared/card-abilities.json');
const cardData = await response.json();
console.log(cardData);

const selectButton = document.querySelectorAll('i.fa-arrow-right');
const axieBox =  document.querySelectorAll('.axie-box');
const calculatorSection = document.querySelector('.calculator-section');
const calImages = document.querySelector('.cal-image-box');
const calMoves = document.querySelector('.cal-moves');
const calTotal = document.querySelector('.cal-total');
const calEnemies = document.querySelector('.cal-enemies');
const calBuff = document.querySelector('.cal-buff');
const calResult = document.querySelector('.cal-result');
const calContent = document.querySelector('.cal-content-box');
const calReset = document.querySelector('.cal-reset');
let axieData = {};
let count = 0;
let chosenOne;

// class axieSkills{
//     constructor(skill){
//         this.move = skill.name;
//         // this.damage = 
//         this.type = skill.class;
//     }
//     buff=1;
//     getDamage(){
//         const keyArr = Object.keys(cardData);
//         const move = keyArr.filter((x)=>{
//             let typePart = x.slice(0,x.search('-'));
//             let otherParts = x.slice(x.search('-')+1); 
//             let bodyPart = otherParts.slice(0,otherParts.search('-'));
//             return (typePart=="aquatic" && bodyPart=="horn" && cardData[x].partName=='Oranda');
//         })
//         return cardData[move].defaultAttack;
//     }
// }

const getAxieDamage = skill => {
    const keyArr = Object.keys(cardData);
        const move = keyArr.find((x)=>{
            // let typePart = x.slice(0,x.search('-'));
            // let otherParts = x.slice(x.search('-')+1); 
            // let bodyPart = otherParts.slice(0,otherParts.search('-'));
            // console.log(skill.name);
            // return (typePart==skill.class.toLowerCase() && bodyPart==skill.type.toLowerCase() && cardData[x].partName==skill.name);
            return cardData[x].partName.includes(skill.name);
        })
        return cardData[move].defaultAttack;
}


let inputAxie = document.querySelector('.axie-input');

inputAxie.addEventListener('input',()=>{
    let address = inputAxie.value;
    let backPart = '';
    if (address.length==42 && address.slice(0,2)=='0x'){
        backPart = address.slice(2);
    }
    if (address.length==46 && address.slice(0,6)=='ronin:'){
        backPart = address.slice(6);
    }
    if (backPart.length==40){
        let axieAdress = "0x".concat(backPart);
        // axieData = getData(axieAdress);
        getData(axieAdress).then(data => {
            axieData = data.data.axies.results;
            console.log(axieData);
        })
        let loadingElement = document.querySelector('.loading-section');
        loadingElement.style.display ="block";
        setTimeout(() => {
            if (axieData.length>0){
                AddAxies();
                document.querySelector('.container').style.display = 'block';
                loadingElement.style.display ="none";
            }
        }, 1000);
        loadingElement.innerHTML = `<h1>Loading</h1><icon class="fa fa-undo loading-icon"></icon>`;

        
    }
    
})

const AddAxies = () => {
    let axieImgElements = document.querySelectorAll('.axie-img');
    let axieSkillElements = document.querySelectorAll('.axie-skills');
    for (let i =0;i<axieData.length;i++){
        axieImgElements[i].innerHTML = `<img class='img-fluid' src=${axieData[i].image}>`;
        let skillHtml = axieData[i].parts.map((skill)=>{
            return `<li>${skill.name}</li>`
        })
        let html = `<ul class="list-unstyled">`+ skillHtml.splice(2,4).join(``)+`</ul`;
        axieSkillElements[i].innerHTML = html;
    };
}

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
        document.querySelector('.cal-intro').style.display = "none";
        document.querySelector('.calculator-section').style.display = "flex";
        // document.querySelector('.cal-image-box').style.display = "block";
        let imgURL = `<img src='${axieData[i].image}'>`;
        calImages.innerHTML = imgURL;
        document.querySelector('.cal-image-box-sm').innerHTML = imgURL;
        chosenOne = i;
        console.log(chosenOne);
        for (let j=2;j<6;j++){
            axieData[i].parts[j].damage = getAxieDamage(axieData[i].parts[j]);
        }
        calMoves.innerHTML = `
                                <button type="button" id='move-2' class="btn ${bgcolor[axieData[i].parts[2].class.toLowerCase()]} axie-moves">${axieData[i].parts[2].name}</br>${axieData[i].parts[2].damage} dmg</button>
                                <button type="button" id='move-3' class="btn ${bgcolor[axieData[i].parts[3].class.toLowerCase()]} axie-moves">${axieData[i].parts[3].name}</br>${axieData[i].parts[3].damage} dmg</button>
                                <button type="button" id='move-4' class="btn ${bgcolor[axieData[i].parts[4].class.toLowerCase()]} axie-moves">${axieData[i].parts[4].name}</br>${axieData[i].parts[4].damage} dmg</button>
                                <button type="button" id='move-5' class="btn ${bgcolor[axieData[i].parts[5].class.toLowerCase()]} axie-moves">${axieData[i].parts[5].name}</br>${axieData[i].parts[5].damage} dmg</button>
                                `;
        calEnemies.innerHTML = `
                                <div class="btn-group" role="group">
                                    <button type="button" id='ene-0' class="btn bg-color-plant active bd-none-r">Plant-Reptile</button>    
                                    <button type="button" id='ene-1' class="btn bg-color-aqua bd-none-l bd-none-r">Aqua-Bird</button>    
                                    <button type="button" id='ene-2' class="btn bg-color-bug bd-none-l">Beast-Bug</button>    
                                <div>
                                
        `;
        calBuff.innerHTML = `
                                <div class="btn-group" role="group">
                                    <button type="button" id='buff-0' class="btn bg-color-down bd-none-r">-2Attack</button>    
                                    <button type="button" id='buff-1' class="btn bg-color-down bd-none-l bd-none-r">-Attack</button>    
                                    <button type="button" id='buff-3' class="btn bg-color-up bd-none-l bd-none-r">+Attack</button>    
                                    <button type="button" id='buff-4' class="btn bg-color-up bd-none-l">+2Attack</button>    
                                <div>
                                
        `;
    }) 
}

let moveStacks =[];

const switchingAxie = () =>{
    moveStacks =[];
    calTotal.innerHTML = '';
    calResult.innerHTML = '';
    calReset.innerHTML ='';
    count = 0;
}

calMoves.addEventListener('click', (e)=>{
    if (e.target && e.target.matches('.axie-moves')){
        for (let i=0;i<=3;i++){
            calBuff.children[0].children[i].classList.remove('active')
        }
        // calReset.scrollIntoView(false);
        let numberofMove = e.target.id.match(/(\d+)/)[0];
        let move = axieData[chosenOne].parts[numberofMove];
        let newMove = JSON.parse(JSON.stringify(move));
        console.log(newMove);
        newMove.buff =1;
        if (count<=3){
            moveStacks.push(newMove);
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
    if (e.target && e.target.matches('button') && moveStacks.length>0){
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
        return typeAdvantage(typeOf(axieData[chosenOne].class), enemy.id);
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
    return (1+(axieData[chosenOne].stats.skill*0.55-12.25)/100*0.985);
}

const getSameClassMulti = (move)=>{
    return axieData[chosenOne].class==move.class?1.1:1;
}


calContent.addEventListener('click',(e)=>{
    if (e.target && e.target.matches('button')){
        window.scrollTo(0,document.body.scrollHeight);
        let stackHtml = ``;
        let totalDmg =0;
        for (let i=0;i<moveStacks.length;i++){
            // console.log(moveStacks.length);
            let dmg = (moveStacks[i].damage*moveStacks[i].buff*getEnemyMulti()*getSameClassMulti(moveStacks[i]));
            if (moveStacks.length>1){
                dmg *= getComboBonus(moveStacks[i].damage);
            }
            dmg = Math.floor(dmg);
            let len = moveStacks.length;
            stackHtml = stackHtml.concat(`<div class='move-stacks ${bgcolor[moveStacks[i].class.toLowerCase()]} '>${moveStacks[i].name}: ${dmg}</div>`);
            totalDmg += dmg;
        }
        // console.log(stackHtml);
        calResult.innerHTML = stackHtml;
        calTotal.innerHTML = `  <h1>${totalDmg}</h1>`;
        if (calResult.innerHTML!=""){
            calReset.innerHTML = `Wanna try again? <icon class="fa fa-undo"></icon>`;
        }
    }
})

calReset.addEventListener('click',()=>{
    switchingAxie();
})

const typeOf = (e) => {
    let teamPlant = ['plant', 'reptile', 'dusk'];
    let teamAqua = ['aquatic', 'bird', 'dawn'];
    let teamBeast = ['bug', 'beast', 'mech'];
    
    if (teamPlant.includes(e.toLowerCase())) return 'ene-0';
    if (teamAqua.includes(e.toLowerCase())) return 'ene-1';
    if (teamBeast.includes(e.toLowerCase())) return 'ene-2';
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

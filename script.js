// load color from invidual axies
import bgcolor from "./shared/bgcolor.js";
// load fetching function
import getData from "./shared/getAxieData.js";
const calImages = document.querySelector('.cal-image-box');
const calMoves = document.querySelector('.cal-moves');
const calTotal = document.querySelector('.cal-total');
const calEnemies = document.querySelector('.cal-enemies');
const calBuff = document.querySelector('.cal-buff');
const calResult = document.querySelector('.cal-result');
const calContent = document.querySelector('.cal-content-box');
const calReset = document.querySelector('.cal-reset');
let axieBoxes;
let selectButton;

let axieData = {};
let count = 0;
let chosenOne;
let inputAxie = document.querySelector('.axie-input');

// load card abilities
let cardData;

const fetchAbi = async() => {
    const response = await fetch('./shared/card-abilities.json');
    cardData = await response.json();
}

fetchAbi();
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
        // loading screen on
        // if (axieData.length>0){
        //     raiseLoadingIcon();
        // }
        inputAxie.blur();
        let loadingElement = document.querySelector('.loading-section');
        loadingElement.style.display ="block";

        // process loading data
        let axieAdress = "0x".concat(backPart);
        let tempData;

        getData(axieAdress).then(data => {
            tempData = data.data.axies.results;
            console.log(tempData);
        })
        let counter = 0;
        let loop = setInterval(()=>{
            if (counter>4){
                loadingElement.style.display = 'none';
                raiseErrorGetData();
                raiseErrorCheckMarks(1);
                clearInterval(loop);
            }
            else {
                if (tempData && tempData.length>0){
                    console.log("Succesfully loaded data!");
                    axieData = tempData;
                    addAxies2();
                    document.querySelector('#contain-bg').style.opacity = 0;
                    document.querySelector('.content-section').style.display = 'block';
                    loadingElement.style.display = 'none';
                    inputAxie.classList.add('done');
                    inputAxie.parentNode.classList.add('done');
                    inputAxie.blur();
                    setTimeout(() => {
                        document.querySelector('.navbar-section').classList.add('active');
                    }, 500);            
                    raiseErrorCheckMarks();                 
                    clearInterval(loop);
                }
                else{
                    console.log(`Try again...(${counter})`);
                }
            }
            counter++;
        }, 1000)
        loadingElement.innerHTML = `<h1>Loading</h1><icon class="fa fa-undo loading-icon"></icon>`;
    }
    
})
// const AddAxies = () => {
//     let axieImgElements = document.querySelectorAll('.axie-img');
//     let axieSkillElements = document.querySelectorAll('.axie-skills');
//     for (let i =0;i<axieData.length;i++){
//         axieImgElements[i].innerHTML = `<img class='img-fluid' src=${axieData[i].image}>`;
//         let skillHtml = axieData[i].parts.map((skill)=>{
//             return `<li>${skill.name}</li>`
//         })
//         let html = `<ul class="list-unstyled">`+ skillHtml.splice(2,4).join(``)+`</ul>`;
//         axieSkillElements[i].innerHTML =    html;
//     };

const addAxies2 = () => {
    let axieBoxElement = document.querySelector('#axie-box-section');
    let axieBox = ``;
    for (let i =0;i<axieData.length;i++){
        let initHtml = ` 
            <div class="col-12 col-md-4 px-3 mb-1">
            <div class="row axie-box">`;
        let imgHtml = `
            <div class="col col-5 axie-img  align-self-center">
                <img class='img-fluid' src=${axieData[i].image}>
            </div>
            `;
        let skillHtml = axieData[i].parts.map((skill)=>{
            return `<li>${skill.name}</li>`
        }).splice(2,4).join(``);
        skillHtml = `<div class="col col-4 axie-skills align-self-center">
            <ul class="list-unstyled">`+ skillHtml +`</ul></div>`;
        let arrowHtml = `
            <div class="col col-3 align-self-center"> 
                <a href="#"><i class="fa fa-arrow-right fa-2x select-box"></i> </a>
            </div></div></div>`;
        axieBox += initHtml.concat(imgHtml,skillHtml,arrowHtml);
    };
    axieBoxElement.innerHTML = axieBox;
    axieBoxes = document.querySelectorAll('.axie-box');
    selectButton = document.querySelectorAll('i.fa-arrow-right');
    addEvent_AxieBoxes();
}
// }
// const showLoadingSection = () =>{
//     let loadingElement = document.querySelector('.loading-section');
//     if (axieData.length<1){
//         loadingElement.style.display ="none";
//     }
const raiseErrorGetData = () => {
    let page = document.body;
    let noti = document.createElement('div');
    noti.className = "notify-box";
    noti.innerText = "Can't get those Axies. Try again!";
    console.log(noti);
    page.appendChild(noti);
    setTimeout(() => {
        noti.classList.add('out');
        setTimeout(()=>{
            page.removeChild(noti);
        }, 1000);
    }, 2100);
}

const raiseLoadingIcon = () => {
    const inputSection = document.querySelector('.input-section');
    inputSection.removeChild(inputSection.lastChild);
    let e = document.createElement('div');
    e.innerHTML = `<span class="fa fa-undo loading-icon">`;
    e.className = 'input-checkmarks';
    inputSection.appendChild(e);
    setTimeout(() => {
        e.className += " in";
    }, 50)
}

const raiseErrorCheckMarks = (c = 0) => {
    const inputSection = document.querySelector('.input-section');
    inputSection.removeChild(inputSection.lastChild);
    let e = document.createElement('div');
    e.className = 'input-checkmarks';
    if (c==0){
        e.innerHTML = `<span class="fa fa-check text-success">`;
    }
    else{
        e.innerHTML = `<span class="fa fa-close text-danger">`;
    }
    inputSection.appendChild(e);
    setTimeout(() => {
        e.className += " in";
    }, 50)
    setTimeout(() => {
        e.className = "input-checkmarks out";
    }, 2100);

}

const getAxieDamage = skill => {
    const keyArr = Object.keys(cardData);
    const move = keyArr.find((x)=>{
        return cardData[x].partName.includes(skill.name);
    })
    return cardData[move].defaultAttack;
}

const getCardImgURL = skill => {
    const keyArr = Object.keys(cardData);
    const move = keyArr.find((x)=>{
        return cardData[x].partName.includes(skill.name);
    })
    return `https://cdn.axieinfinity.com/game/cards/base/${move}.png`;
}

let testObj = {
    "id": "tail-hot-butt",
    "name": "Hot Butt",
    "class": "Plant",
    "type": "Tail",
    "specialGenes": null,
    "__typename": "AxiePart",
    "damage": 80,
    "buff": 1
}
let axieCard = document.querySelector('.axie-box-new');
// axieCard.children[0].innerHTML = `<img src='${getCardImgURL(testObj)}' class='img-fluid'>`;
const getCardImg = url => {
    
}

const addEvent_AxieBoxes = () => {
    for (let i=0;i<  axieData.length;i++){
        selectButton[i].addEventListener('mouseenter', function(){
            selectButton[i].classList.remove('fa-2x');
            selectButton[i].classList.add('fa-3x');
            axieBoxes[i].classList.add('axie-box-green');
        
        })

        selectButton[i].addEventListener('mouseleave', function(){
            selectButton[i].classList.remove('fa-3x');
            selectButton[i].classList.add('fa-2x');
            axieBoxes[i].classList.remove('axie-box-green');
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
            console.log('Axie number '+     chosenOne);
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
            setTimeout(()=>{
                let botPos = document.querySelector('.calculator-section').offsetTop;
                window.scrollTo(0,botPos)
            },50);
        }) 
    }
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

const getEnemyMulti = (i)=>{
    const enemy = document.querySelector('.cal-enemies .active');
    if (enemy){
        return typeAdvantage(typeOf(moveStacks[i].class), enemy.id);
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
    return axieData[chosenOne].class==moveStacks[move].class?1.1:1;
}


calContent.addEventListener('click',(e)=>{
    if (e.target && (e.target.matches('button') || e.target.matches('.move-stacks'))){
        setTimeout(() => {
            window.scrollTo(0,document.body.scrollHeight);
        }, 50);
        let stackHtml = ``;
        let totalDmg =0;
        for (let i=0;i<moveStacks.length;i++){
            // console.log(moveStacks.length);
            let dmg = (moveStacks[i].damage*moveStacks[i].buff*getEnemyMulti(i)*getSameClassMulti(i));
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
        // Remove skills from combos
        let stackArr = document.querySelectorAll('.move-stacks');
        for (let j=0;j<stackArr.length; j++){
            stackArr[j].addEventListener('click',()=>{
                count--;
                moveStacks.splice(j,1);
            })
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

// const gridMode = 

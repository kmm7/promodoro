const focusTime = 25 * 60 * 1000; // 25 minutes
const storageItem = 'startTimer';
let remainingTimeDiv;


window.onload = onLoad();

function onLoad(){
    remainingTimeDiv = document.querySelector('#remainingTime');
}


function formatMinSec(value){
    if (value>9)
        return value;
    else
        return '0'+value;
}

function millisToMinutes(millis){
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis - minutes * 60000) / 1000);
    return `${formatMinSec(minutes)}:${formatMinSec(seconds)}`;
}

function count(){
    let startTime = localStorage.getItem(storageItem);
    let remainingTime = focusTime - (Date.now() - startTime);
    if (remainingTime<=0)
    // done!
        console.log('completed!');
    else{
        let remainingTimeStr = millisToMinutes(remainingTime);
        document.title = remainingTimeStr;
        remainingTimeDiv.innerHTML = remainingTimeStr;
        setTimeout(count, 1000);
    }
}

function startCounting(evt){
    localStorage.setItem(storageItem, Date.now());
    count();
}
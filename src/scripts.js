let activeTimer;
const timers =     [
    {
        name: 'focus',
        time: 2 * 60 * 1000
    },
    {
        name: 'short-break',
        time: 5 * 60 * 1000
    },
    {
        name: 'long-break',
        time: 15 * 60 * 1000
    }
];
let runningTimer;

const storageItem = 'startTimer';
let remainingTimeDiv;


window.onload = onLoad();

function onLoad(){
    activeTimer = 'focus';
    var tabs = document.querySelectorAll('nav div');
    tabs.forEach(tab=>tab.addEventListener('click', ()=>{
        if (activeTimer !== tab.dataset.timerName){
            clearTimeout(runningTimer);

            tabs.forEach(t=>t.classList.remove('highlited'));
            activeTimer = tab.dataset.timerName;
            tab.classList.add('highlited');
            
            showCounter(getActiveTimerDuration());
        }
    }));

    remainingTimeDiv = document.querySelector('#remainingTime');

    showCounter(getActiveTimerDuration());
    askForNotificationPermission();
}

function getActiveTimerDuration(){
    const activeTimerObject = timers.find(p=>p.name === activeTimer);
    return activeTimerObject.time;
}
function askForNotificationPermission(){
    if (!("Notification" in window))
    return;

    if (["granted", "denied"].indexOf(Notification.permission) == -1) {
        Notification.requestPermission();
    }
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
    let remainingTime = getActiveTimerDuration() - (Date.now() - startTime);
    if (remainingTime<=0)
    // done!
        sendNotification();
    else{
        showCounter(remainingTime);
        runningTimer = setTimeout(count, 1000);
    }
}

function showCounter(remainingTime){
    let remainingTimeStr = millisToMinutes(remainingTime);
    document.title = `${activeTimer} ${remainingTimeStr}`;
    remainingTimeDiv.innerHTML = remainingTimeStr;
}

function sendNotification(){
    if (!("Notification" in window))
        return;

    if (Notification.permission === "granted") {
        var notification = new Notification("Timer ended!");
    }
}

function startCounting(evt){
    localStorage.setItem(storageItem, Date.now());
    count();
}
let activeTimer;
const timers =     [
    {
        name: 'focus',
        time: 2 * 60 * 1000,
        'main-background': '#582A72',
        'main-color': '#6B457F',
        'highlihted-color': '#9C91A2'
    },
    {
        name: 'short-break',
        time: 5 * 60 * 1000,
        'main-background':'#294F6D',
        'main-color':'#43637B',
        'highlihted-color':'#8C959C'
    },
    {
        name: 'long-break',
        time: 15 * 60 * 1000,
        'main-background':'#AA5939',
        'main-color':'#BE7D63',
        'highlihted-color':'#F2E0D8'
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
            
            setTheme();
            showCounter(getActiveTimerDuration());
        }
    }));

    remainingTimeDiv = document.querySelector('#remainingTime');

    showCounter(getActiveTimerDuration());
    askForNotificationPermission();
}

function setTheme(){
    const activeTimerObject = timers.find(p=>p.name === activeTimer);
    ['main-background', 'main-color', 'highlihted-color'].forEach(
        attr=>{
            document.querySelector(':root').style.setProperty(`--${attr}`, activeTimerObject[attr]);
        }
    );
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
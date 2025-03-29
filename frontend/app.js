// 全局变量
let eventIdCounter = 1;
let storedEvents = [];
let selectedDate = null;
let currentEvent = null;
let calendar = null;
let currentUser = null;

// 喝水数据
let waterAmount = 0;
const waterGoal = 2000;
let waterReminder = null;

// 桌宠相关
let petSpeechTimeoutId = null;
const petMessages = [
    "记得按时喝水哦！",
    "每天喝够8杯水很重要！",
    "现在休息一下，喝点水吧！",
    "保持身体水分是健康的关键！",
    "嘿，别忘了完成今天的日程安排！",
    "今天的工作进展如何？需要我提醒什么吗？",
    "保持规律作息，身体会感谢你的！",
    "工作之余也要注意休息哦~"
];

// 初始化应用
function initializeApp() {
    initializeCalendar();
    updateWaterLevel();
    initializePet();
}

// 页面加载完成后检查是否有已登录用户
$(document).ready(function () {
    const lastLoggedInUser = localStorage.getItem('lastLoggedInUser');
    if (lastLoggedInUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        currentUser = users.find(u => u.username === lastLoggedInUser);

        if (currentUser) {
            loadUserData();
            initializeApp();
            showAppPage();
            startWaterReminder();
        } else {
            showLoginPage();
        }
    } else {
        showLoginPage();
    }
});
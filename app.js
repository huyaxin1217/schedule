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

// 请求通知权限
if (Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
}

// 通知提醒函数 + 桌宠抖动
function notifyUser(title) {
    if (Notification.permission === "granted") {
        new Notification("日程提醒", {
            body: `喂！现在是 ${title}！别拖了，快去做事！`,
        });
    }

    const pet = document.getElementById("pet");
    if (pet) {
        pet.classList.add("shake");
        setTimeout(() => pet.classList.remove("shake"), 1000);
    }
}

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
function checkEventsForReminder() {
    const now = new Date();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    storedEvents.forEach(event => {
        if (event.userId !== currentUser.id) return;

        const eDate = new Date(event.start);
        const diff = Math.abs(now.getTime() - eDate.getTime());

        if (diff <= 30000) { // 在事件时间前后30秒内提醒
            notifyUser(event.title);
            showPopup(event.title);
        }
    });
}

setInterval(checkEventsForReminder, 1000); // 每秒检查一次
function showPopup(title) {
    const popup = document.createElement("div");
    popup.innerText = `提醒：你该 "${title}" 啦！`;
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.background = "#ff4d4f";
    popup.style.color = "#fff";
    popup.style.padding = "15px 20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    popup.style.zIndex = 9999;
    popup.style.fontSize = "16px";

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 8000);
}


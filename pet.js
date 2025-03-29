// 初始化桌宠
function initializePet() {
    const pet = document.getElementById('pet');
    pet.classList.add('animated');

    // 定期让桌宠说话
    schedulePetMessages();

    // 添加点击事件
    pet.addEventListener('click', () => {
        const randomTip = [
            "需要我提醒你什么事情吗？",
            "不要忘记今天的任务哦！",
            "休息一下眼睛，看看远处吧！",
            "记得定期起来活动一下身体~",
            "保持良好心情是高效工作的关键！",
            `${currentUser.nickname}，今天过得怎么样？`,
            "我在这里陪着你，加油！"
        ][Math.floor(Math.random() * 7)];

        petSpeak(randomTip);
    });
}

// 让桌宠说话
function petSpeak(message) {
    const speechBubble = document.getElementById('pet-speech');
    speechBubble.textContent = message;

    const pet = document.getElementById('pet');
    pet.classList.add('talking');

    // 清除之前的定时器
    if (petSpeechTimeoutId) {
        clearTimeout(petSpeechTimeoutId);
    }

    // 5秒后隐藏对话
    petSpeechTimeoutId = setTimeout(() => {
        pet.classList.remove('talking');
    }, 5000);
}

// 设置定期随机消息
function schedulePetMessages() {
    // 每15-30分钟随机说一句话
    setInterval(() => {
        const randomMessage = petMessages[Math.floor(Math.random() * petMessages.length)];
        petSpeak(randomMessage);
    }, (15 + Math.random() * 15) * 60 * 1000);

    // 首次启动时先说一句
    setTimeout(() => {
        petSpeak(`${currentUser.nickname}，欢迎回来！今天有什么计划呢？`);
    }, 2000);
}
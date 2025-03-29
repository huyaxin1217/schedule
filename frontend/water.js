/* 喝水部分 */
function addWater(amount) {
    if (waterAmount + amount <= waterGoal) {
        waterAmount += amount;

        // 显示水滴动画
        createWaterDrops(3);

        // 桌宠喝水动画
        const pet = document.getElementById('pet');
        pet.classList.add('drinking');
        setTimeout(() => {
            pet.classList.remove('drinking');
        }, 2000);

        if (waterAmount >= waterGoal) {
            petSpeak("太棒了！今天的喝水目标已完成！💧");
        } else if (waterAmount >= waterGoal * 0.75) {
            petSpeak("做得好！已经完成了75%的喝水目标。继续保持！");
        } else if (waterAmount >= waterGoal * 0.5) {
            petSpeak("很不错！已经喝了一半的水了，继续加油！");
        } else {
            petSpeak("喝水+" + amount + "ml！💧 保持水分很重要哦~");
        }
    } else if (waterAmount < waterGoal) {
        waterAmount = waterGoal;
        petSpeak("恭喜！今日喝水目标已达成！🎉");
    } 
    updateWaterLevel();
    saveUserData();
}

function resetWater() {
    if (confirm("确定要重置今日喝水记录吗？")) {
        waterAmount = 0;
        updateWaterLevel();
        saveUserData();
        petSpeak("喝水记录已重置，记得保持水分摄入哦！");
    }
}

function updateWaterLevel() {
    const waterLevel = document.getElementById("water-level");
    const progressBar = document.getElementById("progress-bar");
    const waterPercentage = (waterAmount / waterGoal) * 100;
    waterLevel.style.height = waterPercentage + "%";
    progressBar.style.width = waterPercentage + "%";

    document.getElementById("current-amount").textContent = waterAmount;
    document.getElementById("goal-amount").textContent = waterGoal;
    document.getElementById("percentage").textContent = Math.round(waterPercentage);
}

// 创建水滴动画
function createWaterDrops(count) {
    const container = document.getElementById('water-drops');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'water-drop';

        // 随机位置
        const left = 10 + Math.random() * 80;
        const delay = Math.random() * 0.5;

        drop.style.left = `${left}%`;
        drop.style.top = '0';
        drop.style.width = `${8 + Math.random() * 12}px`;
        drop.style.height = `${8 + Math.random() * 12}px`;
        drop.style.animationDelay = `${delay}s`;

        container.appendChild(drop);

        // 一段时间后移除
        setTimeout(() => {
            if (drop.parentNode === container) {
                container.removeChild(drop);
            }
        }, 1500);
    }
}

// 喝水提醒定时器
function startWaterReminder() {
    // 检查是否已经有足够的水分摄入
    function checkWaterIntake() {
        const now = new Date();
        const hour = now.getHours();

        // 工作时间内 (9:00-18:00) 每2小时检查一次
        if (hour >= 9 && hour <= 18 && hour % 2 === 0 && waterAmount < waterGoal * (hour - 8) / 10) {
            petSpeak("已经 " + hour + " 点了，该喝水了！保持水分摄入很重要哦。💧");
        }
    }

    // 初始检查
    checkWaterIntake();

    // 每30分钟检查一次
    waterReminder = setInterval(checkWaterIntake, 30 * 60 * 1000);
}
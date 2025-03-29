// 用户管理功能
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'none';
}

function showRegisterPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'flex';
    document.getElementById('app-page').style.display = 'none';
}

function showAppPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'block';

    // 初始化用户头像和名称
    if (currentUser) {
        const avatar = document.getElementById('user-avatar');
        avatar.textContent = currentUser.nickname.charAt(0).toUpperCase();
        document.getElementById('user-name').textContent = currentUser.nickname;
    }

    // 确保日历正确渲染
    if (calendar) {
        setTimeout(() => {
            calendar.fullCalendar('render');
        }, 100);
    }
}

// 注册功能
function register() {
    // 重置错误信息
    document.getElementById('register-username-error').textContent = '';
    document.getElementById('register-nickname-error').textContent = '';
    document.getElementById('register-password-error').textContent = '';
    document.getElementById('register-confirm-password-error').textContent = '';

    // 获取表单数据
    const username = document.getElementById('register-username').value.trim();
    const nickname = document.getElementById('register-nickname').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // 表单验证
    let isValid = true;

    if (!username) {
        document.getElementById('register-username-error').textContent = '请输入用户名';
        isValid = false;
    }

    if (!nickname) {
        document.getElementById('register-nickname-error').textContent = '请输入昵称';
        isValid = false;
    }

    if (!password) {
        document.getElementById('register-password-error').textContent = '请设置密码';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('register-password-error').textContent = '密码长度至少6位';
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById('register-confirm-password-error').textContent = '两次密码输入不一致';
        isValid = false;
    }

    if (!isValid) return;

    // 检查用户名是否已存在
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        document.getElementById('register-username-error').textContent = '用户名已存在';
        return;
    }

    // 创建新用户
    const newUser = {
        username,
        nickname,
        password, // 实际应用中应加密
        events: [],
        waterRecord: {
            amount: 0,
            date: new Date().toDateString()
        }
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('注册成功！请登录');
    showLoginPage();
}

// 登录功能
function login() {
    // 重置错误信息
    document.getElementById('login-username-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';

    // 获取表单数据
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    // 表单验证
    if (!username) {
        document.getElementById('login-username-error').textContent = '请输入用户名';
        return;
    }

    if (!password) {
        document.getElementById('login-password-error').textContent = '请输入密码';
        return;
    }

    // 验证用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 登录成功
        currentUser = user;

        // 记住最后登录的用户
        localStorage.setItem('lastLoggedInUser', username);

        // 加载用户数据
        loadUserData();

        // 初始化日历和桌宠
        initializeApp();

        // 显示应用页面
        showAppPage();

        // 设置定时器检查喝水提醒
        startWaterReminder();
    } else {
        document.getElementById('login-password-error').textContent = '用户名或密码错误';
    }
}

// 退出登录
function logout() {
    // 保存用户数据
    saveUserData();

    // 清除当前用户
    currentUser = null;

    // 清除本地存储的最后登录用户
    localStorage.removeItem('lastLoggedInUser');

    // 清除提醒定时器
    if (waterReminder) {
        clearInterval(waterReminder);
    }

    // 返回登录页
    showLoginPage();
}

// 加载用户数据
function loadUserData() {
    if (!currentUser) return;

    // 加载事件
    storedEvents = [];
    if (currentUser.events && currentUser.events.length > 0) {
        currentUser.events.forEach(event => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            storedEvents.push(event);
        });

        const maxId = Math.max(...storedEvents.map(e => e.id || 0), 0);
        eventIdCounter = maxId + 1;
    }

    // 加载喝水记录
    if (currentUser.waterRecord) {
        const today = new Date().toDateString();
        if (currentUser.waterRecord.date === today) {
            waterAmount = currentUser.waterRecord.amount;
        } else {
            waterAmount = 0;
        }
    } else {
        waterAmount = 0;
    }
}

// 保存用户数据
function saveUserData() {
    if (!currentUser) return;

    // 保存事件
    currentUser.events = storedEvents;

    // 保存喝水记录
    currentUser.waterRecord = {
        amount: waterAmount,
        date: new Date().toDateString()
    };

    // 更新localStorage中的用户数据
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.username === currentUser.username);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}
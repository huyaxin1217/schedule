// 日程页面与喝水页面切换
function showPage(page) {
    const pages = document.querySelectorAll(".content");
    pages.forEach((p) => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
    if (page === "schedule" && calendar) {
        calendar.fullCalendar("render");
    }
}

// 初始化日历
function initializeCalendar() {
    calendar = $("#calendar").fullCalendar({
        header: {
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay",
        },
        lang: 'zh-cn',
        timeFormat: 'H:mm',
        defaultTimedEventDuration: "00:30:00",
        forceEventDuration: true,
        slotDuration: "00:30:00",
        allDaySlot: false,
        selectable: true,
        editable: true,
        eventLimit: true,
        nowIndicator: true,
        eventSources: [
            function (start, end, timezone, callback) {
                callback(storedEvents);
            },
        ],
        eventRender: function (event, element) {
            // 让标题、描述都能在week/day视图里正常显示
            if (event.description) {
                element.attr("title", event.description);
            }
        },
        dayClick: function (date, jsEvent, view) {
            selectedDate = date;
            let defaultTime = view.name === "month" ? "09:00" : date.format("HH:mm");
            document.getElementById("event-id").value = "";
            document.getElementById("event-title").value = "";
            document.getElementById("event-date").value = date.format("YYYY-MM-DD");
            document.getElementById("event-start-time").value = defaultTime;
            document.getElementById("event-end-time").value = moment(date)
                .add(30, "minutes")
                .format("HH:mm");
            document.getElementById("event-color").value = "#3788d8";
            document.getElementById("event-description").value = "";
            document.getElementById("event-modal").style.display = "flex";
        },
        eventClick: function (event) {
            currentEvent = event;
            const action = confirm(
                `事件：${event.title}\n\n• 点击确定编辑此事件\n• 点击取消删除此事件`
            );
            if (action) {
                // 编辑
                document.getElementById("event-id").value = event.id;
                document.getElementById("event-title").value = event.title;
                document.getElementById("event-date").value =
                    moment(event.start).format("YYYY-MM-DD");
                document.getElementById("event-start-time").value =
                    moment(event.start).format("HH:mm");
                document.getElementById("event-end-time").value =
                    moment(event.end).format("HH:mm");
                document.getElementById("event-color").value = event.color || "#3788d8";
                document.getElementById("event-description").value =
                    event.description || "";
                document.getElementById("event-modal").style.display = "flex";
            } else {
                // 删除
                const index = storedEvents.findIndex((e) => e.id === event.id);
                if (index !== -1) {
                    storedEvents.splice(index, 1);
                    saveUserData();
                    calendar.fullCalendar("removeEvents", event.id);
                }
            }
        },
        eventDrop: function (event) {
            const index = storedEvents.findIndex((e) => e.id === event.id);
            if (index !== -1) {
                storedEvents[index].start = event.start.toDate();
                storedEvents[index].end = event.end.toDate();
                saveUserData();
            }
        },
        eventResize: function (event) {
            const index = storedEvents.findIndex((e) => e.id === event.id);
            if (index !== -1) {
                storedEvents[index].end = event.end.toDate();
                saveUserData();
            }
        },

        // 渲染农历
        dayRender: function (date, cell) {
            try {
                const lunar = Lunar.fromDate(date.toDate());
                const yi = lunar.getDayYi().join("、");
                const ji = lunar.getDayJi().join("、");
                const shortYi = lunar.getDayYi()[0] || "无";
                const shortJi = lunar.getDayJi()[0] || "无";
                const almanacHtml = `
                  <div class="almanac-info" title="宜：${yi}\n忌：${ji}">
                    <span class="tag tag-yi">宜</span> ${shortYi}<br />
                    <span class="tag tag-ji">忌</span> ${shortJi}
                  </div>
                `;
                cell.append(almanacHtml);
            } catch (e) {
                console.warn("黄历加载失败:", e);
            }
        },
    });
}

// 添加新事件
function addNewEvent() {
    selectedDate = moment();
    document.getElementById("event-id").value = "";
    document.getElementById("event-title").value = "";
    document.getElementById("event-date").value = selectedDate.format("YYYY-MM-DD");
    document.getElementById("event-start-time").value =
        selectedDate.format("HH:mm");
    document.getElementById("event-end-time").value = selectedDate
        .add(30, "minutes")
        .format("HH:mm");
    document.getElementById("event-color").value = "#3788d8";
    document.getElementById("event-description").value = "";
    document.getElementById("event-modal").style.display = "flex";
}

// 保存事件
function saveEvent() {
    const id = document.getElementById("event-id").value;
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const startTime = document.getElementById("event-start-time").value;
    const endTime = document.getElementById("event-end-time").value;
    const color = document.getElementById("event-color").value;
    const description = document.getElementById("event-description").value;

    if (!title || !date || !startTime || !endTime) {
        alert("请填写必填字段！");
        return;
    }

    const start = moment(`${date}T${startTime}`).toDate();
    const end = moment(`${date}T${endTime}`).toDate();

    if (end <= start) {
        alert("结束时间必须晚于开始时间！");
        return;
    }

    if (id) {
        // 更新
        const index = storedEvents.findIndex((e) => e.id === parseInt(id));
        if (index !== -1) {
            storedEvents[index].title = title;
            storedEvents[index].start = start;
            storedEvents[index].end = end;
            storedEvents[index].color = color;
            storedEvents[index].description = description;
        }
    } else {
        // 新建
        const newEvent = {
            id: eventIdCounter++,
            title: title,
            start: start,
            end: end,
            color: color,
            description: description,
            allDay: false,
        };
        storedEvents.push(newEvent);
    }

    saveUserData();
    calendar.fullCalendar("refetchEvents");
    hideEventForm();

    // 让桌宠说话
    petSpeak("事件已保存！你的日程已更新。");
}

// 清除所有事件
function clearAllEvents() {
    if (confirm("确定要清除所有事件吗？此操作不可恢复！")) {
        storedEvents = [];
        saveUserData();
        calendar.fullCalendar("removeEvents");

        // 让桌宠说话
        petSpeak("所有事件已清除，现在你可以重新规划了。");
    }
}

// 隐藏事件表单
function hideEventForm() {
    document.getElementById("event-modal").style.display = "none";
}

// 一月总结
function showSummary() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const countPerDay = Array(daysInMonth).fill(0);

    storedEvents.forEach((e) => {
        const date = new Date(e.start);
        if (
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth
        ) {
            countPerDay[date.getDate() - 1]++;
        }
    });

    const labels = countPerDay.map((_, i) => `${i + 1}日`);
    if (window.summaryChartInstance) {
        window.summaryChartInstance.destroy();
    }
    const ctx = document.getElementById("summaryChart").getContext("2d");
    window.summaryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "事件数",
                    data: countPerDay,
                    backgroundColor: "rgba(76, 175, 80, 0.7)",
                    borderColor: "#4caf50",
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: "rgba(76, 175, 80, 1)"
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        precision: 0
                    },
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.1)"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.1)"
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: "#333"
                }
            },
            animation: {
                duration: 1000,
                easing: "easeOutQuart"
            }
        },
    });
    document.getElementById("summary-modal").style.display = "flex";
}

function hideSummary() {
    document.getElementById("summary-modal").style.display = "none";
}
// グラフ描画モジュール

let charts = {};

/**
 * すべてのグラフを初期化
 */
function initializeCharts() {
    // 既存のチャートを破棄
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
}

/**
 * 年代別の円グラフを作成
 */
function createPaymentChart(stats) {
    const ctx = document.getElementById('paymentChart');
    
    if (charts.payment) {
        charts.payment.destroy();
    }

    const sortedData = sortAgeGroups(stats.ageGroups);
    const labels = sortedData.map(d => d[0]);
    const values = sortedData.map(d => d[1]);

    const data = {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: [
                '#667eea',
                '#764ba2',
                '#f093fb',
                '#4facfe',
                '#43e97b',
                '#fa709a',
                '#fee140',
                '#30cfd0',
                '#a8edea'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    charts.payment = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}人 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * キャンパスツアー参加状況の円グラフを作成
 */
function createTourChart(stats) {
    const ctx = document.getElementById('tourChart');
    
    if (charts.tour) {
        charts.tour.destroy();
    }

    const data = {
        labels: Object.keys(stats.tourParticipation),
        datasets: [{
            data: Object.values(stats.tourParticipation),
            backgroundColor: [
                '#43e97b',
                '#fa709a',
                '#fee140',
                '#30cfd0'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    charts.tour = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}人 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 送迎バス利用状況の円グラフを作成
 */
function createBusChart(stats) {
    const ctx = document.getElementById('busChart');
    
    if (charts.bus) {
        charts.bus.destroy();
    }

    const data = {
        labels: Object.keys(stats.busUsage),
        datasets: [{
            data: Object.values(stats.busUsage),
            backgroundColor: [
                '#4facfe',
                '#00f2fe',
                '#fa709a',
                '#fee140'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    charts.bus = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}人 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 卒業回別(年齢)参加者数の棒グラフを作成
 */
function createGraduationChart(stats, hideZero = true) {
    const ctx = document.getElementById('graduationChart');
    
    if (charts.graduation) {
        charts.graduation.destroy();
    }

    let sortedData = sortGraduationRoundsWithAge(stats.graduationRoundsWithAge);
    
    // チェックボックスの状態に応じて0人の回をフィルタリング
    if (hideZero) {
        sortedData = sortedData.filter(d => d[1] > 0);
    }
    
    const labels = sortedData.map(d => d[0]);
    const values = sortedData.map(d => d[1]);

    const data = {
        labels: labels,
        datasets: [{
            label: '参加者数',
            data: values,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    charts.graduation = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 90,
                        minRotation: 45,
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `参加者数: ${context.parsed.y}人`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 年代別参加者数の棒グラフを作成
 */
function createAgeGroupChart(stats) {
    const ctx = document.getElementById('ageGroupChart');
    
    if (charts.ageGroup) {
        charts.ageGroup.destroy();
    }

    const sortedData = sortAgeGroups(stats.ageGroups);
    const labels = sortedData.map(d => d[0]);
    const values = sortedData.map(d => d[1]);

    const data = {
        labels: labels,
        datasets: [{
            label: '参加者数',
            data: values,
            backgroundColor: 'rgba(250, 112, 154, 0.8)',
            borderColor: 'rgba(250, 112, 154, 1)',
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    charts.ageGroup = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `参加者数: ${context.parsed.y}人`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 人気クラブTOP10の横棒グラフを作成
 */
function createClubChart(stats) {
    const ctx = document.getElementById('clubChart');
    
    if (charts.club) {
        charts.club.destroy();
    }

    const topClubs = getTopClubs(stats.clubs, 10);
    const labels = topClubs.map(c => c[0]);
    const values = topClubs.map(c => c[1]);

    const data = {
        labels: labels,
        datasets: [{
            label: '参加者数',
            data: values,
            backgroundColor: 'rgba(118, 75, 162, 0.8)',
            borderColor: 'rgba(118, 75, 162, 1)',
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    charts.club = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `参加者数: ${context.parsed.x}人`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 日毎の申込推移グラフを作成（棒グラフ+折れ線グラフの混合）
 */
function createDailyTrendChart(dailyData) {
    const ctx = document.getElementById('dailyTrendChart');
    
    if (charts.dailyTrend) {
        charts.dailyTrend.destroy();
    }

    if (!dailyData || dailyData.length === 0) {
        return;
    }

    const labels = dailyData.map(d => d.dateLabel);
    const dailyCounts = dailyData.map(d => d.count);
    const cumulativeCounts = dailyData.map(d => d.cumulative);

    const data = {
        labels: labels,
        datasets: [
            {
                type: 'bar',
                label: '日毎の申込数',
                data: dailyCounts,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 4,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: '累積申込数',
                data: cumulativeCounts,
                borderColor: 'rgba(250, 112, 154, 1)',
                backgroundColor: 'rgba(250, 112, 154, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(250, 112, 154, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    };

    charts.dailyTrend = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: '日毎の申込数',
                        font: {
                            size: 12
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    },
                    title: {
                        display: true,
                        text: '累積申込数',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value}人`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * すべてのグラフを更新
 */
function updateAllCharts(stats, dailyData) {
    const hideZero = document.getElementById('hideZeroRounds')?.checked ?? true;
    
    createPaymentChart(stats);
    createTourChart(stats);
    createBusChart(stats);
    createDailyTrendChart(dailyData);
    createGraduationChart(stats, hideZero);
    createAgeGroupChart(stats);
    createClubChart(stats);
}

// Made with Bob

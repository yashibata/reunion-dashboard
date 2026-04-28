// フィルタリング機能モジュール

/**
 * フィルターUIを初期化
 */
function initializeFilters() {
    // 卒業年フィルターの選択肢を設定
    const graduationFilter = document.getElementById('graduationFilter');
    const graduationYears = getGraduationYears();
    
    graduationYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        graduationFilter.appendChild(option);
    });

    // フィルター変更イベントリスナーを設定
    document.getElementById('graduationFilter').addEventListener('change', applyFilters);
    document.getElementById('paymentFilter').addEventListener('change', applyFilters);
    document.getElementById('tourFilter').addEventListener('change', applyFilters);
    document.getElementById('busFilter').addEventListener('change', applyFilters);

    // リセットボタンのイベントリスナー
    document.getElementById('resetFilters').addEventListener('click', resetAllFilters);
}

/**
 * フィルターを適用
 */
function applyFilters() {
    const filters = {
        graduation: document.getElementById('graduationFilter').value,
        payment: document.getElementById('paymentFilter').value,
        tour: document.getElementById('tourFilter').value,
        bus: document.getElementById('busFilter').value
    };

    // データをフィルタリング
    const filtered = filterData(filters);

    // 統計を再計算
    const stats = calculateStatistics(filtered);

    // UIを更新
    updateSummaryCards(stats);
    updateAllCharts(stats);

    console.log('フィルター適用:', filters, '結果:', filtered.length, '件');
}

/**
 * すべてのフィルターをリセット
 */
function resetAllFilters() {
    // フィルター選択をリセット
    document.getElementById('graduationFilter').value = 'all';
    document.getElementById('paymentFilter').value = 'all';
    document.getElementById('tourFilter').value = 'all';
    document.getElementById('busFilter').value = 'all';

    // データをリセット
    const data = resetFilters();

    // 統計を再計算
    const stats = calculateStatistics(data);

    // UIを更新
    updateSummaryCards(stats);
    updateAllCharts(stats);

    console.log('フィルターをリセットしました');
}

/**
 * 現在のフィルター状態を取得
 */
function getCurrentFilters() {
    return {
        graduation: document.getElementById('graduationFilter').value,
        payment: document.getElementById('paymentFilter').value,
        tour: document.getElementById('tourFilter').value,
        bus: document.getElementById('busFilter').value
    };
}

/**
 * フィルターの状態を表示
 */
function displayFilterStatus() {
    const filters = getCurrentFilters();
    const activeFilters = Object.entries(filters)
        .filter(([key, value]) => value !== 'all')
        .map(([key, value]) => `${key}: ${value}`);

    if (activeFilters.length > 0) {
        console.log('アクティブなフィルター:', activeFilters.join(', '));
    } else {
        console.log('フィルターなし（全データ表示）');
    }
}

// Made with Bob

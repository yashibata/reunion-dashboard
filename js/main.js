// メインアプリケーションロジック

/**
 * アプリケーションの初期化
 */
async function initializeApp() {
    try {
        console.log('アプリケーションを初期化中...');

        // ローディング表示
        showLoading();

        // CSVデータを読み込む
        await loadCSVData();
        console.log('データ読み込み完了');

        // フィルターUIを初期化
        initializeFilters();
        console.log('フィルター初期化完了');

        // 初期データで統計を計算
        const data = getFilteredData();
        const stats = calculateStatistics(data);
        console.log('統計計算完了:', stats);

        // UIを更新
        updateSummaryCards(stats);
        updateAllCharts(stats);

        // ローディングを非表示
        hideLoading();

        console.log('アプリケーション初期化完了！');
        console.log(`総参加者数: ${stats.total}人`);

    } catch (error) {
        console.error('初期化エラー:', error);
        showError('データの読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

/**
 * ローディング表示
 */
function showLoading() {
    const container = document.querySelector('.container');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<p>データを読み込み中...</p>';
    container.appendChild(loadingDiv);
}

/**
 * ローディング非表示
 */
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

/**
 * エラーメッセージを表示
 */
function showError(message) {
    hideLoading();
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 20px;
        margin: 20px;
        border-radius: 10px;
        border: 2px solid #f5c6cb;
        text-align: center;
        font-size: 1.1em;
    `;
    errorDiv.innerHTML = `
        <h3>⚠️ エラー</h3>
        <p>${message}</p>
    `;
    container.insertBefore(errorDiv, container.firstChild);
}

/**
 * データをエクスポート（CSV形式）
 */
function exportToCSV() {
    const data = getFilteredData();
    const headers = ['No.', '卒業年・回', '所属クラブ名', '会費支払方法', 'キャンパスツアー', '送迎バス', '登録日時'];
    
    let csv = headers.join(',') + '\n';
    
    data.forEach((row, index) => {
        const line = [
            index + 1,
            row['卒業年・回'] || '',
            row['所属クラブ名'] || '',
            row['会費支払方法'] || '',
            row['キャンパス\nツアー申込'] || row['キャンパスツアー申込'] || '',
            row['送迎バス'] || '',
            row['登録日時'] || ''
        ].map(field => `"${field}"`).join(',');
        
        csv += line + '\n';
    });
    
    // BOMを追加してExcelで正しく開けるようにする
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `同窓会参加者_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('CSVエクスポート完了');
}

/**
 * 統計サマリーを表示
 */
function showStatisticsSummary() {
    const data = getFilteredData();
    const stats = calculateStatistics(data);
    
    console.log('=== 統計サマリー ===');
    console.log(`総参加者数: ${stats.total}人`);
    console.log('\n支払方法:');
    Object.entries(stats.paymentMethods).forEach(([method, count]) => {
        const percent = ((count / stats.total) * 100).toFixed(1);
        console.log(`  ${method}: ${count}人 (${percent}%)`);
    });
    console.log('\nキャンパスツアー:');
    Object.entries(stats.tourParticipation).forEach(([status, count]) => {
        const percent = ((count / stats.total) * 100).toFixed(1);
        console.log(`  ${status}: ${count}人 (${percent}%)`);
    });
    console.log('\n送迎バス:');
    Object.entries(stats.busUsage).forEach(([status, count]) => {
        const percent = ((count / stats.total) * 100).toFixed(1);
        console.log(`  ${status}: ${count}人 (${percent}%)`);
    });
    console.log('\n卒業回別(年齢) TOP 10:');
    sortGraduationRoundsWithAge(stats.graduationRoundsWithAge).slice(0, 10).forEach(([label, count]) => {
        const percent = ((count / stats.total) * 100).toFixed(1);
        console.log(`  ${label}: ${count}人 (${percent}%)`);
    });
    console.log('\n人気クラブ TOP 5:');
    getTopClubs(stats.clubs, 5).forEach(([club, count], index) => {
        console.log(`  ${index + 1}. ${club}: ${count}人`);
    });
    console.log('==================');
}

/**
 * ページ読み込み時に実行
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('同窓会参加者分析ダッシュボード起動');
    initializeApp();
    
    // チェックボックスのイベントリスナーを設定
    const hideZeroCheckbox = document.getElementById('hideZeroRounds');
    if (hideZeroCheckbox) {
        hideZeroCheckbox.addEventListener('change', function() {
            const data = getFilteredData();
            const stats = calculateStatistics(data);
            updateAllCharts(stats);
            console.log('0人の回の表示を切り替えました:', this.checked ? '非表示' : '表示');
        });
    }
    
    // グローバル関数として公開（デバッグ用）
    window.exportToCSV = exportToCSV;
    window.showStatisticsSummary = showStatisticsSummary;
    window.applyFilters = applyFilters;
    window.resetAllFilters = resetAllFilters;
    
    console.log('利用可能なコマンド:');
    console.log('  - exportToCSV(): フィルター済みデータをCSVでエクスポート');
    console.log('  - showStatisticsSummary(): 統計サマリーをコンソールに表示');
    console.log('  - resetAllFilters(): すべてのフィルターをリセット');
});

// Made with Bob

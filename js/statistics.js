// 統計計算モジュール

/**
 * 卒業年から年齢を計算（卒業時19歳として計算）
 */
function calculateAge(graduationStr) {
    if (!graduationStr) return null;
    
    const match = graduationStr.match(/(\d{4})年/);
    if (match) {
        const graduationYear = parseInt(match[1]);
        const currentYear = 2026; // 現在の年
        const age = 19 + (currentYear - graduationYear);
        return age;
    }
    return null;
}

/**
 * 卒業回を抽出
 */
function extractGraduationRound(graduationStr) {
    if (!graduationStr) return '不明';
    
    const match = graduationStr.match(/(\d+)回/);
    if (match) {
        return match[1] + '回';
    }
    return '不明';
}

/**
 * 卒業回と年齢を統合したラベルを作成
 */
function createGraduationAgeLabel(graduationStr) {
    const round = extractGraduationRound(graduationStr);
    const age = calculateAge(graduationStr);
    
    if (round === '不明' || age === null) {
        return '不明';
    }
    
    return `${round}(${age}歳)`;
}

/**
 * 年齢から年代を取得
 */
function getAgeGroup(age) {
    if (age === null) return '不明';
    const decade = Math.floor(age / 10) * 10;
    return `${decade}代`;
}

/**
 * 基本統計を計算
 */
function calculateStatistics(data) {
    const stats = {
        total: data.length,
        paymentMethods: {},
        tourParticipation: {},
        busUsage: {},
        graduationRoundsWithAge: {},
        ageGroups: {},
        clubs: {}
    };

    // 全ての回を初期化（1回から76回まで）
    for (let i = 1; i <= 76; i++) {
        const age = 19 + (2026 - (1951 + i - 1)); // 1回は1951年卒業
        const label = `${i}回(${age}歳)`;
        stats.graduationRoundsWithAge[label] = 0;
    }

    data.forEach(row => {
        // 支払方法の集計
        const payment = row['会費支払方法']?.trim() || '未選択';
        stats.paymentMethods[payment] = (stats.paymentMethods[payment] || 0) + 1;

        // キャンパスツアーの集計
        const tour = row['キャンパス\nツアー申込']?.trim() || row['キャンパスツアー申込']?.trim() || '未選択';
        stats.tourParticipation[tour] = (stats.tourParticipation[tour] || 0) + 1;

        // 送迎バスの集計
        const bus = row['送迎バス']?.trim() || '未選択';
        stats.busUsage[bus] = (stats.busUsage[bus] || 0) + 1;

        // 卒業回(年齢)の集計
        const graduation = row['卒業年・回']?.trim() || '不明';
        const graduationAgeLabel = createGraduationAgeLabel(graduation);
        if (graduationAgeLabel !== '不明') {
            stats.graduationRoundsWithAge[graduationAgeLabel] = (stats.graduationRoundsWithAge[graduationAgeLabel] || 0) + 1;
        }

        // 年代別の集計
        const age = calculateAge(graduation);
        const ageGroup = getAgeGroup(age);
        stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1;

        // クラブの集計
        const club = row['所属クラブ名']?.trim();
        if (club) {
            // 複数のクラブが記載されている場合は分割
            const clubs = club.split(/[、・,]/).map(c => c.trim()).filter(c => c);
            clubs.forEach(c => {
                stats.clubs[c] = (stats.clubs[c] || 0) + 1;
            });
        }
    });

    return stats;
}

/**
 * サマリーカードの値を更新
 */
function updateSummaryCards(stats) {
    // 総参加者数
    document.getElementById('totalParticipants').textContent = stats.total;

    // オンライン決済
    const onlinePayment = stats.paymentMethods['オンライン決済'] || 0;
    const onlinePercent = stats.total > 0 ? ((onlinePayment / stats.total) * 100).toFixed(1) : 0;
    document.getElementById('onlinePayment').textContent = onlinePayment;
    document.getElementById('onlinePaymentPercent').textContent = `${onlinePercent}%`;

    // ツアー参加
    const tourParticipants = stats.tourParticipation['参加する'] || 0;
    const tourPercent = stats.total > 0 ? ((tourParticipants / stats.total) * 100).toFixed(1) : 0;
    document.getElementById('tourParticipants').textContent = tourParticipants;
    document.getElementById('tourPercent').textContent = `${tourPercent}%`;

    // バス利用
    const busUsers = stats.busUsage['利用する'] || 0;
    const busPercent = stats.total > 0 ? ((busUsers / stats.total) * 100).toFixed(1) : 0;
    document.getElementById('busUsers').textContent = busUsers;
    document.getElementById('busPercent').textContent = `${busPercent}%`;
}


/**
 * トップNのクラブを取得
 */
function getTopClubs(clubStats, n = 10) {
    return Object.entries(clubStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n);
}

/**
 * 卒業回(年齢)を並び替え（年齢の若い順 = 回数の大きい順）
 */
function sortGraduationRoundsWithAge(data) {
    return Object.entries(data).sort((a, b) => {
        // 不明は最後に
        if (a[0] === '不明') return 1;
        if (b[0] === '不明') return -1;
        
        // 回数を抽出して数値として比較（降順：大きい回数が左）
        const roundA = parseInt(a[0].match(/(\d+)回/)?.[1] || '0');
        const roundB = parseInt(b[0].match(/(\d+)回/)?.[1] || '0');
        return roundB - roundA;
    });
}

/**
 * 年代別を並び替え
 */
function sortAgeGroups(data) {
    return Object.entries(data).sort((a, b) => {
        // 不明は最後に
        if (a[0] === '不明') return 1;
        if (b[0] === '不明') return -1;
        
        // 年代を抽出して数値として比較
        const ageA = parseInt(a[0]);
        const ageB = parseInt(b[0]);
        return ageA - ageB;
    });
}

/**
 * パーセンテージを計算
 */
function calculatePercentage(value, total) {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
}


// Made with Bob

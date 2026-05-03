// データローダー - CSVファイルを読み込んでパースする

let rawData = [];
let filteredData = [];

/**
 * CSVファイルを読み込む
 */
function loadCSVData() {
    return new Promise((resolve, reject) => {
        Papa.parse('data/participants.csv', {
            download: true,
            header: true,
            encoding: 'UTF-8',
            skipEmptyLines: true,
            complete: function(results) {
                console.log('CSV読み込み完了:', results.data.length, '件');
                rawData = results.data.filter(row => row['回答'] === '参加' || row['回答'] === '参加 ');
                filteredData = [...rawData];
                resolve(rawData);
            },
            error: function(error) {
                console.error('CSV読み込みエラー:', error);
                reject(error);
            }
        });
    });
}

/**
 * データから卒業年代のリストを取得
 */
function getGraduationYears() {
    const years = new Set();
    rawData.forEach(row => {
        const graduation = row['卒業年・回'];
        if (graduation) {
            years.add(graduation.trim());
        }
    });
    return Array.from(years).sort();
}

/**
 * データから年代（10年単位）を抽出
 */
function extractDecade(graduationStr) {
    if (!graduationStr) return '不明';
    
    // 昭和、平成、令和から西暦を抽出
    const match = graduationStr.match(/(\d{4})年/);
    if (match) {
        const year = parseInt(match[1]);
        const decade = Math.floor(year / 10) * 10;
        return `${decade}年代`;
    }
    return '不明';
}

/**
 * データをフィルタリング
 */
function filterData(filters) {
    filteredData = rawData.filter(row => {
        // 卒業年フィルター
        if (filters.graduation !== 'all') {
            if (row['卒業年・回']?.trim() !== filters.graduation) {
                return false;
            }
        }

        // 支払方法フィルター
        if (filters.payment !== 'all') {
            const payment = row['会費支払方法']?.trim() || '';
            if (payment !== filters.payment) {
                return false;
            }
        }

        // キャンパスツアーフィルター
        if (filters.tour !== 'all') {
            const tour = row['キャンパス\nツアー申込']?.trim() || row['キャンパスツアー申込']?.trim() || '';
            if (tour !== filters.tour) {
                return false;
            }
        }

        // 送迎バスフィルター
        if (filters.bus !== 'all') {
            const bus = row['送迎バス']?.trim() || '';
            if (bus !== filters.bus) {
                return false;
            }
        }

        return true;
    });

    return filteredData;
}

/**
 * フィルターをリセット
 */
function resetFilters() {
    filteredData = [...rawData];
    return filteredData;
}

/**
 * 現在のフィルター済みデータを取得
 */
function getFilteredData() {
    return filteredData;
}

/**
 * 生データを取得
 */
function getRawData() {
    return rawData;
}

// Made with Bob

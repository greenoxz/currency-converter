import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TRANSLATIONS = {
  th: {
    appTitle: 'แลกเงิน',
    trackerTitle: 'ประวัติรายการ',
    marketRate: 'ที่อัตราแลกเปลี่ยนกลางของตลาด',
    offlineApp: 'แอปกำลังออฟไลน์ (อิงเรทตั้งแต่วันที่ {0})',
    offlineSimple: 'ใช้งานออฟไลน์ (ข้อมูลไม่อัปเดต)',
    saveLogBtn: 'บันทึกรายการ',
    tabChart: 'อัตราแลกเปลี่ยน',
    time_7d: '7 วัน',
    time_1m: '1 เดือน',
    time_6m: '6 เดือน',
    time_1y: '1 ปี',
    compareOthers: 'เทียบค่าเงินอื่นๆ เพิ่มเติม',
    addFav: '+ เพิ่มค่าเงิน',
    noFavs: 'คุณยังไม่มีค่าเงินอื่นๆ ในรายการโปรด',
    noHistory: 'ยังไม่มีประวัติการบันทึก',
    noHistorySub: '(กดปุ่ม "บันทึกรายการ" ที่หน้าหลักเพื่อเพิ่มรายการ)',
    edit: 'แก้ไข',
    spent: 'ใช้เงิน:',
    convertedTo: 'แลกเปลี่ยนเป็น:',
    rateAtSave: 'เรทตอนบันทึก:',
    rateToday: 'เรทวันนี้:',
    moreExpensive: 'แพงขึ้น',
    cheaper: 'ถูกลง',
    profitVal: '(กำไร/ประหยัดไป',
    lossVal: '(ขาดทุน',
    modalSaveNew: 'บันทึกรายจ่าย/แลกเงิน',
    modalSaveEdit: 'แก้ไขรายการ',
    txNameLabel: 'ชื่อรายการ (เช่น ซื้อกระเป๋า, จ่ายค่าพาสต้า)',
    txNamePlaceholder: 'ซื้อของฝาก...',
    calcFromApp: 'คำนวณจากแอป:',
    calcEstValue: 'มีมูลค่าประมาณ',
    actualRateLabel: 'เรทจริงที่ใช้',
    swapRate: 'สลับเรท',
    saveBtn: 'บันทึกรายการ',
    deleteBtn: 'ลบรายการนี้ทิ้ง',
    addCurrencyTitle: 'เพิ่มค่าเงิน',
    selectCurrencyTitle: 'เลือกสกุลเงิน',
    searchPlaceholder: 'ค้นหา...',
    modalChartTitle: 'ประวัติ',
    tabHome: 'แลกเงิน',
    tabTracker: 'ประวัติรายการ',
    invalidInput: 'กรุณากรอกชื่อรายการและเรทให้ถูกต้อง',
    chartRateLabel: 'อัตราแลกเปลี่ยน',
    tableDate: 'วันที่',
    tableRate: 'เรท',
    tabSettings: 'ตั้งค่า',
    mainCurrencyLabel: 'สกุลเงินหลักของคุณ',
    ratesTableTitle: 'อัตราแลกเปลี่ยนวันนี้ (เทียบ {0})',
    allCurrencies: 'ทุกสกุลเงิน',
    clearAllData: 'ล้างข้อมูลทั้งหมด',
    confirmClear: 'คุณแน่ใจหรือไม่ว่าต้องการลบประวัติรายการทั้งหมด?',
    copySuccess: 'คัดลอกแล้ว!',
    darkMode: 'โหมดมืด',
    lightMode: 'โหมดสว่าง'
  },
  en: {
    appTitle: 'Exchange',
    trackerTitle: 'History',
    marketRate: 'at mid-market exchange rate',
    offlineApp: 'App offline (Rates from {0})',
    offlineSimple: 'Offline mode (Data not updated)',
    saveLogBtn: 'Save Record',
    tabChart: 'Rates',
    time_7d: '7D',
    time_1m: '1M',
    time_6m: '6M',
    time_1y: '1Y',
    compareOthers: 'Compare Other Currencies',
    addFav: '+ Add Currency',
    noFavs: 'You have no favorite currencies yet.',
    noHistory: 'No saved history',
    noHistorySub: '(Click "Save Record" on the Home tab to add manually)',
    edit: 'Edit',
    spent: 'Spent:',
    convertedTo: 'Converted to:',
    rateAtSave: 'Saved rate:',
    rateToday: 'Current rate:',
    moreExpensive: 'More expensive',
    cheaper: 'Cheaper',
    profitVal: '(Saved / Profit',
    lossVal: '(Loss of',
    modalSaveNew: 'Save Transaction',
    modalSaveEdit: 'Edit Record',
    txNameLabel: 'Item Name',
    txNamePlaceholder: 'Souvenirs...',
    calcFromApp: 'App calc:',
    calcEstValue: 'estimated value',
    actualRateLabel: 'Actual rate used',
    swapRate: 'Swap',
    saveBtn: 'Save Record',
    deleteBtn: 'Delete Record',
    addCurrencyTitle: 'Add Currency',
    selectCurrencyTitle: 'Select Currency',
    searchPlaceholder: 'Search...',
    modalChartTitle: 'History',
    tabHome: 'Convert',
    tabTracker: 'History',
    invalidInput: 'Please enter a valid item name and rate.',
    chartRateLabel: 'Exchange Rate',
    tableDate: 'Date',
    tableRate: 'Rate',
    tabSettings: 'Settings',
    mainCurrencyLabel: 'Your Main Currency',
    ratesTableTitle: 'Rate Table (vs {0})',
    allCurrencies: 'All Currencies',
    clearAllData: 'Clear All History',
    confirmClear: 'Are you sure you want to delete all transaction history?',
    copySuccess: 'Copied!',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode'
  },
  zh: {
    appTitle: '汇率换算',
    trackerTitle: '交易记录',
    marketRate: '按中间市场汇率',
    offlineApp: '离线模式（汇率更新于 {0}）',
    offlineSimple: '离线模式（数据未更新）',
    saveLogBtn: '保存记录',
    tabChart: '汇率',
    time_7d: '7天',
    time_1m: '1月',
    time_6m: '6月',
    time_1y: '1年',
    compareOthers: '比较其他货币',
    addFav: '+ 添加货币',
    noFavs: '您还没有收藏的货币',
    noHistory: '没有保存的记录',
    noHistorySub: '（在主页点击“保存记录”来添加项目）',
    edit: '编辑',
    spent: '花费：',
    convertedTo: '兑换为：',
    rateAtSave: '保存汇率：',
    rateToday: '今日汇率：',
    moreExpensive: '变贵了',
    cheaper: '变便宜了',
    profitVal: '（节省了',
    lossVal: '（亏损',
    modalSaveNew: '保存交易',
    modalSaveEdit: '编辑记录',
    txNameLabel: '项目名称',
    txNamePlaceholder: '纪念品...',
    calcFromApp: 'App计算：',
    calcEstValue: '估值约',
    actualRateLabel: '实际使用的汇率',
    swapRate: '切换',
    saveBtn: '保存',
    deleteBtn: '删除此记录',
    addCurrencyTitle: '添加货币',
    selectCurrencyTitle: '选择货币',
    searchPlaceholder: '搜索...',
    modalChartTitle: '图表',
    tabHome: '汇率',
    tabTracker: '记录',
    invalidInput: '请输入有效的项目名称和汇率。',
    chartRateLabel: '汇率',
    tableDate: '日期',
    tableRate: '汇率',
    tabSettings: '设置',
    mainCurrencyLabel: '您的主货币',
    ratesTableTitle: '今日汇率 (对比 {0})',
    allCurrencies: '所有货币',
    clearAllData: '清除所有历史记录',
    confirmClear: '您确定要删除所有交易历史记录吗？',
    copySuccess: '已复制！',
    darkMode: '深色模式',
    lightMode: '浅色模式'
  }
};

const CURRENCY_DATA = {
  USD: { name: 'US Dollar', flag: 'us' },
  THB: { name: 'Thai Baht', flag: 'th' },
  EUR: { name: 'Euro', flag: 'eu' },
  JPY: { name: 'Japanese Yen', flag: 'jp' },
  GBP: { name: 'British Pound', flag: 'gb' },
  AUD: { name: 'Australian Dollar', flag: 'au' },
  CAD: { name: 'Canadian Dollar', flag: 'ca' },
  CHF: { name: 'Swiss Franc', flag: 'ch' },
  CNY: { name: 'Chinese Renminbi', flag: 'cn' },
  SGD: { name: 'Singapore Dollar', flag: 'sg' },
  HKD: { name: 'Hong Kong Dollar', flag: 'hk' },
  KRW: { name: 'South Korean Won', flag: 'kr' },
  TWD: { name: 'New Taiwan Dollar', flag: 'tw' },
  MYR: { name: 'Malaysian Ringgit', flag: 'my' },
  VND: { name: 'Vietnamese Dong', flag: 'vn' },
  IDR: { name: 'Indonesian Rupiah', flag: 'id' },
  PHP: { name: 'Philippine Peso', flag: 'ph' },
  INR: { name: 'Indian Rupee', flag: 'in' },
  AED: { name: 'UAE Dirham', flag: 'ae' },
  NZD: { name: 'New Zealand Dollar', flag: 'nz' }
};

function generateMockHistory(currentRate, lang, timeframe = '1m') {
  const data = [];
  let days = 30;
  if (timeframe === '7d') days = 7;
  else if (timeframe === '1m') days = 30;
  else if (timeframe === '6m') days = 180;
  else if (timeframe === '1y') days = 365;

  let currentSimRate = currentRate;
  let simulatedRates = [currentSimRate];
  for (let i = 1; i <= days; i++) {
    const fluctuation = 1 + (Math.random() * 0.016 - 0.008);
    currentSimRate = currentSimRate * fluctuation;
    simulatedRates.push(currentSimRate);
  }
  simulatedRates.reverse();

  const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
  
  for(let i=days; i>=0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({ date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }), rate: Number(simulatedRates[days - i].toFixed(4)) });
  }
  return data;
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'th');
  const t = TRANSLATIONS[lang] || TRANSLATIONS['th'];

  const [activeTab, setActiveTab] = useState('home');

  // --- Home Tab States ---
  const [fromCurrency, setFromCurrency] = useState(() => localStorage.getItem('fromCurrency') || 'CNY');
  const [toCurrency, setToCurrency] = useState(() => localStorage.getItem('toCurrency') || 'THB');
  const [amount, setAmount] = useState(() => localStorage.getItem('amount') || '1000');
  
  const [rates, setRates] = useState(() => {
    const savedRates = localStorage.getItem('exchangeRates');
    return savedRates ? JSON.parse(savedRates) : null;
  }); 

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites_light');
    return savedFavs ? JSON.parse(savedFavs) : ['USD', 'JPY', 'KRW'];
  });
  
  const [mainCurrency, setMainCurrency] = useState(() => localStorage.getItem('mainCurrency') || 'THB');
  
  // --- Tracker States ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('tx_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txCustomRate, setTxCustomRate] = useState('');
  const [editingTxId, setEditingTxId] = useState(null);
  const [modalRateInverted, setModalRateInverted] = useState(false);

  const [loading, setLoading] = useState(!rates);
  const [lastUpdated, setLastUpdated] = useState(() => localStorage.getItem('lastUpdated') || null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('1m');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (activeTab === 'chart' && rates) {
      setChartData(generateMockHistory(getTargetRateValue(toCurrency), lang, chartTimeframe));
    }
  }, [activeTab, fromCurrency, toCurrency, lang, chartTimeframe, rates]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [copyToast, setCopyToast] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      if (themeColor) themeColor.setAttribute('content', '#121212');
    } else {
      document.body.classList.remove('dark-mode');
      if (themeColor) themeColor.setAttribute('content', '#ffffff');
    }
  }, [isDarkMode]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    });
  };

  const clearAllHistory = () => {
    if (window.confirm(t.confirmClear)) {
      setTransactions([]);
      localStorage.removeItem('tx_history');
    }
  };


  useEffect(() => {
    const fetchRates = async () => {
      try {
        const apiKey = import.meta.env.VITE_ER_API_KEY;
        let finalRates = null;
        let dataSource = 'Global API';

        // 1. Try fetching from v6 authenticated API if Key is available
        if (apiKey && apiKey !== "เอา_API_KEY_จริงตรงนี้" && apiKey !== "") {
          try {
            const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
            if (res.ok) {
              const data = await res.json();
              if (data.result === 'success') {
                finalRates = data.conversion_rates;
                dataSource = 'Premium API';
              }
            }
          } catch (e) {
            console.warn("v6 API Fetch failed, falling back to v4", e);
          }
        }

        // 2. Fallback to v4 free API if v6 failed or no key
        if (!finalRates) {
          const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          const data = await res.json();
          finalRates = data.rates;
          dataSource = 'Global API';
        }

        setRates(finalRates);
        
        const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
        const now = new Date().toLocaleString(locale);
        const stampMsg = `${now} (${dataSource})`;
        
        setLastUpdated(stampMsg);
        localStorage.setItem('exchangeRates', JSON.stringify(finalRates));
        localStorage.setItem('lastUpdated', stampMsg);
        setIsOfflineMode(false);
      } catch (err) {
        console.error("Failed to fetch rates:", err);
        setIsOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (navigator.onLine === false) {
      setIsOfflineMode(true);
      setLoading(false);
    } else {
      fetchRates();
    }

    const handleOnline = () => { setIsOfflineMode(false); fetchRates(); };
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang]); // Refetch/update time locale if language changes

  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
    localStorage.setItem('toCurrency', toCurrency);
    localStorage.setItem('amount', amount);
    localStorage.setItem('favorites_light', JSON.stringify(favorites));
    localStorage.setItem('mainCurrency', mainCurrency);
  }, [fromCurrency, toCurrency, amount, favorites, mainCurrency]);

  useEffect(() => {
    localStorage.setItem('tx_history', JSON.stringify(transactions));
  }, [transactions]);

  // --- Core Calculation ---
  const getTargetRateValue = (code = toCurrency, base = fromCurrency) => {
    if (!rates) return 0;
    const oneBaseInUSD = 1 / rates[base];
    return oneBaseInUSD * rates[code];
  };

  const getConvertedAmount = (code = toCurrency) => {
    if (!rates || !amount) return '0.00';
    const rateValue = getTargetRateValue(code);
    const convertedAmount = parseFloat(amount) * rateValue;

    if (['JPY', 'KRW', 'VND'].includes(code)) return Math.round(convertedAmount).toLocaleString('en-US');
    return convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const exchangeRateText = (() => {
    const rate = getTargetRateValue(toCurrency);
    if(rate === 0) return '';
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  })();

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSelectCurrency = (code) => {
    if (activeDropdown === 'from') setFromCurrency(code);
    else if (activeDropdown === 'to') setToCurrency(code);
    else if (activeDropdown === 'main') setMainCurrency(code);
    else if (activeDropdown === 'favorite') {
      if (!favorites.includes(code)) setFavorites(prev => [...prev, code]);
    }
    setActiveDropdown(null);
  };

  // --- Tracker Handlers ---
  const openSaveDialog = (txId = null) => {
    if (txId) {
      const tx = transactions.find(t => t.id === txId);
      if(tx) {
        setEditingTxId(tx.id);
        setTxTitle(tx.title);
        setModalRateInverted(tx.rateInverted || false);
        const rateToDisplay = tx.rateInverted ? (1 / tx.customRate) : tx.customRate;
        setTxCustomRate(rateToDisplay.toFixed(4));
        setFromCurrency(tx.from);
        setToCurrency(tx.to);
        setAmount(tx.fromAmount.toString());
      }
    } else {
      setEditingTxId(null);
      setTxTitle('');
      setModalRateInverted(false);
      setTxCustomRate(getTargetRateValue(toCurrency).toFixed(4));
    }
    setShowSaveModal(true);
  };

  const saveTransaction = () => {
    let rateValue = parseFloat(txCustomRate);
    if(isNaN(rateValue) || !txTitle) return alert(t.invalidInput);

    if (modalRateInverted) {
      rateValue = 1 / rateValue;
    }

    const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');

    const newTx = {
      id: editingTxId || Date.now().toString(),
      title: txTitle,
      from: fromCurrency,
      to: toCurrency,
      fromAmount: parseFloat(amount),
      customRate: rateValue,
      rateInverted: modalRateInverted,
      date: new Date().toLocaleString(locale)
    };

    if (editingTxId) {
      setTransactions(prev => prev.map(tr => tr.id === editingTxId ? newTx : tr));
    } else {
      setTransactions(prev => [newTx, ...prev]);
      setActiveTab('tracker');
    }
    setShowSaveModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tr => tr.id !== id));
    setShowSaveModal(false);
  };

  const renderFlag = (code) => {
    const flagData = CURRENCY_DATA[code];
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" loading="lazy" />;
  };

  if (loading) {
    return (
      <div className="app-container" style={{justifyContent: 'center'}}>
        <div className="loader-container"><div className="loader"></div></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      <div className="header-container">
        <h1 className="header-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1}}>
            <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {activeTab === 'home' ? t.appTitle : activeTab === 'chart' ? t.chartRateLabel : activeTab === 'settings' ? t.tabSettings : t.trackerTitle}
            </span>
            {deferredPrompt && (
              <button onClick={handleInstallClick} style={{background: '#a3e635', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0}}>INSTALL</button>
            )}
          </div>
          <div style={{position: 'relative'}}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{display: 'flex', alignItems: 'center', gap: '6px', background: '#f9fafb', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)'}}>
              <img src={`https://flagcdn.com/w40/${lang === 'en' ? 'gb' : (lang === 'zh' ? 'cn' : 'th')}.png`} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}} alt={lang} />
              <span style={{fontSize: '13px', fontWeight: 600}}>{lang.toUpperCase()}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {showLangMenu && (
              <>
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90}} onClick={() => setShowLangMenu(false)}></div>
                <div className="lang-menu" style={{position: 'absolute', top: '100%', right: 0, marginTop: '8px', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '100px', overflow: 'hidden'}}>
                  {[ {id: 'th', flag: 'th', label: 'TH'}, {id: 'en', flag: 'gb', label: 'EN'}, {id: 'zh', flag: 'cn', label: 'ZH'} ].map(l => (
                    <div 
                      key={l.id}
                      onClick={() => { setLang(l.id); localStorage.setItem('appLang', l.id); setShowLangMenu(false); }}
                      style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', cursor: 'pointer', background: lang === l.id ? (isDarkMode ? '#2e2e2e' : '#f3f4f6') : 'transparent', borderBottom: '1px solid var(--border-light)'}}
                    >
                      <img src={`https://flagcdn.com/w40/${l.flag}.png`} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}} alt={l.label}/>
                      <span style={{fontSize: '14px', fontWeight: lang === l.id ? 600 : 500, color: 'var(--text-main)'}}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </h1>
      </div>
      <div className="scrollable-content" key={activeTab}>

      {activeTab === 'home' && (
        <>
          <div className="converter-wrapper">
            <div className="currency-box">
              <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}}>
                {renderFlag(fromCurrency)}
                <span className="currency-code">{fromCurrency}</span>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <input type="text" inputMode="decimal" className="amount-input" value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0" />
            </div>

            <div className="swap-btn-container">
              <button className="swap-btn" onClick={handleSwap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
              </button>
            </div>

            <div className="currency-box">
              <div className="currency-selector" onClick={() => {setActiveDropdown('to'); setSearchQuery('')}}>
                {renderFlag(toCurrency)}
                <span className="currency-code">{toCurrency}</span>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="amount-display" style={{position: 'relative', cursor: 'pointer'}} onClick={() => copyToClipboard(getConvertedAmount(toCurrency))}>
                {getConvertedAmount(toCurrency)}
                {copyToast && (
                  <div style={{position: 'absolute', top: '-28px', right: 0, background: 'var(--accent-dark)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', animation: 'fadeInOut 2s forwards', fontWeight: 600}}>
                    {t.copySuccess}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rate-info-box">
            <svg className="rate-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <span className="rate-text">
                <strong>{exchangeRateText}</strong> {t.marketRate}
              </span>
              
              <div style={{fontSize: '11px', color: '#6b7280', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>อัปเดตล่าสุด: {lastUpdated ? lastUpdated.split(' (')[0] : '-'}</span>
                <span className="api-tag" style={{
                  background: lastUpdated && lastUpdated.includes('Premium API') ? '#dcfce7' : '#e5e7eb', 
                  padding: '3px 8px', 
                  borderRadius: '6px', 
                  fontWeight: 700, 
                  fontSize: '10px',
                  color: lastUpdated && lastUpdated.includes('Premium API') ? '#166534' : '#374151',
                  border: lastUpdated && lastUpdated.includes('Premium API') ? '1px solid #bbf7d0' : 'none'
                }}>
                  {lastUpdated && lastUpdated.includes('Premium API') ? 'Premium API' : 'Global API'}
                </span>
              </div>

              {isOfflineMode && lastUpdated && (
                <span style={{fontSize: '11.5px', color: '#dc2626', marginTop: '6px', fontWeight: 600}}>
                  {t.offlineApp.replace('{0}', lastUpdated.split(' (')[0])}
                </span>
              )}
            </div>
          </div>

          <div className="dual-btn-group">
            <button className="action-btn" style={{width: '100%'}} onClick={() => openSaveDialog()}>{t.saveLogBtn}</button>
          </div>

          <div className="favorites-header">
            <span>{t.compareOthers}</span>
            <button className="add-fav-btn" onClick={() => {setActiveDropdown('favorite'); setSearchQuery('')}}>{t.addFav}</button>
          </div>
          <div className="favorites-list-container">
            {favorites.map((code) => (
              <div key={code} className="fav-currency-box">
                <div className="fav-left">{renderFlag(code)} <span className="currency-code">{code}</span></div>
                <div className="fav-right">
                  <span className="fav-amount">{getConvertedAmount(code)}</span>
                  <button className="fav-remove-btn" onClick={() => setFavorites(prev => prev.filter(c => c !== code))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            ))}
            {favorites.length === 0 && (
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>
                {t.noFavs}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'tracker' && (
        <div className="tx-list">
          {transactions.length === 0 ? (
            <div style={{textAlign: 'center', marginTop: '40px', color: '#9ca3af', lineHeight: '1.5'}}>
              {t.noHistory}<br/><br/><b>{t.noHistorySub}</b>
            </div>
          ) : transactions.map(tx => {
            const currentLiveRate = getTargetRateValue(tx.to, tx.from);
            
            const costAtSave = tx.fromAmount * tx.customRate;
            const costToday = tx.fromAmount * currentLiveRate;
            
            const diffAmount = costToday - costAtSave; 
            const diffPercent = ((currentLiveRate - tx.customRate) / tx.customRate) * 100;
            
            const isProfit = diffAmount > 0;
            const statusText = isProfit ? t.moreExpensive : t.cheaper;
            const adviceText = isProfit ? `${t.profitVal} ${Math.abs(diffAmount).toFixed(2)} ${tx.to})` : `${t.lossVal} ${Math.abs(diffAmount).toFixed(2)} ${tx.to})`;
            
            return (
              <div key={tx.id} className="tx-card">
                <div className="tx-header">
                  <div>
                    <div className="tx-title">{tx.title}</div>
                    <div className="tx-date">{tx.date}</div>
                  </div>
                  <button className="edit-tx-btn" onClick={() => openSaveDialog(tx.id)}>{t.edit}</button>
                </div>
                <div className="tx-body">
                  <div className="tx-row">
                    <span>{t.spent}</span>
                    <strong>{tx.fromAmount.toLocaleString()} {tx.from}</strong>
                  </div>
                  <div className="tx-row">
                    <span>{t.convertedTo}</span>
                    <strong>{costAtSave.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} {tx.to}</strong>
                  </div>
                  <div className="tx-row">
                    <span>{t.rateAtSave}</span>
                    <strong>1 {tx.rateInverted ? tx.to : tx.from} = {tx.rateInverted ? (1/tx.customRate).toFixed(4) : tx.customRate.toFixed(4)} {tx.rateInverted ? tx.from : tx.to}</strong>
                  </div>
                  <div className="tx-result">
                    <span style={{fontSize: '12px'}}>{t.rateToday} {tx.rateInverted ? (1/currentLiveRate).toFixed(4) : currentLiveRate.toFixed(4)}</span>
                    <span className={isProfit ? 'profit' : 'loss'}>
                      {statusText} {Math.abs(diffPercent).toFixed(2)}%<br/>
                      <span style={{fontSize: '11px'}}>{adviceText}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="chart-page" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div className="chart-header-controls" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-light)'
          }}>
            <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}} style={{flex: 1}}>
              {renderFlag(fromCurrency)} 
              <span className="currency-code">{fromCurrency}</span>
            </div>
            <button className="swap-btn-small" onClick={handleSwap} style={{
              background: '#f9fafb', border: '1px solid var(--border-light)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)', margin: '0 8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
            </button>
            <div className="currency-selector" onClick={() => {setActiveDropdown('to'); setSearchQuery('')}} style={{flex: 1, justifyContent: 'flex-end'}}>
              <span className="currency-code">{toCurrency}</span>
              {renderFlag(toCurrency)} 
            </div>
          </div>

          <div className="chart-timeframe-selector" style={{display: 'flex', gap: '8px'}}>
            {['7d', '1m', '6m', '1y'].map((tf) => (
              <button 
                key={tf}
                className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                onClick={() => setChartTimeframe(tf)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid',
                  borderColor: chartTimeframe === tf ? 'var(--accent)' : 'var(--border-light)',
                  background: chartTimeframe === tf ? '#f7fee7' : '#ffffff',
                  color: chartTimeframe === tf ? 'var(--accent-dark)' : 'var(--text-muted)',
                  fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                }}
              >
                {t[`time_${tf}`]}
              </button>
            ))}
          </div>

          <div className="chart-container-box" style={{ padding: '20px 10px', borderRadius: '16px', border: '1px solid var(--border-light)', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', textAlign: 'center', fontWeight: 600}}>
              1 {fromCurrency} = {getTargetRateValue(toCurrency).toFixed(4)} {toCurrency}
            </h3>
            <div style={{flex: 1, width: '100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} style={{ outline: 'none' }}>
                  <XAxis 
                    dataKey="date" 
                    stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={10} 
                    tickFormatter={(val) => val.split(' ')[0] + ' ' + (val.split(' ')[1] || '')}
                    minTickGap={20}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={10} 
                    width={45}
                    tickFormatter={(val) => val.toFixed(4)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'var(--accent-dark)', fontWeight: 600 }}
                    formatter={(value) => [value, t.chartRateLabel]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--accent)" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 5, fill: 'var(--accent)', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 style={{margin: '16px 0 12px 0', fontSize: '15px', color: 'var(--text-muted)', fontWeight: 600}}>
            {t.ratesTableTitle.replace('{0}', mainCurrency)}
          </h3>

          <div className="chart-table-container" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '80px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-light)' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{t.allCurrencies}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>{t.tableRate}</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(CURRENCY_DATA).filter(c => c !== mainCurrency).map((code, idx) => {
                  const rateToShow = getTargetRateValue(mainCurrency, code);
                  return (
                    <tr key={code} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} onClick={() => { setFromCurrency(code); setToCurrency(mainCurrency); setActiveTab('home'); window.scrollTo({top:0, behavior:'smooth'}); }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderFlag(code)}
                        <span>1 {code}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--accent-dark)', fontWeight: 600 }}>
                        {rateToShow.toFixed(4)} {mainCurrency}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-page" style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px'}}>
          <div style={{background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)'}}>
            <label className="form-label" style={{marginBottom: '12px'}}>{t.mainCurrencyLabel}</label>
            <div className="currency-selector" onClick={() => {setActiveDropdown('main'); setSearchQuery('')}} style={{
              border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                {renderFlag(mainCurrency)}
                <span className="currency-code">{mainCurrency}</span>
                <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[mainCurrency]?.name}</span>
              </div>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div style={{background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <label className="form-label" style={{margin: 0}}>{isDarkMode ? t.darkMode : t.lightMode}</label>
            <div 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              style={{
                width: '50px', height: '26px', background: isDarkMode ? 'var(--accent)' : '#d1d5db',
                borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
               <div style={{
                 width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                 position: 'absolute', top: '3px', left: isDarkMode ? '27px' : '3px', transition: 'all 0.3s',
                 boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
               }}></div>
            </div>
          </div>

          <button 
            onClick={clearAllHistory}
            className="danger-btn"
            style={{
              background: '#fee2e2', color: '#dc2626', border: 'none', padding: '16px',
              borderRadius: '16px', fontWeight: 600, cursor: 'pointer', fontSize: '15px'
            }}
          >
            {t.clearAllData}
          </button>
          
          <div style={{textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '12px'}}>
            Exchange App v2.0 • Premium Edition
          </div>
        </div>
      )}

      {/* -- Modals -- */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setShowSaveModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>{editingTxId ? t.modalSaveEdit : t.modalSaveNew}</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">{t.txNameLabel}</label>
              <input type="text" className="form-input" value={txTitle} onChange={e => setTxTitle(e.target.value)} placeholder={t.txNamePlaceholder} autoFocus />
            </div>

            <div className="form-group">
              <label className="form-label" style={{color: 'var(--accent-dark)'}}>{t.calcFromApp} {amount} {fromCurrency} {t.calcEstValue} {getConvertedAmount(toCurrency)} {toCurrency}</label>
            </div>

            <div className="form-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <label className="form-label" style={{margin: 0}}>
                  {t.actualRateLabel} (1 {modalRateInverted ? toCurrency : fromCurrency} = ... {modalRateInverted ? fromCurrency : toCurrency})
                </label>
                <button 
                  onClick={() => {
                    const currentVal = parseFloat(txCustomRate);
                    if (!isNaN(currentVal) && currentVal !== 0) {
                      setTxCustomRate((1 / currentVal).toFixed(4));
                    }
                    setModalRateInverted(!modalRateInverted);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'transparent', border: '1px solid #d1d5db',
                    padding: '4px 8px', borderRadius: '8px', fontSize: '11px',
                    cursor: 'pointer', fontWeight: 600, color: '#4b5563'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
                  {t.swapRate}
                </button>
              </div>
              <input type="number" step="0.0001" className="form-input" value={txCustomRate} onChange={e => setTxCustomRate(e.target.value)} />
            </div>

            <button className="action-btn" onClick={saveTransaction}>{t.saveBtn}</button>
            {editingTxId && <button className="delete-tx-btn" onClick={() => deleteTransaction(editingTxId)}>{t.deleteBtn}</button>}
          </div>
        </div>
      )}

      {activeDropdown && (
        <div className="modal-overlay" onClick={() => setActiveDropdown(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setActiveDropdown(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>{activeDropdown === 'favorite' ? t.addCurrencyTitle : t.selectCurrencyTitle}</h2>
            </div>
            <input type="text" className="search-input" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
            <div className="currency-list">
              {Object.keys(CURRENCY_DATA)
                .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()) || CURRENCY_DATA[c].name.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter(c => activeDropdown !== 'favorite' || (!favorites.includes(c) && c !== fromCurrency))
                .map(c => (
                <div key={c} className="currency-list-item" onClick={() => handleSelectCurrency(c)}>
                  {renderFlag(c)} <div><div className="currency-code">{c}</div><div style={{fontSize: '12px', color:'#6b7280'}}>{CURRENCY_DATA[c].name}</div></div>
                </div>
              ))}
              {Object.keys(CURRENCY_DATA).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()) || CURRENCY_DATA[c].name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                  {t.notFound}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>{t.tabHome}</span>
        </button>
        <button className={`nav-item ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <span>{t.tabChart}</span>
        </button>
        <button className={`nav-item ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>{t.tabTracker}</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>{t.tabSettings}</span>
        </button>
      </div>

    </div>
  );
}

export default App;

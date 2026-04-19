import React, { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './constants/translations';
import { generateMockHistory } from './utils/helpers';
import { Transaction, PriceAlert, Translation, PaymentCard } from './types';

// Importing components
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import TrackerTab from './components/TrackerTab';
import ChartTab from './components/ChartTab';
import SettingsTab from './components/SettingsTab';
import SaveTxModal from './components/SaveTxModal';
import CurrencyDropdown from './components/CurrencyDropdown';
import PriceAlertModal from './components/PriceAlertModal';
import DetailChartModal from './components/DetailChartModal';
import ContextMenuSheet from './components/ContextMenuSheet';
import BillSplitTab from './components/BillSplitTab';


const App: React.FC = () => {
  const [lang, setLang] = useState<string>(() => localStorage.getItem('appLang') || 'th');
  const t: Translation = TRANSLATIONS[lang] || TRANSLATIONS['th'];

  const [activeTab, setActiveTab] = useState<string>('home');

  // --- Home Tab States ---
  const [fromCurrency, setFromCurrency] = useState<string>(() => localStorage.getItem('fromCurrency') || 'USD');
  const [toCurrency, setToCurrency] = useState<string>(() => localStorage.getItem('toCurrency') || 'THB');
  const [chartFrom, setChartFrom] = useState<string>(() => localStorage.getItem('fromCurrency') || 'USD');
  const [chartTo, setChartTo] = useState<string>(() => localStorage.getItem('toCurrency') || 'THB');
  const [amount, setAmount] = useState<string>(() => localStorage.getItem('amount') || '1');
  
  const [rates, setRates] = useState<Record<string, number> | null>(() => {
    const savedRates = localStorage.getItem('exchangeRates');
    return savedRates ? JSON.parse(savedRates) : null;
  }); 

  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavs = localStorage.getItem('favorites_light');
    return savedFavs ? JSON.parse(savedFavs) : ['USD', 'JPY', 'KRW'];
  });
  
  const [pinnedRates, setPinnedRates] = useState<string[]>(() => {
    const saved = localStorage.getItem('pinnedRates');
    return saved ? JSON.parse(saved) : [];
  });

  const [contextMenuCurrency, setContextMenuCurrency] = useState<string | null>(null);
  
  const [mainCurrency, setMainCurrency] = useState<string>(() => localStorage.getItem('mainCurrency') || 'THB');
  const [decimalPlaces, setDecimalPlaces] = useState<number | 'auto'>(() => {
    const saved = localStorage.getItem('decimalPlaces');
    if (!saved) return 'auto';
    return saved === 'auto' ? 'auto' : (parseInt(saved) || 2);
  });
  
  // --- Tracker States ---
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tx_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [clearConfirmState, setClearConfirmState] = useState(false);

  const [txTitle, setTxTitle] = useState('');
  const [txCustomRate, setTxCustomRate] = useState('');
  const [modalRateInverted, setModalRateInverted] = useState(false);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('priceAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAlertInput, setShowAlertInput] = useState<string | null>(null); 

  // --- Payment Cards ---
  const [cards, setCards] = useState<PaymentCard[]>(() => {
    const saved = localStorage.getItem('paymentCards');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(!rates);
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => localStorage.getItem('lastUpdated') || null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [detailChartCurrency, setDetailChartCurrency] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('1m');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isCryptoCollapsed, setIsCryptoCollapsed] = useState(() => localStorage.getItem('isCryptoCollapsed') === 'true');
  const [isFiatCollapsed, setIsFiatCollapsed] = useState(() => localStorage.getItem('isFiatCollapsed') === 'true');
  const [visibleFiat, setVisibleFiat] = useState<string[]>(() => {
    const saved = localStorage.getItem('visibleFiat');
    return saved ? JSON.parse(saved) : ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
  });
  const [visibleCrypto, setVisibleCrypto] = useState<string[]>(() => {
    const saved = localStorage.getItem('visibleCrypto');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH', 'SOL'];
  });

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'auto');
  const [copyToast, setCopyToast] = useState(false);

  // --- Helpers ---
  const getTargetRateValue = useCallback((code: string, base: string = fromCurrency): number => {
    if (!rates) return 0;
    const oneBaseInUSD = 1 / rates[base];
    return oneBaseInUSD * rates[code];
  }, [rates, fromCurrency]);

  const fetchRates = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const apiKey = import.meta.env.VITE_ER_API_KEY;
      let finalRates: Record<string, number> | null = null;
      let dataSource = 'Global API';

      if (apiKey && apiKey !== "เอา_API_KEY_จริงตรงนี้" && apiKey !== "") {
        try {
          const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
          if (res.ok) {
            const data = await res.json();
            if (data.result === 'success') {
              finalRates = data.conversion_rates;
              dataSource = 'ExchangeRate-API';
            }
          }
        } catch (e) {
          console.warn("v6 API Fetch failed, falling back to v4", e);
        }
      }

      if (!finalRates) {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        finalRates = data.rates;
        dataSource = 'Global API';
      }

      try {
        const cryptoIds = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,tron,figure-heloc';
        const cryptoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`);
        if (cryptoRes.ok && finalRates) {
          const cryptoData = await cryptoRes.json();
          if (cryptoData.bitcoin) finalRates['BTC'] = 1 / cryptoData.bitcoin.usd;
          if (cryptoData.ethereum) finalRates['ETH'] = 1 / cryptoData.ethereum.usd;
          if (cryptoData.solana) finalRates['SOL'] = 1 / cryptoData.solana.usd;
          if (cryptoData.binancecoin) finalRates['BNB'] = 1 / cryptoData.binancecoin.usd;
          if (cryptoData.ripple) finalRates['XRP'] = 1 / cryptoData.ripple.usd;
          if (cryptoData.dogecoin) finalRates['DOGE'] = 1 / cryptoData.dogecoin.usd;
          if (cryptoData.tron) finalRates['TRX'] = 1 / cryptoData.tron.usd;
          if (cryptoData['figure-heloc']) finalRates['FIGR_HELOC'] = 1 / cryptoData['figure-heloc'].usd;
          dataSource += ' + CoinGecko';
        }
      } catch (e) {
        console.warn("Crypto Fetch failed", e);
      }

      if (finalRates) {
        setRates({...finalRates});
        const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
        const now = new Date().toLocaleString(locale);
        const stampMsg = `${now} (${dataSource})`;
        setLastUpdated(stampMsg);
        localStorage.setItem('exchangeRates', JSON.stringify(finalRates));
        localStorage.setItem('lastUpdated', stampMsg);
        setIsOfflineMode(false);
      } else {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error("Failed to fetch rates:", err);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [lang]);

  // Effects
  useEffect(() => {
    if (activeTab === 'chart' && rates) {
      setChartData(generateMockHistory(getTargetRateValue(chartTo, chartFrom), lang, chartTimeframe));
    }
  }, [activeTab, chartFrom, chartTo, lang, chartTimeframe, rates, getTargetRateValue]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.body.classList.add('dark-mode');
      else document.body.classList.remove('dark-mode');
    };
    applyTheme();
    
    // Add language class to body
    document.body.classList.remove('lang-th', 'lang-en', 'lang-zh');
    document.body.classList.add(`lang-${lang}`);
    document.documentElement.lang = lang;

    if (theme === 'auto') {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      matcher.addEventListener('change', applyTheme);
      return () => matcher.removeEventListener('change', applyTheme);
    }
  }, [theme, lang]);

  useEffect(() => {
    if (!navigator.onLine) setIsOfflineMode(true);
    else fetchRates();
    const handleOnline = () => { setIsOfflineMode(false); fetchRates(); };
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRates]);

  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
    localStorage.setItem('toCurrency', toCurrency);
    localStorage.setItem('amount', amount);
    localStorage.setItem('favorites_light', JSON.stringify(favorites));
    localStorage.setItem('mainCurrency', mainCurrency);
    localStorage.setItem('decimalPlaces', decimalPlaces.toString());
    localStorage.setItem('tx_history', JSON.stringify(transactions));
    localStorage.setItem('pinnedRates', JSON.stringify(pinnedRates));
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
    localStorage.setItem('isCryptoCollapsed', isCryptoCollapsed.toString());
    localStorage.setItem('isFiatCollapsed', isFiatCollapsed.toString());
    localStorage.setItem('visibleFiat', JSON.stringify(visibleFiat));
    localStorage.setItem('visibleCrypto', JSON.stringify(visibleCrypto));
    localStorage.setItem('paymentCards', JSON.stringify(cards));
  }, [fromCurrency, toCurrency, amount, favorites, mainCurrency, decimalPlaces, transactions, pinnedRates, priceAlerts, isCryptoCollapsed, isFiatCollapsed, visibleFiat, visibleCrypto, cards]);

  const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (loading) {
    return (
      <div className="app-container" style={{justifyContent: 'center'}}>
        <div className="loader-container"><div className="loader"></div></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab} 
        t={t} 
        lang={lang} 
        setLang={setLang} 
        deferredPrompt={deferredPrompt} 
        setDeferredPrompt={setDeferredPrompt}
        isRefreshing={isRefreshing}
        fetchRates={fetchRates}
        showLangMenu={showLangMenu}
        setShowLangMenu={setShowLangMenu}
        isDarkMode={isDarkMode}
      />

      <div className="scrollable-content" key={activeTab}>
        {activeTab === 'home' && (
          <HomeTab 
            t={t} lang={lang} isDarkMode={isDarkMode}
            fromCurrency={fromCurrency} setFromCurrency={setFromCurrency}
            toCurrency={toCurrency} setToCurrency={setToCurrency}
            amount={amount} setAmount={setAmount}
            rates={rates} lastUpdated={lastUpdated} isOfflineMode={isOfflineMode}
            favorites={favorites} setFavorites={setFavorites}
            getTargetRateValue={getTargetRateValue}
            decimalPlaces={decimalPlaces}
            setActiveDropdown={setActiveDropdown}
            setSearchQuery={setSearchQuery}
            setShowSaveModal={setShowSaveModal}
            setEditingTxId={setEditingTxId}
            setTxTitle={setTxTitle}
            setModalRateInverted={setModalRateInverted}
            setTxCustomRate={setTxCustomRate}
            copyToast={copyToast} setCopyToast={setCopyToast}
          />
        )}

        {activeTab === 'split' && (
          <BillSplitTab
            t={t} lang={lang} isDarkMode={isDarkMode}
            cards={cards}
            getTargetRateValue={getTargetRateValue}
            mainCurrency={mainCurrency}
            fromCurrency={fromCurrency}
          />
        )}

        {activeTab === 'chart' && (
          <ChartTab 
            t={t} lang={lang} isDarkMode={isDarkMode}
            chartFrom={chartFrom} setChartFrom={setChartFrom}
            chartTo={chartTo} setChartTo={setChartTo}
            chartTimeframe={chartTimeframe} setChartTimeframe={setChartTimeframe}
            chartData={chartData} mainCurrency={mainCurrency}
            decimalPlaces={decimalPlaces}
            pinnedRates={pinnedRates} setPinnedRates={setPinnedRates}
            visibleFiat={visibleFiat} setVisibleFiat={setVisibleFiat}
            visibleCrypto={visibleCrypto} setVisibleCrypto={setVisibleCrypto}
            isFiatCollapsed={isFiatCollapsed} setIsFiatCollapsed={setIsFiatCollapsed}
            isCryptoCollapsed={isCryptoCollapsed} setIsCryptoCollapsed={setIsCryptoCollapsed}
            priceAlerts={priceAlerts} getTargetRateValue={getTargetRateValue}
            setActiveDropdown={setActiveDropdown} setSearchQuery={setSearchQuery}
            setDetailChartCurrency={setDetailChartCurrency}
            setContextMenuCurrency={setContextMenuCurrency}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            t={t} lang={lang} isDarkMode={isDarkMode}
            mainCurrency={mainCurrency} setMainCurrency={setMainCurrency}
            setActiveDropdown={setActiveDropdown}
            theme={theme} setTheme={setTheme}
            decimalPlaces={decimalPlaces} setDecimalPlaces={setDecimalPlaces}
            cards={cards} setCards={setCards}
            clearConfirmState={clearConfirmState} setClearConfirmState={setClearConfirmState}
            clearAllHistory={() => {
              if (!clearConfirmState) {
                setClearConfirmState(true);
                return;
              }
              setTransactions([]); setPinnedRates([]); setFavorites(['USD', 'JPY', 'KRW']);
              localStorage.removeItem('tx_history'); localStorage.removeItem('pinnedRates'); localStorage.removeItem('favorites_light');
              setClearConfirmState(false);
            }}
          />
        )}
      </div>

      {/* Modals & Overlays */}
      {showSaveModal && (
        <SaveTxModal 
          t={t} lang={lang} isDarkMode={isDarkMode} editingTxId={editingTxId}
          txTitle={txTitle} setTxTitle={setTxTitle}
          amount={amount} fromCurrency={fromCurrency} toCurrency={toCurrency}
          modalRateInverted={modalRateInverted} setModalRateInverted={setModalRateInverted}
          txCustomRate={txCustomRate} setTxCustomRate={setTxCustomRate}
          onClose={() => setShowSaveModal(false)}
          cards={cards}
          onSave={(cardId, feeAmount, feePercent) => {
            let rateValue = parseFloat(txCustomRate);
            if(isNaN(rateValue) || !txTitle) return alert(t.invalidInput);
            if (modalRateInverted) rateValue = 1 / rateValue;
            const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
            const newTx: Transaction = {
              id: editingTxId || Date.now().toString(),
              title: txTitle, from: fromCurrency, to: toCurrency,
              fromAmount: parseFloat(amount), customRate: rateValue,
              rateInverted: modalRateInverted, date: new Date().toLocaleString(locale),
              cardId, feeAmount, feePercent
            };
            if (editingTxId) setTransactions(prev => prev.map(tr => tr.id === editingTxId ? newTx : tr));
            else { setTransactions(prev => [newTx, ...prev]); setActiveTab('tracker'); }
            setShowSaveModal(false);
          }}
          onDelete={(id) => { setTransactions(prev => prev.filter(tr => tr.id !== id)); setShowSaveModal(false); }}
          getTargetRateValue={getTargetRateValue}
        />
      )}

      {activeDropdown && (
        <CurrencyDropdown 
          activeDropdown={activeDropdown} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          t={t} isDarkMode={isDarkMode} pinnedRates={pinnedRates}
          favorites={favorites} fromCurrency={fromCurrency}
          visibleFiat={visibleFiat} visibleCrypto={visibleCrypto}
          onSelect={(code) => {
            if (activeTab === 'chart' && (activeDropdown === 'from' || activeDropdown === 'to')) {
              if (activeDropdown === 'from') setChartFrom(code); else setChartTo(code);
            } else if (activeDropdown === 'from') setFromCurrency(code);
            else if (activeDropdown === 'to') setToCurrency(code);
            else if (activeDropdown === 'main') setMainCurrency(code);
            else if (activeDropdown === 'fiatTable') {
              if (visibleFiat.includes(code) || pinnedRates.includes(code)) {
                setVisibleFiat(prev => prev.filter(c => c !== code)); setPinnedRates(prev => prev.filter(c => c !== code));
              } else setVisibleFiat(prev => [...prev, code]);
            } else if (activeDropdown === 'cryptoTable') {
              if (visibleCrypto.includes(code) || pinnedRates.includes(code)) {
                setVisibleCrypto(prev => prev.filter(c => c !== code)); setPinnedRates(prev => prev.filter(c => c !== code));
              } else setVisibleCrypto(prev => [...prev, code]);
            } else if (activeDropdown === 'favorite') {
              if (!favorites.includes(code)) setFavorites(prev => [...prev, code]);
            }
            if (activeDropdown !== 'fiatTable' && activeDropdown !== 'cryptoTable') setActiveDropdown(null);
          }}
          onClose={() => setActiveDropdown(null)}
        />
      )}

      {showAlertInput && (
        <PriceAlertModal 
          code={showAlertInput} mainCurrency={mainCurrency}
          getTargetRateValue={getTargetRateValue}
          onClose={() => setShowAlertInput(null)}
          onSet={(code, val) => {
            setPriceAlerts(prev => {
              const existing = prev.filter(a => a.code !== code);
              return [...existing, { code, target: val, base: mainCurrency }];
            });
            setShowAlertInput(null); setContextMenuCurrency(null);
          }}
        />
      )}

      {detailChartCurrency && (
        <DetailChartModal 
          code={detailChartCurrency} mainCurrency={mainCurrency} lang={lang} t={t} isDarkMode={isDarkMode}
          pinnedRates={pinnedRates} togglePin={(c) => {
            setPinnedRates(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
          }}
          chartTimeframe={chartTimeframe} setChartTimeframe={setChartTimeframe}
          getTargetRateValue={getTargetRateValue}
          onClose={() => setDetailChartCurrency(null)}
        />
      )}

      {contextMenuCurrency && (
        <ContextMenuSheet 
          code={contextMenuCurrency} lang={lang} t={t} isDarkMode={isDarkMode}
          pinnedRates={pinnedRates} togglePin={(c) => {
            setPinnedRates(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
            setContextMenuCurrency(null);
          }}
          onRemoveFromHome={(c) => {
            setVisibleFiat(prev => prev.filter(item => item !== c));
            setVisibleCrypto(prev => prev.filter(item => item !== c));
            setContextMenuCurrency(null);
          }}
          onSetAlert={(c) => { setShowAlertInput(c); }}
          priceAlerts={priceAlerts} removeAlert={(c) => {
            setPriceAlerts(prev => prev.filter(a => a.code !== c));
            setContextMenuCurrency(null);
          }}
          onClose={() => setContextMenuCurrency(null)}
        />
      )}



      {/* Bottom Nav - 5 tabs */}
      <div className="bottom-nav">
        {[
          { id: 'home', tKey: 'tabHome', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
          { id: 'chart', tKey: 'tabChart', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
          { id: 'split', tKey: 'tabBillSplit', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> },
          { id: 'settings', tKey: 'tabSettings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
        ].map(nav => (
          <button key={nav.id} className={`nav-item ${activeTab === nav.id ? 'active' : ''}`} onClick={() => setActiveTab(nav.id)}>
            {nav.icon}
            <span>{(t as any)[nav.tKey]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;

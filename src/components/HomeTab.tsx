import React, { useMemo } from 'react';
import { Translation } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import { generateMockHistory, formatWithCommas } from '../utils/helpers';

interface HomeTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  fromCurrency: string; setFromCurrency: (c: string) => void;
  toCurrency: string; setToCurrency: (c: string) => void;
  amount: string; setAmount: (a: string) => void;
  rates: Record<string, number> | null; lastUpdated: string | null; isOfflineMode: boolean;
  favorites: string[]; setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  getTargetRateValue: (code: string, base?: string) => number;
  decimalPlaces: number | 'auto';
  setActiveDropdown: (d: string | null) => void;
  setSearchQuery: (s: string) => void;
  setShowSaveModal: (s: boolean) => void;
  setEditingTxId: (id: string | null) => void;
  setTxTitle: (t: string) => void;
  setModalRateInverted: (i: boolean) => void;
  setTxCustomRate: (r: string) => void;
  copyToast: boolean; setCopyToast: (t: boolean) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  t, lang, fromCurrency, toCurrency, amount, setAmount,
  rates, lastUpdated, isOfflineMode, favorites, setFavorites,
  getTargetRateValue, decimalPlaces, setActiveDropdown, setSearchQuery, setShowSaveModal,
  setEditingTxId, setTxTitle, setModalRateInverted, setTxCustomRate,
  copyToast, setCopyToast, setFromCurrency, setToCurrency
}) => {

  const getConvertedAmount = (code: string = toCurrency) => {
    if (!rates || !amount) return '0.00';
    const rateValue = getTargetRateValue(code);
    const convertedAmount = parseFloat(amount.replace(/,/g, '')) * rateValue;
    let minD: number, maxD: number;
    if (decimalPlaces === 'auto') {
      minD = 2; maxD = convertedAmount < 0.01 ? 8 : convertedAmount < 1 ? 4 : 2;
    } else {
      minD = decimalPlaces; maxD = decimalPlaces;
    }
    return convertedAmount.toLocaleString('en-US', { minimumFractionDigits: minD, maximumFractionDigits: maxD });
  };

  const handleSwap = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };

  const handleKeypadPress = (key: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // subtle haptic feedback
    }
    
    if (key === 'AC') {
      setAmount('');
    } else if (key === 'backspace') {
      setAmount(amount.length > 1 ? amount.slice(0, -1) : '');
    } else if (key === '=') {
      try {
        const sanitized = amount.replace(/[^0-9.+\-*/()]/g, '');
        const result = new Function(`return (${sanitized})`)();
        if (result !== undefined && !isNaN(result) && isFinite(result)) {
           const finalStr = result.toString();
           setAmount(finalStr.length > 10 ? parseFloat(result).toFixed(4) : finalStr);
        }
      } catch(e) {}
    } else {
      let val = key;
      if (key === '÷') val = '/';
      if (key === '×') val = '*';

      if (val === '.') {
        const parts = amount.split(/[+\-*/]/);
        if (parts[parts.length - 1].includes('.')) return;
        setAmount(amount === '' ? '0.' : amount + '.');
      } else {
        const isOperator = ['/', '*', '+', '-'].includes(val);
        setAmount((amount === '0' && !isOperator) ? val : amount + val);
      }
    }
  };

  const exchangeRateText = useMemo(() => {
    const rate = getTargetRateValue(toCurrency);
    if(rate === 0) return '';
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  }, [fromCurrency, toCurrency, getTargetRateValue]);

  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  const rateInfo = useMemo(() => {
    const currentRate = getTargetRateValue(toCurrency, fromCurrency);
    if (!currentRate) return null;
    const history30d = generateMockHistory(currentRate, lang, '1m');
    const avg = history30d.reduce((sum, item) => sum + item.rate, 0) / history30d.length;
    let iconColor = '#d97706'; 
    let iconPath = <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></>;
    const diffPercent = ((currentRate - avg) / avg) * 100;
    const isPositive = diffPercent > 0.05; 
    const isNegative = diffPercent < -0.05;
    if (isPositive) {
      iconColor = '#16a34a'; 
      iconPath = <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></>;
    } else if (isNegative) {
      iconColor = '#dc2626'; 
      iconPath = <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></>;
    }
    return { iconColor, iconPath, diffPercent, isPositive, isNegative, currentRate };
  }, [toCurrency, fromCurrency, getTargetRateValue, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="converter-wrapper">
        <div className="currency-box">
          <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}}>
            {renderFlag(fromCurrency)}
            <span className="currency-code">{fromCurrency}</span>
            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            <input 
              type="text" className="amount-input" 
              inputMode="none"
              value={formatWithCommas(amount)} 
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, '');
                if (/^[0-9.+\-*/() ]*$/.test(rawValue)) setAmount(rawValue);
              }} 
              onBlur={() => {
                if (/[+\-*/]/.test(amount)) {
                  try {
                    const sanitized = amount.replace(/[^0-9.+\-*/()]/g, '');
                    const result = new Function(`return (${sanitized})`)();
                    if (result !== undefined && !isNaN(result) && isFinite(result)) setAmount(result.toString());
                  } catch(e) {}
                }
              }}
              placeholder="0" 
            />

          </div>
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
          <div className="amount-display" style={{position: 'relative', cursor: 'pointer'}} onClick={() => {
            navigator.clipboard.writeText(getConvertedAmount(toCurrency));
            setCopyToast(true); setTimeout(() => setCopyToast(false), 2000);
          }}>
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
        {rateInfo && (
          <>
            <svg className="rate-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={rateInfo.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {rateInfo.iconPath}
            </svg>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <span className="rate-text">
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {exchangeRateText}
                </strong> {t.marketRate}
              </span>
              <div style={{fontSize: '10.5px', color: '#6b7280', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                <span>อัปเดตล่าสุด: {lastUpdated ? lastUpdated.split(' (')[0] : '-'}</span>
                {(rateInfo.isPositive || rateInfo.isNegative) && (
                  <span style={{ 
                    color: rateInfo.isPositive ? '#16a34a' : '#dc2626', 
                    fontSize: '10px', fontWeight: 800, background: rateInfo.isPositive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                    padding: '2px 4px', borderRadius: '4px'
                  }}>
                    {rateInfo.isPositive ? '+' : ''}{rateInfo.diffPercent.toFixed(2)}% {rateInfo.isPositive ? '▲' : '▼'}
                  </span>
                )}
              </div>
              {isOfflineMode && lastUpdated && (
                <span style={{fontSize: '10.5px', color: '#dc2626', marginTop: '2px', fontWeight: 600}}>
                  {t.offlineApp.replace('{0}', lastUpdated.split(' (')[0])}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center', minHeight: 0, paddingBottom: '8px' }}>
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '8px', maxWidth: '340px', margin: '0 auto' }}>
          {[
            { key: 'AC', color: '#ef4444' }, { key: 'backspace', color: 'var(--text-muted)' }, { key: '00' }, { key: '÷', bg: '#9fe870', color: '#166534' },
            { key: '7' }, { key: '8' }, { key: '9' }, { key: '×', bg: '#9fe870', color: '#166534' },
            { key: '4' }, { key: '5' }, { key: '6' }, { key: '-', bg: '#9fe870', color: '#166534' },
            { key: '1' }, { key: '2' }, { key: '3' }, { key: '+', bg: '#9fe870', color: '#166534' },
            { key: '0', span: 2 }, { key: '.' }, { key: '=', bg: '#9fe870', color: '#166534' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleKeypadPress(item.key)}
              className="numpad-btn"
              style={{ 
                gridColumn: item.span ? `span ${item.span}` : 'auto',
                height: '100%',
                color: item.color || 'var(--text-main)',
                background: item.bg || undefined,
                fontWeight: (item.key === 'AC' || item.bg) ? 800 : 500,
                fontSize: item.bg ? '28px' : '24px'
              }}
            >
              {item.key === 'backspace' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
              ) : item.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;

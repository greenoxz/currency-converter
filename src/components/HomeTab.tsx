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

      <div style={{ textAlign: 'center', margin: '0 0 16px 0', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-main)', marginRight: '6px' }}>
          {exchangeRateText}
        </span>
        ({t.lastUpdatedLabel}: {lastUpdated ? lastUpdated.split(' (')[0] : '-'})
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, paddingBottom: '8px' }}>
        <div style={{ width: '100%', height: '100%', maxHeight: '420px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '8px', maxWidth: '340px', margin: '0 auto' }}>
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

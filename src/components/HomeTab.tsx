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
    <>
      <div className="converter-wrapper">
        <div className="currency-box">
          <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}}>
            {renderFlag(fromCurrency)}
            <span className="currency-code">{fromCurrency}</span>
            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <input 
            type="text" className="amount-input" 
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
            <svg className="rate-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={rateInfo.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {rateInfo.iconPath}
            </svg>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
              <span className="rate-text">
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {exchangeRateText}
                  {(rateInfo.isPositive || rateInfo.isNegative) && (
                    <span style={{ 
                      color: rateInfo.isPositive ? '#16a34a' : '#dc2626', 
                      fontSize: '11px', fontWeight: 800, background: rateInfo.isPositive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                      padding: '2px 6px', borderRadius: '6px', marginLeft: '2px'
                    }}>
                      {rateInfo.isPositive ? '+' : ''}{rateInfo.diffPercent.toFixed(2)}% {rateInfo.isPositive ? '▲' : '▼'}
                    </span>
                  )}
                </strong> {t.marketRate}
              </span>
              <div style={{fontSize: '11px', color: '#6b7280', marginTop: '6px'}}>
                <span>อัปเดตล่าสุด: {lastUpdated ? lastUpdated.split(' (')[0] : '-'}</span>
              </div>
              {isOfflineMode && lastUpdated && (
                <span style={{fontSize: '11.5px', color: '#dc2626', marginTop: '6px', fontWeight: 600}}>
                  {t.offlineApp.replace('{0}', lastUpdated.split(' (')[0])}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="dual-btn-group" style={{ position: 'relative', zIndex: 10, marginBottom: '32px' }}>
        <button 
          className="action-btn" 
          style={{ width: '100%', background: '#9fe870', boxShadow: '0 4px 14px rgba(159, 232, 112, 0.4)', border: 'none', height: '56px' }} 
          onClick={() => {
            setEditingTxId(null); setTxTitle(''); setModalRateInverted(false);
            setTxCustomRate(getTargetRateValue(toCurrency).toFixed(4));
            setShowSaveModal(true);
          }}
        >
          {t.saveLogBtn}
        </button>
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
        {favorites.length === 0 && <div style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>{t.noFavs}</div>}
      </div>
    </>
  );
};

export default HomeTab;

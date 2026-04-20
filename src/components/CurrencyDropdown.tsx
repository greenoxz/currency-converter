import React from 'react';
import { Translation } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';

interface CurrencyDropdownProps {
  activeDropdown: string; searchQuery: string; setSearchQuery: (s: string) => void;
  t: Translation; isDarkMode: boolean; pinnedRates: string[];
  favorites: string[]; fromCurrency: string;
  visibleFiat: string[]; visibleCrypto: string[];
  onSelect: (code: string) => void; onClose: () => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  activeDropdown, searchQuery, setSearchQuery, t, isDarkMode, pinnedRates,
  favorites, fromCurrency, visibleFiat, visibleCrypto, onSelect, onClose
}) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  const filteredCurrencies = Object.keys(CURRENCY_DATA)
    .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()) || (CURRENCY_DATA[c] && CURRENCY_DATA[c].name.toLowerCase().includes(searchQuery.toLowerCase())))
    .filter(c => activeDropdown !== 'favorite' || (!favorites.includes(c) && c !== fromCurrency))
    .filter(c => activeDropdown !== 'fiatTable' || !CURRENCY_DATA[c].isCrypto)
    .filter(c => activeDropdown !== 'cryptoTable' || CURRENCY_DATA[c].isCrypto);

  return (
    <div className={`popup-overlay ${isClosing ? 'is-closing' : ''}`} onClick={handleClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <button className="close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2>{activeDropdown === 'favorite' ? t.addCurrencyTitle : t.selectCurrencyTitle}</h2>
        </div>
        <input type="text" className="search-input" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
        <div className="currency-list">
          {pinnedRates.length > 0 && !searchQuery && activeDropdown !== 'fiatTable' && activeDropdown !== 'cryptoTable' && (
            <>
              <div style={{ padding: '12px 16px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                {t.pinnedRates}
              </div>
              {pinnedRates.map(c => (
                <div key={`pinned-sel-${c}`} className="currency-list-item" onClick={() => onSelect(c)} style={{background: isDarkMode ? 'rgba(159, 232, 112, 0.15)' : 'rgba(163, 230, 53, 0.15)', border: '1px solid rgba(159, 232, 112, 0.3)', marginBottom: '6px'}}>
                  {renderFlag(c)} <div><div className="currency-code" style={{color: 'var(--accent-dark)', fontWeight: 700}}>{c}</div><div style={{fontSize: '11px', color:'var(--text-muted)'}}>{CURRENCY_DATA[c].name}</div></div>
                </div>
              ))}
              <div style={{ height: '1px', width: 'calc(100% - 32px)', margin: '12px auto', background: 'var(--border-light)' }}></div>
            </>
          )}
          {filteredCurrencies.map(c => {
            const isSelected = visibleFiat.includes(c) || visibleCrypto.includes(c) || pinnedRates.includes(c);
            return (
              <div key={c} className="currency-list-item" onClick={() => onSelect(c)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {renderFlag(c)} 
                  <div><div className="currency-code">{c}</div><div style={{fontSize: '12px', color:'var(--text-muted)'}}>{CURRENCY_DATA[c]?.name}</div></div>
                </div>
                {(activeDropdown === 'fiatTable' || activeDropdown === 'cryptoTable') && (
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', 
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-light)'}`,
                    background: isSelected ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrencyDropdown;

import React from 'react';
import { Translation, PriceAlert } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';

interface ContextMenuSheetProps {
  code: string; lang: string; t: Translation; isDarkMode: boolean;
  pinnedRates: string[]; togglePin: (c: string) => void;
  onRemoveFromHome: (c: string) => void;
  onSetAlert: (c: string) => void;
  priceAlerts: PriceAlert[]; removeAlert: (c: string) => void;
  onClose: () => void;
}

const ContextMenuSheet: React.FC<ContextMenuSheetProps> = ({
  code, lang, t, isDarkMode, pinnedRates, togglePin, onRemoveFromHome, onSetAlert, priceAlerts, removeAlert, onClose
}) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const renderFlag = (c: string) => {
    const flagData = CURRENCY_DATA[c];
    if (flagData?.icon) return <img src={flagData.icon} alt={c} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : ''} alt={c} className="flag-icon" />;
  };

  return (
    <div className={`popup-overlay ${isClosing ? 'is-closing' : ''}`} onClick={handleClose}>
      <div 
        className="popup-content" 
        style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{width: '40px', height: '4px', background: 'var(--border-light)', borderRadius: '2px', alignSelf: 'center', marginBottom: '20px'}}></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          {renderFlag(code)}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '18px', fontWeight: 700, color: 'var(--text-main)'}}>{code}</span>
            <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[code]?.name}</span>
          </div>
        </div>
        
        <button 
          onClick={() => togglePin(code)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', color: 'var(--text-main)', fontSize: '15px', fontWeight: 600 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={pinnedRates.includes(code) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          {pinnedRates.includes(code) ? (lang === 'th' ? 'นำออกจากรายการโปรด' : 'Remove from Favorites') : (lang === 'th' ? 'เพิ่มลงรายการโปรด' : 'Add to Favorites')}
        </button>

        {!pinnedRates.includes(code) && (
          <button onClick={() => onRemoveFromHome(code)} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', fontSize: '15px', fontWeight: 600 }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
             {lang === 'th' ? 'ลบออกจากหน้าหลัก' : 'Remove from Home'}
          </button>
        )}

        <button onClick={() => onSetAlert(code)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', color: 'var(--text-main)', fontSize: '15px', fontWeight: 600 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>
          {t.alertSet}
        </button>
        
        {priceAlerts.some(a => a.code === code) && (
          <button onClick={() => removeAlert(code)} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: 'none', fontSize: '15px', fontWeight: 600 }}>
            {t.alertRemove}
          </button>
        )}

        <button onClick={handleClose} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '15px' }}>{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
      </div>
    </div>
  );
};

export default ContextMenuSheet;

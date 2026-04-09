import React from 'react';
import { Translation } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';

interface SettingsTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  mainCurrency: string; setMainCurrency: (c: string) => void;
  theme: string; setTheme: (t: string) => void;
  decimalPlaces: number | 'auto'; setDecimalPlaces: (n: number | 'auto') => void;

  clearConfirmState: boolean; setClearConfirmState: (s: boolean) => void;
  clearAllHistory: () => void;
  lastUpdated: string | null;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  t, lang, isDarkMode, mainCurrency, theme, setTheme, decimalPlaces, setDecimalPlaces,
  clearConfirmState, clearAllHistory, lastUpdated
}) => {
  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  return (
    <div className="settings-page" style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px'}}>
      <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)'}}>
        <label className="form-label" style={{marginBottom: '12px'}}>{t.mainCurrencyLabel}</label>
        <div className="currency-selector" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {renderFlag(mainCurrency)}
            <span className="currency-code">{mainCurrency}</span>
            <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[mainCurrency]?.name}</span>
          </div>
        </div>
      </div>

      <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <label className="form-label" style={{margin: 0}}>{t.tabSettings}</label>
        <div style={{ display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {[
            { id: 'auto', label: t.autoMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> },
            { id: 'light', label: t.lightMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg> },
            { id: 'dark', label: t.darkMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> }
          ].map(opt => (
            <button
              key={opt.id} onClick={() => setTheme(opt.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: theme === opt.id ? (isDarkMode ? '#3f3f46' : '#ffffff') : 'transparent',
                color: theme === opt.id ? 'var(--accent-dark)' : 'var(--text-muted)',
                fontWeight: theme === opt.id ? 700 : 500, fontSize: '13px'
              }}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <label className="form-label" style={{margin: 0}}>{t.decimalPlaces}</label>
        <div style={{ display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {(['auto', 0, 2, 4, 8] as const).map(num => (
            <button
              key={num} onClick={() => setDecimalPlaces(num)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: decimalPlaces === num ? (isDarkMode ? '#3f3f46' : '#ffffff') : 'transparent',
                color: decimalPlaces === num ? 'var(--accent-dark)' : 'var(--text-muted)',
                fontWeight: decimalPlaces === num ? 700 : 500, fontSize: '13px'
              }}
            >
              {num === 'auto' ? t.autoMode : num}
            </button>
          ))}
        </div>
      </div>



      <button 
        onClick={clearAllHistory} className="danger-btn"
        style={{
          background: clearConfirmState ? '#dc2626' : '#fee2e2', color: clearConfirmState ? '#ffffff' : '#dc2626', 
          border: 'none', padding: '16px', borderRadius: '16px', fontWeight: 600, cursor: 'pointer', fontSize: '15px'
        }}
      >
        {clearConfirmState ? (lang === 'th' ? 'กดยืนยันอีกครั้งเพื่อลบ' : 'Click again to confirm') : t.clearAllData}
      </button>

      <div className="settings-footer-area" style={{marginTop: 'auto', padding: '20px 0', textAlign: 'center'}}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: '1px solid var(--border-light)'}}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: lastUpdated && lastUpdated.includes('ExchangeRate-API') ? '#22c55e' : '#94a3b8' }}></div>
          <span style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)'}}>
            Data Source: {lastUpdated ? (lastUpdated.split(' (')[1]?.replace(')', '') || 'Global API').replace('+', '&') : 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;

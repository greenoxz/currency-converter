import React, { useState } from 'react';
import { Translation } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import packageJson from '../../package.json';

interface SettingsTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  mainCurrency: string; setMainCurrency: (c: string) => void;
  setActiveDropdown: (d: string | null) => void;
  theme: string; setTheme: (t: string) => void;
  decimalPlaces: number | 'auto'; setDecimalPlaces: (n: number | 'auto') => void;

  clearConfirmState: boolean; setClearConfirmState: (s: boolean) => void;
  clearAllHistory: () => void;
  lastUpdated: string | null;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  t, lang, isDarkMode, mainCurrency, setActiveDropdown, theme, setTheme, decimalPlaces, setDecimalPlaces,
  clearConfirmState, setClearConfirmState, clearAllHistory, lastUpdated
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showCleared, setShowCleared] = useState(false);

  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  return (
    <div className="settings-page" style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px'}}>

      <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
          <label className="form-label" style={{margin: 0}}>{t.mainCurrencyLabel}</label>
          <button 
            onClick={() => setShowTerms(true)}
            title={t.termsTitle}
            style={{ 
              background: isDarkMode ? '#2a2a2a' : '#f3f4f6', 
              border: 'none', 
              borderRadius: '50%', 
              width: '30px', 
              height: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
        <div
          className="currency-selector"
          onClick={() => setActiveDropdown('main')}
          style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {renderFlag(mainCurrency)}
            <span className="currency-code">{mainCurrency}</span>
            <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[mainCurrency]?.name}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <label className="form-label" style={{margin: 0}}>{t.themeLabel}</label>
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



      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {!clearConfirmState ? (
          <button 
            onClick={() => clearAllHistory()}
            className="danger-btn"
            style={{
              background: isDarkMode ? '#3b0f0f' : '#fee2e2',
              color: isDarkMode ? '#f87171' : '#dc2626',
              border: 'none',
              padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
          >
            {t.clearAllData}
          </button>
        ) : (
          <div style={{ 
            width: '100%', 
            maxWidth: '300px', 
            background: isDarkMode ? '#2d1010' : '#fef2f2', 
            padding: '20px', 
            borderRadius: '16px', 
            border: `1px dashed ${isDarkMode ? '#ef4444' : '#f87171'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <p style={{ fontSize: '13px', color: isDarkMode ? '#fca5a5' : '#991b1b', textAlign: 'center', margin: 0 }}>
              {lang === 'th' ? "พิมพ์คำว่า 'Delete' เพื่อยืนยันการลบ" : lang === 'zh' ? "输入 'Delete' 以确认删除" : "Type 'Delete' to confirm"}
            </p>
            <input 
              type="text" 
              placeholder="Delete"
              autoFocus
              className="form-input"
              style={{ 
                textAlign: 'center', 
                padding: '10px', 
                fontSize: '16px', 
                fontWeight: 700,
                letterSpacing: '1px',
                background: isDarkMode ? '#1a1a1a' : '#ffffff',
                border: `2px solid ${isDarkMode ? '#ef4444' : '#f87171'}`,
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Delete') {
                  clearAllHistory();
                  setShowCleared(true);
                }
              }}
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setClearConfirmState(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '10px',
                marginTop: '4px'
              }}
            >
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
          </div>
        )}
      </div>



      {showTerms && (
        <div 
          onClick={() => setShowTerms(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: isDarkMode ? '#1e1e1e' : '#ffffff',
              borderRadius: '24px', padding: '24px',
              maxWidth: '400px', width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>{t.termsTitle}</h3>
              <button 
                onClick={() => setShowTerms(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {t.termsContent}
            </div>
            <button 
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: '24px', width: '100%', padding: '14px', borderRadius: '12px',
                background: isDarkMode ? '#9fe870' : '#163300',
                color: isDarkMode ? '#163300' : '#ffffff',
                border: 'none',
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              {t.okBtn}
            </button>
          </div>
        </div>
      )}

      {showCleared && (
        <div
          onClick={() => setShowCleared(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: isDarkMode ? '#1e1e1e' : '#ffffff',
              borderRadius: '24px', padding: '32px 24px',
              maxWidth: '320px', width: '100%', textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ 
              width: '72px', height: '72px', borderRadius: '50%', 
              background: isDarkMode ? '#2d1010' : '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)', fontWeight: 700 }}>
              {lang === 'th' ? 'ลบข้อมูลสำเร็จ' : lang === 'zh' ? '数据已清除' : 'Data Cleared'}
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {lang === 'th' ? 'ข้อมูลทั้งหมดถูกลบเรียบร้อยแล้ว' : lang === 'zh' ? '所有数据已成功删除' : 'All history and settings have been cleared.'}
            </p>
            <button
              onClick={() => setShowCleared(false)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: isDarkMode ? '#9fe870' : '#163300',
                color: isDarkMode ? '#163300' : '#ffffff',
                border: 'none',
                fontWeight: 600, cursor: 'pointer', fontSize: '15px'
              }}
            >
              {t.okBtn}
            </button>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 'auto', padding: '20px 0', opacity: 0.5, fontSize: '12px' }}>
        FishyCurrency v{packageJson.version}
      </div>
    </div>
  );
};

export default SettingsTab;

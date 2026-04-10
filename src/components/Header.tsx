import React from 'react';
import { Translation } from '../types';

interface HeaderProps {
  activeTab: string;
  t: Translation;
  lang: string;
  setLang: (lang: string) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
  isRefreshing: boolean;
  fetchRates: (manual?: boolean) => void;
  showLangMenu: boolean;
  setShowLangMenu: (show: boolean) => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, t, lang, setLang, deferredPrompt, setDeferredPrompt, 
  isRefreshing, fetchRates, showLangMenu, setShowLangMenu, isDarkMode 
}) => {
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const getTitle = () => {
    if (activeTab === 'home') return t.appTitle;
    if (activeTab === 'chart') return t.chartRateLabel;
    if (activeTab === 'settings') return t.tabSettings;
    return t.trackerTitle;
  };

  return (
    <div className="header-container">
      <h1 className="header-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1}}>
          <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {getTitle()}
          </span>
        </div>
        <div style={{position: 'relative', display: 'flex', gap: '8px', alignItems: 'center'}}>
          <button onClick={() => setShowLangMenu(!showLangMenu)} style={{display: 'flex', alignItems: 'center', gap: '6px', background: '#f9fafb', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)'}}>
            <img src={`https://flagcdn.com/w40/${lang === 'en' ? 'gb' : (lang === 'zh' ? 'cn' : 'th')}.png`} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}} alt={lang} />
            <span style={{fontSize: '13px', fontWeight: 600}}>{lang.toUpperCase()}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          
          {(activeTab === 'home' || activeTab === 'chart') && (
            <button 
              onClick={() => fetchRates(true)} 
              disabled={isRefreshing}
              className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: isDarkMode ? '#262626' : '#f9fafb',
                border: '1px solid #d1d5db',
                padding: '6px', borderRadius: '12px', cursor: 'pointer',
                color: 'var(--text-main)', transition: 'all 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          )}

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
  );
};

export default Header;

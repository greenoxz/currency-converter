import React, { useState } from 'react';
import { Translation, PaymentCard } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import packageJson from '../../package.json';
import { CardIcon, CARD_TYPES } from './PaymentCardIcons';

interface SettingsTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  mainCurrency: string; setMainCurrency: (c: string) => void;
  setActiveDropdown: (d: string | null) => void;
  theme: string; setTheme: (t: string) => void;
  decimalPlaces: number | 'auto'; setDecimalPlaces: (n: number | 'auto') => void;
  clearConfirmState: boolean; setClearConfirmState: (s: boolean) => void;
  clearAllHistory: () => void;
  cards: PaymentCard[];
  setCards: React.Dispatch<React.SetStateAction<PaymentCard[]>>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  t, lang, isDarkMode, mainCurrency, setActiveDropdown, theme, setTheme, decimalPlaces, setDecimalPlaces,
  clearConfirmState, setClearConfirmState, clearAllHistory, cards, setCards
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showCleared, setShowCleared] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState<PaymentCard['type']>('visa');
  const [newCardFee, setNewCardFee] = useState('');
  const [newCardAlipayLimit, setNewCardAlipayLimit] = useState('200');
  const [cardSavedToast, setCardSavedToast] = useState(false);

  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  const openAddCard = (card?: PaymentCard) => {
    if (card) {
      setEditingCard(card);
      setNewCardName(card.name);
      setNewCardType(card.type);
      setNewCardFee(card.feePercent.toString());
      setNewCardAlipayLimit(card.alipayFreeLimit?.toString() || '200');
    } else {
      setEditingCard(null);
      setNewCardName('Visa');
      setNewCardType('visa');
      setNewCardFee('');
      setNewCardAlipayLimit('200');
    }
    setShowAddCard(true);
  };

  const saveCard = () => {
    if (!newCardName.trim()) return;
    const feeVal = parseFloat(newCardFee) || 0;
    const alipayLimit = parseFloat(newCardAlipayLimit) || 200;
    
    const card: PaymentCard = {
      id: editingCard?.id || Date.now().toString(),
      name: newCardName.trim(),
      type: newCardType,
      feePercent: feeVal,
      alipayFreeLimit: (newCardType === 'alipay' || newCardType === 'wechat') ? alipayLimit : undefined
    };

    if (editingCard) {
      setCards(prev => prev.map(c => c.id === editingCard.id ? card : c));
    } else {
      setCards(prev => [...prev, card]);
    }
    setShowAddCard(false);
    setCardSavedToast(true);
    setTimeout(() => setCardSavedToast(false), 2000);
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setShowAddCard(false);
  };

  const sectionStyle = {
    background: isDarkMode ? '#1e1e1e' : '#ffffff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid var(--border-light)'
  };

  const DEFAULT_FEES: Record<string, number> = {
    visa: 2.5, mastercard: 2.5, unionpay: 1.5, jcb: 1.5,
    alipay: 0, wechat: 0, promptpay: 0
  };

  return (
    <div className="settings-page" style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px'}}>

      {/* Main Currency */}
      <div className="settings-card" style={sectionStyle}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
          <label className="form-label" style={{margin: 0}}>{t.mainCurrencyLabel}</label>
          <button 
            onClick={() => setShowTerms(true)}
            title={t.termsTitle}
            style={{ background: isDarkMode ? '#2a2a2a' : '#f3f4f6', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
        <div className="currency-selector" onClick={() => setActiveDropdown('main')} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {renderFlag(mainCurrency)}
            <span className="currency-code">{mainCurrency}</span>
            <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[mainCurrency]?.name}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      {/* Theme */}
      <div className="settings-card" style={{...sectionStyle, display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <label className="form-label" style={{margin: 0}}>{t.themeLabel}</label>
        <div style={{ display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {[
            { id: 'auto', label: t.autoMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> },
            { id: 'light', label: t.lightMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg> },
            { id: 'dark', label: t.darkMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> }
          ].map(opt => (
            <button key={opt.id} onClick={() => setTheme(opt.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer', background: theme === opt.id ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent', color: theme === opt.id ? 'var(--accent-dark)' : 'var(--text-muted)', fontWeight: theme === opt.id ? 700 : 500, fontSize: '13px' }}>
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Decimal Places */}
      <div className="settings-card" style={{...sectionStyle, display: 'flex', flexDirection: 'column', gap: '12px'}}>
        <label className="form-label" style={{margin: 0}}>{t.decimalPlaces}</label>
        <div style={{ display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {(['auto', 0, 2, 4, 8] as const).map(num => (
            <button key={num} onClick={() => setDecimalPlaces(num)} style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer', background: decimalPlaces === num ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent', color: decimalPlaces === num ? 'var(--accent-dark)' : 'var(--text-muted)', fontWeight: decimalPlaces === num ? 700 : 500, fontSize: '13px' }}>
              {num === 'auto' ? t.autoMode : num}
            </button>
          ))}
        </div>
      </div>

      {/* My Cards */}
      <div className="settings-card" style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <label className="form-label" style={{ margin: 0 }}>{t.myCards}</label>
          <button
            onClick={() => openAddCard()}
            style={{
              padding: '6px 14px', borderRadius: '10px', border: 'none',
              background: isDarkMode ? '#163300' : '#dcfce7',
              color: isDarkMode ? '#9fe870' : '#15803d',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {t.addCard}
          </button>
        </div>

        {cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            {t.noCards}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => openAddCard(card)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px',
                  border: `1px solid ${isDarkMode ? '#2e2e2e' : '#f3f4f6'}`,
                  background: isDarkMode ? '#262626' : '#f9fafb',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <CardIcon type={card.type} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>{card.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {CARD_TYPES.find(ct => ct.type === card.type)?.label}
                    {card.feePercent > 0 ? ` · ${card.feePercent}% fee` : ` · ${lang === 'th' ? 'ฟรี' : lang === 'zh' ? '免费' : 'Free'}`}
                    {card.alipayFreeLimit ? ` · Free ≤${card.alipayFreeLimit} CNY` : ''}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Terms Modal */}
      {showTerms && (
        <div onClick={() => setShowTerms(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '24px', padding: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>{t.termsTitle}</h3>
              <button onClick={() => setShowTerms(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{t.termsContent}</div>
            <button onClick={() => setShowTerms(false)} style={{ marginTop: '24px', width: '100%', padding: '14px', borderRadius: '12px', background: isDarkMode ? '#9fe870' : '#163300', color: isDarkMode ? '#163300' : '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{t.okBtn}</button>
          </div>
        </div>
      )}

      {/* Data Cleared Modal */}
      {showCleared && (
        <div onClick={() => setShowCleared(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '24px', padding: '32px 24px', maxWidth: '320px', width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: isDarkMode ? '#2d1010' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)', fontWeight: 700 }}>{lang === 'th' ? 'ลบข้อมูลสำเร็จ' : lang === 'zh' ? '数据已清除' : 'Data Cleared'}</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{lang === 'th' ? 'ข้อมูลทั้งหมดถูกลบเรียบร้อยแล้ว' : lang === 'zh' ? '所有数据已成功删除' : 'All history and settings have been cleared.'}</p>
            <button onClick={() => setShowCleared(false)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: isDarkMode ? '#9fe870' : '#163300', color: isDarkMode ? '#163300' : '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}>{t.okBtn}</button>
          </div>
        </div>
      )}

      {/* Add/Edit Card Modal */}
      {showAddCard && (
        <div onClick={() => setShowAddCard(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '24px 24px 0 0', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 -20px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                {editingCard ? (lang === 'th' ? 'แก้ไขบัตร' : lang === 'zh' ? '编辑卡片' : 'Edit Card') : t.addCard}
              </h3>
              <button onClick={() => setShowAddCard(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.cardName}</label>
              <input
                type="text"
                value={newCardName}
                onChange={e => setNewCardName(e.target.value)}
                placeholder={lang === 'th' ? 'เช่น KASIKORN Mastercard' : lang === 'zh' ? '例如 招商银行 Visa' : 'e.g. Kasikorn Mastercard'}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '16px' }}>
                {lang === 'th' ? 'ประเภทบัตร' : 'Card Type'}
              </label>

              {/* Credit Card Group */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '4px' }}>
                   {lang === 'th' ? 'บัตรเครดิต' : 'Credit Card'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', background: isDarkMode ? '#262626' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`, overflow: 'hidden' }}>
                  {CARD_TYPES.filter(ct => ['visa', 'mastercard', 'jcb', 'unionpay'].includes(ct.type)).map((ct, idx, arr) => (
                    <button
                      key={ct.type}
                      onClick={() => {
                        const oldLabel = CARD_TYPES.find(c => c.type === newCardType)?.label;
                        if (!newCardName || newCardName === oldLabel) setNewCardName(ct.label);
                        setNewCardType(ct.type as PaymentCard['type']);
                        if (!newCardFee) setNewCardFee(DEFAULT_FEES[ct.type]?.toString() || '2.5');
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'transparent', border: 'none', borderBottom: idx < arr.length - 1 ? `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}` : 'none', cursor: 'pointer', width: '100%', textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CardIcon type={ct.type} size={28} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{ct.label}</span>
                      </div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${newCardType === ct.type ? 'var(--accent-dark)' : (isDarkMode ? '#555' : '#ccc')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         {newCardType === ct.type && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-dark)' }} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* E-Wallet Group */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '4px' }}>
                   E-Wallet / PromptPay
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', background: isDarkMode ? '#262626' : '#ffffff', borderRadius: '16px', border: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`, overflow: 'hidden' }}>
                  {CARD_TYPES.filter(ct => ['alipay', 'wechat', 'promptpay'].includes(ct.type)).map((ct, idx, arr) => (
                    <button
                      key={ct.type}
                      onClick={() => {
                        const oldLabel = CARD_TYPES.find(c => c.type === newCardType)?.label;
                        if (!newCardName || newCardName === oldLabel) setNewCardName(ct.label);
                        setNewCardType(ct.type as PaymentCard['type']);
                        if (!newCardFee) setNewCardFee('0');
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'transparent', border: 'none', borderBottom: idx < arr.length - 1 ? `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}` : 'none', cursor: 'pointer', width: '100%', textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CardIcon type={ct.type} size={28} />
                        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{ct.label}</span>
                      </div>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${newCardType === ct.type ? 'var(--accent-dark)' : (isDarkMode ? '#555' : '#ccc')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         {newCardType === ct.type && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-dark)' }} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.cardFeePercent}</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <input
                  type="number"
                  value={newCardFee}
                  onChange={e => setNewCardFee(e.target.value)}
                  placeholder="2.5"
                  min="0" max="10" step="0.1"
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['0', '1.5', '2.5', '3'].map(v => (
                    <button
                      key={v}
                      onClick={() => setNewCardFee(v)}
                      style={{
                        padding: '0 12px', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#2e2e2e' : '#e5e7eb'}`,
                        background: newCardFee === v ? (isDarkMode ? '#163300' : '#dcfce7') : (isDarkMode ? '#262626' : '#f9fafb'),
                        color: newCardFee === v ? 'var(--accent-dark)' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >{v}%</button>
                  ))}
                </div>
              </div>
              {['visa', 'mastercard', 'jcb', 'unionpay'].includes(newCardType) && (
                <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink: 0}}><path d="M9 21h6"></path><path d="M10.5 21v-2h3v2"></path><path d="M12 17v-4"></path><path d="M12 9A3 3 0 1 0 12 3a3 3 0 0 0 0 6z"></path><path d="M12 9h.01"></path></svg>
                  <span>{lang === 'th' ? 'บัตรเครดิตปกติมักมีค่าธรรมเนียมความเสี่ยงอัตราแลกเปลี่ยน (FX Rate) ~2.0 - 2.5%' : lang === 'zh' ? '普通信用卡通常收取约2.0 - 2.5%的汇率风险手续费 (FX Rate)' : 'Regular credit cards typically charge a ~2.0 - 2.5% FX risk fee'}</span>
                </p>
              )}
            </div>

            {(newCardType === 'alipay' || newCardType === 'wechat') && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.cardAlipayLimit}</label>
                <input
                  type="number"
                  value={newCardAlipayLimit}
                  onChange={e => setNewCardAlipayLimit(e.target.value)}
                  placeholder="200"
                  className="form-input"
                />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {lang === 'th' ? 'Alipay ผูก Visa/Master: ฟรีถ้ายอดไม่เกินจำนวนนี้ต่อครั้ง' : lang === 'zh' ? '支付宝绑定Visa/银联: 每笔交易低于此金额免手续费' : 'Alipay with Visa/Master binding: Free if amount below this per transaction'}
                </p>
              </div>
            )}

            <button
              onClick={saveCard}
              className="action-btn"
              style={{ marginTop: '8px' }}
            >
              {lang === 'th' ? 'บันทึกบัตร' : lang === 'zh' ? '保存卡片' : 'Save Card'}
            </button>

            {editingCard && (
              <button
                onClick={() => { if (window.confirm(lang === 'th' ? 'ลบบัตรนี้?' : 'Delete this card?')) deleteCard(editingCard.id); }}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', marginTop: '12px', padding: '8px' }}
              >
                {lang === 'th' ? 'ลบบัตรนี้' : lang === 'zh' ? '删除此卡' : 'Delete Card'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Card saved toast */}
      {cardSavedToast && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: '#22c55e', color: 'white', padding: '10px 20px', borderRadius: '20px',
          fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          ✓ {t.cardSaved}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 'auto', padding: '20px 0', opacity: 0.5, fontSize: '12px' }}>
        FinFX v{packageJson.version}
      </div>
    </div>
  );
};

export default SettingsTab;

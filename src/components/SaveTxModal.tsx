import React, { useState, useMemo } from 'react';
import { Translation, PaymentCard } from '../types';
import { CardIcon } from './PaymentCardIcons';

interface SaveTxModalProps {
  t: Translation; lang: string; isDarkMode: boolean; editingTxId: string | null;
  txTitle: string; setTxTitle: (t: string) => void;
  amount: string; fromCurrency: string; toCurrency: string;
  modalRateInverted: boolean; setModalRateInverted: (i: boolean) => void;
  txCustomRate: string; setTxCustomRate: (r: string) => void;
  onClose: () => void; onSave: (cardId?: string, feeAmount?: number, feePercent?: number) => void;
  onDelete: (id: string) => void;
  getTargetRateValue: (code: string, base?: string) => number;
  cards: PaymentCard[];
}

const SaveTxModal: React.FC<SaveTxModalProps> = ({
  t, lang, isDarkMode, editingTxId, txTitle, setTxTitle, amount, fromCurrency, toCurrency,
  modalRateInverted, setModalRateInverted, txCustomRate, setTxCustomRate,
  onClose, onSave, onDelete, cards
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const selectedCard = cards.find(c => c.id === selectedCardId);

  const baseAmount = useMemo(() => {
    const rate = parseFloat(txCustomRate);
    const amt = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(rate) || isNaN(amt)) return 0;
    return modalRateInverted ? amt / rate : amt * rate;
  }, [amount, txCustomRate, modalRateInverted]);

  const feeInfo = useMemo(() => {
    if (!selectedCard || selectedCard.feePercent === 0) return null;
    if (fromCurrency === mainCurrency) return null;
    
    let feeableAmount = baseAmount;
    let freeNote = '';

    // Alipay: free up to X CNY per txn (when using Visa/Master binding)
    if (selectedCard.type === 'alipay' && selectedCard.alipayFreeLimit && fromCurrency === 'CNY') {
      const freeAmt = selectedCard.alipayFreeLimit;
      const originalFromAmt = parseFloat(amount.replace(/,/g, ''));
      if (originalFromAmt <= freeAmt) {
        return { feeAmount: 0, feePercent: 0, totalWithFee: baseAmount, freeNote: t.alipayFreeNote.replace('{0}', freeAmt.toString()).replace('{1}', 'CNY') };
      }
      freeNote = t.alipayFreeNote.replace('{0}', freeAmt.toString()).replace('{1}', 'CNY');
    }

    const feeAmount = (feeableAmount * selectedCard.feePercent) / 100;
    const totalWithFee = feeableAmount + feeAmount;
    return { feeAmount, feePercent: selectedCard.feePercent, totalWithFee, freeNote };
  }, [selectedCard, baseAmount, fromCurrency, amount, t]);

  const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';
  const cardBorder = isDarkMode ? '#2e2e2e' : '#e5e7eb';

  return (
    <div className={`popup-overlay ${isClosing ? 'is-closing' : ''}`} onClick={handleClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()} style={{ overflowY: 'auto' }}>
        <div className="modal-header">
          <button className="close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2>{editingTxId ? t.modalSaveEdit : t.modalSaveNew}</h2>
        </div>
        
        <div className="form-group">
          <label className="form-label">{t.txNameLabel}</label>
          <input type="text" className="form-input" value={txTitle} onChange={e => setTxTitle(e.target.value)} placeholder={t.txNamePlaceholder} autoFocus />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {[t.catFood, t.catShopping, t.catHotel, t.catTransport, t.catCafe, t.catExchange, t.catOther].map(label => (
              <button key={label} onClick={() => setTxTitle(label)} className="category-tag" style={{
                padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-light)',
                background: isDarkMode ? '#262626' : '#f8fafc', color: 'var(--text-main)', fontSize: '12px', cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{color: 'var(--accent-dark)'}}>{t.calcFromApp} {amount} {fromCurrency} {t.calcEstValue} ... {toCurrency}</label>
        </div>

        <div className="form-group">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
            <label className="form-label" style={{margin: 0}}>{t.actualRateLabel}</label>
            <button 
              onClick={() => {
                const currentVal = parseFloat(txCustomRate);
                if (!isNaN(currentVal) && currentVal !== 0) setTxCustomRate((1 / currentVal).toFixed(4));
                setModalRateInverted(!modalRateInverted);
              }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', 
                background: isDarkMode ? '#2a2a2a' : '#f8fafc', 
                border: `1px solid ${isDarkMode ? '#3f3f46' : '#d1d5db'}`, 
                color: 'var(--text-main)',
                padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' 
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
              {t.swapRate}
            </button>
          </div>
          <input type="number" step="0.0001" className="form-input" value={txCustomRate} onChange={e => setTxCustomRate(e.target.value)} />
        </div>

        {/* Payment Card Selection */}
        <div className="form-group">
          <label className="form-label">{t.selectCard}</label>
          <button
            onClick={() => setShowCardPicker(!showCardPicker)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', color: 'var(--text-main)',
              transition: 'all 0.2s'
            }}
          >
            {selectedCard ? (
              <>
                <CardIcon type={selectedCard.type} size={32} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{selectedCard.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedCard.feePercent}% fee</div>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: isDarkMode ? '#333' : '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {cards.length === 0 ? t.noCards : t.selectCard}
                </span>
              </>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <polyline points={showCardPicker ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </button>

          {showCardPicker && (
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '12px', marginTop: '8px', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div
                onClick={() => { setSelectedCardId(undefined); setShowCardPicker(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: `1px solid ${cardBorder}`,
                  background: !selectedCardId ? (isDarkMode ? '#2a2a2a' : '#f0fdf4') : 'transparent'
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: isDarkMode ? '#333' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                  {lang === 'th' ? 'เงินสด / ไม่มีค่าธรรมเนียม' : lang === 'zh' ? '现金 / 无手续费' : 'Cash / No Fee'}
                </span>
              </div>
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => { setSelectedCardId(card.id); setShowCardPicker(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', cursor: 'pointer',
                    borderBottom: `1px solid ${cardBorder}`,
                    background: selectedCardId === card.id ? (isDarkMode ? '#2a2a2a' : '#f0fdf4') : 'transparent'
                  }}
                >
                  <CardIcon type={card.type} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{card.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {card.feePercent > 0 ? `${card.feePercent}% fee` : (lang === 'th' ? 'ฟรี' : lang === 'zh' ? '免手续费' : 'Free')}
                    </div>
                  </div>
                  {selectedCardId === card.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fee Calculation */}
        {feeInfo && baseAmount > 0 && (
          <div style={{
            background: isDarkMode ? '#1a2818' : '#f0fdf4',
            border: `1px solid ${isDarkMode ? '#2d4a28' : '#bbf7d0'}`,
            borderRadius: '12px', padding: '14px 16px', marginBottom: '20px'
          }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: isDarkMode ? '#86efac' : '#166534', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {t.feeCalc}
            </div>
            {feeInfo.freeNote && (
              <div style={{ fontSize: '11px', color: isDarkMode ? '#86efac' : '#15803d', marginBottom: '8px', padding: '4px 8px', background: isDarkMode ? '#14532d20' : '#dcfce7', borderRadius: '6px' }}>
                ✓ {feeInfo.freeNote}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{lang === 'th' ? 'ยอดเงิน' : lang === 'zh' ? '金额' : 'Amount'}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{baseAmount.toFixed(2)} {toCurrency}</span>
              </div>
              {feeInfo.feeAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.cardFee} ({feeInfo.feePercent}%)</span>
                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>+{feeInfo.feeAmount.toFixed(2)} {toCurrency}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `1px dashed ${isDarkMode ? '#2d4a28' : '#bbf7d0'}`, marginTop: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.totalWithFee}</span>
                <span style={{ fontWeight: 800, fontSize: '16px', color: isDarkMode ? '#4ade80' : '#15803d' }}>
                  {feeInfo.totalWithFee.toFixed(2)} {toCurrency}
                </span>
              </div>
            </div>
          </div>
        )}

        <button className="action-btn" onClick={() => onSave(selectedCardId, feeInfo?.feeAmount, feeInfo?.feePercent)}>{t.saveBtn}</button>
        {editingTxId && (
          <div style={{ marginTop: '20px' }}>
            {!showDeleteConfirm ? (
              <button className="delete-tx-btn" onClick={() => setShowDeleteConfirm(true)}>{t.deleteBtn}</button>
            ) : (
              <div style={{ 
                background: isDarkMode ? '#2d1010' : '#fef2f2', 
                padding: '16px', 
                borderRadius: '12px', 
                border: `1px dashed ${isDarkMode ? '#ef4444' : '#f87171'}`,
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '13px', color: isDarkMode ? '#fca5a5' : '#991b1b', marginBottom: '10px' }}>
                   {t.deleteBtn}? <br/>พิมพ์ <b>Delete</b> เพื่อยืนยัน
                </p>
                <input 
                  type="text" 
                  placeholder="Delete"
                  autoFocus
                  className="form-input"
                  style={{ 
                    textAlign: 'center', 
                    padding: '8px', 
                    fontSize: '14px', 
                    fontWeight: 700,
                    marginBottom: '8px',
                    borderColor: isDarkMode ? '#ef4444' : '#f87171'
                  }}
                  onChange={(e) => {
                    if (e.target.value === 'Delete') {
                      onDelete(editingTxId!);
                    }
                  }}
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    fontSize: '13px', 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '10px'
                  }}
                >
                  {lang === 'th' ? 'ยกเลิก' : lang === 'zh' ? '取消' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveTxModal;

import React from 'react';
import { Translation } from '../types';

interface SaveTxModalProps {
  t: Translation; isDarkMode: boolean; editingTxId: string | null;
  txTitle: string; setTxTitle: (t: string) => void;
  amount: string; fromCurrency: string; toCurrency: string;
  modalRateInverted: boolean; setModalRateInverted: (i: boolean) => void;
  txCustomRate: string; setTxCustomRate: (r: string) => void;
  onClose: () => void; onSave: () => void; onDelete: (id: string) => void;
  getTargetRateValue: (code: string, base?: string) => number;
}

const SaveTxModal: React.FC<SaveTxModalProps> = ({
  t, isDarkMode, editingTxId, txTitle, setTxTitle, amount, fromCurrency, toCurrency,
  modalRateInverted, setModalRateInverted, txCustomRate, setTxCustomRate,
  onClose, onSave, onDelete
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
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

        <button className="action-btn" onClick={onSave}>{t.saveBtn}</button>
        {editingTxId && <button className="delete-tx-btn" onClick={() => onDelete(editingTxId!)}>{t.deleteBtn}</button>}
      </div>
    </div>
  );
};

export default SaveTxModal;

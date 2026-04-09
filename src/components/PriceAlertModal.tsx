import React, { useState } from 'react';

interface PriceAlertModalProps {
  code: string; mainCurrency: string;
  getTargetRateValue: (code: string, base: string) => number;
  onClose: () => void;
  onSet: (code: string, value: number) => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ code, mainCurrency, getTargetRateValue, onClose, onSet }) => {
  const [alertTarget, setAlertTarget] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2>Set Alert for {code}</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Alert me when 1 {code} is below:</label>
          <input 
            type="number" className="form-input" 
            value={alertTarget} onChange={e => setAlertTarget(e.target.value)} 
            placeholder="Target Price" autoFocus 
          />
          <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px'}}>Current: {getTargetRateValue(mainCurrency, code).toFixed(4)} {mainCurrency}</p>
        </div>
        <button className="action-btn" onClick={() => {
          const val = parseFloat(alertTarget);
          if (!isNaN(val)) onSet(code, val);
        }}>Set Alert</button>
      </div>
    </div>
  );
};

export default PriceAlertModal;

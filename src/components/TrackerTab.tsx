import React from 'react';
import { Translation, Transaction, PaymentCard } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import { CardIcon } from './PaymentCardIcons';

interface TrackerTabProps {
  t: Translation; lang: string; transactions: Transaction[];
  rates: Record<string, number> | null; 
  getTargetRateValue: (code: string, base?: string) => number;
  decimalPlaces: number | 'auto';
  openSaveDialog: (id: string) => void;
  cards: PaymentCard[];
}

const TrackerTab: React.FC<TrackerTabProps> = ({
  t, transactions, getTargetRateValue, decimalPlaces, openSaveDialog, cards
}) => {
  return (
    <div className="tx-list">
      {transactions.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '40px', color: '#9ca3af', lineHeight: '1.5'}}>
          {t.noHistory}<br/><br/><b>{t.noHistorySub}</b>
        </div>
      ) : transactions.map(tx => {
        const currentLiveRate = getTargetRateValue(tx.to, tx.from);
        const costAtSave = tx.fromAmount * tx.customRate;
        const costToday = tx.fromAmount * currentLiveRate;
        const diffAmount = costToday - costAtSave; 
        const diffPercent = ((currentLiveRate - tx.customRate) / tx.customRate) * 100;
        const isProfit = diffAmount > 0;
        const statusText = isProfit ? t.moreExpensive : t.cheaper;
        const adviceText = isProfit ? `${t.profitVal} ${Math.abs(diffAmount).toFixed(2)} ${tx.to})` : `${t.lossVal} ${Math.abs(diffAmount).toFixed(2)} ${tx.to})`;
        const usedCard = tx.cardId ? cards.find(c => c.id === tx.cardId) : null;
        
        return (
          <div key={tx.id} className="tx-card">
            <div className="tx-header">
              <div>
                <div className="tx-title">{tx.title}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {usedCard && (
                  <div title={usedCard.name}>
                    <CardIcon type={usedCard.type} size={26} />
                  </div>
                )}
                <button className="edit-tx-btn" onClick={() => openSaveDialog(tx.id)}>{t.edit}</button>
              </div>
            </div>
            <div className="tx-body">
              <div className="tx-row">
                <span>{t.spent}</span>
                <strong>{tx.fromAmount.toLocaleString('en-US')} {tx.from}</strong>
              </div>
              <div className="tx-row">
                <span>{t.convertedTo}</span>
                <strong>{(() => {
                  let minD = typeof decimalPlaces === 'number' ? decimalPlaces : 2;
                  let maxD = typeof decimalPlaces === 'number' ? decimalPlaces : 2;
                  if (decimalPlaces === 'auto') {
                    const isCrypto = CURRENCY_DATA[tx.to]?.isCrypto;
                    if (['JPY', 'KRW', 'VND'].includes(tx.to)) { minD = 0; maxD = 0; }
                    else if (isCrypto) {
                      minD = 2; maxD = costAtSave < 0.0001 ? 8 : (costAtSave < 1 ? 6 : 4);
                    } else { minD = 2; maxD = costAtSave < 0.01 ? 4 : 2; }
                  }
                  return costAtSave.toLocaleString('en-US', {minimumFractionDigits: minD, maximumFractionDigits: maxD});
                })()} {tx.to}</strong>
              </div>
              {/* Show fee if present */}
              {tx.feeAmount !== undefined && tx.feeAmount > 0 && (
                <div className="tx-row">
                  <span style={{ color: '#f59e0b' }}>{t.cardFee} ({tx.feePercent}%)</span>
                  <strong style={{ color: '#f59e0b' }}>+{tx.feeAmount.toFixed(2)} {tx.to}</strong>
                </div>
              )}
              {tx.feeAmount !== undefined && tx.feeAmount > 0 && (
                <div className="tx-row" style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '6px', marginTop: '4px' }}>
                  <span style={{ fontWeight: 700 }}>{t.totalWithFee}</span>
                  <strong style={{ color: 'var(--accent-dark)' }}>{(costAtSave + tx.feeAmount).toFixed(2)} {tx.to}</strong>
                </div>
              )}
              <div className="tx-row">
                <span>{t.rateAtSave}</span>
                <strong>1 {tx.rateInverted ? tx.to : tx.from} = {tx.rateInverted ? (1/tx.customRate).toFixed(4) : tx.customRate.toFixed(4)} {tx.rateInverted ? tx.from : tx.to}</strong>
              </div>
              {/* Card badge */}
              {usedCard && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', padding: '4px 8px', borderRadius: '8px', background: 'rgba(0,0,0,0.04)' }}>
                  <CardIcon type={usedCard.type} size={18} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {t.paymentMethod}: <strong>{usedCard.name}</strong>
                  </span>
                </div>
              )}
              <div className="tx-result">
                <span style={{fontSize: '12px'}}>{t.rateToday} {tx.rateInverted ? (1/currentLiveRate).toFixed(4) : currentLiveRate.toFixed(4)}</span>
                <span className={isProfit ? 'profit' : 'loss'}>
                  {statusText} {Math.abs(diffPercent).toFixed(2)}%<br/>
                  <span style={{fontSize: '11px'}}>{adviceText}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackerTab;

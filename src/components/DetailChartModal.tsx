import React, { useMemo } from 'react';
import { Translation } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import { generateMockHistory } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DetailChartModalProps {
  code: string; mainCurrency: string; lang: string; t: Translation; isDarkMode: boolean;
  pinnedRates: string[]; togglePin: (c: string) => void;
  chartTimeframe: string; setChartTimeframe: (tf: string) => void;
  getTargetRateValue: (code: string, base: string) => number;
  onClose: () => void;
}

const DetailChartModal: React.FC<DetailChartModalProps> = ({
  code, mainCurrency, lang, t, isDarkMode, pinnedRates, togglePin,
  chartTimeframe, setChartTimeframe, getTargetRateValue, onClose
}) => {
  const data = useMemo(() => generateMockHistory(getTargetRateValue(mainCurrency, code), lang, chartTimeframe), [code, mainCurrency, lang, chartTimeframe, getTargetRateValue]);
  
  const stats = useMemo(() => {
    if (!data || data.length < 2) return null;
    const first = data[0].rate;
    const last = data[data.length - 1].rate;
    const diff = last - first;
    const percent = (diff / first) * 100;
    return { diff, percent, isPlus: diff >= 0 };
  }, [data]);

  const renderFlag = (c: string) => {
    const flagData = CURRENCY_DATA[c];
    if (flagData?.icon) return <img src={flagData.icon} alt={c} style={{width: '24px', height: '24px', borderRadius: '50%'}} />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : ''} alt={c} style={{width: '24px', height: '24px', borderRadius: '50%'}} />;
  };

  return (
    <div className="modal-overlay" style={{ background: isDarkMode ? '#121212' : '#ffffff', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <button onClick={onClose} style={{ background: isDarkMode ? '#2a2a2a' : '#f0f0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDarkMode ? '#fff' : '#000' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button onClick={() => togglePin(code)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: pinnedRates.includes(code) ? '#9fe870' : '#888' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </button>
      </div>

      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{code} {t.convertedTo} {mainCurrency}</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#888' }}>{CURRENCY_DATA[code]?.name} to {CURRENCY_DATA[mainCurrency]?.name}</p>
          </div>
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, border: '2px solid #fff', borderRadius: '50%' }}>{renderFlag(code)}</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 2, border: '2px solid #fff', borderRadius: '50%' }}>{renderFlag(mainCurrency)}</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700 }}>1 {code} = {getTargetRateValue(mainCurrency, code).toFixed(4)} {mainCurrency}</div>
          {stats && (
            <div style={{ color: stats.isPlus ? '#16a34a' : '#dc2626', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points={stats.isPlus ? "23 6 13.5 15.5 8.5 10.5 1 18" : "23 18 13.5 8.5 8.5 13.5 1 6"} /></svg>
              {Math.abs(stats.percent).toFixed(2)}%
            </div>
          )}
        </div>

        <div className="chart-timeframe-selector" style={{display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto'}}>
          {['1h', '1d', '7d', '1m', '6m', '1y', '5y'].map((tf) => (
            <button key={tf} className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`} onClick={() => setChartTimeframe(tf)} style={{
              flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid',
              borderColor: chartTimeframe === tf ? 'var(--accent)' : 'var(--border-light)',
              background: chartTimeframe === tf ? 'rgba(159, 232, 112, 0.1)' : 'transparent',
              color: chartTimeframe === tf ? 'var(--accent-dark)' : '#888'
            }}>{(t as any)[`time_${tf}`]}</button>
          ))}
        </div>

        <div style={{flex: 1, maxHeight: '400px', background: isDarkMode ? '#1e1e1e' : '#f9fafb', borderRadius: '16px', padding: '10px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="var(--accent-dark)" strokeWidth={3} dot={false} />
              {data.length > 0 && <ReferenceLine y={data[data.length-1].rate} stroke="#22c55e" strokeDasharray="3 3"/>}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DetailChartModal;

import React, { useRef, useState } from 'react';
import { Translation, PriceAlert } from '../types';
import { CURRENCY_DATA } from '../constants/currencies';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateMockHistory } from '../utils/helpers';

interface ChartTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  chartFrom: string; setChartFrom: (c: string) => void;
  chartTo: string; setChartTo: (c: string) => void;
  chartTimeframe: string; setChartTimeframe: (tf: string) => void;
  chartData: any[]; mainCurrency: string;
  pinnedRates: string[]; setPinnedRates: React.Dispatch<React.SetStateAction<string[]>>;
  visibleFiat: string[]; setVisibleFiat: React.Dispatch<React.SetStateAction<string[]>>;
  visibleCrypto: string[]; setVisibleCrypto: React.Dispatch<React.SetStateAction<string[]>>;
  isFiatCollapsed: boolean; setIsFiatCollapsed: (c: boolean) => void;
  isCryptoCollapsed: boolean; setIsCryptoCollapsed: (c: boolean) => void;
  priceAlerts: PriceAlert[]; getTargetRateValue: (code: string, base: string) => number;
  setActiveDropdown: (d: string | null) => void; setSearchQuery: (s: string) => void;
  setDetailChartCurrency: (c: string | null) => void;
  setContextMenuCurrency: (c: string | null) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({
  t, lang, isDarkMode, chartFrom, chartTo, chartTimeframe, setChartTimeframe,
  chartData, mainCurrency, pinnedRates,
  visibleFiat, visibleCrypto,
  isFiatCollapsed, setIsFiatCollapsed, isCryptoCollapsed, setIsCryptoCollapsed,
  priceAlerts, getTargetRateValue, setActiveDropdown, setSearchQuery,
  setDetailChartCurrency, setContextMenuCurrency, setChartFrom, setChartTo
}) => {
  const chartStats = React.useMemo(() => {
    if (!chartData || chartData.length < 2) return null;
    const first = chartData[0].rate;
    const last = chartData[chartData.length - 1].rate;
    const diff = last - first;
    const percent = (diff / first) * 100;
    return { diff, percent, isPlus: diff >= 0 };
  }, [chartData]);

  const renderFlag = (code: string) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) return <img src={flagData.icon} alt={code} className="flag-icon" />;
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" />;
  };

  const pressTimer = useRef<any>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: any, code: string) => {
    const touch = e.touches ? e.touches[0] : e;
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setIsLongPress(false);
    pressTimer.current = setTimeout(() => {
      setContextMenuCurrency(code);
      setIsLongPress(true);
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(60);
    }, 600);
  };

  const onTouchEnd = (e: any, _code: string, onClickAction: () => void) => {
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const diffX = Math.abs(touch.clientX - touchStartPos.current.x);
    const diffY = Math.abs(touch.clientY - touchStartPos.current.y);
    clearTimeout(pressTimer.current);
    if (!isLongPress && diffX < 10 && diffY < 10) onClickAction();
  };

  const renderRow = (code: string, isPinned = false) => {
    const rateToShow = getTargetRateValue(mainCurrency, code);
    if (rateToShow === 0) return null;
    return (
      <tr 
        key={code} 
        style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: isPinned ? (isDarkMode ? 'rgba(159, 232, 112, 0.02)' : 'rgba(163, 230, 53, 0.02)') : 'transparent' }} 
        onTouchStart={(e) => onTouchStart(e, code)}
        onTouchEnd={(e) => onTouchEnd(e, code, () => setDetailChartCurrency(code))}
        onMouseDown={(e) => onTouchStart(e, code)}
        onMouseUp={(e) => onTouchEnd(e, code, () => setDetailChartCurrency(code))}
      >
        <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderFlag(code)}
            <span style={{color: 'var(--text-main)', fontWeight: isPinned ? 600 : 500}}>1 {code}</span>
          </div>
        </td>
        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ color: 'var(--accent-dark)', fontWeight: isPinned ? 700 : 600, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
            {priceAlerts.some(a => a.code === code && rateToShow <= a.target) && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#16a34a" style={{ animation: 'pulse 2s infinite' }}><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V10a6 6 0 0 0-12 0v6l-2 2v1h16v-1l-2-2z"/></svg>
            )}
            {rateToShow.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {mainCurrency}
          </div>
          {(() => {
            const history = generateMockHistory(rateToShow, lang, '1m');
            const avg = history.reduce((sum, item) => sum + item.rate, 0) / history.length;
            const diff = ((rateToShow - avg) / avg) * 100;
            if (Math.abs(diff) < 0.05) return null;
            return (
              <div style={{ color: diff > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', marginTop: '1px' }}>
                {diff > 0 ? '+' : ''}{diff.toFixed(2)}% {diff > 0 ? '▲' : '▼'}
              </div>
            );
          })()}
        </td>
      </tr>
    );
  };

  return (
    <div className="chart-page" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div className="chart-header-controls" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDarkMode ? '#1e1e1e' : '#ffffff', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-light)'
      }}>
        <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}} style={{flex: 1}}>
          {renderFlag(chartFrom)} 
          <span className="currency-code">{chartFrom}</span>
        </div>
        <button className="swap-btn-small" onClick={() => { const old=chartFrom; setChartFrom(chartTo); setChartTo(old); }} style={{
          background: '#f9fafb', border: '1px solid var(--border-light)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
        </button>
        <div className="currency-selector" onClick={() => {setActiveDropdown('to'); setSearchQuery('')}} style={{flex: 1, justifyContent: 'flex-end'}}>
          <span className="currency-code">{chartTo}</span>
          {renderFlag(chartTo)} 
        </div>
      </div>

      <div className="chart-timeframe-selector" style={{display: 'flex', gap: '8px', padding: '0 4px', overflowX: 'auto', scrollbarWidth: 'none'}}>
        {['1h', '1d', '7d', '1m', '6m', '1y', '5y'].map((tf) => (
          <button 
            key={tf} className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
            onClick={() => setChartTimeframe(tf)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid',
              borderColor: chartTimeframe === tf ? 'var(--accent)' : 'var(--border-light)',
              background: chartTimeframe === tf ? (isDarkMode ? 'rgba(159, 232, 112, 0.15)' : '#f7fee7') : (isDarkMode ? '#262626' : '#ffffff'),
              color: chartTimeframe === tf ? 'var(--accent-dark)' : 'var(--text-muted)',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px'
            }}
          >
            {(t as any)[`time_${tf}`]}
          </button>
        ))}
      </div>

      <div className="chart-container-box" style={{ padding: '20px 10px', borderRadius: '16px', border: '1px solid var(--border-light)', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', textAlign: 'center', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div>1 {chartFrom} = {getTargetRateValue(chartTo, chartFrom).toFixed(4)} {chartTo}</div>
          {chartStats && (
            <div style={{ fontSize: '13px', color: chartStats.isPlus ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {chartStats.isPlus ? '+' : ''}{chartStats.diff.toFixed(4)} ({chartStats.isPlus ? '+' : ''}{chartStats.percent.toFixed(2)}%)
            </div>
          )}
        </h3>
        <div style={{flex: 1, width: '100%'}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" stroke={isDarkMode ? '#6b7280' : '#9ca3af'} fontSize={10} tickFormatter={(val) => val.split(' ')[0]} minTickGap={20} />
              <YAxis domain={['auto', 'auto']} stroke={isDarkMode ? '#6b7280' : '#9ca3af'} fontSize={10} width={45} tickFormatter={(val) => val.toFixed(4)} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#ffffff', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="rate" stroke={isDarkMode ? 'var(--accent)' : 'var(--accent-dark)'} strokeWidth={3} dot={false} />
              {chartData.length > 0 && <ReferenceLine y={chartData[chartData.length - 1].rate} stroke={isDarkMode ? '#16a34a' : '#15803d'} strokeDasharray="3 3" label={{ position: 'right', value: chartData[chartData.length - 1].rate.toFixed(4), fill: isDarkMode ? '#16a34a' : '#15803d', fontSize: 10, fontWeight: 700, offset: 10 }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{margin: '16px 0 12px 0', fontSize: '15px', color: 'var(--text-muted)', fontWeight: 600}}>{t.ratesTableTitle.replace('{0}', mainCurrency)}</h3>

      <div className="chart-table-container" style={{ background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '80px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-light)' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{t.allCurrencies}</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>{t.tableRate}</th>
            </tr>
          </thead>
          <tbody>
            {pinnedRates.length > 0 && (
              <>
                <tr style={{background: isDarkMode ? 'rgba(159, 232, 112, 0.1)' : 'rgba(163, 230, 53, 0.05)'}}><td colSpan={2} style={{padding: '10px 16px', fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.5px'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '6px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>{t.pinnedRates}</td></tr>
                {pinnedRates.map(code => renderRow(code, true))}
              </>
            )}

            <tr onClick={() => setIsFiatCollapsed(!isFiatCollapsed)} style={{background: (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'), cursor: 'pointer'}}>
              <td colSpan={2} style={{padding: '10px 16px'}}>
                <div style={{fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between'}}>
                  {t.fiatCurrencies}
                  <svg style={{transform: isFiatCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </td>
            </tr>
            {!isFiatCollapsed && visibleFiat.filter(c => c !== mainCurrency && !pinnedRates.includes(c)).map(code => renderRow(code))}
            {!isFiatCollapsed && <tr><td colSpan={2} style={{padding: '12px 16px'}}><button className="add-currency-btn" onClick={() => {setActiveDropdown('fiatTable'); setSearchQuery('')}} style={{width: '100%', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: '10px', background: 'transparent', color: 'var(--accent-dark)', fontWeight: 600}}>+ {t.addCurrencyTitle}</button></td></tr>}

            <tr onClick={() => setIsCryptoCollapsed(!isCryptoCollapsed)} style={{background: (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'), cursor: 'pointer'}}>
              <td colSpan={2} style={{padding: '10px 16px'}}>
                <div style={{fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between'}}>
                  {t.cryptoCurrencies}
                  <svg style={{transform: isCryptoCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </td>
            </tr>
            {!isCryptoCollapsed && visibleCrypto.filter(c => c !== mainCurrency && !pinnedRates.includes(c)).map(code => renderRow(code))}
            {!isCryptoCollapsed && <tr><td colSpan={2} style={{padding: '12px 16px'}}><button className="add-currency-btn" onClick={() => {setActiveDropdown('cryptoTable'); setSearchQuery('')}} style={{width: '100%', padding: '8px', border: '1px dashed var(--border-color)', borderRadius: '10px', background: 'transparent', color: 'var(--accent-dark)', fontWeight: 600}}>+ {t.addCurrencyTitle}</button></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartTab;

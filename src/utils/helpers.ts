import { HistoryData } from '../types';

export function generateMockHistory(currentRate: number, lang: string, timeframe: string = '1m'): HistoryData[] {
  const data: HistoryData[] = [];
  let steps = 30;
  let mode = 'day';

  if (timeframe === '1h') { steps = 12; mode = 'm5'; }
  else if (timeframe === '1d') { steps = 24; mode = 'h1'; }
  else if (timeframe === '7d') { steps = 7; mode = 'day'; }
  else if (timeframe === '1m') { steps = 30; mode = 'day'; }
  else if (timeframe === '6m') { steps = 180; mode = 'day'; }
  else if (timeframe === '1y') { steps = 365; mode = 'day'; }
  else if (timeframe === '5y') { steps = 1825; mode = 'day'; }

  let currentSimRate = currentRate;
  let simulatedRates = [currentSimRate];
  const vol = timeframe.includes('h') || timeframe === '1d' ? 0.005 : 0.016;
  for (let i = 1; i <= steps; i++) {
    const fluctuation = 1 + (Math.random() * vol - (vol/2));
    currentSimRate = currentSimRate * fluctuation;
    simulatedRates.push(currentSimRate);
  }
  simulatedRates.reverse();

  const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
  
  for(let i=steps; i>=0; i--) {
    const date = new Date();
    if (mode === 'm5') date.setMinutes(date.getMinutes() - (i * 5));
    else if (mode === 'h1') date.setHours(date.getHours() - i);
    else date.setDate(date.getDate() - i);

    let dateLabel = '';
    if (mode === 'm5' || mode === 'h1') {
      dateLabel = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      dateLabel = date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    }

    data.push({ date: dateLabel, rate: Number(simulatedRates[steps - i].toFixed(4)) });
  }
  return data;
}

export function formatWithCommas(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === '') return '';
  if (/[+\-*/]/.test(val.toString())) return val.toString();
  const parts = val.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

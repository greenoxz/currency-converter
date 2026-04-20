import React, { useState, useEffect, useMemo } from 'react';
import { Translation, PaymentCard } from '../types';
import { CardIcon } from './PaymentCardIcons';
import { CURRENCY_DATA } from '../constants/currencies';

interface BillSplitTabProps {
  t: Translation; lang: string; isDarkMode: boolean;
  cards: PaymentCard[];
  getTargetRateValue: (code: string, base?: string) => number;
  mainCurrency: string;
  fromCurrency: string;
}

export interface LedgerMember { id: string; name: string; }
export interface LedgerRecord {
  id: string;
  desc: string;
  amountForeign: number;
  currency: string;
  payerId: string;
  cardId: string | undefined;
  exchangeRate: number;
  feeAmountForeign: number;
  totalForeign: number;
  totalMain: number;
  isShared: boolean;
  splitMode?: 'all' | 'custom' | 'personal';
  sharedWithIds?: string[];
  timestamp: number;
}

const BillSplitTab: React.FC<BillSplitTabProps> = ({
  lang, isDarkMode, cards, getTargetRateValue, mainCurrency, fromCurrency
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'summary'>('ledger');
  
  const [members, setMembers] = useState<LedgerMember[]>(() => {
    const saved = localStorage.getItem('trip_members');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: lang === 'th' ? 'ฉัน' : 'Me' },
      { id: '2', name: lang === 'th' ? 'เพื่อน' : 'Friend' }
    ];
  });

  const [records, setRecords] = useState<LedgerRecord[]>(() => {
    const saved = localStorage.getItem('trip_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('trip_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('trip_records', JSON.stringify(records));
  }, [records]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCurrency, setFormCurrency] = useState(fromCurrency || 'CNY');
  const [formPayer, setFormPayer] = useState<string>(members[0]?.id || '1');
  const [formCardId, setFormCardId] = useState<string | undefined>(undefined);
  const [formSplitMode, setFormSplitMode] = useState<'all' | 'custom' | 'personal'>('all');
  const [formSharedWith, setFormSharedWith] = useState<string[]>([]);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  const CURRENCIES = Object.keys(CURRENCY_DATA);

  const getCardFee = (amount: number, cId: string | undefined, curr: string) => {
    const card = cards.find(c => c.id === cId);
    if (!card || card.feePercent === 0) return 0;
    if (curr === mainCurrency) return 0;
    if (card.type === 'alipay' && card.alipayFreeLimit && curr === 'CNY') {
      if (amount <= card.alipayFreeLimit) return 0;
    }
    return (amount * card.feePercent) / 100;
  };

  const openAddModal = () => {
    setEditingRecordId(null);
    setFormDesc('');
    setFormAmount('');
    setFormCurrency(fromCurrency || 'CNY');
    setFormPayer(members[0]?.id || '1');
    setFormCardId(undefined);
    setFormSplitMode('all');
    setFormSharedWith([]);
    setShowAddModal(true);
  };

  const editRecord = (r: LedgerRecord) => {
    setEditingRecordId(r.id);
    setFormDesc(r.desc);
    setFormAmount(r.amountForeign.toString());
    setFormCurrency(r.currency);
    setFormPayer(r.payerId);
    setFormCardId(r.cardId);
    setFormSplitMode(r.splitMode || (r.isShared ? 'all' : 'personal'));
    setFormSharedWith(r.sharedWithIds || []);
    setShowAddModal(true);
  };

  const handleSave = () => {
    const amt = parseFloat(formAmount);
    if (!amt || isNaN(amt) || amt <= 0) return;
    
    const fee = getCardFee(amt, formCardId, formCurrency);
    const totalFor = amt + fee;
    // Calculate exchange rate against the MAIN currency
    const rate = getTargetRateValue(mainCurrency, formCurrency);
    const tMain = totalFor * rate;

    const newRec: LedgerRecord = {
      id: editingRecordId || Date.now().toString(),
      desc: formDesc || (lang === 'th' ? 'รายการค่าใช้จ่าย' : 'Expense'),
      amountForeign: amt,
      currency: formCurrency,
      payerId: formPayer,
      cardId: formCardId,
      exchangeRate: rate,
      feeAmountForeign: fee,
      totalForeign: totalFor,
      totalMain: tMain,
      isShared: formSplitMode !== 'personal',
      splitMode: formSplitMode,
      sharedWithIds: formSplitMode === 'custom' ? formSharedWith : undefined,
      timestamp: Date.now()
    };

    if (editingRecordId) {
      setRecords(records.map(r => r.id === editingRecordId ? newRec : r));
    } else {
      setRecords([newRec, ...records]);
    }
    
    setShowAddModal(false);
    setEditingRecordId(null);
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };
  
  const clearLedger = () => {
    if(window.confirm(lang === 'th' ? 'ล้างข้อมูลบัญชีทริปทั้งหมด?' : 'Clear all ledger data?')) {
       setRecords([]);
    }
  };

  // Settlement Calculation
  const { sharedMain, debts, totalPaid } = useMemo(() => {
    const sharedRecordsForTotal = records.filter(r => r.splitMode === 'all' || r.splitMode === 'custom' || (!r.splitMode && r.isShared));
    const sharedM = sharedRecordsForTotal.reduce((s, r) => s + r.totalMain, 0);
    
    const balances: Record<string, number> = {};
    const tPaid: Record<string, number> = {};
    members.forEach(m => { balances[m.id] = 0; tPaid[m.id] = 0; });
    
    records.forEach(r => {
      // Add out-of-pocket amount to payer
      if (tPaid[r.payerId] !== undefined) tPaid[r.payerId] += r.totalMain;

      const mode = r.splitMode || (r.isShared ? 'all' : 'personal');
      
      if (mode !== 'personal') {
        if (balances[r.payerId] !== undefined) balances[r.payerId] += r.totalMain;
        
        if (mode === 'all') {
           const perPerson = members.length > 0 ? r.totalMain / members.length : 0;
           members.forEach(m => { if (balances[m.id] !== undefined) balances[m.id] -= perPerson; });
        } else if (mode === 'custom' && r.sharedWithIds && r.sharedWithIds.length > 0) {
           const validIds = r.sharedWithIds.filter(id => balances[id] !== undefined);
           const perPerson = validIds.length > 0 ? r.totalMain / validIds.length : 0;
           validIds.forEach(id => balances[id] -= perPerson);
        }
      }
    });

    const debtors = members.map(m => ({ id: m.id, name: m.name, bal: balances[m.id] })).filter(m => m.bal <= -0.01).sort((a,b) => a.bal - b.bal);
    const creditors = members.map(m => ({ id: m.id, name: m.name, bal: balances[m.id] })).filter(m => m.bal >= 0.01).sort((a,b) => b.bal - a.bal);
    
    const debtsList: {fromName: string, toName: string, amount: number}[] = [];
    let dIndex = 0; let cIndex = 0;
    while(dIndex < debtors.length && cIndex < creditors.length) {
      const d = debtors[dIndex]; const c = creditors[cIndex];
      const amount = Math.min(-d.bal, c.bal);
      debtsList.push({ fromName: d.name, toName: c.name, amount });
      d.bal += amount; c.bal -= amount;
      if (Math.abs(d.bal) < 0.01) dIndex++;
      if (c.bal < 0.01) cIndex++;
    }

    return { sharedMain: sharedM, debts: debtsList, totalPaid: tPaid };
  }, [records, members]);

  const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';
  const cardBorder = isDarkMode ? '#2e2e2e' : '#e5e7eb';
  const sectionBg = isDarkMode ? '#1a1a1a' : '#f8fafc';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
      
      {/* Header & Tabs */}
      <div style={{ background: cardBg, borderRadius: '20px', padding: '16px', border: `1px solid ${cardBorder}` }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--accent-main)', borderRadius: '10px', padding: '6px', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
          </div>
          {lang === 'th' ? 'สมุดบัญชีทริป (Trip Ledger)' : 'Trip Ledger'}
        </h3>
        
        {/* Toggle View */}
        <div style={{ display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px' }}>
          {[
            { id: 'ledger', label: lang === 'th' ? 'รายการจด' : 'Records' },
            { id: 'summary', label: lang === 'th' ? 'สรุปยอด/เคลียร์เงิน' : 'Settlement' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveTab(opt.id as 'ledger' | 'summary')}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px',
                background: activeTab === opt.id ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent',
                color: activeTab === opt.id ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: activeTab === opt.id ? 700 : 500,
                boxShadow: activeTab === opt.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ledger' && (
        <>
          <button
            onClick={openAddModal}
            style={{
              padding: '16px', borderRadius: '16px', border: `1px solid ${isDarkMode ? '#2d4a28' : '#bbf7d0'}`,
              background: `linear-gradient(135deg, ${isDarkMode ? '#1a2818' : '#f0fdf4'}, ${isDarkMode ? '#1e1e1e' : '#ffffff'})`,
              color: isDarkMode ? '#86efac' : '#15803d',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ background: isDarkMode ? '#2d4a28' : '#dcfce7', borderRadius: '8px', padding: '4px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            {lang === 'th' ? 'จดรายการใหม่' : 'Add New Record'}
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {records.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: '12px' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg></div>
                {lang === 'th' ? 'ยังไม่มีรายการค่าใช้จ่าย กดปุ่มด้านบนเพื่อเพิ่ม' : 'No records yet. Tap above to add.'}
              </div>
            ) : (
              records.map(r => {
                const payerName = members.find(m => m.id === r.payerId)?.name || 'Unknown';
                const card = cards.find(c => c.id === r.cardId);
                return (
                  <div key={r.id} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '16px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', paddingRight: '12px', wordBreak: 'break-word', flex: 1 }}>{r.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '8px', flexShrink: 0,
                          background: (r.splitMode === 'all' || (!r.splitMode && r.isShared)) ? (isDarkMode ? '#1e3a8a' : '#dbeafe') : r.splitMode === 'custom' ? (isDarkMode ? '#4c1d95' : '#ede9fe') : (isDarkMode ? '#27272a' : '#f3f4f6'),
                          color: (r.splitMode === 'all' || (!r.splitMode && r.isShared)) ? (isDarkMode ? '#bfdbfe' : '#1e40af') : r.splitMode === 'custom' ? (isDarkMode ? '#ddd6fe' : '#5b21b6') : (isDarkMode ? '#a1a1aa' : '#52525b')
                        }}>
                          {(r.splitMode === 'all' || (!r.splitMode && r.isShared)) ? (lang === 'th' ? 'หารทุกคน' : 'Shared') : r.splitMode === 'custom' ? (lang === 'th' ? `หาร ${r.sharedWithIds?.length || 0} คน` : `Split (${r.sharedWithIds?.length || 0})`) : (lang === 'th' ? `ส่วนตัว (${payerName})` : 'Personal')}
                        </div>
                        <button 
                          onClick={() => editRecord(r)}
                          style={{ padding: '6px', background: 'transparent', border: `1px solid ${cardBorder}`, borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title={lang === 'th' ? 'แก้ไข' : 'Edit'}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={() => { if(window.confirm(lang === 'th' ? 'ลบรายการนี้?' : 'Delete?')) deleteRecord(r.id); }}
                          className="delete-icon-btn"
                          title={lang === 'th' ? 'ลบรายการนี้' : 'Delete'}
                        >
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px dashed ${cardBorder}`, paddingTop: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {lang === 'th' ? 'จ่ายโดย:' : 'Paid by:'} <strong style={{ color: 'var(--text-main)' }}>{payerName}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CardIcon type={card ? card.type : 'cash'} size={24} />
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{card ? card.name : (lang === 'th' ? 'เงินสด' : 'Cash')}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Inter' }}>
                          {r.totalForeign.toFixed(2)} <span style={{ fontSize: '14px' }}>{r.currency}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          ≈ {r.totalMain.toFixed(2)} {mainCurrency}
                        </div>
                        {r.feeAmountForeign > 0 && (
                          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>
                            (+ {r.feeAmountForeign.toFixed(2)} Fee)
                          </div>
                        )}
                      </div>
                    </div>
                    
                  </div>
                );
              })
            )}
            
            {records.length > 0 && (
               <button onClick={clearLedger} style={{ marginTop: '20px', padding: '14px', background: 'transparent', border: `1px dashed ${cardBorder}`, color: '#ef4444', borderRadius: '16px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', alignSelf: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                 {lang === 'th' ? 'เคลียร์ข้อมูลทริปทั้งหมด' : 'Clear Trip Data'}
               </button>
            )}
          </div>
        </>
      )}

      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           {/* Section 1: Settlement */}
           <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               {lang === 'th' ? 'สรุปการเคลียร์เงิน' : 'Settlement'}
             </h4>
             <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
               {lang === 'th' ? 'คำนวณจากทุกรายการที่มีคนหารร่วมกัน โดยแปลงค่าเป็นสกุลเงินหลักแล้ว' : 'Calculated from all shared items, converted to base currency.'}
             </div>
             
             {debts.length === 0 ? (
               <div style={{ padding: '20px', background: sectionBg, borderRadius: '12px', textAlign: 'center', color: 'var(--accent-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 {lang === 'th' ? 'เคลียร์กันลงตัวพอดี ไม่มีใครค้างใคร!' : 'All settled up!'}
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {debts.map((d, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: sectionBg, borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '15px' }}>{d.fromName}</div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        <div style={{ fontWeight: 700, color: '#10b981', fontSize: '15px' }}>{d.toName}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Inter' }}>{d.amount.toFixed(2)}</div>
                       <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{mainCurrency}</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           {/* Section 2: Shared Expense Total */}
           <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
               {lang === 'th' ? 'ยอดรวมรายการหารทุกคน' : 'Total Shared Expenses'}
             </h4>
             <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-dark)', fontFamily: 'Inter' }}>
               {sharedMain.toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>{mainCurrency}</span>
             </div>
             <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
               {lang === 'th' ? 'ตกเฉลี่ยคนละ' : 'Average per person'}: <strong>{(members.length > 0 ? sharedMain / members.length : 0).toFixed(2)} {mainCurrency}</strong>
             </div>
           </div>

           {/* Section 3: Total Paid summary */}
           <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
               {lang === 'th' ? 'แต่ละคนออกเงินไปทั้งหมด' : 'Total Amount Paid'}
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {members.map(m => (
                 <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: sectionBg, borderRadius: '10px', border: `1px solid ${cardBorder}` }}>
                   <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.name}</div>
                   <div style={{ fontWeight: 700, fontFamily: 'Inter', color: 'var(--text-main)' }}>
                     {(totalPaid[m.id] || 0).toFixed(2)} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{mainCurrency}</span>
                   </div>
                 </div>
               ))}
               {Object.values(totalPaid).every(v => v === 0) && (
                 <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                   {lang === 'th' ? 'ยังไม่ได้จ่ายเงินเลยซักบาท' : 'No payments recorded.'}
                 </div>
               )}
             </div>
           </div>
           
           {/* Section 4: Edit Members */}
           <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px' }}>
             <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               {lang === 'th' ? 'จัดการผู้ร่วมทริป' : 'Manage Members'}
             </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {members.map(m => (
                 <div key={m.id} style={{ display: 'flex', gap: '8px' }}>
                   <input 
                     type="text" value={m.name} 
                     onChange={(e) => setMembers(members.map(mb => mb.id === m.id ? { ...mb, name: e.target.value } : mb))}
                     className="form-input" style={{ flex: 1, padding: '10px' }}
                   />
                   <button 
                     className="delete-icon-btn"
                     onClick={() => {
                        if (members.length <= 1) return;
                        if(window.confirm(lang === 'th' ? `ลบผู้ร่วมทริป "${m.name}"?` : `Remove member "${m.name}"?`)) {
                          setMembers(members.filter(mb => mb.id !== m.id));
                        }
                     }}
                     disabled={members.length <= 1}
                     title={lang === 'th' ? 'ลบผู้ร่วมทริป' : 'Remove Member'}
                   >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                 </div>
               ))}
               <button onClick={() => setMembers([...members, { id: Date.now().toString(), name: 'New Friend' }])} style={{ padding: '10px', background: isDarkMode ? '#2d4a28' : '#dcfce7', color: isDarkMode ? '#86efac' : '#15803d', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>
                 + {lang === 'th' ? 'เพิ่มผู้ร่วมทริป' : 'Add Member'}
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '24px 24px 0 0', padding: '24px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{lang === 'th' ? (editingRecordId ? 'แก้ไขรายการค่าใช้จ่าย' : 'เพิ่มรายการค่าใช้จ่าย') : (editingRecordId ? 'Edit Record' : 'New Record')}</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'รายละเอียด' : 'Description'}</label>
                <input type="text" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder={lang === 'th' ? 'เช่น ตั๋วรถไฟ, ข้าวเย็น' : 'e.g., Dinner, Train ticket'} className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</label>
                  <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 700 }} />
                </div>
                <div style={{ width: '140px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'สกุลเงิน' : 'Currency'}</label>
                  <div onClick={() => setShowCurrencyModal(true)} className="form-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingRight: '12px', fontSize: '15px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {CURRENCY_DATA[formCurrency]?.icon ? <img src={CURRENCY_DATA[formCurrency].icon} alt={formCurrency} style={{width: '20px', height: '20px'}} /> : <img src={`https://flagcdn.com/w40/${CURRENCY_DATA[formCurrency]?.flag}.png`} alt={formCurrency} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover'}} />}
                      <span>{formCurrency}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'ใครเป็นคนจ่าย?' : 'Who paid?'}</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {members.map(m => (
                    <button key={m.id} onClick={() => setFormPayer(m.id)} style={{ padding: '10px 16px', borderRadius: '12px', border: `2px solid ${formPayer === m.id ? 'var(--accent-dark)' : cardBorder}`, background: formPayer === m.id ? (isDarkMode ? '#163300' : '#f0fdf4') : sectionBg, color: formPayer === m.id ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'จ่ายด้วยอะไร?' : 'Paid via'}</label>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowCardPicker(!showCardPicker)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: sectionBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', color: 'var(--text-main)' }}>
                    {formCardId ? (
                      <>
                        <CardIcon type={cards.find(c => c.id === formCardId)?.type || 'cash'} size={24} />
                        <div style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>{cards.find(c => c.id === formCardId)?.name}</div>
                      </>
                    ) : (
                      <span style={{ fontWeight: 600, flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        {lang === 'th' ? 'เงินสด / ไม่มีค่าธรรมเนียม' : 'Cash / No Fee'}
                      </span>
                    )}
                  </button>
                  {showCardPicker && (
                    <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '8px', background: isDarkMode ? '#262626' : '#ffffff', border: `1px solid ${cardBorder}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                      <div onClick={() => { setFormCardId(undefined); setShowCardPicker(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${cardBorder}`, background: !formCardId ? (isDarkMode ? '#3f3f46' : '#f3f4f6') : 'transparent', display: 'flex', gap: '12px', alignItems: 'center' }}>
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                         <span style={{ fontWeight: 600 }}>{lang === 'th' ? 'เงินสด (Cash)' : 'Cash'}</span>
                      </div>
                      {cards.map(c => (
                        <div key={c.id} onClick={() => { setFormCardId(c.id); setShowCardPicker(false); }} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: `1px solid ${cardBorder}`, background: formCardId === c.id ? (isDarkMode ? '#3f3f46' : '#f3f4f6') : 'transparent', display: 'flex', gap: '12px', alignItems: 'center' }}>
                           <CardIcon type={c.type} size={24} />
                           <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 600 }}>{c.name}</div>
                             <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.feePercent > 0 ? `${c.feePercent}% fee` : 'Free'}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{lang === 'th' ? 'รูปแบบการหาร' : 'Split Type'}</label>
                <div style={{ display: 'flex', background: sectionBg, padding: '4px', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
                  <button onClick={() => setFormSplitMode('all')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: formSplitMode === 'all' ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent', color: formSplitMode === 'all' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: formSplitMode === 'all' ? 700 : 500, cursor: 'pointer', boxShadow: formSplitMode === 'all' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    {lang === 'th' ? 'หารทุกคน' : 'All'}
                  </button>
                  <button onClick={() => { setFormSplitMode('custom'); if (formSharedWith.length === 0) setFormSharedWith(members.map(m => m.id)); }} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: formSplitMode === 'custom' ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent', color: formSplitMode === 'custom' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: formSplitMode === 'custom' ? 700 : 500, cursor: 'pointer', boxShadow: formSplitMode === 'custom' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                    {lang === 'th' ? 'คนที่เลือก' : 'Select'}
                  </button>
                  <button onClick={() => setFormSplitMode('personal')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: formSplitMode === 'personal' ? (isDarkMode ? '#1e1e1e' : '#ffffff') : 'transparent', color: formSplitMode === 'personal' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: formSplitMode === 'personal' ? 700 : 500, cursor: 'pointer', boxShadow: formSplitMode === 'personal' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    {lang === 'th' ? 'ส่วนตัว' : 'Personal'}
                  </button>
                </div>
                {formSplitMode === 'custom' && (
                   <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: isDarkMode ? '#262626' : '#ffffff', borderRadius: '12px', border: `1px solid ${cardBorder}` }}>
                     <div style={{ width: '100%', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>{lang === 'th' ? 'เลือกคนที่ช่วยจ่ายรายการนี้:' : 'Select who shares this:'}</div>
                     {members.map(m => {
                        const isSelected = formSharedWith.includes(m.id);
                        return (
                          <button key={m.id} onClick={() => {
                             if (isSelected) setFormSharedWith(formSharedWith.filter(i => i !== m.id));
                             else setFormSharedWith([...formSharedWith, m.id]);
                          }} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${isSelected ? 'var(--accent-dark)' : cardBorder}`, background: isSelected ? (isDarkMode ? '#163300' : '#f0fdf4') : 'transparent', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '4px', border: `2px solid ${isSelected ? 'var(--accent-dark)' : (isDarkMode ? '#555' : '#ccc')}`, background: isSelected ? 'var(--accent-main)' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                               {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            {m.name}
                          </button>
                        );
                     })}
                   </div>
                )}
              </div>

              {parseFloat(formAmount) > 0 && (
                <div style={{ marginTop: '8px', padding: '16px', borderRadius: '12px', background: isDarkMode ? '#2d4a28' : '#dcfce7', border: `1px solid ${isDarkMode ? '#163300' : '#bbf7d0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: isDarkMode ? '#86efac' : '#166534', fontWeight: 600 }}>{lang === 'th' ? 'ยอดที่ต้องจ่ายจริง (รวมค่าธรรมเนียม)' : 'Total charge'}</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: isDarkMode ? '#86efac' : '#166534', fontFamily: 'Inter' }}>
                      {(parseFloat(formAmount) + getCardFee(parseFloat(formAmount), formCardId, formCurrency)).toFixed(2)} {formCurrency}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: isDarkMode ? '#4ade80' : '#15803d' }}>
                    ≈ {((parseFloat(formAmount) + getCardFee(parseFloat(formAmount), formCardId, formCurrency)) * getTargetRateValue(mainCurrency, formCurrency)).toFixed(2)} {mainCurrency}
                  </div>
                </div>
              )}

              <button onClick={handleSave} className="action-btn" style={{ width: '100%', marginTop: '16px' }}>
                {lang === 'th' ? 'บันทึกรายการนี้' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Selection Modal for Add Record */}
      {showCurrencyModal && (
        <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={() => setShowCurrencyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setShowCurrencyModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>{lang === 'th' ? 'เลือกสกุลเงิน' : 'Select Currency'}</h2>
            </div>
            <input type="text" className="search-input" placeholder={lang === 'th' ? 'ค้นหาสกุลเงิน...' : 'Search currency...'} value={currencySearch} onChange={e => setCurrencySearch(e.target.value)} autoFocus />
            <div className="currency-list">
              {Object.keys(CURRENCY_DATA)
                .filter(c => c.toLowerCase().includes(currencySearch.toLowerCase()) || (CURRENCY_DATA[c] && CURRENCY_DATA[c].name.toLowerCase().includes(currencySearch.toLowerCase())))
                .map(c => {
                  const flagData = CURRENCY_DATA[c];
                  return (
                    <div key={c} className="currency-list-item" onClick={() => { setFormCurrency(c); setShowCurrencyModal(false); setCurrencySearch(''); }} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {flagData?.icon ? <img src={flagData.icon} alt={c} className="flag-icon" /> : <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={c} className="flag-icon" />}
                        <div><div className="currency-code">{c}</div><div style={{fontSize: '12px', color:'var(--text-muted)'}}>{flagData?.name}</div></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BillSplitTab;

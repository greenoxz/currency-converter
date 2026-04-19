import React from 'react';

// Local Image Assets
import visaImg from '../assets/icons/card/visa.png';
import mastercardImg from '../assets/icons/card/mastercard.png';
import unionpayImg from '../assets/icons/card/unionpay.png';
import thaiqrImg from '../assets/icons/card/thaiqr.png';
import alipayImg from '../assets/icons/card/alipay.svg';
import jcbImg from '../assets/icons/card/jcb.png';
import wechatImg from '../assets/icons/card/wechat.png';

// ---- Card type definition ----
export type CardType =
  | 'visa'
  | 'mastercard'
  | 'jcb'
  | 'alipay'
  | 'wechat'
  | 'unionpay'
  | 'promptpay'
  | 'cash';

// Metadata for each card type
export const CARD_TYPES: { type: CardType; label: string; color: string; bg: string }[] = [
  { type: 'visa',       label: 'Visa',        color: '#1A1F71', bg: '#EEF0FF' },
  { type: 'mastercard', label: 'Mastercard',  color: '#EB001B', bg: '#FFF0F0' },
  { type: 'jcb',        label: 'JCB',         color: '#0E4C96', bg: '#EEF4FF' },
  { type: 'alipay',     label: 'Alipay',      color: '#00A3E0', bg: '#EEF9FF' },
  { type: 'wechat',     label: 'WeChat Pay',  color: '#07C160', bg: '#EDFBF3' },
  { type: 'unionpay',   label: 'UnionPay',    color: '#E21F24', bg: '#FFF0F0' },
  { type: 'promptpay',  label: 'PromptPay',   color: '#036DA8', bg: '#EEF5FF' },
];

// ---- Individual icon components ----
interface CardIconProps {
  size?: number;
}

// Helper: render a rounded card badge with an image inside
const ImageBadge: React.FC<{
  src: string;
  size: number;
  label?: string;
  padding?: string;
  bg?: string;
}> = ({ src, size, label, padding = '0', bg = '#ffffff' }) => (
  <span
    title={label}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size * 0.65,
      borderRadius: size * 0.12,
      background: bg,
      border: `1px solid rgba(0,0,0,0.1)`,
      flexShrink: 0,
      overflow: 'hidden',
      padding: padding
    }}
  >
    <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  </span>
);

// Cash — generic green badge
const CashBadge: React.FC<CardIconProps> = ({ size = 48 }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size * 0.65,
      borderRadius: size * 0.12,
      background: '#EDFBF3',
      border: '1px solid #07C16040',
      fontSize: size * 0.4,
      flexShrink: 0,
    }}
  >
    💵
  </span>
);

// ---- Main CardIcon component ----
export const CardIcon: React.FC<{ type: CardType; size?: number }> = ({ type, size = 48 }) => {
  switch (type) {
    case 'visa':       return <ImageBadge src={visaImg} size={size} label="Visa" />;
    case 'mastercard': return <ImageBadge src={mastercardImg} size={size} label="Mastercard" />;
    case 'unionpay':   return <ImageBadge src={unionpayImg} size={size} label="UnionPay" />;
    case 'promptpay':  return <ImageBadge src={thaiqrImg} size={size} label="PromptPay" padding="2px" />;
    case 'alipay':     return <ImageBadge src={alipayImg} size={size} label="Alipay" padding="2px" />;
    case 'wechat':     return <ImageBadge src={wechatImg} size={size} label="WeChat Pay" padding="2px" />;
    case 'jcb':        return <ImageBadge src={jcbImg} size={size} label="JCB" />;
    
    case 'cash':       return <CashBadge size={size} />;
    default:           return <CashBadge size={size} />;
  }
};

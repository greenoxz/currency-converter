import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TRANSLATIONS = {
  th: {
    appTitle: 'แลกเงิน',
    trackerTitle: 'ประวัติรายการ',
    marketRate: 'ที่อัตราแลกเปลี่ยนกลางของตลาด',
    offlineApp: 'แอปกำลังออฟไลน์ (อิงเรทตั้งแต่วันที่ {0})',
    offlineSimple: 'ใช้งานออฟไลน์ (ข้อมูลไม่อัปเดต)',
    saveLogBtn: 'บันทึกรายการ',
    tabChart: 'เรท',
    time_1h: 'H',
    time_1d: 'D',
    time_7d: 'W',
    time_1m: 'M',
    time_6m: '6M',
    time_1y: '1Y',
    time_5y: '5Y',
    decimalPlaces: 'จำนวนทศนิยม',
    compareOthers: 'เทียบค่าเงินอื่นๆ เพิ่มเติม',
    addFav: '+ เพิ่มค่าเงิน',
    noFavs: 'ยังไม่มีค่าเงินที่บันทึกไว้',
    alertSet: 'ตั้งเตือนราคา',
    alertTargetLow: 'เตือนเมื่อ 1 {0} ต่ำกว่า:',
    alertRemove: 'ยกเลิกการแจ้งเตือน',
    noHistory: 'ยังไม่มีประวัติการบันทึก',
    noHistorySub: '(กดปุ่ม "บันทึกรายการ" ที่หน้าหลักเพื่อเพิ่มรายการ)',
    edit: 'แก้ไข',
    spent: 'ใช้เงิน:',
    convertedTo: 'แลกเปลี่ยนเป็น:',
    rateAtSave: 'เรทตอนบันทึก:',
    rateToday: 'เรทวันนี้:',
    moreExpensive: 'แพงขึ้น',
    cheaper: 'ถูกลง',
    profitVal: '(กำไร/ประหยัดไป',
    lossVal: '(ขาดทุน',
    modalSaveNew: 'บันทึกรายจ่าย/แลกเงิน',
    modalSaveEdit: 'แก้ไขรายการ',
    txNameLabel: 'ชื่อรายการ (เช่น ซื้อกระเป๋า, จ่ายค่าพาสต้า)',
    txNamePlaceholder: 'ซื้อของฝาก...',
    calcFromApp: 'คำนวณจากแอป:',
    calcEstValue: 'มีมูลค่าประมาณ',
    actualRateLabel: 'เรทจริงที่ใช้',
    swapRate: 'สลับเรท',
    saveBtn: 'บันทึกรายการ',
    deleteBtn: 'ลบรายการนี้ทิ้ง',
    addCurrencyTitle: 'เพิ่มค่าเงิน',
    selectCurrencyTitle: 'เลือกสกุลเงิน',
    searchPlaceholder: 'ค้นหา...',
    modalChartTitle: 'ประวัติ',
    tabHome: 'แลกเงิน',
    tabTracker: 'ประวัติ',
    invalidInput: 'กรุณากรอกชื่อรายการและเรทให้ถูกต้อง',
    chartRateLabel: 'อัตราแลกเปลี่ยน',
    tableDate: 'วันที่',
    tableRate: 'เรท',
    tabSettings: 'ตั้งค่า',
    mainCurrencyLabel: 'สกุลเงินหลักของคุณ',
    ratesTableTitle: 'อัตราแลกเปลี่ยนวันนี้ (เทียบ {0})',
    allCurrencies: 'ทุกสกุลเงิน',
    clearAllData: 'ล้างข้อมูลทั้งหมด',
    confirmClear: 'คุณแน่ใจหรือไม่ว่าต้องการลบประวัติรายการทั้งหมด?',
    copySuccess: 'คัดลอกแล้ว!',
    autoMode: 'อัตโนมัติ',
    darkMode: 'โหมดมืด',
    lightMode: 'โหมดสว่าง',
    howToInstall: 'วิธีติดตั้งแอปบนมือถือ',
    installGuideTitle: 'คู่มือการติดตั้ง (PWA)',
    iosInstall: 'วิธีติดตั้งสำหรับ iPhone (iOS)',
    androidInstall: 'วิธีติดตั้งสำหรับ Android',
    iosSteps: [
      '1. เปิดแอปด้วยบราวเซอร์ Safari',
      '2. กดปุ่ม "แชร์" (รูปสี่เหลี่ยมมีลูกศรขึ้น)',
      '3. เลือกเมนู "เพิ่มไปยังหน้าจอโฮม"',
      '4. กด "เพิ่ม" เพื่อเสร็จสิ้น'
    ],
    androidSteps: [
      '1. เปิดแอปด้วยบราวเซอร์ Chrome',
      '2. กดปุ่ม "สามจุด" (จุดไข่ปลา) มุมบนขวา',
      '3. เลือกเมนู "ติดตั้งแอป" หรือ "เพิ่มไปยังหน้าจอหลัก"',
      '4. กดยืนยันการติดตั้ง'
    ],
    fiatCurrencies: 'สกุลเงินทั่วไป (Fiat)',
    cryptoCurrencies: 'สกุลเงินคริปโต (Real-time Crypto)',
    pinnedRates: 'รายการโปรด',
    rateStatusCheap: 'ราคาถูก (น่าแลก)',
    rateStatusExpensive: 'ราคาแพง (รอก่อน)',
    rateStatusNormal: 'ราคาปกติ',
    catFood: '🍱 มื้ออาหาร',
    catShopping: '🛍️ ช้อปปิ้ง',
    catHotel: '🏨 ที่พัก',
    catTransport: '🚕 เดินทาง',
    catCafe: '☕ คาเฟ่',
    catExchange: '💱 แลกเงิน',
    catOther: '✨ อื่นๆ'
  },
  en: {
    appTitle: 'Exchange',
    trackerTitle: 'History',
    marketRate: 'at mid-market exchange rate',
    offlineApp: 'App offline (Rates from {0})',
    offlineSimple: 'Offline mode (Data not updated)',
    saveLogBtn: 'Save Record',
    tabChart: 'Rates',
    time_1h: 'H',
    time_1d: 'D',
    time_7d: 'W',
    time_1m: 'M',
    time_6m: '6M',
    time_1y: '1Y',
    time_5y: '5Y',
    decimalPlaces: 'Decimal Places',
    compareOthers: 'Compare Other Currencies',
    addFav: '+ Add Currency',
    noFavs: 'No favorites added yet',
    alertSet: 'Set Price Alert',
    alertTargetLow: 'Alert when 1 {0} is below:',
    alertRemove: 'Remove Alert',
    noHistory: 'No records found',
    noHistorySub: '(Click "Save Record" on the Home tab to add manually)',
    edit: 'Edit',
    spent: 'Spent:',
    convertedTo: 'Converted to:',
    rateAtSave: 'Saved rate:',
    rateToday: 'Current rate:',
    moreExpensive: 'More expensive',
    cheaper: 'Cheaper',
    profitVal: '(Saved / Profit',
    lossVal: '(Loss of',
    modalSaveNew: 'Save Transaction',
    modalSaveEdit: 'Edit Record',
    txNameLabel: 'Item Name',
    txNamePlaceholder: 'Souvenirs...',
    calcFromApp: 'App calc:',
    calcEstValue: 'estimated value',
    actualRateLabel: 'Actual rate used',
    swapRate: 'Swap',
    saveBtn: 'Save Record',
    deleteBtn: 'Delete Record',
    addCurrencyTitle: 'Add Currency',
    selectCurrencyTitle: 'Select Currency',
    searchPlaceholder: 'Search...',
    modalChartTitle: 'History',
    tabHome: 'Convert',
    tabTracker: 'History',
    invalidInput: 'Please enter a valid item name and rate.',
    chartRateLabel: 'Exchange Rate',
    tableDate: 'Date',
    tableRate: 'Rate',
    tabSettings: 'Settings',
    mainCurrencyLabel: 'Your Main Currency',
    ratesTableTitle: 'Rate Table (vs {0})',
    allCurrencies: 'All Currencies',
    clearAllData: 'Clear All History',
    confirmClear: 'Are you sure you want to delete all transaction history?',
    copySuccess: 'Copied!',
    autoMode: 'Auto',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    howToInstall: 'How to Install App',
    installGuideTitle: 'Installation Guide (PWA)',
    iosInstall: 'Install for iPhone (iOS)',
    androidInstall: 'Install for Android',
    iosSteps: [
      '1. Open this app in Safari browser',
      '2. Tap the "Share" button (Square with up arrow)',
      '3. Select "Add to Home Screen"',
      '4. Tap "Add" to finish'
    ],
    androidSteps: [
      '1. Open this app in Chrome browser',
      '2. Tap the "Three-dot" menu at top-right',
      '3. Select "Install app" or "Add to Home Screen"',
      '4. Confirm the installation'
    ],
    fiatCurrencies: 'Fiat Currencies',
    cryptoCurrencies: 'Real-time Crypto',
    pinnedRates: 'Favorites',
    rateStatusCheap: 'Cheap (Good Rate)',
    rateStatusExpensive: 'Expensive (High)',
    rateStatusNormal: 'Normal',
    catFood: '🍱 Food',
    catShopping: '🛍️ Shopping',
    catHotel: '🏨 Hotel',
    catTransport: '🚕 Travel',
    catCafe: '☕ Cafe',
    catExchange: '💱 Exchange',
    catOther: '✨ Other'
  },
  zh: {
    appTitle: '汇率换算',
    trackerTitle: '交易记录',
    marketRate: '按中间市场汇率',
    offlineApp: '离线模式（汇率更新于 {0}）',
    offlineSimple: '离线模式（数据未更新）',
    saveLogBtn: '保存记录',
    tabChart: '汇率',
    time_1h: 'H',
    time_1d: 'D',
    time_7d: 'W',
    time_1m: 'M',
    time_6m: '6M',
    time_1y: '1Y',
    time_5y: '5Y',
    decimalPlaces: '小数位数',
    compareOthers: '比较其他货币',
    addFav: '+ 添加货币',
    noFavs: '您还没有收藏的货币',
    alertSet: '设置价格提醒',
    alertTargetLow: '当 1 {0} 低于：',
    alertRemove: '删除提醒',
    noHistory: '没有保存的记录',
    noHistorySub: '（在主页点击“保存记录”来添加项目）',
    edit: '编辑',
    spent: '花费：',
    convertedTo: '兑换为：',
    rateAtSave: '保存汇率：',
    rateToday: '今日汇率：',
    moreExpensive: '变贵了',
    cheaper: '变便宜了',
    profitVal: '（节省了',
    lossVal: '（亏损',
    modalSaveNew: '保存交易',
    modalSaveEdit: '编辑记录',
    txNameLabel: '项目名称',
    txNamePlaceholder: '纪念品...',
    calcFromApp: 'App计算：',
    calcEstValue: '估值约',
    actualRateLabel: '实际使用的汇率',
    swapRate: '切换',
    saveBtn: '保存',
    deleteBtn: '删除此记录',
    addCurrencyTitle: '添加货币',
    selectCurrencyTitle: '选择货币',
    searchPlaceholder: '搜索...',
    modalChartTitle: '图表',
    tabHome: '汇率',
    tabTracker: '记录',
    invalidInput: '请输入有效的项目名称和汇率。',
    chartRateLabel: '汇率',
    tableDate: '日期',
    tableRate: '汇率',
    tabSettings: '设置',
    mainCurrencyLabel: '您的主货币',
    ratesTableTitle: '今日汇率 (对比 {0})',
    allCurrencies: '所有货币',
    clearAllData: '清除所有历史记录',
    confirmClear: '您确定要删除所有交易历史记录吗？',
    copySuccess: '已复制！',
    autoMode: '自动',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    howToInstall: '如何安装应用',
    installGuideTitle: '安装指南 (PWA)',
    iosInstall: 'iPhone (iOS) 安装说明',
    androidInstall: 'Android 安装说明',
    iosSteps: [
      '1. 在 Safari 浏览器中打开此应用',
      '2. 点击“共享”按钮（带有向上箭头的方框）',
      '3. 选择“添加到主屏幕”',
      '4. 点击“添加”完成安装'
    ],
    androidSteps: [
      '1. 在 Chrome 浏览器中打开此应用',
      '2. 点击右上角的“三点”菜单',
      '3. 选择“安装应用”或“添加到主屏幕”',
      '4. 确认安装'
    ],
    fiatCurrencies: '法定货币 (Fiat)',
    cryptoCurrencies: '加密货币 (Real-time Crypto)',
    pinnedRates: '收藏夹',
    rateStatusCheap: '汇率划算 (建议)',
    rateStatusExpensive: '汇率偏高 (建议等待)',
    rateStatusNormal: '汇率正常',
    catFood: '🍱 餐食',
    catShopping: '🛍️ 购物',
    catHotel: '🏨 住宿',
    catTransport: '🚕 交通',
    catCafe: '☕ 咖啡',
    catExchange: '💱 兑换',
    catOther: '✨ 其他'
  }
};

const CURRENCY_DATA = {
  USD: { name: 'US Dollar', flag: 'us' },
  THB: { name: 'Thai Baht', flag: 'th' },
  EUR: { name: 'Euro', flag: 'eu' },
  JPY: { name: 'Japanese Yen', flag: 'jp' },
  GBP: { name: 'British Pound', flag: 'gb' },
  AUD: { name: 'Australian Dollar', flag: 'au' },
  CAD: { name: 'Canadian Dollar', flag: 'ca' },
  CHF: { name: 'Swiss Franc', flag: 'ch' },
  CNY: { name: 'Chinese Renminbi', flag: 'cn' },
  SGD: { name: 'Singapore Dollar', flag: 'sg' },
  HKD: { name: 'Hong Kong Dollar', flag: 'hk' },
  KRW: { name: 'South Korean Won', flag: 'kr' },
  TWD: { name: 'New Taiwan Dollar', flag: 'tw' },
  MYR: { name: 'Malaysian Ringgit', flag: 'my' },
  VND: { name: 'Vietnamese Dong', flag: 'vn' },
  IDR: { name: 'Indonesian Rupiah', flag: 'id' },
  PHP: { name: 'Philippine Peso', flag: 'ph' },
  INR: { name: 'Indian Rupee', flag: 'in' },
  AED: { name: 'UAE Dirham', flag: 'ae' },
  NZD: { name: 'New Zealand Dollar', flag: 'nz' },
  AFN: { name: 'Afghan Afghani', flag: 'af' },
  ALL: { name: 'Albanian Lek', flag: 'al' },
  AMD: { name: 'Armenian Dram', flag: 'am' },
  ANG: { name: 'Neth. Antillean Guilder', flag: 'an' },
  AOA: { name: 'Angolan Kwanza', flag: 'ao' },
  ARS: { name: 'Argentine Peso', flag: 'ar' },
  AWG: { name: 'Aruban Florin', flag: 'aw' },
  AZN: { name: 'Azerbaijani Manat', flag: 'az' },
  BAM: { name: 'Bosnia-Herzegovina Mark', flag: 'ba' },
  BBD: { name: 'Barbadian Dollar', flag: 'bb' },
  BDT: { name: 'Bangladeshi Taka', flag: 'bd' },
  BGN: { name: 'Bulgarian Lev', flag: 'bg' },
  BHD: { name: 'Bahraini Dinar', flag: 'bh' },
  BIF: { name: 'Burundian Franc', flag: 'bi' },
  BMD: { name: 'Bermudian Dollar', flag: 'bm' },
  BND: { name: 'Brunei Dollar', flag: 'bn' },
  BOB: { name: 'Bolivian Boliviano', flag: 'bo' },
  BRL: { name: 'Brazilian Real', flag: 'br' },
  BSD: { name: 'Bahamian Dollar', flag: 'bs' },
  BTN: { name: 'Bhutanese Ngultrum', flag: 'bt' },
  BWP: { name: 'Botswanan Pula', flag: 'bw' },
  BYN: { name: 'Belarusian Ruble', flag: 'by' },
  BZD: { name: 'Belize Dollar', flag: 'bz' },
  CDF: { name: 'Congolese Franc', flag: 'cd' },
  CLP: { name: 'Chilean Peso', flag: 'cl' },
  COP: { name: 'Colombian Peso', flag: 'co' },
  CRC: { name: 'Costa Rican Colón', flag: 'cr' },
  CUP: { name: 'Cuban Peso', flag: 'cu' },
  CVE: { name: 'Cape Verdean Escudo', flag: 'cv' },
  CZK: { name: 'Czech Koruna', flag: 'cz' },
  DJF: { name: 'Djiboutian Franc', flag: 'dj' },
  DKK: { name: 'Danish Krone', flag: 'dk' },
  DOP: { name: 'Dominican Peso', flag: 'do' },
  DZD: { name: 'Algerian Dinar', flag: 'dz' },
  EGP: { name: 'Egyptian Pound', flag: 'eg' },
  ERN: { name: 'Eritrean Nakfa', flag: 'er' },
  ETB: { name: 'Ethiopian Birr', flag: 'et' },
  FJD: { name: 'Fijian Dollar', flag: 'fj' },
  FKP: { name: 'Falkland Islands Pound', flag: 'fk' },
  FOK: { name: 'Faroese Króna', flag: 'fo' },
  GEL: { name: 'Georgian Lari', flag: 'ge' },
  GGP: { name: 'Guernsey Pound', flag: 'gg' },
  GHS: { name: 'Ghanaian Cedi', flag: 'gh' },
  GIP: { name: 'Gibraltar Pound', flag: 'gi' },
  GMD: { name: 'Gambian Dalasi', flag: 'gm' },
  GNF: { name: 'Guinean Franc', flag: 'gn' },
  GTQ: { name: 'Guatemalan Quetzal', flag: 'gt' },
  GYD: { name: 'Guyanese Dollar', flag: 'gy' },
  HNL: { name: 'Honduran Lempira', flag: 'hn' },
  HRK: { name: 'Croatian Kuna', flag: 'hr' },
  HTG: { name: 'Haitian Gourde', flag: 'ht' },
  HUF: { name: 'Hungarian Forint', flag: 'hu' },
  ILS: { name: 'Israeli New Shekel', flag: 'il' },
  IMP: { name: 'Isle of Man Pound', flag: 'im' },
  IQD: { name: 'Iraqi Dinar', flag: 'iq' },
  IRR: { name: 'Iranian Rial', flag: 'ir' },
  ISK: { name: 'Icelandic Króna', flag: 'is' },
  JEP: { name: 'Jersey Pound', flag: 'je' },
  JMD: { name: 'Jamaican Dollar', flag: 'jm' },
  JOD: { name: 'Jordanian Dinar', flag: 'jo' },
  KES: { name: 'Kenyan Shilling', flag: 'ke' },
  KGS: { name: 'Kyrgystani Som', flag: 'kg' },
  KHR: { name: 'Cambodian Riel', flag: 'kh' },
  KID: { name: 'Kiribati Dollar', flag: 'ki' },
  KMF: { name: 'Comorian Franc', flag: 'km' },
  KWD: { name: 'Kuwaiti Dinar', flag: 'kw' },
  KYD: { name: 'Cayman Islands Dollar', flag: 'ky' },
  KZT: { name: 'Kazakhstani Tenge', flag: 'kz' },
  LAK: { name: 'Laotian Kip', flag: 'la' },
  LBP: { name: 'Lebanese Pound', flag: 'lb' },
  LKR: { name: 'Sri Lankan Rupee', flag: 'lk' },
  LRD: { name: 'Liberian Dollar', flag: 'lr' },
  LSL: { name: 'Lesotho Loti', flag: 'ls' },

  LYD: { name: 'Libyan Dinar', flag: 'ly' },
  MAD: { name: 'Moroccan Dirham', flag: 'ma' },
  MDL: { name: 'Moldovan Leu', flag: 'md' },
  MGA: { name: 'Malagasy Ariary', flag: 'mg' },
  MKD: { name: 'Macedonian Denar', flag: 'mk' },
  MMK: { name: 'Myanmar Kyat', flag: 'mm' },
  MNT: { name: 'Mongolian Tögrög', flag: 'mn' },
  MOP: { name: 'Macanese Pataca', flag: 'mo' },
  MRU: { name: 'Mauritanian Ouguiya', flag: 'mr' },
  MUR: { name: 'Mauritian Rupee', flag: 'mu' },
  MVR: { name: 'Maldivian Rufiyaa', flag: 'mv' },
  MWK: { name: 'Malawian Kwacha', flag: 'mw' },
  MXN: { name: 'Mexican Peso', flag: 'mx' },
  MZN: { name: 'Mozambican Metical', flag: 'mz' },
  NAD: { name: 'Namibian Dollar', flag: 'na' },
  NGN: { name: 'Nigerian Naira', flag: 'ng' },
  NIO: { name: 'Nicaraguan Córdoba', flag: 'ni' },
  NOK: { name: 'Norwegian Krone', flag: 'no' },
  NPR: { name: 'Nepalese Rupee', flag: 'np' },
  OMR: { name: 'Omani Rial', flag: 'om' },
  PAB: { name: 'Panamanian Balboa', flag: 'pa' },
  PEN: { name: 'Peruvian Sol', flag: 'pe' },
  PGK: { name: 'Papua New Guinean Kina', flag: 'pg' },
  PKR: { name: 'Pakistani Rupee', flag: 'pk' },
  PLN: { name: 'Polish Złoty', flag: 'pl' },
  PYG: { name: 'Paraguayan Guarani', flag: 'py' },
  QAR: { name: 'Qatari Riyal', flag: 'qa' },
  RON: { name: 'Romanian Leu', flag: 'ro' },
  RSD: { name: 'Serbian Dinar', flag: 'rs' },
  RUB: { name: 'Russian Ruble', flag: 'ru' },
  RWF: { name: 'Rwandan Franc', flag: 'rw' },
  SAR: { name: 'Saudi Riyal', flag: 'sa' },
  SBD: { name: 'Solomon Islands Dollar', flag: 'sb' },
  SCR: { name: 'Seychellois Rupee', flag: 'sc' },
  SDG: { name: 'Sudanese Pound', flag: 'sd' },
  SEK: { name: 'Swedish Krone', flag: 'se' },
  SHP: { name: 'St. Helena Pound', flag: 'sh' },
  SLE: { name: 'Sierra Leonean Leone', flag: 'sl' },
  SLL: { name: 'Sierra Leonean Leone', flag: 'sl' },
  SOS: { name: 'Somali Shilling', flag: 'so' },
  SRD: { name: 'Surinamese Dollar', flag: 'sr' },
  SSP: { name: 'South Sudanese Pound', flag: 'ss' },
  STN: { name: 'São Tomé Dobra', flag: 'st' },
  SYP: { name: 'Syrian Pound', flag: 'sy' },
  SZL: { name: 'Swazi Lilangeni', flag: 'sz' },
  TJS: { name: 'Tajikistani Somoni', flag: 'tj' },
  TMT: { name: 'Turkmenistani Manat', flag: 'tm' },
  TND: { name: 'Tunisian Dinar', flag: 'tn' },
  TOP: { name: 'Tongan Paʻanga', flag: 'to' },
  TRY: { name: 'Turkish Lira', flag: 'tr' },
  TTD: { name: 'Trinidad Dollar', flag: 'tt' },
  TVD: { name: 'Tuvaluan Dollar', flag: 'tv' },
  TZS: { name: 'Tanzanian Shilling', flag: 'tz' },
  UAH: { name: 'Ukrainian Hryvnia', flag: 'ua' },
  UGX: { name: 'Ugandan Shilling', flag: 'ug' },
  UYU: { name: 'Uruguayan Peso', flag: 'uy' },
  UZS: { name: 'Uzbekistani Som', flag: 'uz' },
  VES: { name: 'Venezuelan Bolívar', flag: 've' },
  VUV: { name: 'Vanuatu Vatu', flag: 'vu' },
  WST: { name: 'Samoan Tala', flag: 'ws' },
  XAF: { name: 'CFA Franc BEAC', flag: 'cf' },
  XCD: { name: 'East Caribbean Dollar', flag: 'dm' },
  XOF: { name: 'CFA Franc BCEAO', flag: 'sn' },
  XPF: { name: 'CFP Franc', flag: 'pf' },
  YER: { name: 'Yemeni Rial', flag: 'ye' },
  ZAR: { name: 'South African Rand', flag: 'za' },
  ZMW: { name: 'Zambian Kwacha', flag: 'zm' },
  ZWL: { name: 'Zimbabwean Dollar', flag: 'zw' },
  BTC: { name: 'Bitcoin', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png' },
  ETH: { name: 'Ethereum', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png' },
  SOL: { name: 'Solana', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png' },
  BNB: { name: 'BNB', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png' },
  XRP: { name: 'XRP', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png' },
  ADA: { name: 'Cardano', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png' },
  DOGE: { name: 'Dogecoin', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png' },
  DOT: { name: 'Polkadot', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/dot.png' },
  MATIC: { name: 'Polygon', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png' },
  LINK: { name: 'Chainlink', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png' },
  UNI: { name: 'Uniswap', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/uni.png' },
  LTC: { name: 'Litecoin', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ltc.png' },
  SHIB: { name: 'Shiba Inu', isCrypto: true, icon: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png' },
  AVAX: { name: 'Avalanche', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/avax.png' },
  TRX: { name: 'TRON', isCrypto: true, icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/trx.png' },
  FIGR_HELOC: { name: 'Figure HELOC', isCrypto: true, icon: 'https://coin-images.coingecko.com/coins/images/68480/large/figure.png' }
};

function generateMockHistory(currentRate, lang, timeframe = '1m') {
  const data = [];
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

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'th');
  const t = TRANSLATIONS[lang] || TRANSLATIONS['th'];

  const [activeTab, setActiveTab] = useState('home');

  // --- Home Tab States ---
  const [fromCurrency, setFromCurrency] = useState(() => localStorage.getItem('fromCurrency') || 'USD');
  const [toCurrency, setToCurrency] = useState(() => localStorage.getItem('toCurrency') || 'THB');
  const [chartFrom, setChartFrom] = useState(() => localStorage.getItem('fromCurrency') || 'USD');
  const [chartTo, setChartTo] = useState(() => localStorage.getItem('toCurrency') || 'THB');
  const [amount, setAmount] = useState(() => localStorage.getItem('amount') || '1');
  
  const [rates, setRates] = useState(() => {
    const savedRates = localStorage.getItem('exchangeRates');
    return savedRates ? JSON.parse(savedRates) : null;
  }); 

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites_light');
    return savedFavs ? JSON.parse(savedFavs) : ['USD', 'JPY', 'KRW'];
  });
  
  const [pinnedRates, setPinnedRates] = useState(() => {
    const saved = localStorage.getItem('pinnedRates');
    return saved ? JSON.parse(saved) : [];
  });

  const [contextMenuCurrency, setContextMenuCurrency] = useState(null);
  
  const [mainCurrency, setMainCurrency] = useState(() => localStorage.getItem('mainCurrency') || 'THB');
  const [decimalPlaces, setDecimalPlaces] = useState(() => {
    const saved = localStorage.getItem('decimalPlaces');
    if (!saved) return 'auto';
    return saved === 'auto' ? 'auto' : (parseInt(saved) || 2);
  });
  
  // --- Tracker States ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('tx_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [clearConfirmState, setClearConfirmState] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txCustomRate, setTxCustomRate] = useState('');
  const [modalRateInverted, setModalRateInverted] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [priceAlerts, setPriceAlerts] = useState(() => {
    const saved = localStorage.getItem('priceAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAlertInput, setShowAlertInput] = useState(null); // code of currency being alerted
  const [alertTarget, setAlertTarget] = useState('');

  const [loading, setLoading] = useState(!rates);
  const [lastUpdated, setLastUpdated] = useState(() => localStorage.getItem('lastUpdated') || null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [detailChartCurrency, setDetailChartCurrency] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartTimeframe, setChartTimeframe] = useState('1m');
  const [chartData, setChartData] = useState([]);
  const [isCryptoCollapsed, setIsCryptoCollapsed] = useState(() => localStorage.getItem('isCryptoCollapsed') === 'true');
  const [isFiatCollapsed, setIsFiatCollapsed] = useState(() => localStorage.getItem('isFiatCollapsed') === 'true');
  const [visibleFiat, setVisibleFiat] = useState(() => {
    const saved = localStorage.getItem('visibleFiat');
    return saved ? JSON.parse(saved) : ['USD', 'EUR', 'JPY', 'GBP', 'CNY'];
  });
  const [visibleCrypto, setVisibleCrypto] = useState(() => {
    const saved = localStorage.getItem('visibleCrypto');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH', 'SOL'];
  });



  useEffect(() => {
    if (activeTab === 'chart' && rates) {
      setChartData(generateMockHistory(getTargetRateValue(chartTo, chartFrom), lang, chartTimeframe));
    }
  }, [activeTab, chartFrom, chartTo, lang, chartTimeframe, rates]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'auto');
  const [copyToast, setCopyToast] = useState(false);
  
  const chartStats = useMemo(() => {
    if (!chartData || chartData.length < 2) return null;
    const first = chartData[0].rate;
    const last = chartData[chartData.length - 1].rate;
    const diff = last - first;
    const percent = (diff / first) * 100;
    return { diff, percent, isPlus: diff >= 0 };
  }, [chartData]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const themeColor = document.querySelector('meta[name="theme-color"]');
      
      if (isDark) {
        document.body.classList.add('dark-mode');
        if (themeColor) themeColor.setAttribute('content', '#121212');
      } else {
        document.body.classList.remove('dark-mode');
        if (themeColor) themeColor.setAttribute('content', '#ffffff');
      }
    };

    applyTheme();

    if (theme === 'auto') {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      matcher.addEventListener('change', applyTheme);
      return () => matcher.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  // Derived variable for components that need to know the actual mode
  const isDarkMode = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    });
  };

  const clearAllHistory = () => {
    if (!clearConfirmState) {
      setClearConfirmState(true);
      setTimeout(() => setClearConfirmState(false), 3000);
      return;
    }
    setTransactions([]);
    setPinnedRates([]);
    setFavorites(['USD', 'JPY', 'KRW']);
    localStorage.removeItem('tx_history');
    localStorage.removeItem('pinnedRates');
    localStorage.removeItem('favorites_light');
    setClearConfirmState(false);
  };


  const fetchRates = React.useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const apiKey = import.meta.env.VITE_ER_API_KEY;
      let finalRates = null;
      let dataSource = 'Global API';

      // 1. Try fetching from v6 authenticated API if Key is available
      if (apiKey && apiKey !== "เอา_API_KEY_จริงตรงนี้" && apiKey !== "") {
        try {
          const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
          if (res.ok) {
            const data = await res.json();
            if (data.result === 'success') {
              finalRates = data.conversion_rates;
              dataSource = 'ExchangeRate-API';
            }
          }
        } catch (e) {
          console.warn("v6 API Fetch failed, falling back to v4", e);
        }
      }

      // 2. Fallback to v4 free API if v6 failed or no key
      if (!finalRates) {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        finalRates = data.rates;
        dataSource = 'Global API';
      }

      // 3. Fetch Crypto Rates from CoinGecko
      try {
        const cryptoIds = 'bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,tron,figure-heloc';
        const cryptoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`);
        if (cryptoRes.ok && finalRates) {
          const cryptoData = await cryptoRes.json();
          // Convert to 1 USD = X Crypto format
          if (cryptoData.bitcoin) finalRates['BTC'] = 1 / cryptoData.bitcoin.usd;
          if (cryptoData.ethereum) finalRates['ETH'] = 1 / cryptoData.ethereum.usd;
          if (cryptoData.solana) finalRates['SOL'] = 1 / cryptoData.solana.usd;
          if (cryptoData.binancecoin) finalRates['BNB'] = 1 / cryptoData.binancecoin.usd;
          if (cryptoData.ripple) finalRates['XRP'] = 1 / cryptoData.ripple.usd;
          if (cryptoData.dogecoin) finalRates['DOGE'] = 1 / cryptoData.dogecoin.usd;
          if (cryptoData.tron) finalRates['TRX'] = 1 / cryptoData.tron.usd;
          if (cryptoData['figure-heloc']) finalRates['FIGR_HELOC'] = 1 / cryptoData['figure-heloc'].usd;
          dataSource += ' + CoinGecko';
        }
      } catch (e) {
        console.warn("Crypto Fetch failed", e);
      }

      if (finalRates) {
        setRates({...finalRates});
        
        const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');
        const now = new Date().toLocaleString(locale);
        const stampMsg = `${now} (${dataSource})`;
        
        setLastUpdated(stampMsg);
        localStorage.setItem('exchangeRates', JSON.stringify(finalRates));
        localStorage.setItem('lastUpdated', stampMsg);
        setIsOfflineMode(false);
      } else {
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error("Failed to fetch rates:", err);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [lang]);
  
  useEffect(() => {
    if (navigator.onLine === false) {
      setIsOfflineMode(true);
      setLoading(false);
    } else {
      fetchRates();
    }

    const handleOnline = () => { setIsOfflineMode(false); fetchRates(); };
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchRates]); 

  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
    localStorage.setItem('toCurrency', toCurrency);
    localStorage.setItem('amount', amount);
    localStorage.setItem('favorites_light', JSON.stringify(favorites));
    localStorage.setItem('mainCurrency', mainCurrency);
    localStorage.setItem('decimalPlaces', decimalPlaces.toString());
  }, [fromCurrency, toCurrency, amount, favorites, mainCurrency, decimalPlaces]);

  useEffect(() => {
    localStorage.setItem('tx_history', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pinnedRates', JSON.stringify(pinnedRates));
  }, [pinnedRates]);

  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('isCryptoCollapsed', isCryptoCollapsed);
    localStorage.setItem('isFiatCollapsed', isFiatCollapsed);
    localStorage.setItem('visibleFiat', JSON.stringify(visibleFiat));
    localStorage.setItem('visibleCrypto', JSON.stringify(visibleCrypto));
  }, [isCryptoCollapsed, isFiatCollapsed, visibleFiat, visibleCrypto]);

  // --- Core Calculation ---
  const getTargetRateValue = (code = toCurrency, base = fromCurrency) => {
    if (!rates) return 0;
    const oneBaseInUSD = 1 / rates[base];
    return oneBaseInUSD * rates[code];
  };

  const getConvertedAmount = (code = toCurrency) => {
    if (!rates || !amount) return '0.00';
    const rateValue = getTargetRateValue(code);
    const convertedAmount = parseFloat(amount) * rateValue;
    
    let minD = decimalPlaces;
    let maxD = decimalPlaces;

    if (decimalPlaces === 'auto') {
      const isCrypto = CURRENCY_DATA[code]?.isCrypto;
      if (['JPY', 'KRW', 'VND'].includes(code)) {
        minD = 0; maxD = 0;
      } else if (isCrypto) {
        minD = 2;
        maxD = convertedAmount < 0.0001 ? 8 : (convertedAmount < 1 ? 6 : 4);
      } else {
        minD = 2;
        maxD = convertedAmount < 0.01 ? 4 : 2;
      }
    }
    
    return convertedAmount.toLocaleString('en-US', { 
      minimumFractionDigits: minD, 
      maximumFractionDigits: maxD 
    });
  };

  const exchangeRateText = (() => {
    const rate = getTargetRateValue(toCurrency);
    if(rate === 0) return '';
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  })();

  const detailChartData = useMemo(() => {
    if (!detailChartCurrency || !rates) return [];
    return generateMockHistory(getTargetRateValue(mainCurrency, detailChartCurrency), lang, chartTimeframe);
  }, [detailChartCurrency, mainCurrency, lang, chartTimeframe, rates]);

  const detailChartStats = useMemo(() => {
    if (!detailChartData || detailChartData.length < 2) return null;
    const first = detailChartData[0].rate;
    const last = detailChartData[detailChartData.length - 1].rate;
    const diff = last - first;
    const percent = (diff / first) * 100;
    return { diff, percent, isPlus: diff >= 0 };
  }, [detailChartData]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleTableClick = (code) => {
    setDetailChartCurrency(code);
    setChartTimeframe('1m');
  };

  const handleChartSwap = () => {
    const oldFrom = chartFrom;
    setChartFrom(chartTo);
    setChartTo(oldFrom);
  };

  const handleSelectCurrency = (code) => {
    if (activeTab === 'chart' && (activeDropdown === 'from' || activeDropdown === 'to')) {
      if (activeDropdown === 'from') setChartFrom(code);
      else if (activeDropdown === 'to') setChartTo(code);
      setActiveDropdown(null);
      return;
    }

    if (activeDropdown === 'from') {
      setFromCurrency(code);
      setActiveDropdown(null);
    }
    else if (activeDropdown === 'to') {
      setToCurrency(code);
      setActiveDropdown(null);
    }
    else if (activeDropdown === 'main') {
      setMainCurrency(code);
      setActiveDropdown(null);
    }
    else if (activeDropdown === 'fiatTable') {
      if (visibleFiat.includes(code) || pinnedRates.includes(code)) {
        setVisibleFiat(prev => prev.filter(c => c !== code));
        setPinnedRates(prev => prev.filter(c => c !== code));
      } else {
        setVisibleFiat(prev => [...prev, code]);
      }
    }
    else if (activeDropdown === 'cryptoTable') {
      if (visibleCrypto.includes(code) || pinnedRates.includes(code)) {
        setVisibleCrypto(prev => prev.filter(c => c !== code));
        setPinnedRates(prev => prev.filter(c => c !== code));
      } else {
        setVisibleCrypto(prev => [...prev, code]);
      }
    }
    else if (activeDropdown === 'favorite') {
      if (!favorites.includes(code)) setFavorites(prev => [...prev, code]);
      setActiveDropdown(null);
    }
  };

  // --- Tracker Handlers ---
  const openSaveDialog = (txId = null) => {
    // Debug alert
    // window.alert("Opening Save Dialog for: " + (txId || "new"));
    
    if (txId) {
      const tx = transactions.find(t => t.id === txId);
      if(tx) {
        setEditingTxId(tx.id);
        setTxTitle(tx.title);
        setModalRateInverted(tx.rateInverted || false);
        const rateToDisplay = tx.rateInverted ? (1 / tx.customRate) : tx.customRate;
        setTxCustomRate(rateToDisplay.toFixed(4));
        setFromCurrency(tx.from);
        setToCurrency(tx.to);
        setAmount(tx.fromAmount.toString());
      }
    } else {
      setEditingTxId(null);
      setTxTitle('');
      setModalRateInverted(false);
      const currentRate = getTargetRateValue(toCurrency);
      setTxCustomRate((currentRate || 0).toFixed(4));
    }
    setShowSaveModal(true);
  };

  const saveTransaction = () => {
    let rateValue = parseFloat(txCustomRate);
    if(isNaN(rateValue) || !txTitle) return alert(t.invalidInput);

    if (modalRateInverted) {
      rateValue = 1 / rateValue;
    }

    const locale = lang === 'th' ? 'th-TH' : (lang === 'zh' ? 'zh-CN' : 'en-US');

    const newTx = {
      id: editingTxId || Date.now().toString(),
      title: txTitle,
      from: fromCurrency,
      to: toCurrency,
      fromAmount: parseFloat(amount),
      customRate: rateValue,
      rateInverted: modalRateInverted,
      date: new Date().toLocaleString(locale)
    };

    if (editingTxId) {
      setTransactions(prev => prev.map(tr => tr.id === editingTxId ? newTx : tr));
    } else {
      setTransactions(prev => [newTx, ...prev]);
      setActiveTab('tracker');
    }
    setShowSaveModal(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tr => tr.id !== id));
    setShowSaveModal(false);
  };

  const renderFlag = (code) => {
    const flagData = CURRENCY_DATA[code];
    if (flagData?.icon) {
      return <img src={flagData.icon} alt={code} className="flag-icon" loading="lazy" style={{background: 'transparent', boxShadow: 'none'}} />;
    }
    return <img src={flagData?.flag ? `https://flagcdn.com/w40/${flagData.flag}.png` : 'https://placehold.co/40x40/cccccc/white?text=?'} alt={code} className="flag-icon" loading="lazy" />;
  };

  const pressTimer = useRef(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const togglePin = (code) => {
    setPinnedRates(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    setContextMenuCurrency(null);
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
  };

  const setAlert = (code, value) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;
    setPriceAlerts(prev => {
      const existing = prev.filter(a => a.code !== code);
      return [...existing, { code, target: val, base: mainCurrency }];
    });
    setShowAlertInput(null);
    setAlertTarget('');
    setContextMenuCurrency(null);
  };

  const removeAlert = (code) => {
    setPriceAlerts(prev => prev.filter(a => a.code !== code));
    setContextMenuCurrency(null);
  };

  const onTouchStart = (e, code) => {
    const touch = e.touches ? e.touches[0] : e;
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    
    setIsLongPress(false);
    pressTimer.current = setTimeout(() => {
      setContextMenuCurrency(code);
      setIsLongPress(true);
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(60);
      }
    }, 600);
  };

  const onTouchEnd = (e, code, onClickAction) => {
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const diffX = Math.abs(touch.clientX - touchStartPos.current.x);
    const diffY = Math.abs(touch.clientY - touchStartPos.current.y);

    clearTimeout(pressTimer.current);
    if (!isLongPress && diffX < 10 && diffY < 10) {
      onClickAction();
    }
  };

  const formatWithCommas = (val) => {
    if (val === null || val === undefined || val === '') return '';
    if (/[+\-*/]/.test(val.toString())) return val.toString();
    const parts = val.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (/^[0-9.+\-*/() ]*$/.test(rawValue)) {
      setAmount(rawValue);
    }
  };

  const handleAmountBlur = () => {
    if (/[+\-*/]/.test(amount)) {
      try {
        const sanitized = amount.replace(/[^0-9.+\-*/()]/g, '');
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (result !== undefined && !isNaN(result) && isFinite(result)) {
           const finalStr = result.toString();
           if (finalStr !== amount) setAmount(finalStr);
        }
      } catch (err) {
        console.error("Calc error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{justifyContent: 'center'}}>
        <div className="loader-container"><div className="loader"></div></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      <div className="header-container">
        <h1 className="header-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1}}>
            <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {activeTab === 'home' ? t.appTitle : activeTab === 'chart' ? t.chartRateLabel : activeTab === 'settings' ? t.tabSettings : t.trackerTitle}
            </span>
            {deferredPrompt && (
              <button onClick={handleInstallClick} style={{background: '#9fe870', color: '#163300', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0}}>INSTALL</button>
            )}
          </div>
          <div style={{position: 'relative', display: 'flex', gap: '8px', alignItems: 'center'}}>
            <button onClick={() => setShowLangMenu(!showLangMenu)} style={{display: 'flex', alignItems: 'center', gap: '6px', background: '#f9fafb', border: '1px solid #d1d5db', padding: '6px 10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-main)'}}>
              <img src={`https://flagcdn.com/w40/${lang === 'en' ? 'gb' : (lang === 'zh' ? 'cn' : 'th')}.png`} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}} alt={lang} />
              <span style={{fontSize: '13px', fontWeight: 600}}>{lang.toUpperCase()}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {/* Refresh Button */}
            {(activeTab === 'home' || activeTab === 'chart') && (
              <button 
                onClick={() => fetchRates(true)} 
                disabled={isRefreshing}
                className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: isDarkMode ? '#262626' : '#f9fafb',
                  border: '1px solid #d1d5db',
                  padding: '6px', borderRadius: '12px', cursor: 'pointer',
                  color: 'var(--text-main)', transition: 'all 0.2s'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
            )}

            {showLangMenu && (
              <>
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90}} onClick={() => setShowLangMenu(false)}></div>
                <div className="lang-menu" style={{position: 'absolute', top: '100%', right: 0, marginTop: '8px', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '100px', overflow: 'hidden'}}>
                  {[ {id: 'th', flag: 'th', label: 'TH'}, {id: 'en', flag: 'gb', label: 'EN'}, {id: 'zh', flag: 'cn', label: 'ZH'} ].map(l => (
                    <div 
                      key={l.id}
                      onClick={() => { setLang(l.id); localStorage.setItem('appLang', l.id); setShowLangMenu(false); }}
                      style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', cursor: 'pointer', background: lang === l.id ? (isDarkMode ? '#2e2e2e' : '#f3f4f6') : 'transparent', borderBottom: '1px solid var(--border-light)'}}
                    >
                      <img src={`https://flagcdn.com/w40/${l.flag}.png`} style={{width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}} alt={l.label}/>
                      <span style={{fontSize: '14px', fontWeight: lang === l.id ? 600 : 500, color: 'var(--text-main)'}}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </h1>
      </div>
      <div className="scrollable-content" key={activeTab}>

      {activeTab === 'home' && (
        <>
          <div className="converter-wrapper">
            <div className="currency-box">
              <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}}>
                {renderFlag(fromCurrency)}
                <span className="currency-code">{fromCurrency}</span>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
                <input 
                  type="text" 
                  inputMode="text" 
                  className="amount-input" 
                  value={formatWithCommas(amount)} 
                  onChange={handleAmountChange} 
                  onBlur={handleAmountBlur}
                  placeholder="0" 
                />
            </div>

            <div className="swap-btn-container">
              <button className="swap-btn" onClick={handleSwap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
              </button>
            </div>

            <div className="currency-box">
              <div className="currency-selector" onClick={() => {setActiveDropdown('to'); setSearchQuery('')}}>
                {renderFlag(toCurrency)}
                <span className="currency-code">{toCurrency}</span>
                <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className="amount-display" style={{position: 'relative', cursor: 'pointer'}} onClick={() => copyToClipboard(getConvertedAmount(toCurrency))}>
                {getConvertedAmount(toCurrency)}
                {copyToast && (
                  <div style={{position: 'absolute', top: '-28px', right: 0, background: 'var(--accent-dark)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', animation: 'fadeInOut 2s forwards', fontWeight: 600}}>
                    {t.copySuccess}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rate-info-box">
            {(() => {
              const currentRate = getTargetRateValue(toCurrency, fromCurrency);
              if (!currentRate) return null;
              
              const history30d = generateMockHistory(currentRate, lang, '1m');
              const avg = history30d.reduce((sum, item) => sum + item.rate, 0) / history30d.length;
              
              let iconColor = '#d97706'; 
              let iconPath = <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></>;
              
              const diffPercent = ((currentRate - avg) / avg) * 100;
              const isPositive = diffPercent > 0.05; 
              const isNegative = diffPercent < -0.05;
              
              if (isPositive) {
                iconColor = '#16a34a'; 
                iconPath = <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></>;
              } else if (isNegative) {
                iconColor = '#dc2626'; 
                iconPath = <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></>;
              }

              return (
                <>
                  <svg className="rate-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {iconPath}
                  </svg>
                  <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <span className="rate-text">
                      <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {exchangeRateText}
                        {(isPositive || isNegative) && (
                          <span style={{ 
                            color: isPositive ? '#16a34a' : '#dc2626', 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            background: isPositive ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            marginLeft: '2px'
                          }}>
                            {isPositive ? '+' : ''}{diffPercent.toFixed(2)}% {isPositive ? '▲' : '▼'}
                          </span>
                        )}
                      </strong> {t.marketRate}
                    </span>
                    
                    <div style={{fontSize: '11px', color: '#6b7280', marginTop: '6px'}}>
                      <span>อัปเดตล่าสุด: {lastUpdated ? lastUpdated.split(' (')[0] : '-'}</span>
                    </div>

                    {isOfflineMode && lastUpdated && (
                      <span style={{fontSize: '11.5px', color: '#dc2626', marginTop: '6px', fontWeight: 600}}>
                        {t.offlineApp.replace('{0}', lastUpdated.split(' (')[0])}
                      </span>
                    )}

                    {/* Speedometer removed as per request */}
                  </div>
                </>
              );
            })()}
          </div>


          <div className="dual-btn-group" style={{ position: 'relative', zIndex: 10, marginBottom: '32px' }}>
            <button 
              className="action-btn" 
              style={{
                width: '100%', 
                background: '#9fe870', // Ensure color is explicitly set
                boxShadow: '0 4px 14px rgba(159, 232, 112, 0.4)',
                border: 'none',
                height: '56px' // Make it taller for easier tapping
              }} 
              onPointerDown={(e) => { e.preventDefault(); openSaveDialog(); }}
              onClick={(e) => { e.preventDefault(); openSaveDialog(); }}
            >
              {t.saveLogBtn}
            </button>
          </div>

          <div className="favorites-header">
            <span>{t.compareOthers}</span>
            <button className="add-fav-btn" onClick={() => {setActiveDropdown('favorite'); setSearchQuery('')}}>{t.addFav}</button>
          </div>
          <div className="favorites-list-container">
            {favorites.map((code) => (
              <div key={code} className="fav-currency-box">
                <div className="fav-left">{renderFlag(code)} <span className="currency-code">{code}</span></div>
                <div className="fav-right">
                  <span className="fav-amount">{getConvertedAmount(code)}</span>
                  <button className="fav-remove-btn" onClick={() => setFavorites(prev => prev.filter(c => c !== code))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            ))}
            {favorites.length === 0 && (
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>
                {t.noFavs}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'tracker' && (
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
            
            return (
              <div key={tx.id} className="tx-card">
                <div className="tx-header">
                  <div>
                    <div className="tx-title">{tx.title}</div>
                    <div className="tx-date">{tx.date}</div>
                  </div>
                  <button className="edit-tx-btn" onMouseDown={() => openSaveDialog(tx.id)}>{t.edit}</button>
                </div>
                <div className="tx-body">
                  <div className="tx-row">
                    <span>{t.spent}</span>
                    <strong>{tx.fromAmount.toLocaleString('en-US')} {tx.from}</strong>
                  </div>
                  <div className="tx-row">
                    <span>{t.convertedTo}</span>
                    <strong>{(() => {
                      let minD = decimalPlaces;
                      let maxD = decimalPlaces;
                      if (decimalPlaces === 'auto') {
                        const isCrypto = CURRENCY_DATA[tx.to]?.isCrypto;
                        if (['JPY', 'KRW', 'VND'].includes(tx.to)) {
                          minD = 0; maxD = 0;
                        } else if (isCrypto) {
                          minD = 2;
                          maxD = costAtSave < 0.0001 ? 8 : (costAtSave < 1 ? 6 : 4);
                        } else {
                          minD = 2;
                          maxD = costAtSave < 0.01 ? 4 : 2;
                        }
                      }
                      return costAtSave.toLocaleString('en-US', {minimumFractionDigits: minD, maximumFractionDigits: maxD});
                    })()} {tx.to}</strong>
                  </div>
                  <div className="tx-row">
                    <span>{t.rateAtSave}</span>
                    <strong>1 {tx.rateInverted ? tx.to : tx.from} = {tx.rateInverted ? (1/tx.customRate).toFixed(4) : tx.customRate.toFixed(4)} {tx.rateInverted ? tx.from : tx.to}</strong>
                  </div>
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
      )}

      {activeTab === 'chart' && (
        <div className="chart-page" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div className="chart-header-controls" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDarkMode ? '#1e1e1e' : '#ffffff', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-light)'
          }}>
            <div className="currency-selector" onClick={() => {setActiveDropdown('from'); setSearchQuery('')}} style={{flex: 1}}>
              {renderFlag(chartFrom)} 
              <span className="currency-code">{chartFrom}</span>
            </div>
            <button className="swap-btn-small" onClick={handleChartSwap} style={{
              background: '#f9fafb', border: '1px solid var(--border-light)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-muted)', margin: '0 8px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
            </button>
            <div className="currency-selector" onClick={() => {setActiveDropdown('to'); setSearchQuery('')}} style={{flex: 1, justifyContent: 'flex-end'}}>
              <span className="currency-code">{chartTo}</span>
              {renderFlag(chartTo)} 
            </div>
          </div>

          <div className="chart-timeframe-selector" style={{display: 'flex', gap: '8px', padding: '0 4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {['1h', '1d', '7d', '1m', '6m', '1y', '5y'].map((tf) => (
              <button 
                key={tf}
                className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                onClick={() => setChartTimeframe(tf)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid',
                  borderColor: chartTimeframe === tf ? 'var(--accent)' : 'var(--border-light)',
                  background: chartTimeframe === tf ? (isDarkMode ? 'rgba(159, 232, 112, 0.15)' : '#f7fee7') : (isDarkMode ? '#262626' : '#ffffff'),
                  color: chartTimeframe === tf ? 'var(--accent-dark)' : 'var(--text-muted)',
                  fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                }}
              >
                {t[`time_${tf}`]}
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
                <LineChart data={chartData} style={{ outline: 'none' }} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={10} 
                    tickFormatter={(val) => val.split(' ')[0] + ' ' + (val.split(' ')[1] || '')}
                    minTickGap={20}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={10} 
                    width={45}
                    tickFormatter={(val) => val.toFixed(4)}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'var(--accent-dark)', fontWeight: 600 }}
                    formatter={(value) => [value, t.chartRateLabel]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke={isDarkMode ? 'var(--accent)' : 'var(--accent-dark)'} 
                     strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 5, fill: isDarkMode ? 'var(--accent)' : 'var(--accent-dark)', stroke: '#fff', strokeWidth: 2 }}
                  />
                  {chartData.length > 0 && (
                    <ReferenceLine 
                      y={chartData[chartData.length - 1].rate} 
                      stroke={isDarkMode ? '#16a34a' : '#15803d'} 
                      strokeDasharray="3 3"
                      label={{ 
                        position: 'right', 
                        value: chartData[chartData.length - 1].rate.toFixed(4), 
                        fill: isDarkMode ? '#16a34a' : '#15803d', 
                        fontSize: 10, 
                        fontWeight: 700,
                        offset: 10
                      }} 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 style={{margin: '16px 0 12px 0', fontSize: '15px', color: 'var(--text-muted)', fontWeight: 600}}>
            {t.ratesTableTitle.replace('{0}', mainCurrency)}
          </h3>

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
                    <tr style={{background: isDarkMode ? 'rgba(159, 232, 112, 0.1)' : 'rgba(163, 230, 53, 0.05)'}}><td colSpan="2" style={{padding: '10px 16px', fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> {t.pinnedRates}</td></tr>
                    {pinnedRates.map((code) => {
                      const rateToShow = getTargetRateValue(mainCurrency, code);
                      return (
                        <tr 
                          key={`pinned-${code}`} 
                          style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: isDarkMode ? 'rgba(159, 232, 112, 0.02)' : 'rgba(163, 230, 53, 0.02)' }} 
                          onTouchStart={(e) => onTouchStart(e, code)}
                          onTouchEnd={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                          onMouseDown={(e) => onTouchStart(e, code)}
                          onMouseUp={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                        >
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {renderFlag(code)}
                              <span style={{color: 'var(--text-main)', fontWeight: 600}}>1 {code}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                            <div style={{ color: 'var(--accent-dark)', fontWeight: 700, fontSize: CURRENCY_DATA[code]?.isCrypto ? '15px' : '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              {(() => {
                                const alert = priceAlerts.find(a => a.code === code);
                                if (alert) {
                                  const hit = rateToShow <= alert.target; // Example: alert if price is low
                                  return <svg width="14" height="14" viewBox="0 0 24 24" fill={hit ? '#16a34a' : '#f59e0b'} style={{ animation: hit ? 'pulse 2s infinite' : 'none' }}><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V10a6 6 0 0 0-12 0v6l-2 2v1h16v-1l-2-2z"/></svg>;
                                }
                                return null;
                              })()}
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
                    })}
                  </>
                )}

                <tr 
                  onClick={() => setIsFiatCollapsed(!isFiatCollapsed)} 
                  style={{background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', cursor: 'pointer'}}
                >
                  <td colSpan="2" style={{padding: '10px 16px'}}>
                    <div style={{fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {t.fiatCurrencies}
                      <svg style={{transform: isFiatCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', opacity: 0.6}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </td>
                </tr>
                {!isFiatCollapsed && visibleFiat.filter(c => c !== mainCurrency && !pinnedRates.includes(c)).map((code) => {
                  const rateToShow = getTargetRateValue(mainCurrency, code);
                  if (rateToShow === 0) return null;
                  return (
                    <tr 
                      key={code} 
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }} 
                      onTouchStart={(e) => onTouchStart(e, code)}
                      onTouchEnd={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                      onMouseDown={(e) => onTouchStart(e, code)}
                      onMouseUp={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                    >
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {renderFlag(code)}
                          <span style={{color: 'var(--text-main)', fontWeight: 500}}>1 {code}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <div style={{ color: 'var(--accent-dark)', fontWeight: 600, fontSize: '16px' }}>
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
                })}
                {!isFiatCollapsed && (
                  <tr>
                    <td colSpan="2" style={{padding: '12px 16px', textAlign: 'center'}}>
                      <button 
                        onClick={() => {setActiveDropdown('fiatTable'); setSearchQuery('')}}
                        style={{
                          background: isDarkMode ? '#262626' : '#f3f4f6',
                          border: '1px dashed var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--accent-dark)',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        + {t.addCurrencyTitle}
                      </button>
                    </td>
                  </tr>
                )}
                <tr 
                  onClick={() => setIsCryptoCollapsed(!isCryptoCollapsed)} 
                  style={{background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', cursor: 'pointer'}}
                >
                  <td colSpan="2" style={{padding: '10px 16px'}}>
                    <div style={{fontWeight: 700, fontSize: '11px', color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {t.cryptoCurrencies}
                      <svg style={{transform: isCryptoCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s', opacity: 0.6}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </td>
                </tr>
                {!isCryptoCollapsed && visibleCrypto.filter(c => c !== mainCurrency && !pinnedRates.includes(c)).map((code) => {
                  const rateToShow = getTargetRateValue(mainCurrency, code);
                  return (
                    <tr 
                      key={code} 
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }} 
                      onTouchStart={(e) => onTouchStart(e, code)}
                      onTouchEnd={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                      onMouseDown={(e) => onTouchStart(e, code)}
                      onMouseUp={(e) => onTouchEnd(e, code, () => handleTableClick(code))}
                    >
                      <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {renderFlag(code)}
                          <span style={{color: 'var(--text-main)', fontWeight: 500}}>1 {code}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <div style={{ color: 'var(--accent-dark)', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {(() => {
                            const alert = priceAlerts.find(a => a.code === code);
                            if (alert) {
                              const hit = rateToShow <= alert.target;
                              return <svg width="14" height="14" viewBox="0 0 24 24" fill={hit ? '#16a34a' : '#f59e0b'} style={{ animation: hit ? 'pulse 2s infinite' : 'none' }}><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V10a6 6 0 0 0-12 0v6l-2 2v1h16v-1l-2-2z"/></svg>;
                            }
                            return null;
                          })()}
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
                })}
                {!isCryptoCollapsed && (
                  <tr>
                    <td colSpan="2" style={{padding: '12px 16px', textAlign: 'center'}}>
                      <button 
                        onClick={() => {setActiveDropdown('cryptoTable'); setSearchQuery('')}}
                        style={{
                          background: isDarkMode ? '#262626' : '#f3f4f6',
                          border: '1px dashed var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--accent-dark)',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        + {t.addCurrencyTitle}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-page" style={{display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px'}}>
          <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)'}}>
            <label className="form-label" style={{marginBottom: '12px'}}>{t.mainCurrencyLabel}</label>
            <div className="currency-selector" onClick={() => {setActiveDropdown('main'); setSearchQuery('')}} style={{
              border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                {renderFlag(mainCurrency)}
                <span className="currency-code">{mainCurrency}</span>
                <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[mainCurrency]?.name}</span>
              </div>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <label className="form-label" style={{margin: 0}}>{t.tabSettings}</label>
            <div style={{
              display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px'
            }}>
              {[
                { id: 'auto', label: t.autoMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> },
                { id: 'light', label: t.lightMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg> },
                { id: 'dark', label: t.darkMode, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: theme === opt.id ? (isDarkMode ? '#3f3f46' : '#ffffff') : 'transparent',
                    color: theme === opt.id ? 'var(--accent-dark)' : 'var(--text-muted)',
                    fontWeight: theme === opt.id ? 700 : 500,
                    fontSize: '13px', transition: 'all 0.2s',
                    boxShadow: theme === opt.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="settings-card" style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <label className="form-label" style={{margin: 0}}>{t.decimalPlaces}</label>
            <div style={{
              display: 'flex', background: isDarkMode ? '#262626' : '#f3f4f6', padding: '4px', borderRadius: '14px', gap: '4px'
            }}>
              {['auto', 0, 2, 4, 8].map(num => (
                <button
                  key={num}
                  onClick={() => setDecimalPlaces(num)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: decimalPlaces === num ? (isDarkMode ? '#3f3f46' : '#ffffff') : 'transparent',
                    color: decimalPlaces === num ? 'var(--accent-dark)' : 'var(--text-muted)',
                    fontWeight: decimalPlaces === num ? 700 : 500,
                    fontSize: '13px', transition: 'all 0.2s',
                    boxShadow: decimalPlaces === num ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {num === 'auto' ? t.autoMode : num}
                </button>
              ))}
            </div>
          </div>

          <div 
            onClick={() => setShowInstallGuide(true)}
            className="settings-card"
            style={{background: isDarkMode ? '#1e1e1e' : '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{background: isDarkMode ? '#262626' : '#f3f4f6', padding: '8px', borderRadius: '10px', color: 'var(--accent)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <label className="form-label" style={{margin: 0, cursor: 'pointer'}}>{t.howToInstall}</label>
            </div>
            <svg style={{color: 'var(--text-muted)'}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>

          <button 
            onClick={clearAllHistory}
            className="danger-btn"
            style={{
              background: clearConfirmState ? '#dc2626' : '#fee2e2', 
              color: clearConfirmState ? '#ffffff' : '#dc2626', 
              border: 'none', padding: '16px',
              borderRadius: '16px', fontWeight: 600, cursor: 'pointer', fontSize: '15px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: clearConfirmState ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {clearConfirmState ? (lang === 'th' ? 'กดยืนยันอีกครั้งเพื่อลบ' : 'Click again to confirm') : t.clearAllData}
          </button>

          <div className="settings-footer-area" style={{marginTop: 'auto', padding: '20px 0', textAlign: 'center', background: 'transparent'}}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              padding: '6px 14px', borderRadius: '20px', 
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border-light)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: lastUpdated && lastUpdated.includes('ExchangeRate-API') ? '#22c55e' : '#94a3b8',
                boxShadow: lastUpdated && lastUpdated.includes('ExchangeRate-API') ? '0 0 8px #22c55e' : 'none'
              }}></div>
              <span style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)'}}>
                Data Source: {(() => {
                  if (!lastUpdated) return 'Loading...';
                  const source = lastUpdated.split(' (')[1]?.replace(')', '') || 'Global API';
                  return source.replace('+', '&'); // e.g. ExchangeRate-API & Crypto
                })()}
              </span>
            </div>
          </div>
          
          <div className="settings-footer-area" style={{textAlign: 'center', padding: '10px 20px 40px', color: '#9ca3af', fontSize: '11px', background: 'transparent'}}>
            <div style={{opacity: 0.6, letterSpacing: '0.5px'}}>FishyCurrency Exchange App v2.2.0</div>
          </div>
        </div>
      )}

      {/* -- Modals -- */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setShowSaveModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>{editingTxId ? t.modalSaveEdit : t.modalSaveNew}</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">{t.txNameLabel}</label>
              <input type="text" className="form-input" value={txTitle} onChange={e => setTxTitle(e.target.value)} placeholder={t.txNamePlaceholder} autoFocus />
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {[
                  { id: 'Food', label: t.catFood },
                  { id: 'Shopping', label: t.catShopping },
                  { id: 'Hotel', label: t.catHotel },
                  { id: 'Transport', label: t.catTransport },
                  { id: 'Cafe', label: t.catCafe },
                  { id: 'Exchange', label: t.catExchange },
                  { id: 'Other', label: t.catOther }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setTxTitle(cat.label)}
                    style={{
                      padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-light)',
                      background: isDarkMode ? '#262626' : '#f8fafc',
                      color: 'var(--text-main)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                    onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-light)'}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{color: 'var(--accent-dark)'}}>{t.calcFromApp} {amount} {fromCurrency} {t.calcEstValue} {getConvertedAmount(toCurrency)} {toCurrency}</label>
            </div>

            <div className="form-group">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <label className="form-label" style={{margin: 0}}>
                  {t.actualRateLabel} (1 {modalRateInverted ? toCurrency : fromCurrency} = ... {modalRateInverted ? fromCurrency : toCurrency})
                </label>
                <button 
                  onClick={() => {
                    const currentVal = parseFloat(txCustomRate);
                    if (!isNaN(currentVal) && currentVal !== 0) {
                      setTxCustomRate((1 / currentVal).toFixed(4));
                    }
                    setModalRateInverted(!modalRateInverted);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'transparent', border: '1px solid #d1d5db',
                    padding: '4px 8px', borderRadius: '8px', fontSize: '11px',
                    cursor: 'pointer', fontWeight: 600, color: '#4b5563'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="4" x2="8" y2="20"></line><polyline points="4 8 8 4 12 8"></polyline><line x1="16" y1="20" x2="16" y2="4"></line><polyline points="20 16 16 20 12 16"></polyline></svg>
                  {t.swapRate}
                </button>
              </div>
              <input type="number" step="0.0001" className="form-input" value={txCustomRate} onChange={e => setTxCustomRate(e.target.value)} />
            </div>

            <button className="action-btn" onMouseDown={saveTransaction}>{t.saveBtn}</button>
            {editingTxId && <button className="delete-tx-btn" onClick={() => deleteTransaction(editingTxId)}>{t.deleteBtn}</button>}
          </div>
        </div>
      )}



      {activeDropdown && (
        <div className="modal-overlay" onClick={() => setActiveDropdown(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setActiveDropdown(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>{activeDropdown === 'favorite' ? t.addCurrencyTitle : t.selectCurrencyTitle}</h2>
            </div>
            <input type="text" className="search-input" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
            <div className="currency-list">
              {pinnedRates.length > 0 && !searchQuery && activeDropdown !== 'fiatTable' && activeDropdown !== 'cryptoTable' && (
                <>
                  <div style={{ padding: '12px 16px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    {t.pinnedRates}
                  </div>
                  {pinnedRates.map(c => (
                    <div key={`pinned-sel-${c}`} className="currency-list-item" onClick={() => handleSelectCurrency(c)} style={{background: isDarkMode ? 'rgba(159, 232, 112, 0.15)' : 'rgba(163, 230, 53, 0.15)', border: '1px solid rgba(159, 232, 112, 0.3)', marginBottom: '6px'}}>
                      {renderFlag(c)} <div><div className="currency-code" style={{color: 'var(--accent-dark)', fontWeight: 700}}>{c}</div><div style={{fontSize: '11px', color:'var(--text-muted)'}}>{CURRENCY_DATA[c].name}</div></div>
                    </div>
                  ))}
                  <div style={{ flexShrink: 0, minHeight: '1px', width: 'calc(100% - 16px)', margin: '16px auto', borderBottom: '1px solid #6b7280', opacity: 0.5 }}></div>
                </>
              )}
              {Object.keys(CURRENCY_DATA)
                .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()) || (CURRENCY_DATA[c] && CURRENCY_DATA[c].name.toLowerCase().includes(searchQuery.toLowerCase())))
                .filter(c => activeDropdown !== 'favorite' || (!favorites.includes(c) && c !== fromCurrency))
                .filter(c => activeDropdown !== 'fiatTable' || !CURRENCY_DATA[c].isCrypto)
                .filter(c => activeDropdown !== 'cryptoTable' || CURRENCY_DATA[c].isCrypto)
                .map(c => {
                  return (
                    <div 
                      key={c} 
                      className="currency-list-item" 
                      onClick={() => handleSelectCurrency(c)} 
                      style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {renderFlag(c)} 
                        <div>
                          <div className="currency-code">{c}</div>
                          <div style={{fontSize: '12px', color:'var(--text-muted)'}}>{CURRENCY_DATA[c]?.name}</div>
                        </div>
                      </div>
                      {(activeDropdown === 'fiatTable' || activeDropdown === 'cryptoTable') && (
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '6px', 
                          border: `2px solid ${(visibleFiat.includes(c) || visibleCrypto.includes(c) || pinnedRates.includes(c)) ? 'var(--accent)' : 'var(--border-light)'}`,
                          background: (visibleFiat.includes(c) || visibleCrypto.includes(c) || pinnedRates.includes(c)) ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                        }}>
                          {(visibleFiat.includes(c) || visibleCrypto.includes(c) || pinnedRates.includes(c)) && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              {Object.keys(CURRENCY_DATA).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()) || CURRENCY_DATA[c].name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                  {t.notFound}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAlertInput && (
        <div className="modal-overlay" onClick={() => setShowAlertInput(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setShowAlertInput(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>Set Alert for {showAlertInput}</h2>
            </div>
            <div className="form-group">
              <label className="form-label">Alert me when 1 {showAlertInput} is below:</label>
              <input 
                type="number" 
                className="form-input" 
                value={alertTarget} 
                onChange={e => setAlertTarget(e.target.value)} 
                placeholder="Target Price"
                autoFocus 
              />
              <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px'}}>Current: {getTargetRateValue(mainCurrency, showAlertInput).toFixed(4)} {mainCurrency}</p>
            </div>
            <button className="action-btn" onClick={() => setAlert(showAlertInput, alertTarget)}>Set Alert</button>
          </div>
        </div>
      )}

      {detailChartCurrency && (
        <div className="modal-overlay" style={{
          background: isDarkMode ? '#121212' : '#ffffff',
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column', color: isDarkMode ? '#ffffff' : '#000000',
          overflow: 'hidden'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <button 
              onClick={() => setDetailChartCurrency(null)}
              style={{ background: isDarkMode ? '#2a2a2a' : '#f0f0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDarkMode ? '#fff' : '#000' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <button
              onClick={() => togglePin(detailChartCurrency)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: pinnedRates.includes(detailChartCurrency) ? '#9fe870' : (isDarkMode ? '#555' : '#ccc') }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
          </div>

          <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Title and Flags Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>{detailChartCurrency} {lang === 'th' ? 'ถึง' : 'to'} {mainCurrency}</h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                  {CURRENCY_DATA[detailChartCurrency]?.name} {lang === 'th' ? 'ถึง' : 'to'} {CURRENCY_DATA[mainCurrency]?.name}
                </p>
              </div>
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, outline: `3px solid ${isDarkMode ? '#121212' : '#ffffff'}`, borderRadius: '50%' }}>
                  {renderFlag(detailChartCurrency)}
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 2, outline: `3px solid ${isDarkMode ? '#121212' : '#ffffff'}`, borderRadius: '50%' }}>
                  {renderFlag(mainCurrency)}
                </div>
              </div>
            </div>

            {/* Rate and Stats Row */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>
                1 {detailChartCurrency} = {getTargetRateValue(mainCurrency, detailChartCurrency).toFixed(4)} {mainCurrency}
              </div>
              {detailChartStats && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: detailChartStats.isPlus ? (isDarkMode ? '#9fe870' : '#16a34a') : (isDarkMode ? '#ff4d4d' : '#dc2626'), fontSize: '15px', fontWeight: 600, marginTop: '6px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {detailChartStats.isPlus ? <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline> : <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>}
                    {detailChartStats.isPlus ? <polyline points="17 6 23 6 23 12"></polyline> : <polyline points="17 18 23 18 23 12"></polyline>}
                  </svg>
                  <span>{detailChartStats.isPlus ? (lang==='th'?'เพิ่มขึ้น':'Increased') : (lang==='th'?'ลดลง':'Decreased')} {Math.abs(detailChartStats.percent).toFixed(2)}% ({Math.abs(detailChartStats.diff).toFixed(6)} {mainCurrency})</span>
                </div>
              )}
            </div>

            {/* Chart Area */}
            <div className="chart-timeframe-selector" style={{display: 'flex', gap: '8px', padding: '0 4px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', marginBottom: '16px'}}>
              {['1h', '1d', '7d', '1m', '6m', '1y', '5y'].map((tf) => (
                <button 
                  key={tf}
                  className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                  onClick={() => setChartTimeframe(tf)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '12px', border: '1px solid',
                    borderColor: chartTimeframe === tf ? 'var(--accent)' : 'var(--border-light)',
                    background: chartTimeframe === tf ? (isDarkMode ? 'rgba(159, 232, 112, 0.15)' : '#f7fee7') : (isDarkMode ? '#262626' : '#ffffff'),
                    color: chartTimeframe === tf ? 'var(--accent-dark)' : 'var(--text-muted)',
                    fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                  }}
                >
                  {t[`time_${tf}`]}
                </button>
              ))}
            </div>

            <div className="chart-container-box" style={{ padding: '20px 10px', borderRadius: '16px', border: '1px solid var(--border-light)', flex: 1, maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{flex: 1, width: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailChartData} style={{ outline: 'none' }} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                      fontSize={10} 
                      tickFormatter={(val) => val.split(' ')[0] + ' ' + (val.split(' ')[1] || '')}
                      minTickGap={20}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      stroke={isDarkMode ? '#6b7280' : '#9ca3af'} 
                      fontSize={10} 
                      width={45}
                      tickFormatter={(val) => val.toFixed(4)}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDarkMode ? '#262626' : '#ffffff', border: '1px solid var(--border-light)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: 'var(--accent-dark)', fontWeight: 600 }}
                      formatter={(value) => [value, t.chartRateLabel]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke={isDarkMode ? 'var(--accent)' : 'var(--accent-dark)'} 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 5, fill: isDarkMode ? 'var(--accent)' : 'var(--accent-dark)', stroke: '#fff', strokeWidth: 2 }}
                    />
                    {detailChartData.length > 0 && (
                      <ReferenceLine 
                        y={detailChartData[detailChartData.length - 1].rate} 
                        stroke={isDarkMode ? '#16a34a' : '#15803d'} 
                        strokeDasharray="3 3"
                        label={{ 
                          position: 'right', 
                          value: detailChartData[detailChartData.length - 1].rate.toFixed(4), 
                          fill: isDarkMode ? '#16a34a' : '#15803d', 
                          fontSize: 10, 
                          fontWeight: 700,
                          offset: 10
                        }} 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {contextMenuCurrency && (
        <div className="modal-overlay" style={{background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}} onClick={() => setContextMenuCurrency(null)}>
          <div 
            className="context-menu-sheet" 
            style={{
              width: '100%', maxWidth: '500px', background: isDarkMode ? '#1e1e1e' : '#ffffff', 
              borderRadius: '24px 24px 0 0', padding: '20px 20px 40px', 
              animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{width: '40px', height: '4px', background: 'var(--border-light)', borderRadius: '2px', alignSelf: 'center', marginBottom: '20px'}}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 8px'}}>
              {renderFlag(contextMenuCurrency)}
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '18px', fontWeight: 700, color: 'var(--text-main)'}}>{contextMenuCurrency}</span>
                <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{CURRENCY_DATA[contextMenuCurrency]?.name}</span>
              </div>
            </div>
            
            <button 
              onClick={() => togglePin(contextMenuCurrency)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', 
                border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', 
                color: 'var(--text-main)', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={pinnedRates.includes(contextMenuCurrency) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              {pinnedRates.includes(contextMenuCurrency) ? (lang === 'th' ? 'นำออกจากรายการโปรด' : 'Remove from Favorites') : (lang === 'th' ? 'เพิ่มลงรายการโปรด' : 'Add to Favorites')}
            </button>

            {!pinnedRates.includes(contextMenuCurrency) && (
              <button 
                onClick={() => {
                  setVisibleFiat(prev => prev.filter(c => c !== contextMenuCurrency));
                  setVisibleCrypto(prev => prev.filter(c => c !== contextMenuCurrency));
                  setContextMenuCurrency(null);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', 
                  border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', 
                  color: '#ef4444', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                {lang === 'th' ? 'ลบออกจากหน้าหลัก' : 'Remove from Home'}
              </button>
            )}

            <button 
              onClick={() => { setShowAlertInput(contextMenuCurrency); setAlertTarget(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', 
                border: 'none', background: isDarkMode ? '#262626' : '#f3f4f6', 
                color: 'var(--text-main)', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {t.alertSet}
            </button>
            
            {priceAlerts.some(a => a.code === contextMenuCurrency) && (
              <button 
                onClick={() => removeAlert(contextMenuCurrency)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', 
                  border: 'none', background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                {t.alertRemove}
              </button>
            )}

            <button 
              onClick={() => setContextMenuCurrency(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', 
                border: 'none', background: 'transparent', 
                color: 'var(--text-muted)', fontSize: '15px', fontWeight: 500, cursor: 'pointer', justifyContent: 'center'
              }}
            >
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
      </div>

      {showInstallGuide && (
        <div className="modal-overlay" style={{padding: '20px', background: 'rgba(0,0,0,0.4)'}}>
          <div className="modal-content" style={{maxWidth: '500px', width: '100%', padding: '28px', position: 'relative', borderRadius: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main)'}}>{t.installGuideTitle}</h2>
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="close-modal-btn"
                style={{background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex'}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', maxHeight: '65vh', padding: '4px'}}>
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <div style={{background: isDarkMode ? '#2e2e2e' : '#f3f4f6', color: isDarkMode ? '#ffffff' : '#1a1a1a', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width="24" height="24" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  </div>
                  <h3 style={{margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)'}}>{t.iosInstall}</h3>
                </div>
                <div style={{background: isDarkMode ? '#1a1a1a' : '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'}}>
                  {t.iosSteps.map((step, idx) => (
                    <div key={idx} style={{margin: '12px 0', fontSize: '15px', lineHeight: 1.6, color: 'var(--text-main)', display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <div style={{background: isDarkMode ? '#2e2e2e' : '#f3f4f6', color: '#16a34a', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width="24" height="24" viewBox="0 0 640 640" fill="currentColor"><path d="M452.5 317.9C465.8 317.9 476.5 328.6 476.5 341.9C476.5 355.2 465.8 365.9 452.5 365.9C439.2 365.9 428.5 355.2 428.5 341.9C428.5 328.6 439.2 317.9 452.5 317.9zM187.4 317.9C200.7 317.9 211.4 328.6 211.4 341.9C211.4 355.2 200.7 365.9 187.4 365.9C174.1 365.9 163.4 355.2 163.4 341.9C163.4 328.6 174.1 317.9 187.4 317.9zM461.1 221.4L509 138.4C509.8 137.3 510.3 136 510.5 134.6C510.7 133.2 510.7 131.9 510.4 130.5C510.1 129.1 509.5 127.9 508.7 126.8C507.9 125.7 506.9 124.8 505.7 124.1C504.5 123.4 503.2 123 501.8 122.8C500.4 122.6 499.1 122.8 497.8 123.2C496.5 123.6 495.3 124.3 494.2 125.1C493.1 125.9 492.3 127.1 491.7 128.3L443.2 212.4C404.4 195 362.4 186 319.9 186C277.4 186 235.4 195 196.6 212.4L148.2 128.4C147.6 127.2 146.7 126.1 145.7 125.2C144.7 124.3 143.4 123.7 142.1 123.3C140.8 122.9 139.4 122.8 138.1 122.9C136.8 123 135.4 123.5 134.2 124.2C133 124.9 132 125.8 131.2 126.9C130.4 128 129.8 129.3 129.5 130.6C129.2 131.9 129.2 133.3 129.4 134.7C129.6 136.1 130.2 137.3 130.9 138.5L178.8 221.5C96.5 266.2 40.2 349.5 32 448L608 448C599.8 349.5 543.5 266.2 461.1 221.4z"/></svg>
                  </div>
                  <h3 style={{margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)'}}>{t.androidInstall}</h3>
                </div>
                <div style={{background: isDarkMode ? '#1a1a1a' : '#f8fafc', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'}}>
                  {t.androidSteps.map((step, idx) => (
                    <div key={idx} style={{margin: '12px 0', fontSize: '15px', lineHeight: 1.6, color: 'var(--text-main)', display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowInstallGuide(false)}
              className="action-btn"
              style={{marginTop: '28px'}}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>{t.tabHome}</span>
        </button>
        <button className={`nav-item ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <span>{t.tabChart}</span>
        </button>
        <button className={`nav-item ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>{t.tabTracker}</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span>{t.tabSettings}</span>
        </button>
      </div>

    </div>
  );
}

export default App;

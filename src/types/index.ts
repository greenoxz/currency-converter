export interface Translation {
  appTitle: string;
  trackerTitle: string;
  marketRate: string;
  offlineApp: string;
  offlineSimple: string;
  saveLogBtn: string;
  tabChart: string;
  time_1h: string;
  time_1d: string;
  time_7d: string;
  time_1m: string;
  time_6m: string;
  time_1y: string;
  time_5y: string;
  decimalPlaces: string;
  compareOthers: string;
  addFav: string;
  noFavs: string;
  alertSet: string;
  alertTargetLow: string;
  alertRemove: string;
  noHistory: string;
  noHistorySub: string;
  edit: string;
  spent: string;
  convertedTo: string;
  rateAtSave: string;
  rateToday: string;
  moreExpensive: string;
  cheaper: string;
  profitVal: string;
  lossVal: string;
  modalSaveNew: string;
  modalSaveEdit: string;
  txNameLabel: string;
  txNamePlaceholder: string;
  calcFromApp: string;
  calcEstValue: string;
  actualRateLabel: string;
  swapRate: string;
  saveBtn: string;
  deleteBtn: string;
  addCurrencyTitle: string;
  selectCurrencyTitle: string;
  searchPlaceholder: string;
  modalChartTitle: string;
  tabHome: string;
  tabTracker: string;
  invalidInput: string;
  chartRateLabel: string;
  tableDate: string;
  tableRate: string;
  tabSettings: string;
  mainCurrencyLabel: string;
  ratesTableTitle: string;
  allCurrencies: string;
  clearAllData: string;
  confirmClear: string;
  copySuccess: string;
  autoMode: string;
  darkMode: string;
  lightMode: string;
  howToInstall: string;
  installGuideTitle: string;
  iosInstall: string;
  androidInstall: string;
  iosSteps: string[];
  androidSteps: string[];
  fiatCurrencies: string;
  cryptoCurrencies: string;
  pinnedRates: string;
  rateStatusCheap: string;
  rateStatusExpensive: string;
  rateStatusNormal: string;
  catFood: string;
  catShopping: string;
  catHotel: string;
  catTransport: string;
  catCafe: string;
  catExchange: string;
  catOther: string;
  termsTitle: string;
  termsContent: string;
  okBtn: string;
  themeLabel: string;
  // Payment Cards
  myCards: string;
  addCard: string;
  cardName: string;
  cardType: string;
  cardFee: string;
  cardFeePercent: string;
  cardAlipayLimit: string;
  cardSaved: string;
  noCards: string;
  paymentMethod: string;
  selectCard: string;
  feeCalc: string;
  feeIncluded: string;
  totalWithFee: string;
  // Bill Split
  billSplit: string;
  billSplitNew: string;
  addPerson: string;
  personName: string;
  personAmount: string;
  splitResult: string;
  splitTotal: string;
  splitPerPerson: string;
  splitPaidBy: string;
  splitTHBEquiv: string;
  splitFeeIncluded: string;
  tabBillSplit: string;
  clearAmount: string;
  alipayFreeNote: string;
}

export interface CurrencyInfo {
  name: string;
  flag?: string;
  isCrypto?: boolean;
  icon?: string;
}

export interface PaymentCard {
  id: string;
  name: string;
  type: 'visa' | 'mastercard' | 'jcb' | 'alipay' | 'wechat' | 'unionpay' | 'promptpay';
  feePercent: number; // % fee e.g. 2.5
  alipayFreeLimit?: number; // e.g. 200 CNY free
}

export interface BillSplitItem {
  id: string;
  name: string;
  amount: number; // in foreign currency
  currency: string;
  paid: boolean;
  paidByCardId?: string;
}

export interface Transaction {
  id: string;
  title: string;
  from: string;
  to: string;
  fromAmount: number;
  customRate: number;
  rateInverted: boolean;
  date: string;
  cardId?: string; // payment card used
  feeAmount?: number; // fee in 'to' currency
  feePercent?: number;
  paymentMethod?: 'card' | 'alipay' | 'wechat' | 'promptpay' | 'cash';
}

export interface PriceAlert {
  code: string;
  target: number;
  base: string;
}

export interface HistoryData {
  date: string;
  rate: number;
}

export interface BillSplit {
  id: string;
  title: string;
  currency: string;
  items: BillSplitItem[];
  date: string;
  mainCurrency: string; // THB
  rate: number; // rate at time of recording
}

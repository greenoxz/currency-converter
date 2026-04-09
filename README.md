# 💸 FishyCurrency Exchange - Premium Mobile PWA

![FishyCurrency Banner](file:///C:/Users/Green/.gemini/antigravity/brain/fc1d32d2-7122-4c88-8468-f06fdac0c02f/fishy_currency_banner_1775702292913.png)

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Live Demo:** [Click Here](https://currency-converter-git-main-greenoxzs-projects.vercel.app/)

---

## 🇹🇭 บทนำ (Thai)
**FishyCurrency** เป็นแอปพลิเคชันเว็บแบบ Progressive Web App (PWA) ระดับพรีเมียมที่ออกแบบมาเพื่อการติดตามและแปลงสกุลเงินบนมือถือโดยเฉพาะ เน้นความเรียบง่าย สวยงาม และประสิทธิภาพสูงสุด รองรับการใช้งานออฟไลน์และมีระบบบันทึกประวัติค่าใช้จ่ายในตัว

## 🌐 Overview (English)
**FishyCurrency** is a premium, mobile-first Progressive Web App (PWA) designed for seamless currency tracking and conversion. Built with a minimalist aesthetic and high-precision data, it offers a "native-app" feel with advanced features like historical charts, expense logging, and real-time exchange rates.

---

## ✨ Key Features | คุณสมบัติเด่น

### 💱 Smart Converter | ระบบแปลงเงินอัจฉริยะ
- **Dual-Box Design**: แปลงสกุลเงินไป-กลับได้อย่างรวดเร็ว (Swift conversion between 20+ world currencies).
- **Crypto Support**: รองรับสกุลเงินคริปโตหลัก (BTC, ETH, SOL, BNB) อ้างอิงราคา Real-time จาก CoinGecko.
- **High Precision**: ปรับทศนิยมได้ตามต้องการ หรือใช้ระบบ Auto-precision สำหรับความแม่นยำสูงสุด.

### 📈 Interactive Charts | กราฟวิเคราะห์แนวโน้ม
- **Historical Data**: ดูแนวโน้มย้อนหลังได้ตั้งแต่ 1 ชั่วโมง จนถึง 5 ปี.
- **Dynamic Scaling**: กราฟปรับมาตราส่วนอัตโนมัติตามเรทตลาดปัจจุบันเพื่อให้เห็นภาพการเปลี่ยนแปลงที่ชัดเจนที่สุด.

### 📓 Expense Tracker | ระบบบันทึกประวัติ
- **Smart Logging**: บันทึกรายการแลกเงินหรือค่าใช้จ่าย พร้อมเปรียบเทียบ "เรทที่ใช้จริง" กับ "เรทตลาดวันนี้" เพื่อดูผลกำไรหรือส่วนต่างที่ประหยัดได้.
- **Categorization**: แยกหมวดหมู่ค่าใช้จ่าย (อาหาร, ช้อปปิ้ง, ที่พัก ฯลฯ) พร้อมไอคอนสวยงาม.

### 📱 Native Experience | ประสบการณ์แบบแอปมือถือ
- **PWA Ready**: ติดตั้งลงบนหน้าจอโฮมได้ทันที (Installable on iOS & Android).
- **Offline Mode**: ใช้งานได้แม้ไม่มีอินเทอร์เน็ต (อ้างอิงข้อมูลจากการเชื่อมต่อครั้งล่าสุด).
- **Portrait Locked**: ล็อกหน้าจอแนวตั้งเพื่อการใช้งานที่สะดวกที่สุดบนมือถือ.
- **Premium UI**: ดีไซน์โหมดมืด (Dark Mode) ที่หรูหรา พร้อมไอคอนธงชาติแบบวงกลมความละเอียดสูง (High-res circular flags).

---

## 🛠️ Tech Stack | เทคโนโลยีที่ใช้

- **Core**: React 19 + Vite 8
- **Styling**: Vanilla CSS (Custom Design System with high-contrast tokens)
- **Data Visuals**: Recharts (Customized for mobile interaction)
- **PWA Engine**: `vite-plugin-pwa`
- **Data Feeds**: 
  - ExchangeRate-API v6 (Financial Data)
  - CoinGecko API (Crypto Data)

---

## 🚀 Getting Started | การติดตั้งและเริ่มต้นใช้งาน

1. **Clone project:**
   ```bash
   git clone https://github.com/greenoxz/currency-converter.git
   ```

2. **Setup Environment:**
   สร้างไฟล์ `.env` ใน root directory และใส่ API Key ของคุณ:
   ```env
   VITE_ER_API_KEY=your_exchangerate_api_key
   ```

3. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Run Development:**
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy | ปรัชญาการออกแบบ
FishyCurrency ยึดถือหลักการ **Minimalist Excellence**:
- **No Emojis**: เพื่อหลีกเลี่ยงปัญหาการแสดงผลที่ต่างกันในแต่ละ OS เราใช้ SVG และ Vector Icons ทั้งหมด.
- **Fluid Interactions**: ระบบสัมผัสและแอนิเมชันที่ลื่นไหลเหมือนแอป Native.
- **Focus on Data**: เน้นเฉพาะข้อมูลที่จำเป็น เพื่อการตัดสินใจทางการเงินที่รวดเร็ว.

---

## 📄 License
This project is open-source and available under the MIT License.

---
*Created with ❤️ by Greenoxz*

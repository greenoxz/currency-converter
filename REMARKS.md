# Currency Converter Developer Remarks & Troubleshooting

This document serves as a persistent reminder of common pitfalls encountered during development of this project.

## 1. The "White Screen of Death" (ReferenceError)
**The Problem:** React applications fail to mount silently, displaying a completely blank white screen. In the development console, the server may show `hmr update` but the screen remains blank.
**Common Cause:** Accidentally deleting or commenting out a `useState` or contextual variable that is later referenced in the JSX rendering tree (e.g., `<button disabled={isRefreshing}>`). 
**Solution:** 
- Always ensure that code replacement or injections do not swallow neighboring lines. 
- Open the web browser's Developer Tools (F12) -> Console. ReferenceErrors will be stated there clearly (e.g., `Uncaught ReferenceError: isRefreshing is not defined`).

## 2. React Hook Order Mismatches
**The Problem:** The app crashes with `Rendered fewer hooks than expected` or `Hooks must be called in the exact same order on every component render`.
**Common Cause:** Moving a `useMemo`, `useEffect`, or `useState` block below an early `return` statement, or rearranging the order of hooks in the file while the Vite HMR server is watching.
**Solution:** 
- All hooks must be defined at the absolute top of the component body before any `if (...) return` statements.
- If hook order is modified during hot-reload, the current application state might corrupt. A hard refresh (`Ctrl + F5`) in the browser will rebuild the active state correctly.

## 3. "Missing script" or "Command not found" in Terminal
**The Problem:** Running `npm run dev`, `npm run build`, or `npx eslint` returns `Missing script: "build"` or fails to execute properly.
**Common Cause:** Executing the terminal command in the outer parent directory (`currency-exchange`) instead of the actual React web app directory (`currency-exchange/currency-converter`).
**Solution:** 
- Always verify your current active directory with `pwd` or check your prompt path before running package.json scripts.
- Use `cd currency-converter` to enter the Vite working directory before executing `npm run build` or `npm run lint`.

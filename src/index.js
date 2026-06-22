import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

// NOTE: We intentionally use createRoot().render() rather than hydrateRoot,
// even though react-snap prerenders static HTML into #root at build time.
// This app renders auth- and animation-dependent UI that cannot match a
// logged-out, build-time snapshot, which caused React hydration errors
// (#418/#423) in production — visible in Googlebot's render and the cause of
// intermittent duplicate API calls. createRoot re-renders cleanly over the
// prerendered markup: crawlers still receive the static HTML on first fetch
// (SEO intact) and the client mounts effects exactly once.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

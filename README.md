# Alpha Talent Technology

Recruitment website for Alpha Talent Technology. The page explains how employers and candidates meet through the firm, with an interactive 3D Talent Connection Bridge built in React Three Fiber.

Company names, services, phone, and email come from the original company profile. The email address is preserved exactly as published, including its original spelling.

## Run locally

```bash
npm install
npm run dev
```

Vite prints a local address, usually `http://127.0.0.1:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Contact form

The form validates in the browser, then opens the visitor’s email application with a draft to `info@Alphatelenttechnoloy.com`. Inquiries are not stored on a server. `src/lib/deliverInquiry.js` is the place to connect a real API later.

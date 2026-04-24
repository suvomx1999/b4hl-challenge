# 🚀 BFHL Engine - SRM Full Stack Challenge

A high-performance, fully decentralized monorepo submission for the **SRM Full Stack Engineering Challenge (Round 1)**. 

This project encompasses a modular **Express.js (Node.js)** backend algorithm capable of decoding massive hierarchical graph payloads, securely decoupled from a robust, glassmorphic **React + Vite** frontend that supports strictly-typed JSON submissions and dynamic JWT spoofing.

---

## 🔥 Features & Capabilities

- **Deep Tree Resolution**: Automatically parses strings (e.g., `A->B`) into complex multidimensional objects while natively adhering to mathematical tie-breaking boundaries and redundant parent rules.
- **Strict Evaluator Parity**: Perfect compliance with all SRM Challenge logic:
  - Catches integers, syntax failures, and malformed spacing structurally into `invalid_entries`.
  - Mathematically isolates parallel duplicates to `duplicate_edges` seamlessly.
  - Returns raw empty bounds `{}` dynamically the moment cyclic deadlocks (e.g., `X->Y->Z->X`) are encountered, preventing memory leaks!
- **Dynamic Identity Engine (JWT)**: Fully supersedes hardcoded `.env` files by securely capturing `user_id`, `email`, and `roll_number` natively in the client browser, injecting them globally into the API payload using verified `HS256` token encryption via `jose`.
- **Battle-Tested Resilience**: Fully equipped unit testing grid mapping explicit PDF scenarios alongside malicious randomized input fuzzing.
- **Premium Aesthetics**: Dark-mode terminal UI built functionally on Vanilla CSS architecture without bulky libraries.

---

## 💻 Tech Stack
- **API Engine**: Express.js / Node.js
- **Frontend Architecture**: React 18 / Vite / Vanilla CSS
- **Security / Auth**: `jsonwebtoken` (Backend), `jose` (Frontend)

---

## 🛠️ Testing Locally

### 1. Boot up the Backend
```bash
cd server
npm install
npm start
# Server listens dynamically on http://localhost:3001
```

### 2. Boot up the Client UI
```bash
cd client
npm install
npm run dev
# Vite runs instantly on http://localhost:5173
```

### 3. Native Test Suites
To verify the math algorithms processing graph theory rules against cyclic bounds, execute:
```bash
cd server
node processor.test.js
```

---

## ☁️ Deployment Specifications
- **API Base URL**: Automatically routes via `render.yaml` endpoints directly to Render environments.
- **Frontend URL**: Deploys statically through Vercel. Connect `VITE_API_URL` to your production host directly to natively resolve CORS.

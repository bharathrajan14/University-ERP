# University ERP

This is a university ERP application with a React front-end and a Node.js/Express back-end.

## Project Structure

```text
university-erp/
├── client/          # React + Vite client-side application
│   ├── src/         # Source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── assets/
│   └── ...
├── server/          # Node.js + Express server-side application
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── ...
├── .gitignore
└── README.md
```

## Running the Project

### Client
```bash
cd client
npm run dev
```

### Server
```bash
cd server
npm run dev # or nodemon index.js once entry file is added
```

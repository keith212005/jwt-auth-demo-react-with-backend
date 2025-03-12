## 🛠 Installation & Setup

### **1. Clone the Repository**

```sh
git clone https://github.com/your-username/jwt-auth-demo-react.git
cd jwt-auth-demo-react
```

### **2. Install Dependencies**

- **Frontend (React + Vite)**
  ```sh
  npm install
  ```
- **Backend (Express)**
  ```sh
  cd server
  npm install
  ```

### **3. Set Up Environment Variables**

#### **Backend (`server/.env`)**

Inside `server/`, create a `.env` file:

```env
PORT=5001
SECRET_KEY=mysecretkey
REFRESH_SECRET=myrefreshsecret
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

#### **Frontend (`.env`)**

Inside the root project folder (`jwt-auth-demo-react/`), create a `.env` file:

```env
VITE_API_URL=http://localhost:5001
VITE_APP_NAME=JWTAuthDemo
VITE_ENV=development
VITE_DEBUG=true
```

### **4. Start the Backend**

```sh
cd server
npm run dev
```

- The backend runs on **http://localhost:5001**

### **5. Start the Frontend**

```sh
npm run dev
```

- The frontend runs on **http://localhost:5173**

### **6. Login Credentials for Testing**

```
Username: test
Password: password
```

---

## 🔐 Authentication Flow

1. **User logs in** with username & password.
2. Server issues:
   - **Access Token** (short-lived, stored in state)
   - **Refresh Token** (HTTP-only cookie for security)
3. When the **access token expires**, the frontend **automatically fetches a new one** using the refresh token.
4. User stays logged in until they **logout** or the refresh token expires.

---

## 🏗 API Endpoints

### **User Authentication**

| Method | Endpoint   | Description                                                                 |
| ------ | ---------- | --------------------------------------------------------------------------- |
| POST   | `/login`   | Authenticates user and returns JWT access token & refresh token in a cookie |
| POST   | `/refresh` | Generates a new access token using refresh token from cookies               |
| POST   | `/logout`  | Clears refresh token and logs out the user                                  |

### **Protected Routes**

| Method | Endpoint     | Description                                           |
| ------ | ------------ | ----------------------------------------------------- |
| GET    | `/protected` | Access protected data (requires a valid access token) |

---

## ⚡ Running Frontend & Backend Together

To run both backend and frontend in a **single command**, install `concurrently`:

```sh
npm install concurrently
```

Then, update `package.json` scripts:

```json
"scripts": {
  "start": "concurrently \"npm run dev --prefix server\" \"npm run dev\""
}
```

Now, start both with:

```sh
npm start
```

---

## 📌 Notes

- **Access token is stored in React state** (not localStorage for security reasons).
- **Refresh token is stored in HTTP-only cookies** (not accessible by JavaScript).
- **Environment variables** are used in both frontend and backend (`.env` files must be set up correctly).
- Designed for **secure authentication** with **automatic token refresh**.

---

## 🎯 Future Improvements

- ✅ User registration & password hashing
- ✅ Role-based authentication (admin, user)
- ✅ Token revocation & logout across devices

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

🔥 **Happy coding!** 🚀

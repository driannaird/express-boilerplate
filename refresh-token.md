Berikut adalah implementasi autentikasi berbasis token dengan **Access Token** dan **Refresh Token** menggunakan **Express.js** untuk backend dan **React.js** untuk frontend.

---

## **Backend: Express.js**

1. **Install Dependencies**

   ```bash
   npm init -y
   npm install express jsonwebtoken dotenv bcrypt cors cookie-parser
   ```

2. **Buat File `server.js`**

   ```javascript
   const express = require("express");
   const jwt = require("jsonwebtoken");
   const dotenv = require("dotenv");
   const bcrypt = require("bcrypt");
   const cors = require("cors");
   const cookieParser = require("cookie-parser");

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(express.json());
   app.use(
     cors({
       origin: "http://localhost:3000",
       credentials: true,
     })
   );
   app.use(cookieParser());

   // Dummy user data
   const users = [
     {
       id: 1,
       username: "user1",
       password: bcrypt.hashSync("password123", 10), // Hashed password
     },
   ];

   // Token generation functions
   const generateAccessToken = (user) => {
     return jwt.sign(
       { id: user.id, username: user.username },
       process.env.ACCESS_TOKEN_SECRET,
       {
         expiresIn: "15m", // Access Token expires in 15 minutes
       }
     );
   };

   const generateRefreshToken = (user) => {
     return jwt.sign(
       { id: user.id, username: user.username },
       process.env.REFRESH_TOKEN_SECRET,
       {
         expiresIn: "7d", // Refresh Token expires in 7 days
       }
     );
   };

   // Refresh token store
   let refreshTokens = [];

   // Login route
   app.post("/login", (req, res) => {
     const { username, password } = req.body;
     const user = users.find((u) => u.username === username);

     if (!user || !bcrypt.compareSync(password, user.password)) {
       return res.status(401).json({ message: "Invalid username or password" });
     }

     const accessToken = generateAccessToken(user);
     const refreshToken = generateRefreshToken(user);
     refreshTokens.push(refreshToken);

     // Set refresh token in HttpOnly cookie
     res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       secure: false, // Use true in production with HTTPS
       sameSite: "strict",
     });

     res.json({ accessToken });
   });

   // Token refresh route
   app.post("/refresh", (req, res) => {
     const refreshToken = req.cookies.refreshToken;

     if (!refreshToken || !refreshTokens.includes(refreshToken)) {
       return res.status(403).json({ message: "Refresh token is invalid" });
     }

     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
       if (err)
         return res.status(403).json({ message: "Token expired or invalid" });

       const accessToken = generateAccessToken({
         id: user.id,
         username: user.username,
       });
       res.json({ accessToken });
     });
   });

   // Logout route
   app.post("/logout", (req, res) => {
     const refreshToken = req.cookies.refreshToken;
     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

     res.clearCookie("refreshToken");
     res.json({ message: "Logged out successfully" });
   });

   // Protected route
   app.get("/protected", (req, res) => {
     const authHeader = req.headers.authorization;
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) return res.status(401).json({ message: "Unauthorized" });

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
       if (err)
         return res.status(403).json({ message: "Token expired or invalid" });
       res.json({ message: "Protected content", user });
     });
   });

   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Buat File `.env`**

   ```
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

   Kamu bisa membuat secret token menggunakan perintah:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

---

## **Frontend: React.js**

1. **Install React Project**

   ```bash
   npx create-react-app react-refresh-token
   cd react-refresh-token
   npm install axios
   ```

2. **Update `src/App.js`**

   ```javascript
   import React, { useState } from "react";
   import axios from "axios";

   const API_URL = "http://localhost:5000";

   function App() {
     const [accessToken, setAccessToken] = useState(null);
     const [protectedData, setProtectedData] = useState(null);

     const login = async () => {
       try {
         const response = await axios.post(
           `${API_URL}/login`,
           {
             username: "user1",
             password: "password123",
           },
           { withCredentials: true }
         );

         setAccessToken(response.data.accessToken);
       } catch (error) {
         console.error("Login failed", error.response.data);
       }
     };

     const fetchProtectedData = async () => {
       try {
         const response = await axios.get(`${API_URL}/protected`, {
           headers: { Authorization: `Bearer ${accessToken}` },
         });
         setProtectedData(response.data);
       } catch (error) {
         if (error.response.status === 403) {
           // Token expired, refresh token
           try {
             const refreshResponse = await axios.post(
               `${API_URL}/refresh`,
               {},
               { withCredentials: true }
             );
             setAccessToken(refreshResponse.data.accessToken);
           } catch (refreshError) {
             console.error("Token refresh failed", refreshError.response.data);
           }
         } else {
           console.error("Access failed", error.response.data);
         }
       }
     };

     const logout = async () => {
       try {
         await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
         setAccessToken(null);
         setProtectedData(null);
       } catch (error) {
         console.error("Logout failed", error.response.data);
       }
     };

     return (
       <div style={{ padding: "20px" }}>
         <h1>Token-Based Authentication with Refresh Token</h1>
         {!accessToken ? (
           <button onClick={login}>Login</button>
         ) : (
           <>
             <button onClick={fetchProtectedData}>Access Protected Data</button>
             <button onClick={logout}>Logout</button>
           </>
         )}
         {protectedData && <pre>{JSON.stringify(protectedData, null, 2)}</pre>}
       </div>
     );
   }

   export default App;
   ```

---

## **Menjalankan Proyek**

1. Jalankan backend:

   ```bash
   node server.js
   ```

2. Jalankan frontend:
   ```bash
   npm start
   ```

---

## **Cara Uji Coba**

1. Klik tombol **"Login"** di frontend untuk mendapatkan access token.
2. Klik tombol **"Access Protected Data"** untuk mengakses endpoint yang membutuhkan token.
3. Jika access token habis, frontend akan otomatis menggunakan refresh token untuk mendapatkan token baru.
4. Klik **"Logout"** untuk keluar dan menghapus token.

---

## **Penjelasan**

- **Access Token**: Token berumur pendek (15 menit) digunakan untuk autentikasi.
- **Refresh Token**: Token berumur panjang (7 hari) digunakan untuk mendapatkan access token baru.
- **Cookie**: Refresh token disimpan di cookie HTTP-only untuk keamanan.
- **Axios**: Menangani permintaan ke server, termasuk penyegaran token.

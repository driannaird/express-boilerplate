Berikut adalah contoh implementasi **OAuth2 authentication** menggunakan **Google** sebagai penyedia layanan OAuth. Backend menggunakan **Express.js** dan frontend menggunakan **React.js**.

---

### **Backend: Express.js**

1. **Install Dependencies**

   ```bash
   npm init -y
   npm install express passport passport-google-oauth20 express-session dotenv cors
   ```

2. **Buat File `server.js`**

   ```javascript
   const express = require("express");
   const session = require("express-session");
   const passport = require("passport");
   const GoogleStrategy = require("passport-google-oauth20").Strategy;
   const dotenv = require("dotenv");
   const cors = require("cors");

   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(
     cors({
       origin: "http://localhost:3000", // React frontend
       credentials: true,
     })
   );

   app.use(
     session({
       secret: process.env.SESSION_SECRET || "your_session_secret",
       resave: false,
       saveUninitialized: false,
     })
   );

   app.use(passport.initialize());
   app.use(passport.session());

   // Configure Passport with Google OAuth2
   passport.use(
     new GoogleStrategy(
       {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: "http://localhost:5000/auth/google/callback",
       },
       (accessToken, refreshToken, profile, done) => {
         done(null, profile); // Pass the Google profile to the session
       }
     )
   );

   passport.serializeUser((user, done) => {
     done(null, user);
   });

   passport.deserializeUser((user, done) => {
     done(null, user);
   });

   // Google OAuth Routes
   app.get(
     "/auth/google",
     passport.authenticate("google", { scope: ["profile", "email"] })
   );

   app.get(
     "/auth/google/callback",
     passport.authenticate("google", {
       successRedirect: "http://localhost:3000",
       failureRedirect: "/auth/failed",
     })
   );

   app.get("/auth/failed", (req, res) => {
     res.status(401).send("Authentication failed");
   });

   app.get("/auth/logout", (req, res) => {
     req.logout((err) => {
       if (err) return res.status(500).send("Logout failed");
       res.redirect("http://localhost:3000");
     });
   });

   app.get("/auth/user", (req, res) => {
     if (req.isAuthenticated()) {
       res.json(req.user);
     } else {
       res.status(401).send("Not authenticated");
     }
   });

   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Buat File `.env`**

   ```
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   **Cara Mendapatkan Google Client ID dan Secret**:

   - Buka [Google Developer Console](https://console.developers.google.com/).
   - Buat Project Baru atau gunakan yang sudah ada.
   - Aktifkan **Google OAuth2.0** di **APIs & Services**.
   - Tambahkan credential OAuth2 dengan **Authorized Redirect URI**: `http://localhost:5000/auth/google/callback`.

---

### **Frontend: React.js**

1. **Install Dependencies**

   ```bash
   npx create-react-app react-oauth
   cd react-oauth
   npm install axios
   ```

2. **Update `src/App.js`**

   ```javascript
   import React, { useState, useEffect } from "react";
   import axios from "axios";

   const API_URL = "http://localhost:5000";

   function App() {
     const [user, setUser] = useState(null);

     useEffect(() => {
       checkUser();
     }, []);

     const checkUser = async () => {
       try {
         const response = await axios.get(`${API_URL}/auth/user`, {
           withCredentials: true,
         });
         setUser(response.data);
       } catch (error) {
         setUser(null);
       }
     };

     const handleGoogleLogin = () => {
       window.location.href = `${API_URL}/auth/google`;
     };

     const handleLogout = async () => {
       try {
         await axios.get(`${API_URL}/auth/logout`, {
           withCredentials: true,
         });
         setUser(null);
       } catch (error) {
         console.error("Error logging out", error);
       }
     };

     return (
       <div style={{ padding: "20px" }}>
         <h1>Google OAuth Authentication</h1>
         {!user ? (
           <div>
             <button onClick={handleGoogleLogin}>Login with Google</button>
           </div>
         ) : (
           <div>
             <h2>Welcome, {user.displayName}</h2>
             <img
               src={user.photos[0].value}
               alt="Profile"
               style={{ borderRadius: "50%" }}
             />
             <button onClick={handleLogout}>Logout</button>
           </div>
         )}
       </div>
     );
   }

   export default App;
   ```

---

### **Menjalankan Proyek**

1. **Jalankan Backend**

   ```bash
   node server.js
   ```

2. **Jalankan Frontend**
   ```bash
   npm start
   ```

---

### **Cara Uji Coba**

1. Klik tombol **"Login with Google"** di frontend.
2. Google OAuth akan meminta izin akses.
3. Setelah login berhasil, informasi pengguna akan ditampilkan di halaman frontend.
4. Klik tombol **"Logout"** untuk keluar.

---

### **Penjelasan**

- **Google OAuth2** digunakan untuk autentikasi, dengan `passport-google-oauth20` menangani alur otentikasi.
- **Session** digunakan untuk menyimpan status login pengguna di server.
- **React.js** mengatur UI dan berinteraksi dengan backend menggunakan `axios`.

Metode ini aman karena token sensitif tidak disimpan di frontend. Cocok untuk aplikasi yang membutuhkan autentikasi pihak ketiga.

Berikut adalah contoh implementasi **session-based authentication** menggunakan **Express.js** sebagai backend dan **React.js** sebagai frontend.

---

### **Backend: Express.js**

1. **Install Dependencies**

   ```bash
   npm init -y
   npm install express express-session bcryptjs body-parser cors dotenv
   ```

2. **Buat File `server.js`**

   ```javascript
   const express = require("express");
   const session = require("express-session");
   const bcrypt = require("bcryptjs");
   const bodyParser = require("body-parser");
   const cors = require("cors");
   require("dotenv").config();

   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(bodyParser.json());
   app.use(
     cors({
       origin: "http://localhost:3000", // React frontend
       credentials: true, // Allow cookies to be sent
     })
   );

   // Konfigurasi session
   app.use(
     session({
       secret: process.env.SESSION_SECRET || "your_secret_key",
       resave: false,
       saveUninitialized: false,
       cookie: {
         secure: false, // Set to true for HTTPS
         httpOnly: true,
         maxAge: 1000 * 60 * 60, // 1 hour
       },
     })
   );

   const users = []; // Simpan user sementara (gunakan database pada implementasi nyata).

   // Register
   app.post("/register", async (req, res) => {
     const { email, password } = req.body;

     if (users.some((user) => user.email === email)) {
       return res.status(400).json({ message: "Email already exists" });
     }

     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = { id: users.length + 1, email, password: hashedPassword };
     users.push(newUser);

     res.json({ message: "User registered successfully" });
   });

   // Login
   app.post("/login", async (req, res) => {
     const { email, password } = req.body;
     const user = users.find((u) => u.email === email);

     if (!user || !(await bcrypt.compare(password, user.password))) {
       return res.status(401).json({ message: "Invalid credentials" });
     }

     // Simpan informasi user ke session
     req.session.user = { id: user.id, email: user.email };
     res.json({ message: "Login successful" });
   });

   // Cek Login
   app.get("/check-login", (req, res) => {
     if (req.session.user) {
       res.json({ loggedIn: true, user: req.session.user });
     } else {
       res.json({ loggedIn: false });
     }
   });

   // Logout
   app.post("/logout", (req, res) => {
     req.session.destroy((err) => {
       if (err) {
         return res.status(500).json({ message: "Logout failed" });
       }
       res.clearCookie("connect.sid"); // Hapus cookie session
       res.json({ message: "Logout successful" });
     });
   });

   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Buat File `.env`**
   ```
   SESSION_SECRET=your_session_secret
   ```

---

### **Frontend: React.js**

1. **Install Dependencies**

   ```bash
   npx create-react-app react-session-auth
   cd react-session-auth
   npm install axios
   ```

2. **Update `src/App.js`**

   ```javascript
   import React, { useState, useEffect } from "react";
   import axios from "axios";

   const API_URL = "http://localhost:5000";

   function App() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [user, setUser] = useState(null);

     useEffect(() => {
       checkLoginStatus();
     }, []);

     const checkLoginStatus = async () => {
       try {
         const response = await axios.get(`${API_URL}/check-login`, {
           withCredentials: true,
         });
         setIsLoggedIn(response.data.loggedIn);
         setUser(response.data.user || null);
       } catch (error) {
         console.error("Error checking login status", error);
       }
     };

     const handleRegister = async () => {
       try {
         await axios.post(`${API_URL}/register`, { email, password });
         alert("User registered successfully");
       } catch (error) {
         alert(error.response?.data?.message || "Error occurred");
       }
     };

     const handleLogin = async () => {
       try {
         await axios.post(
           `${API_URL}/login`,
           { email, password },
           { withCredentials: true }
         );
         alert("Login successful");
         checkLoginStatus();
       } catch (error) {
         alert(error.response?.data?.message || "Error occurred");
       }
     };

     const handleLogout = async () => {
       try {
         await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
         alert("Logout successful");
         setIsLoggedIn(false);
         setUser(null);
       } catch (error) {
         console.error("Error logging out", error);
       }
     };

     return (
       <div style={{ padding: "20px" }}>
         <h1>Session-Based Authentication</h1>

         {!isLoggedIn ? (
           <div>
             <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               style={{ display: "block", marginBottom: "10px" }}
             />
             <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               style={{ display: "block", marginBottom: "10px" }}
             />
             <button onClick={handleRegister}>Register</button>
             <button onClick={handleLogin} style={{ marginLeft: "10px" }}>
               Login
             </button>
           </div>
         ) : (
           <div>
             <h2>Welcome, {user?.email}</h2>
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

1. Daftar pengguna menggunakan email dan password.
2. Login untuk membuat session.
3. Status login akan dicek menggunakan endpoint `/check-login`.
4. Logout untuk menghapus session.

Metode ini menggunakan **Express.js session** untuk menyimpan status pengguna di server, sementara React mengatur interaksi dengan backend menggunakan cookie. Cocok untuk aplikasi tradisional berbasis server-rendered.

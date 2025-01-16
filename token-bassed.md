Berikut adalah contoh program sederhana menggunakan **Express.js** (sebagai backend) dan **React.js** (sebagai frontend) untuk implementasi **token-based authentication** dengan **JWT (JSON Web Token)**:

---

### **Backend: Express.js**

1. **Install Dependencies**

   ```bash
   npm init -y
   npm install express jsonwebtoken bcryptjs body-parser cors dotenv
   ```

2. **Buat File `server.js`**

   ```javascript
   const express = require("express");
   const jwt = require("jsonwebtoken");
   const bcrypt = require("bcryptjs");
   const bodyParser = require("body-parser");
   const cors = require("cors");
   require("dotenv").config();

   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(bodyParser.json());
   app.use(cors());

   const users = []; // Simpan user secara sederhana (gunakan database pada implementasi nyata).

   const generateToken = (user) => {
     return jwt.sign(
       { id: user.id, email: user.email },
       process.env.JWT_SECRET,
       {
         expiresIn: "1h",
       }
     );
   };

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

     const token = generateToken(user);
     res.json({ token });
   });

   // Protected Route
   app.get("/protected", (req, res) => {
     const token = req.headers.authorization?.split(" ")[1];
     if (!token) return res.status(401).json({ message: "No token provided" });

     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
       if (err) return res.status(403).json({ message: "Invalid token" });

       res.json({ message: "Welcome to the protected route!", user: decoded });
     });
   });

   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Buat File `.env`**
   ```
   JWT_SECRET=your_jwt_secret_key
   ```

---

### **Frontend: React.js**

1. **Install Dependencies**

   ```bash
   npx create-react-app react-token-auth
   cd react-token-auth
   npm install axios
   ```

2. **Update `src/App.js`**

   ```javascript
   import React, { useState } from "react";
   import axios from "axios";

   const API_URL = "http://localhost:5000";

   function App() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [token, setToken] = useState("");
     const [message, setMessage] = useState("");

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
         const response = await axios.post(`${API_URL}/login`, {
           email,
           password,
         });
         setToken(response.data.token);
         alert("Login successful");
       } catch (error) {
         alert(error.response?.data?.message || "Error occurred");
       }
     };

     const accessProtectedRoute = async () => {
       try {
         const response = await axios.get(`${API_URL}/protected`, {
           headers: { Authorization: `Bearer ${token}` },
         });
         setMessage(response.data.message);
       } catch (error) {
         alert(error.response?.data?.message || "Access denied");
       }
     };

     return (
       <div style={{ padding: "20px" }}>
         <h1>Token-Based Authentication</h1>
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
         <hr />
         <button onClick={accessProtectedRoute}>Access Protected Route</button>
         {message && <p>{message}</p>}
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
2. Login untuk mendapatkan token.
3. Gunakan token untuk mengakses route terproteksi (`/protected`).

Aplikasi ini memberikan gambaran sederhana token-based authentication menggunakan Express.js dan React.js. Untuk produksi, Anda disarankan menggunakan database dan middleware untuk meningkatkan keamanan.

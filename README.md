# SEAcompfest


# SEAcompfest – SEA Catering Web App 🍽️

SEAcompfest adalah aplikasi web untuk layanan **SEA Catering**, yang menyediakan **makanan sehat customizable** dengan sistem langganan, dashboard user & admin, dan testimoni pelanggan.  
Project ini dikembangkan dalam rangka **Software Engineering Academy – COMPFEST 17**.

---

FE masih menggunakan data dari local storage belum dimasukkan kedalam BE ke DB sehingga harus membuat 1 user pertama sebagai admin dahulu dan buat 1 user dummy untuk "customer" lalu fitur lainnya bisa berjalan dengan sebagaimana mestinya walaupun belum dihubungkan dengan backend


## ✨ Fitur Utama

✅ Registrasi & Login (dengan role Buyer/Seller/Admin)  
✅ Dashboard pelanggan untuk mengatur meal plan & pesanan  
✅ Dashboard admin untuk mengelola menu & pesanan  
✅ Fitur testimoni pelanggan (review dan carousel)  
✅ Real-time data dengan Supabase PostgreSQL  
✅ API backend dengan Express.js (FE belum fetch dengan BE dengan benar)
✅ Frontend modern dengan React + Vite + Tailwind CSS  
✅ Deployment di Vercel (namun masih blank) 

---

## ⚙️ Tech Stack

- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** Supabase PostgreSQL
- **Deployment:** Vercel

---

## 🚀 Cara Menjalankan Lokal

1. **Clone repository**

    ```bash
    git clone https://github.com/MichaelWjy/SEAcompfest.git
    cd SEAcompfest
    ```

2. **Install dependencies**

    ```bash
    # Frontend
    cd Frontend
    npm install

    # Backend
    cd ../Backend
    npm install
    ```

3. **Buat file `.env`**

    Di folder `Backend`, buat file `.env` berisi:
    ```
    DB_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    ```

4. **Jalankan backend**

    ```bash
    npm start
    ```

5. **Jalankan frontend**

    Buka terminal baru:
    ```bash
    cd Frontend
    npm run dev
    ```

6. Buka `http://localhost:5173` di browser.

---

## 🤝 Kontribusi

1. Fork repo ini.
2. Buat branch baru: `git checkout -b feature/fitur-baru`
3. Commit perubahan: `git commit -m "Tambah fitur baru"`
4. Push ke branch: `git push origin feature/fitur-baru`
5. Buat Pull Request.

---

> SEA Catering — Makan Sehat, Hidup Hebat! 🌱✨

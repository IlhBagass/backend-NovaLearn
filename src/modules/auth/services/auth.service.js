// src/modules/auth/services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sql } from '../../../config/db.js'; // Mengambil jembatan koneksi Neon DB

export const registerUser = async (student_id,admin_id,email ,name, password, kelas, major, years, valid_thru, role) => {
  // 1. Cek NIM
  const existingUser = await sql`SELECT * FROM "User" WHERE student_id = ${student_id}`;
  if (existingUser.length > 0) {
    throw new Error('NIM ini sudah terdaftar di dalam sistem kami!');
  }

  if (!password || typeof password !== "string") {
    throw new Error("Password tidak valid / kosong");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Generate ID unik
  const newId = crypto.randomBytes(5).toString('hex').toUpperCase(); 
  
  const result = await sql`
    INSERT INTO "User" (
      id, student_id,admin_id , email, name, password, kelas, major, years, valid_thru, role
    )
    VALUES (
      ${newId}, ${student_id},${admin_id} , ${email}, ${name}, ${hashedPassword}, ${kelas}, ${major}, ${years}, ${valid_thru}, ${role}
    )
    RETURNING id, student_id,admin_id , email, name, kelas, major, years, valid_thru, role
  `;

  return result[0];
};

export const showUser = async (student_id) => {
  // Hanya ambil kolom yang diperlukan (Tanpa Password)
  const result = await sql`
    SELECT id, student_id, name, kelas, major, years, valid_thru, role,email 
    FROM "User" 
    WHERE student_id = ${student_id}
  `;
  
  // Jika user ditemukan, ambil data pertama. Jika tidak, return null.
  return result.length > 0 ? result[0] : null;
};

export const showAllUser = async () =>{
   const result = await sql `
   SELECT id, student_id, name, kelas, major, valid_thru, role,email
   FROM "User"
   ORDER BY "createdAt" DESC`
   
   return result
}

export const deleteUser = async (student_id) => {
  // Gunakan RETURNING agar data yang dihapus bisa ditampilkan di respon
  const result = await sql`
    DELETE FROM "User"
    WHERE student_id = ${student_id}
    RETURNING id, student_id, name
  `;

  // Karena student_id unik, kita ambil data pertama [0] jika ada
  return result.length > 0 ? result[0] : null;
};

export const loginUser = async (student_id, password) => {
  // 1. Cari user berdasarkan student_id
  const users = await sql`SELECT * FROM "User" WHERE student_id = ${student_id}`;
  if (users.length === 0) throw new Error('NIM tidak ditemukan!');

  const user = users[0];

  // 2. Cek password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Password salah!');

  // 3. Buat Token JWT
  const token = jwt.sign(
    { student_id: user.student_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      student_id: user.student_id,
      name: user.name
    }
  };
};

export const updateUsers = async(student_id,dataBaru) => {
  const {name,kelas,major,years,valid_thru,role} = dataBaru;

  const result = await sql`UPDATE "User"
  SET 
    name = ${name},
    kelas = ${kelas},
    major = ${major},
    years = ${years},
    valid_thru = ${valid_thru},
    role = ${role}
    WHERE student_id = ${student_id}
    
    RETURNING id, student_id,name, kelas, major, years ,valid_thru, role`

    return result.length > 0 ? result[0] : null;
};
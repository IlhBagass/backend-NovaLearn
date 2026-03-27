// src/modules/auth/controllers/auth.controllers.js
import * as service from "../services/auth.service.js"; // Pastikan ejaannya benar (tanpa 's')

export const login = async (request, reply) => {
  try {
    const { student_id, password } = request.body;
    const dataLogin = await service.loginUser(student_id, password);
    return reply.send({ status: 'success', data: dataLogin });
  } catch (error) {
    return reply.code(401).send({ status: 'error', message: error.message });
  }
};

export const register = async (request, reply) => {
  try {
    // Menangkap data dari Postman / Frontend
    const { student_id,admin_id, email ,name, password, kelas, major, years, valid_thru, role,updatedAt } = request.body;
    
    // Melempar data ke Service untuk diproses dan disimpan ke Neon DB
    const dataRegister = await service.registerUser(student_id,admin_id,email ,name, password, kelas, major, years, valid_thru, role, updatedAt);

    // Mengembalikan jawaban sukses ke layar
    return reply.code(201).send({
      status: 'success',
      message: 'Registrasi berhasil! Data tersimpan',
      data: dataRegister
    });
  } catch (error) {
    // Jika NIM sudah ada, akan masuk ke sini
    return reply.code(400).send({ status: 'error', message: error.message });
  }
};

export const getProfile = async (request, reply) => {
  try {
    const { student_id } = request.params; 
    const user = await service.showUser(student_id);
    
    if (!user) {
      return reply.code(404).send({ status: 'error', message: 'User tidak ditemukan' });
    }

    return reply.send({ status: 'success', data: user });
  } catch (error) {
    return reply.code(500).send({ status: 'error', message: error.message });
  }
};

export const listAllUsers = async (request, reply) => {
  try {
    const users = await service.showAllUser();
    
    return reply.send({
      status: 'success',
      total: users.length, // Tambahkan info jumlah data agar informatif
      data: users
    });
  } catch (error) {
    return reply.code(500).send({ 
      status: 'error', 
      message: error.message 
    });
  }
};

// src/modules/auth/controllers/auth.controllers.js
export const removeUser = async (request, reply) => {
  try {
    // 1. Ambil student_id dari params (HARUS SAMA dengan di route)
    const { student_id } = request.params; 

    // 2. Kirim ke service
    const deletedData = await service.deleteUser(student_id);

    if (!deletedData) {
      return reply.code(404).send({
        status: 'error',
        message: 'Gagal menghapus! User tidak ditemukan atau ID salah.'
      });
    }

    return reply.send({ status: 'success', message: 'User Berhasil dihapus' });
  } catch (error) {
    return reply.code(500).send({ status: 'error', message: error.message });
  }
};

export const updateUser = async (request,reply) => {
    try{
      const { student_id } = request.params;
      const dataBaru = request.body;

      const updateData = await service.updateUsers(student_id,dataBaru);

      if (!updateData){
        return reply.code(404).send({
          status : 'error',
          message : 'mahasiswa tidak ada di dalam database'
        });
      }

      return reply.send({
        status : 'success',
        message : 'data berhasil di update',
        data : updateData
      })
    }catch(error){
      return reply.code(500).send({ status : 'error', message: error.message });
    }
}
import * as service from "../services/course.service.js"

import { uploadImageToCloudinary } from "../../../utils/upload.js"; 

export const addCourse = async(request, reply) => {
    try {
        const parts = request.parts(); 
        const body = {};
        let thumbnailUrl = null;

        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'thumbnail') {
                const uploadResult = await uploadImageToCloudinary(part.file);
                thumbnailUrl = uploadResult.secure_url; 
            } else {
                body[part.fieldname] = part.value;
            }
        }

        const { name_course, description, kelas, teacher } = body;

        if (!thumbnailUrl) {
            return reply.code(400).send({ 
                status: "error", 
                message: "Thumbnail gambar wajib diupload!" 
            });
        }

        const dataCourse = await service.createCourse(name_course, description, thumbnailUrl, kelas, teacher);

        return reply.code(201).send({
            status: "success",
            message: "Berhasil ditambahkan ke database",
            data: dataCourse
        });
    } catch(error) {
        return reply.code(500).send({ status: "error", message: error.message });
    }
}

export const showCourse = async(request,reply) => {
    try{
        const AllData = await service.showCourse();

        return reply.code(200).send({
            status : "success",
            total : AllData.length,
            data : AllData
        })
    }catch(error){
        return reply.code(500).send({
            status: "error",
            message: error.message
        });
    }
}

export const deleteCourse = async(request,reply) => {
    try{

        const { name_course }= request.params;

        const deleteData = await service.deleteCourse(name_course);

        if (!deleteData) {
        return reply.code(404).send({
            status: 'error',
            message: 'Gagal menghapus! User tidak ditemukan atau ID salah.'
        });
        }
        
        return reply.send({ status: 'success', message: 'User Berhasil dihapus' });
    }catch(error){
        return reply.code(401).send({status : "error",message: error.message })
    }

}

export const showOnly = async(request,reply) => {
    try{
        const {name_course} = request.params;

        const data = await service.showOnly(name_course);   

        if(!data || data.length == 0){
            return reply.code(404).send({
                status : "error",
                message : "data anda tidak ditemukan"
            })
        }

        return reply.code(200).send({
            status : "success",
            data : data
        })
    }catch (error){
        return reply.code(401).send({status: "error", message: error.message});
    }
}

export const update = async(requets,reply) => {
    const { id } = requets.params
    const dataBaru = requets.body
    
    const newData = await service.updateCourse(id,dataBaru);

    if (!newData){
        reply.code(400).send({
            status : "error",
            message : "maaf data yang anda masukkan tidak ada"
        })
    }

    reply.code(201).send({
        status : "success",
        message : "berhasil menambahkan data",
        data : newData
    })
}

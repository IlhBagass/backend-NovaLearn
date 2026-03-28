import * as service from "../services/course.service.js"

import { uploadImageToCloudinary } from "../../../utils/upload.js"; 

const parseCoursePayload = async (request, { thumbnailRequired = false } = {}) => {
    const body = {};
    let thumbnailUrl = null;

    if (request.isMultipart()) {
        const parts = request.parts();

        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'thumbnail') {
                const uploadResult = await uploadImageToCloudinary(part.file);
                thumbnailUrl = uploadResult.secure_url;
            } else {
                body[part.fieldname] = part.value;
            }
        }
    } else {
        Object.assign(body, request.body);
        thumbnailUrl = request.body?.thumbnail ?? null;
    }

    if (thumbnailRequired && !thumbnailUrl) {
        throw new Error("Thumbnail gambar wajib diupload!");
    }

    return { body, thumbnailUrl };
};

export const addCourse = async(request, reply) => {
    try {
        const { body, thumbnailUrl } = await parseCoursePayload(request, {
            thumbnailRequired: true
        });

        const { name_course, description, kelas, teacher } = body;

        const dataCourse = await service.createCourse(name_course, description, thumbnailUrl, kelas, teacher);

        return reply.code(201).send({
            status: "success",
            message: "Berhasil ditambahkan ke database",
            data: dataCourse
        });
    } catch(error) {
        if (error.message === "Thumbnail gambar wajib diupload!") {
            return reply.code(400).send({
                status: "error",
                message: error.message
            });
        }

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

export const update = async(request,reply) => {
    try {
        const { id } = request.params;
        const { body, thumbnailUrl } = await parseCoursePayload(request);
        const dataBaru = {
            ...body,
            ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {})
        };
        
        const newData = await service.updateCourse(id, dataBaru);

        if (!newData){
            return reply.code(404).send({
                status : "error",
                message : "maaf data yang anda masukkan tidak ada"
            });
        }

        return reply.code(200).send({
            status : "success",
            message : "berhasil mengubah data",
            data : newData
        });
    } catch (error) {
        return reply.code(500).send({
            status: "error",
            message: error.message
        });
    }
}

import * as service from "../services/course.service.js"

export const addCoourse = async(request,reply)=>{
    try{
        const {name_course,description,thumbnail} = request.body;

        const dataCourse = await service.createCourse(name_course,description,thumbnail);

        return reply.code(201).send({
            status : "success",
            message : "berhasil ditambahkan ke database",
            data : dataCourse
        });
    }catch(error){
        return reply.code(401).send({status : "error ",message : error.message})
    }
}

export const showCourse = async(request,reply) => {
    const AllData = await service.showCourse();

    return reply.code(201).send({
        status : "success",
        total : AllData.length,
        data : AllData
    })
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

        return reply.code(201).send({
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
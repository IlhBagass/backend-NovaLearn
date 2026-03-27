import * as service from "../service/modul.service.js"

export const addModule = async(request,reply)=>{
    try{
        const {name_module,link_video,description} = request.body;

        const dataModul = await service.addModule(name_module,link_video,description)

        return reply.code(201).send({
            status : "success",
            message : "data anda berhasil ditambahkan",
            data : dataModul
        })
    }catch(error){
        return reply.code(401).send({
            status : "error",
            message: error.message
        })
    }

}

export const showModul = async(request,reply)=>{
    try{
        const dataModul = await service.showModul();

        return reply.code(201).send({
            status:"success",
            jumlah : dataModul.length,
            data:dataModul
        })
    }catch(error){
        return reply.code(401).send({status:"error",message: error.message})
    }
    
}

export const showModulBy = async(request,reply)=>{

    try{
        const {name_module}= request.params;

        const dataModul =await service.showModulBy(name_module)

        return reply.code(201).send({
            status:"success",
            data: dataModul
        })
    }catch(error){
        return reply.code(401).send({status:"error",message: error.message})
    }
}

export const deleteModule = async(request,reply)=>{
    try{
        const {name_module}= request.params;

        await service.deleteModul(name_module);

        return reply.code(201).send({
            status:"success",
            message: "berhasil dihapus"
        })

    }catch(error){
        return reply.code(401).send({
            status: "error",
            message: error.message
        })
    }
}

export const updateModul = async(request,reply)=>{
    try{
        const data_baru = request.body;
        const {name_module} = request.params;

        const updateModule = await service.updateModul(name_module,data_baru);

        return reply.code(201).send({
            status: "succes",
            message: "data anda berhasil ter Update",
            update : updateModule
        })
    }catch(error){
        return reply.code(401).send({
            status:"error",
            message: error.message
        })
    }
}

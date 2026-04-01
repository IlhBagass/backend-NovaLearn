import * as service from "../service/modul.service.js"
import { uploadFileToCloudinary } from "../../../utils/upload.js";

const parseModulePayload = async (request) => {
    const body = {};
    let materiUrl = null;

    if (request.isMultipart()) {
        const parts = request.parts();

        for await (const part of parts) {
            if (part.type === "file" && part.fieldname === "materi") {
                const uploadResult = await uploadFileToCloudinary(part.file, {
                    folder: "novalearn/modules/materi",
                    resourceType: "auto",
                });
                materiUrl = uploadResult.secure_url;
            } else {
                body[part.fieldname] = part.value;
            }
        }
    } else {
        Object.assign(body, request.body);
        materiUrl = request.body?.link_materi ?? null;
    }

    return {
        body,
        materiUrl,
    };
};

export const addModule = async(request,reply)=>{
    try{
        const { body, materiUrl } = await parseModulePayload(request);
        const {name_module,link_video,description,course_id} = body;
        const finalMateriUrl = materiUrl ?? body.link_materi ?? null;

        const dataModul = await service.addModule(
            name_module,
            link_video,
            description,
            course_id,
            finalMateriUrl
        )

        return reply.code(201).send({
            status : "success",
            message : "data anda berhasil ditambahkan",
            data : dataModul
        })
    }catch(error){
        return reply.code(400).send({
            status : "error",
            message: error.message
        })
    }

}

export const showModul = async(request,reply)=>{
    try{
        const dataModul = await service.showModul();

        return reply.code(200).send({
            status:"success",
            jumlah : dataModul.length,
            data:dataModul
        })
    }catch(error){
        return reply.code(500).send({status:"error",message: error.message})
    }
    
}

export const showModulByCourse = async(request,reply)=>{
    try{
        const {course_id}= request.params;

        const dataModul = await service.showModulByCourse(course_id)

        return reply.code(200).send({
            status:"success",
            jumlah: dataModul.length,
            data: dataModul
        })
    }catch(error){
        return reply.code(404).send({status:"error",message: error.message})
    }
}

export const showModulBy = async(request,reply)=>{

    try{
        const {name_module}= request.params;

        const dataModul =await service.showModulBy(name_module)

        return reply.code(200).send({
            status:"success",
            data: dataModul
        })
    }catch(error){
        return reply.code(404).send({status:"error",message: error.message})
    }
}

export const deleteModule = async(request,reply)=>{
    try{
        const {name_module}= request.params;

        await service.deleteModul(name_module);

        return reply.code(200).send({
            status:"success",
            message: "berhasil dihapus"
        })

    }catch(error){
        return reply.code(404).send({
            status: "error",
            message: error.message
        })
    }
}

export const updateModul = async(request,reply)=>{
    try{
        const { body, materiUrl } = await parseModulePayload(request);
        const {name_module} = request.params;
        const data_baru = {
            ...body,
            ...(materiUrl ? { link_materi: materiUrl } : {})
        };

        const updateModule = await service.updateModul(name_module,data_baru);

        return reply.code(200).send({
            status: "succes",
            message: "data anda berhasil ter Update",
            update : updateModule
        })
    }catch(error){
        return reply.code(400).send({
            status:"error",
            message: error.message
        })
    }
}

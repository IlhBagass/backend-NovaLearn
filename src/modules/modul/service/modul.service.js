import { error } from "console";
import { sql } from "../../../config/db.js"
import crypto from "crypto"


// cek dlu yak baru lanjut
export const addModule = async(name_module,link_video,description,course_id) =>{
    const newId = crypto.randomBytes(3).toString('hex').toUpperCase();

    const available = await sql`SELECT * FROM modul WHERE name_module = ${name_module}`;

    if (available.length > 0){
        throw new error('Maaf modul ini sudah terdaftar');
    }

    const exsistingCourse = await sql`
    SELECT id FROM course
    WHERE id = ${course_id}`

    if (exsistingCourse.length == 0){
        throw new Error("course tidak di temukan")
    }

    const result = await sql`
        INSERT INTO modul (
        id,name_module,link_video,description,created_at,course_id) 
        VALUES (
        ${newId},${name_module},${link_video},${description},NOW(),${course_id})
        RETURNING id,name_module,link_video,description,created_at,course_id`

    return result[0];
};

export const showModul = async() => {
    const result = await sql`
    SELECT id,name_module,link_video,description FROM modul ORDER BY created_at DESC`

    return result;
}

export const showModulBy = async(name_module)=>{
    const result = await sql`
    SELECT id,name_module,link_video,description
    FROM modul WHERE name_module = ${name_module}`

    if(result.length==0){
       throw new Error('Maaf modul ini belum terdaftar');
    }

    return result.length > 0 ? result[0] : null;
}

export const deleteModul = async(name_modul)=>{
    const result = await sql`
    DELETE FROM modul
    WHERE name_module = ${name_modul}
    returning id,name_module,link_video,description`

    if(result.length==0){
       throw new Error('Maaf modul ini belum terdaftar');
    }

    return result.length > 0 ? result[0] : null;
}

export const updateModul = async(name_modul,data_baru) =>{
    const {link_video,description} = data_baru;

    const result = await sql`UPDATE modul
    SET
        link_video = ${link_video},
        description = ${description}

    WHERE name_module = ${name_modul}
    
    RETURNING link_video, description`

    if (result.length == 0){
        throw new Error("maaf data anda tidak ditemukan")
    }

    return result.length > 0 ? result[0] : null;
}

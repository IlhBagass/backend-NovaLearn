import { sql } from "../../../config/db.js"
import crypto from "crypto"

const findCourseById = async (courseId) => {
    const result = await sql`
    SELECT id, name_course
    FROM course
    WHERE id = ${courseId}`

    return result.length > 0 ? result[0] : null;
};

export const addModule = async(name_module,link_video,description,course_id,link_materi) =>{
    if (!name_module || !link_video || !description || !course_id) {
        throw new Error("name_module, link_video, description, dan course_id wajib diisi");
    }

    const newId = crypto.randomBytes(3).toString('hex').toUpperCase();

    const available = await sql`
    SELECT id FROM modul
    WHERE name_module = ${name_module} AND course_id = ${course_id}`;

    if (available.length > 0){
        throw new Error('Modul dengan nama tersebut sudah terdaftar di course ini');
    }

    const exsistingCourse = await findCourseById(course_id);
    if (!exsistingCourse){
        throw new Error("course tidak di temukan")
    }

    const result = await sql`
        INSERT INTO modul (
        id,name_module,link_video,description,created_at,course_id,link_materi) 
        VALUES (
        ${newId},${name_module},${link_video},${description},NOW(),${course_id},${link_materi})
        RETURNING id,name_module,link_video,description,created_at,course_id,link_materi`

    return result[0];
};

export const showModul = async() => {
    const result = await sql`
    SELECT
        m.id,
        m.name_module,
        m.link_video,
        m.description,
        m.created_at,
        m.course_id,
        m.link_materi,
        c.name_course
    FROM modul m
    JOIN course c ON c.id = m.course_id
    ORDER BY m.created_at DESC`

    return result;
}

export const showModulByCourse = async(course_id) => {
    const existingCourse = await findCourseById(course_id);

    if (!existingCourse) {
        throw new Error("course tidak di temukan");
    }

    const result = await sql`
    SELECT
        m.id,
        m.name_module,
        m.link_video,
        m.description,
        m.created_at,
        m.course_id,
        m.link_materi,
        c.name_course
    FROM modul m
    JOIN course c ON c.id = m.course_id
    WHERE m.course_id = ${course_id}
    ORDER BY m.created_at DESC`;

    return result;
}

export const showModulBy = async(name_module)=>{
    const result = await sql`
    SELECT
        m.id,
        m.name_module,
        m.link_video,
        m.description,
        m.created_at,
        m.course_id,
        m.link_materi,
        c.name_course
    FROM modul m
    JOIN course c ON c.id = m.course_id
    WHERE m.name_module = ${name_module}`

    if(result.length==0){
       throw new Error('Maaf modul ini belum terdaftar');
    }

    return result.length > 0 ? result[0] : null;
}

export const deleteModul = async(name_modul)=>{
    const result = await sql`
    DELETE FROM modul
    WHERE name_module = ${name_modul}
    returning id,name_module,link_video,description,course_id,link_materi`

    if(result.length==0){
       throw new Error('Maaf modul ini belum terdaftar');
    }

    return result.length > 0 ? result[0] : null;
}

export const updateModul = async(name_modul,data_baru) =>{
    const existingModule = await sql`
    SELECT id,name_module,link_video,description,course_id,link_materi
    FROM modul
    WHERE name_module = ${name_modul}`;

    if (existingModule.length == 0){
        throw new Error("maaf data anda tidak ditemukan")
    }

    const currentModule = existingModule[0];
    const nextNameModule = data_baru.name_module ?? currentModule.name_module;
    const nextLinkVideo = data_baru.link_video ?? currentModule.link_video;
    const nextDescription = data_baru.description ?? currentModule.description;
    const nextCourseId = data_baru.course_id ?? currentModule.course_id;
    const nextLinkMateri = data_baru.link_materi ?? currentModule.link_materi;

    const exsistingCourse = await findCourseById(nextCourseId);
    if (!exsistingCourse){
        throw new Error("course tidak di temukan")
    }

    if (
        nextNameModule !== currentModule.name_module ||
        nextCourseId !== currentModule.course_id
    ) {
        const duplicateModule = await sql`
        SELECT id FROM modul
        WHERE name_module = ${nextNameModule}
        AND course_id = ${nextCourseId}
        AND id != ${currentModule.id}`;

        if (duplicateModule.length > 0) {
            throw new Error('Modul dengan nama tersebut sudah terdaftar di course ini');
        }
    }

    const result = await sql`UPDATE modul
    SET
        name_module = ${nextNameModule},
        link_video = ${nextLinkVideo},
        description = ${nextDescription},
        course_id = ${nextCourseId},
        link_materi = ${nextLinkMateri}

    WHERE name_module = ${name_modul}
    
    RETURNING id,name_module,link_video,description,course_id,link_materi`

    return result.length > 0 ? result[0] : null;
}

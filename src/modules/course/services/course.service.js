import crypto from 'crypto';
import { sql } from '../../../config/db.js';

export const createCourse = async (name_course,description,thumbnail,kelas,teacher) => {

    const exsistingCourse = await sql`SELECT * FROM course WHERE name_course = ${name_course}`

    if (exsistingCourse.length > 0 ){
        throw new Error('Couse ini sudah dibuat')
    }

    const newId = crypto.randomBytes(3).toString('hex').toUpperCase();

    const result = await sql`
    INSERT INTO course (
    id,
    name_course,
    description,
    kelas,
    thumbnail,teacher) VALUES (${newId},${name_course},${description},${kelas},${thumbnail},${teacher})
    RETURNING id,name_course,description,thumbnail,kelas,teacher
    `;

    return result[0];
}

export const showCourse = async() => {
    
    const result = await sql`SELECT * FROM course`

    return result;
}

export const deleteCourse = async(name_course) => {
    
    const result = await sql`
    DELETE FROM course WHERE name_course = ${name_course}
    RETURNING name_course`

    return result.length > 0 ? result[0] : null;
}

export const showOnly = async(name_course) =>{
    
    const result = await sql`
    SELECT * FROM course
    WHERE name_course = ${name_course}`

    return result;
}

export const updateCourse = async(id,dataBaru) => {
    const { name_course, description, thumbnail,kelas } = dataBaru;

    const result = await sql`
    UPDATE course
    SET
        name_course = ${name_course},
        description = ${description},
        thumbnail = ${thumbnail},
        kelas = ${kelas}
    WHERE id = ${id}
    RETURNING id,name_course,description,thumbnail,kelas`
    
    return result.length > 0 ? result[0] : null;
};

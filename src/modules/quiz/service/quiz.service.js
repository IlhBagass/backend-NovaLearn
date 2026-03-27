import {sql} from "../../../config/db.js"
import crypto from "crypto"

export const addQuiz = async(title,module_id)=>{
    const checkquiz = await sql`
    SELECT title FROM daily_quiz WHERE title = ${title}`

    if(checkquiz.length > 0){
        throw new Error("Nama quiz telah di gunakan")
    }

    const checkIdModule = await sql`
    SELECT id FROM modul WHERE id = ${module_id}`

    if(checkIdModule.length == 0){
        throw new Error("Data modul tidak di temukan")
    }
    
    const newId = crypto.randomBytes(3).toString('hex').toUpperCase()
    
    const addData = await sql`
    INSERT INTO daily_quiz (id,title,module_id)
    VALUES (${newId},${title},${module_id})
    RETURNING id,title,module_id`

    return addData[0];
}

export const addQuestion = async(soal,j_a,j_b,j_c,j_d,jawaban,quiz_id)=>{
    const checkQuiz = await sql`
    SELECT id FROM daily_quiz 
    WHERE id = ${quiz_id}`

    if(checkQuiz.length == 0){
        throw new Error("id quiz anda salah")
    }

    const newId = crypto.randomBytes(3).toString('hex').toUpperCase();

    const result = await sql`
    INSERT INTO daily_question 
    (id, soal, j_a, j_b, j_c ,j_d, jawaban ,quiz_id)
    VALUES (${newId}, ${soal}, ${j_a}, ${j_b}, ${j_c}, ${j_d}, ${jawaban},${quiz_id})
    RETURNING id, soal, j_a, j_b, j_c ,j_d, jawaban,quiz_id`

    return result[0];
} 

export const showAnswerQuestion = async(quiz_id) =>{
    const newQuizId = quiz_id.trim().toUpperCase();

    const existingQuizId = await sql`
    SELECT id FROM daily_quiz
    WHERE id = ${quiz_id}`

    if (existingQuizId.length == 0){
        throw new Error("Data quiz soal tidak di temukan")
    }

    const showData = await sql`
    SELECT * FROM daily_question
    WHERE quiz_id = ${newQuizId}`

    return showData;
}

export const showQuiz = async() => {
    const dataQuiz = await sql`
    SELECT * FROM daily_quiz`

    return dataQuiz;
}

export const showQuestion = async(quiz_id)=>{
    const newQuizId = quiz_id.trim().toUpperCase();

    const result= await sql`
    SELECT soal,j_a,j_b,j_c,j_d FROM daily_question WHERE quiz_id = ${newQuizId}`

    if (result.length === 0) {
        return {
            message: "Soal belum tersedia",
            data: []
        }
    }   
    return result;
}




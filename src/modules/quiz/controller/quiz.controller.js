import * as service from "../service/quiz.service.js"

export const addQuiz = async(request,reply)=>{
    try{
        const { title,module_id }= request.body;

        const addData = await service.addQuiz(title,module_id)
        
        return reply.code(201).send({
            status : "success",
            message : "data anda berhasil ditambahkan",
            data: addData
        })
    }catch(error){
        return reply.code(401).send({
            message: "error",
            message : error.message
        })
    }

}

export const addQQuestion = async(request,reply)=>{
    try{
        const { soal, j_a, j_b, j_c ,j_d, jawaban, quiz_id}= request.body;

        const addData = await service.addQuestion(soal, j_a, j_b, j_c ,j_d, jawaban,quiz_id)
        
        return reply.code(201).send({
            status : "success",
            message : "data anda berhasil ditambahkan",
            data: addData
        })
    }catch(error){
        return reply.code(401).send({
            message: "error",
            message : error.message
        })
    }

}

export const showAnswerQuestion = async(request,reply) => {
    
    const {quiz_id}= request.params;

    const dataQustion = await service.showAnswerQuestion(quiz_id);
    
    return reply.code(201).send({
        status: "success",
        data : dataQustion
    })
}

export const showQuestion = async(request,reply) => {
    
    const {quiz_id}= request.params;

    const dataQustion = await service.showQuestion(quiz_id);
    
    return reply.code(201).send({
        status: "success",
        data : dataQustion
    })
}

export const showQuiz = async(request,reply) => {

    const dataQuiz = await service.showQuiz();
    
    return reply.code(201).send({
        status: "success",
        data : dataQuiz
    })
}
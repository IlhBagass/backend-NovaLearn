import * as controller from "../quiz/controller/quiz.controller.js"

export default async function (app) {
    app.post ("/add/question", controller.addQQuestion)
    app.post ("/add/quiz", controller.addQuiz)

    app.get("/show/question/:quiz_id", controller.showQuestion)
    app.get("/show/answer/:quiz_id", controller.showAnswerQuestion)
    app.get("/show", controller.showQuiz)
}
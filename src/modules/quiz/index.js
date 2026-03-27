import quizRoute from "../quiz/quiz.route.js"

export default async function (app) {
    app.register(quizRoute)
}
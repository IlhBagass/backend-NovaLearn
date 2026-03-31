import * as controller from './controller/annnc.controller.js';

export default async function (app) {
    app.post('/add', controller.createAnnouncement);

    app.get('/show', controller.getAllAnnouncements);

    app.delete('/delete/:id', controller.deleteAnnouncement);

    app.put('/update/:id', controller.updateAnnouncement);
}
import * as service from '../services/annc.service.js';

export const createAnnouncement = async (request, reply) => {
    try{
        const { title, content, is_active, published, expired } = request.body;
        const result = await service.createAnnouncement(title, content, is_active, published, expired);

        reply.code(201).send({status: 'success', data: result});
    }catch(err){
        reply.code(500).send({status: 'error', message: err.message});
    }
}

export const getAllAnnouncements = async (request, reply) => {
    try{
        const result = await service.getAllAnnouncements();
        reply.code(200).send({status: 'success', data: result});
    }catch(err){
        reply.code(500).send({status: 'error', message: err.message});
    }
}

export const deleteAnnouncement = async (request, reply) => {
    try{
        const { id } = request.params;
        const result = await service.deleteAnnouncement(id);

        if(!result){
            reply.code(404).send({status: 'error', message: 'Announcement not found'});
            return;
        }

        reply.code(200).send({status: 'success', message: 'Announcement deleted successfully'});
    }catch(err){
        reply.code(500).send({status: 'error', message: err.message});
    }
}

export const updateAnnouncement = async (request, reply) => {
    try{
        const { id } = request.params;
        const { title, content, is_active, published, expired } = request.body;
        const result = await service.updateAnnouncement(id, title, content, is_active, published, expired); 
        reply.code(200).send({status: 'success', data: result});
    }catch(err){
        reply.code(500).send({status: 'error', message: err.message});
    }
}
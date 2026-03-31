import crypto from 'crypto';

import { sql } from '../../../config/db.js';

export const createAnnouncement = async (title, content, is_active,published,expired) => {
    const existingAnnouncement = await sql`
        SELECT * FROM announcement WHERE title = ${title}
    `;

    if (existingAnnouncement.length > 0) {
        throw new Error('Announcement with this title already exists');
    }

    const newId = crypto.randomBytes(3).toString('hex').toUpperCase();
    const result = await sql`
        INSERT INTO announcement (id, title, content, is_active, published, expired)
        VALUES (${newId}, ${title}, ${content}, ${is_active}, ${published}, ${expired})
        RETURNING *
    `;
    return result[0];
}

export const getAllAnnouncements = async () => {
    const result = await sql`
        SELECT * FROM announcement
    `;
    return result;
}

export const deleteAnnouncement = async (id) => {
    const result = await sql`
        DELETE FROM announcement WHERE id = ${id} RETURNING *
    `;
    return result[0];
}
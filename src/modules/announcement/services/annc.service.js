import crypto from 'crypto';

import { sql } from '../../../config/db.js';

export const createAnnouncement = async (title, content, is_active,published,expired) => {
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
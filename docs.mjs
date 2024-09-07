import openDb from './db/database.mjs';

const documents = {
    getAll: async function getAll() {
        let db = await openDb();

        try {
            return await db.all('SELECT rowid as id, * FROM documents');
        } catch (e) {
            console.error(e);

            return [];
        } finally {
            await db.close();
        }
    },

    getOne: async function getOne(id) {
        let db = await openDb();

        try {
            const result = await db.get('SELECT * FROM documents WHERE rowid=?', id);

            return result;
        } catch (e) {
            console.error(e);

            return {};
        } finally {
            await db.close();
        }
    },

    addOne: async function addOne(body) {
        let db = await openDb();

        try {
            return await db.run(
                'INSERT INTO documents (title, content) VALUES (?, ?)',
                body.title,
                body.content,
            );
        } catch (e) {
            console.error(e);
        } finally {
            await db.close();
        }
    },

    updateOne: async function updateOne(body) {
        let db = await openDb();

        try {
            return await db.run(
                'UPDATE documents SET title = ?, content = ? WHERE rowid = ?',
                body.title,
                body.content,
                body.id
            );
        } catch (e) {
            console.error(e);
        } finally {
            await db.close();
        }
    }
};

export default documents;

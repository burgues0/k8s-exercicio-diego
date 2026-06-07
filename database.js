import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PWD,
        database: process.env.PG_DB
    },
    pool: {
        min: 1,
        max: 10
    }
});

export default db;
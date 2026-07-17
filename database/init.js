import dotenv from "dotenv";
dotenv.config();

import pool from "./db.js";

async function init() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS history (
                id SERIAL PRIMARY KEY,
                command TEXT,
                input TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("historyテーブル作成完了");

    } catch (error) {

        console.error("テーブル作成エラー:", error);

    } finally {

        await pool.end();

    }

}

init();
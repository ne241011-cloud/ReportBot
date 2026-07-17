import dotenv from "dotenv";
dotenv.config();

import pool from "./database/db.js";

console.log("① プログラム開始");

try {

    console.log("② DBへ接続します");

    const result = await pool.query("SELECT NOW();");

    console.log("③ 接続成功");
    console.log(result.rows);

} catch (error) {

    console.log("④ エラー発生");
    console.error(error);

}

console.log("⑤ 終了");

process.exit();
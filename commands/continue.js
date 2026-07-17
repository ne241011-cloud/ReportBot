import dotenv from "dotenv";
dotenv.config();

import { replyLong } from "../utils/discord.js";
import { generateText } from "../utils/gemini.js";
import pool from "../database/db.js";

export default {

    data: {
        name: "continue",
    },


    async execute(interaction) {

        const id = interaction.options.getInteger("id");

        await interaction.deferReply();


        try {

            // 指定された履歴を取得
            const result = await pool.query(
                `
                SELECT *
                FROM history
                WHERE id = $1
                `,
                [id]
            );


            if (result.rows.length === 0) {

                await interaction.editReply(
                    "指定された履歴が見つかりませんでした。"
                );

                return;

            }


            const history = result.rows[0];


            const prompt = `

あなたは大学生向けレポート作成支援AIです。

以下は過去の相談履歴です。

テーマ：
${history.input}

過去の回答：
${history.response}


この相談をさらに発展させるために、

1. 前回の内容の整理
2. 深掘りできる新しい視点
3. レポートで使える考察案

を提案してください。

ただ改善案を出すだけではなく、
過去の相談内容を踏まえた説明をしてください。
最後は質問形式で終わらせず、
提案内容のまとめで終了してください。

`;
const text = await generateText(prompt);


            await replyLong(
                interaction,
                `📚 過去の相談を再開します\n\n${text}`
            );


        } catch(error){

            console.error(error);

            await interaction.editReply(
                "過去の相談内容を取得できませんでした。時間を置いてもう一度試してください。"
            );

        }

    },

};
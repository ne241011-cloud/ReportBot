import dotenv from "dotenv";
dotenv.config();

import { replyLong } from "../utils/discord.js";
import { generateText } from "../utils/gemini.js";
import pool from "../database/db.js";

export default {

    data: {
        name: "summary",
    },

    async execute(interaction) {

        const text = interaction.options.getString("text");

        await interaction.deferReply();

        try {

            const prompt = `
あなたは大学生の学習を支援するアシスタントです。

以下の文章を、大学生が理解しやすいように要約してください。

文章：
${text}

以下の形式で回答してください。

📖 わかりやすい要約

・文章全体の内容を簡潔に説明

重要なポイント：
・重要な点を3つ程度

レポートで活用する場合：
・どのような観点で利用できるか説明
`;

            // Geminiで生成
            const result = await generateText(prompt);

            // Discordへ返信
            await replyLong(interaction, result);

            // DBへ保存
            try {

                await pool.query(
                    `
                    INSERT INTO history
                    (command, input, response)
                    VALUES ($1, $2, $3)
                    `,
                    [
                        "summary",
                        text,
                        result
                    ]
                );

            } catch (dbError) {

                console.error("DB保存失敗:", dbError);

            }

        } catch (error) {

            console.error(error);

            await interaction.editReply(
"文章の要約中にエラーが発生しました。入力内容を確認して、もう一度試してください。"
            );

        }

    },

};
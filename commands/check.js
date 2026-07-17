import dotenv from "dotenv";
dotenv.config();

import { replyLong } from "../utils/discord.js";
import { generateText } from "../utils/gemini.js";
import pool from "../database/db.js";

export default {

    data: {
        name: "check",
    },

    async execute(interaction) {

        const text = interaction.options.getString("text");

        await interaction.deferReply();

        try {

            const prompt = `
あなたは大学レポートの添削経験が豊富な教員です。

以下の文章を確認し、大学レポートとして改善できる点を指摘してください。

文章：
${text}

以下の形式で回答してください。

📝 添削結果

良い点：
・文章の良い部分を1〜2個挙げる

改善点：
・内容、構成、表現について改善できる点を挙げる

修正版の例：
・必要に応じて、より自然な文章例を示す

※文章の内容を否定するのではなく、より説得力のあるレポートにするための助言をしてください。
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
                        "check",
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
                "文章の添削中にエラーが発生しました。時間を置いて再度試してください。"
            );

        }

    },

};
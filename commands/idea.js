import dotenv from "dotenv";
dotenv.config();

import { replyLong } from "../utils/discord.js";
import { generateText } from "../utils/gemini.js";
import pool from "../database/db.js";

export default {

    data: {
        name: "idea",
    },

    async execute(interaction) {

        const theme = interaction.options.getString("theme");

        await interaction.deferReply();

        try {

            const prompt = `
あなたは大学生向けのレポート作成支援AIです。

以下のテーマについて、レポートの構成案を提案してください。

テーマ：
${theme}

以下の形式で回答してください。

1. はじめに
2. 内容①
3. 内容②
4. 具体例
5. まとめ

各項目には1〜2文程度の説明も付けてください。
`;

            const result = await generateText(prompt);

            // Discordへ返信
            await replyLong(interaction, result);

            // DB保存（失敗してもBotは止めない）
            try {

                await pool.query(
                    `
                    INSERT INTO history
                    (command, input, response)
                    VALUES ($1, $2, $3)
                    `,
                    [
                        "idea",
                        theme,
                        result
                    ]
                );

            } catch (dbError) {

                console.error("DB保存失敗:", dbError);

            }

        } catch (error) {

            console.error(error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("レポート構成案の生成中にエラーが発生しました。時間を置いてもう一度試してください。");
            } else {
                await interaction.reply("レポート構成案の生成中にエラーが発生しました。時間を置いてもう一度試してください。");
            }

        }

    },

};
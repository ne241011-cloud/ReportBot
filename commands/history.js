import dotenv from "dotenv";
dotenv.config();

import pool from "../database/db.js";
import { replyLong } from "../utils/discord.js";

export default {

    data: {
        name: "history",
    },

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const result = await pool.query(
                `
                SELECT id, command, input, created_at
                FROM history
                ORDER BY created_at DESC
                LIMIT 5
                `
            );


            if (result.rows.length === 0) {

                await interaction.editReply(
                    "📚 まだ相談履歴がありません。"
                );

                return;

            }


            let message = "📚 過去の相談履歴\n\n";


            result.rows.forEach((row) => {

                message +=
`${row.id}.
コマンド：${row.command}
内容：${row.input}
日時：${row.created_at}

`;

            });


            await interaction.editReply(message);


        } catch (error) {

            console.error(error);

            await interaction.editReply(
                "履歴取得中にエラーが発生しました。"
            );

        }

    },

};
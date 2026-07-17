import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { replyLong } from "../utils/discord.js";

export default {

    data: {
        name: "help",
    },

    async execute(interaction) {

        await interaction.reply(
`📚 ReportBotの使い方

/idea
レポート構成を提案します

/check
文章を添削します

/summary
文章を要約します

/history
過去の相談履歴を表示します

/continue
前回の相談の続きを行います`
        );

    },

};
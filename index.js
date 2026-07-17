import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Client, Events, GatewayIntentBits } from "discord.js";

import helpCommand from "./commands/help.js";
import ideaCommand from "./commands/idea.js";
import summaryCommand from "./commands/summary.js";
import checkCommand from "./commands/check.js";
import historyCommand from "./commands/history.js";
import continueCommand from "./commands/continue.js";

const app = express();
const port = process.env.PORT || 3000;



app.get("/", (req, res) => {
    res.send("ReportBot is running!");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Web server listening on port ${port}`);
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// コマンド一覧
const commands = [
    {
        name: "help",
        description: "ReportBotの使い方を表示します",
    },
    {
        name: "idea",
        description: "レポート構成を提案します",
        options: [
            {
                name: "theme",
                description: "レポートのテーマ",
                type: 3, // STRING
                required: true,
            },
        ],
    },
    {
    name: "check",
    description: "文章を添削します",
    options: [
        {
            name: "text",
            description: "添削したい文章",
            type: 3,
            required: true,
        },
    ],
    },
    {
    name: "summary",
    description: "文章や資料を分かりやすく要約します",
    options: [
        {
            name: "text",
            description: "要約したい文章",
            type: 3,
            required: true,
        },
    ],
    },
    {
    name: "history",
    description: "過去の相談履歴を表示します",
    },
    {
    name: "continue",
    description: "過去の相談を再開します",
    options: [
        {
            name: "id",
            description: "再開したい履歴ID",
            type: 4, // INTEGER
            required: true,
        },
    ],
    },
];

// コマンド管理
const commandMap = new Map([
    ["help", helpCommand],
    ["idea", ideaCommand],
    ["summary", summaryCommand],
    ["check", checkCommand],
    ["history", historyCommand],
    ["continue", continueCommand],
]);

client.once(Events.ClientReady, async (readyClient) => {

    await readyClient.application.commands.set(commands);

    console.log(`${readyClient.user.tag} としてログインしました`);
    console.log("Slash Command登録完了");

});

client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply("エラーが発生しました。");
        } else {
            await interaction.reply("エラーが発生しました。");
        }

    }

});

client.login(process.env.DISCORD_TOKEN);
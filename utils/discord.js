export async function replyLong(interaction, text) {

    const limit = 1900;

    // 1通で送れる場合
    if (text.length <= limit) {
        await interaction.editReply(text);
        return;
    }

    // 送信する総メッセージ数
    const totalPages = Math.ceil(text.length / limit);

    // 1通目
    await interaction.editReply(
        `**(1/${totalPages})**\n\n${text.slice(0, limit)}`
    );

    // 2通目以降
    let page = 2;
    let index = limit;

    while (index < text.length) {

        await interaction.followUp(
            `**(${page}/${totalPages})**\n\n${text.slice(index, index + limit)}`
        );

        index += limit;
        page++;
    }

}
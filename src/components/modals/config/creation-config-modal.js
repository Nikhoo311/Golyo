const ConfigModel = require("../../../schemas/config");
const { MessageFlags } = require("discord.js");

module.exports = {
    data: {
        name: "creation-config-modal"
    },
    async execute(interaction, client) {
        const configName = interaction.fields.getTextInputValue("config_name");
        const gameSelected = interaction.fields.getStringSelectValues("select_game_name")[0];

        await ConfigModel.create({
            name: configName,
            game: gameSelected
        })
        return await interaction.reply({ content: `✅ La configuration \`${configName}\` est crée avec succès !`, flags: [MessageFlags.Ephemeral] })
    }
}
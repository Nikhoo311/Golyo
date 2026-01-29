const { LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, MessageFlags } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");


const dayjs = require("dayjs");
require("dayjs/locale/fr");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    data: {
        name: "btn-choose-config",
        multi: "btn-choose-this-config"
    },

    async execute(interaction, client) {
        const { configs } = client;
        if (interaction.customId === "btn-choose-this-config") {
            const id = interaction.message.components[0].data.content.split("-# ")[1];
            const currentConfig = client.configs.get(id);

            try {
                const data = { configId: id };
                writeFileSync(path.join(__dirname, "../../../../config/chosen-config.json"), JSON.stringify(data, null, 4), "utf-8");
            } catch (error) {
                console.log(error);
                return await interaction.reply({ content: "❌ Une erreur est arrivé lors du choix de la config dans le fichier.", flags: [MessageFlags.Ephemeral] });
            }
            return interaction.reply({ content: `✅ La configuration \`${currentConfig.name}\` est choisi pour la création des saisons !`, flags: [MessageFlags.Ephemeral] });
        }

        if (configs.size >= 25) {
            return await interaction.reply({ content: "❌ Ce bouton ne permet pas de choisir une configuration car je dispose +25 de configurations.\n\nPour sélectionner une configuration précise, rendez-vous sur la fiche détaillée d'une configuration de saison et utilisez le bouton prévu à cet effet.", flags: [MessageFlags.Ephemeral] });
        }
        const gameFile = JSON.parse(readFileSync(path.join(__dirname, "../../../../config/games.json"), "utf-8"));

        const modal = new ModalBuilder()
            .setCustomId("choose-config-modal")
            .setTitle("Choisir une configuration");

        const select = new StringSelectMenuBuilder()
            .setCustomId("select_choose_config")
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Choisir un configuration...")
            .setRequired(true)
            .setOptions(
                 configs.map(config => {
                    const game = gameFile.find(g => g.name === config.game);

                    return new StringSelectMenuOptionBuilder()
                        .setLabel(config.name)
                        .setValue(config.id)
                        .setDescription(`Crée le ${dayjs(config.createdAt).format("D MMMM YYYY à HH:mm")}`)
                        .setEmoji(game?.emoji ?? "🎮");
                })
            )

        const selectLabel = new LabelBuilder()
            .setStringSelectMenuComponent(select)
            .setLabel("Choix de la configuration :");

        modal.addLabelComponents(selectLabel);
        
        return await interaction.showModal(modal);
    }
};
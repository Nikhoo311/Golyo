const { TextDisplayBuilder, ContainerBuilder, SeparatorBuilder, ActionRowBuilder, SeparatorSpacingSize, SectionBuilder, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRow, ButtonComponent, MessageFlags } = require("discord.js");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = {
    data: { 
        name: "choose-config-modal",
    },

    async execute(interaction, client) {
        const id = interaction.fields.getStringSelectValues("select_choose_config")[0];
        const configSelected = client.configs.get(id);
       
        try {
            const data = { configId: id };
            writeFileSync(path.join(__dirname, "../../../../config/chosen-config.json"), JSON.stringify(data, null, 4), "utf-8");
        } catch (error) {
            console.log(error);
            return await interaction.reply({ content: "❌ Une erreur est arrivé lors du choix de la config dans le fichier.", flags: [MessageFlags.Ephemeral] });
        }

        const oldContainer = interaction.message.components[0];
        const firstSection = new SectionBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder({ content: oldContainer.components[0].components[0].content }))
            .setButtonAccessory(ButtonBuilder.from(oldContainer.components[0].accessory.data));
        const buttonsIndex = oldContainer.components.findIndex(c => c instanceof ActionRow && c.components.some(comp => comp instanceof ButtonComponent));
        const buttons = [oldContainer.components[buttonsIndex-1], oldContainer.components[buttonsIndex]];
        
        const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);
        const container = new ContainerBuilder()
            .setAccentColor(oldContainer.data.accent_color)
            .addSectionComponents(firstSection)
            .addSeparatorComponents(separator)

        const selectRow = ActionRowBuilder.from(oldContainer.components[2]);
        
        container.addActionRowComponents(selectRow).addSeparatorComponents(separator);
        container.addTextDisplayComponents(new TextDisplayBuilder({content: buttons[0].data.content}));
        container.addActionRowComponents(ActionRowBuilder.from(buttons[1]));
        container.addSeparatorComponents(separator).addTextDisplayComponents(new TextDisplayBuilder({ content: `✅ La configuration \`${configSelected.name}\` est choisi pour la création des saisons !` }));
        
        return await interaction.update({ components: [container] });
        
    }
}
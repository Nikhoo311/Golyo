const { SlashCommandBuilder ,ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, EmbedBuilder } = require("discord.js");
const { color } = require("../../../config/config.json");

module.exports = {
    name: "profil",
    categorie: "Administation",
    active: true,
    data: new SlashCommandBuilder()
        .setName("profil")
        .setDescription('Voir le profil d\'un joueur')
        .addUserOption(option => 
            option.setName("joueur").setDescription("Mentionnez le joueur dont vous souhaitez consulter les statistiques").setRequired(false)
        ),

    async execute(interaction, client) {
        const user = interaction.options.getUser("joueur") || interaction.user;
        const rankEmojis =  {
            'IRON': "<:iron:1466876271073169530>", 'BRONZE': "", 'SILVER': "<:silver:1466876965113037025>", 'GOLD': "<:gold:1466876296293519622>",
            'PLATINUM': "<:platine:1466876863501570201>", 'EMERALD': "<:emeraude:1466876576821149908>", 'DIAMOND': "<:diamant:1466876173572378827>",
            'MASTER': "<:master:1466876240802615410>", 'GRANDMASTER': "<:grandmaster:1466876209127362845>", 'CHALLENGER': "<:challenger:1466875211571007680>",
            'UNRANKED': ""
        };
        try {
            const profile = client.manager.getPlayerProfile(user.id);
            console.log(profile);
            const embed = new EmbedBuilder()
                .setColor(color.orange)
                .setTitle(`📊 Stats classées – ${profile.gameName}`)
                .setDescription(`**Riot ID :** ${profile.riotId}`)
                .addFields(
                    { name: "🏆 Rang", value: `${rankEmojis[profile.tier]} ${profile.fullRank}`, inline: true },
                    { name: "⭐ LP", value: `${profile.leaguePoints} LP`, inline: true },
                    { name: "🎯 Rôle préféré", value: profile.preferredRole, inline: true },
                    { name: "💰 Valeur en points", value: `${profile.pointValue} pts`, inline: true },
                    { name: "Statistiques ranked globale", value: "\u200b"},
                    { name: "KDA moyen", value: `${profile.stats.kdaAverage}`, inline: true },
                    { name: "Poucentage de parties gagnées", value: `${profile.stats.winrate} %`, inline: true },
                    { name: "Nombre de parties jouer", value: `${profile.stats.gamesPlayed}`, inline: true },
                    { name: "Nombre de parties gagnées", value: `${profile.stats.wins}`, inline: true },
                    { name: "Nombre de parties perdues", value: `${profile.stats.losses}`, inline: true },
                    { name: "Statut", value: `${profile.availability === "AVAILABLE" ? "🟩 Disponible" : "🟥 Indisponible"}`},
                    { name: "Nombre de MVP total sur toutes les saisons", value: `${profile.mvpCount}`},
                )
                .setFooter({ text: `Discord ID : ${profile.discordId}` })
                .setTimestamp();
    
            return await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral]})
        } catch (error) {
            return interaction.reply({ content: `❌ ${error.message}`, flags: [MessageFlags.Ephemeral] });
        }
        
    }
}
const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  // Identifiants Discord
  discordId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Identifiants Riot
  riotId: {
    type: String,
    required: true,
    unique: true
  },
  gameName: String,
  tagLine: String,
  
  // Données Riot Games
  puuid: {
    type: String,
    unique: true,
    sparse: true
  },
  summonerId: String,
  accountId: String,
  
  // Informations de rang
  tier: {
    type: String,
    enum: ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER', 'UNRANKED'],
    default: 'UNRANKED'
  },
  rank: String,
  leaguePoints: {
    type: Number,
    default: 0
  },
  
  // Système de points
  pointValue: {
    type: Number,
    default: 8,
    min: 8,
    max: 50
  },
  
  // Rôle préféré
  preferredRole: {
    type: String,
    enum: ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FILL'],
    default: 'FILL'
  },
  
  // Statistiques globales
  stats: {
    winrate: {
      type: Number,
      default: 0
    },
    kdaAverage: {
      type: Number,
      default: 0
    },
    gamesPlayed: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
  },
  // Champions les plus joués (top 5)
  championPool: [{
    championName: String,
    championId: Number,
    gamesPlayed: Number,
    wins: Number,
    losses: Number,
    winrate: Number,
    averageKDA: Number
  }],

  judiciary: {
    warnings: {
      type: Number,
      default: 0
    },
    suspensions: {
      type: Number,
      default: 0
    },
    history: [{
      type: {
        type: String,
        enum: ['WARNING', 'SUSPENSION', 'FINE']
      },
      reason: String,
      date: { type: Date, default: Date.now },
      issuedBy: String
    }]
  },
  
  availability: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE', 'DRAFTED'],
    default: 'AVAILABLE'
  },
  
  mvpCount: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

// Index pour optimiser les recherches
PlayerSchema.index({ tier: 1, pointValue: 1 });
PlayerSchema.index({ availability: 1 });

module.exports = mongoose.model('player', PlayerSchema);
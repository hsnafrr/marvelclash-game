import type { Card } from "@/lib/stores/useCards";

/**
 * Card definitions for the tower defense card system
 */
export const cardData: Record<string, Omit<Card, 'id'>> = {
  // Basic Tower Cards
  basicTower: {
    name: "Basic Tower",
    description: "A simple tower that fires at enemies. Good damage and range for the cost.",
    type: "tower",
    cost: 50,
    stats: {
      damage: 25,
      range: 8,
      fireRate: 2
    },
    rarity: "common"
  },

  laserTower: {
    name: "Laser Tower",
    description: "Advanced tower with laser beams. Higher damage and fire rate than basic towers.",
    type: "tower", 
    cost: 100,
    stats: {
      damage: 40,
      range: 10,
      fireRate: 3
    },
    rarity: "uncommon"
  },

  missileTower: {
    name: "Missile Tower",
    description: "Launches explosive missiles that deal area damage. Slow but powerful.",
    type: "tower",
    cost: 150,
    stats: {
      damage: 80,
      range: 12,
      fireRate: 1,
      areaOfEffect: 3
    },
    rarity: "rare"
  },

  freezeTower: {
    name: "Freeze Tower",
    description: "Slows down enemies with freezing projectiles. Lower damage but useful utility.",
    type: "tower",
    cost: 120,
    stats: {
      damage: 15,
      range: 6,
      fireRate: 1.5
    },
    effect: "slow_enemies",
    rarity: "uncommon"
  },

  sniperTower: {
    name: "Sniper Tower",
    description: "Extreme range tower with high damage. Perfect for picking off strong enemies.",
    type: "tower",
    cost: 200,
    stats: {
      damage: 120,
      range: 20,
      fireRate: 0.5
    },
    rarity: "rare"
  },

  chainTower: {
    name: "Chain Lightning Tower",
    description: "Electricity jumps between enemies. Damage increases with more targets nearby.",
    type: "tower",
    cost: 175,
    stats: {
      damage: 35,
      range: 8,
      fireRate: 2
    },
    effect: "chain_lightning",
    rarity: "epic"
  },

  // Spell Cards
  damageSpell: {
    name: "Lightning Strike",
    description: "Deals damage to all enemies on the battlefield instantly.",
    type: "spell",
    cost: 30,
    stats: {
      damage: 50
    },
    effect: "damage_all",
    rarity: "common"
  },

  slowSpell: {
    name: "Time Warp",
    description: "Slows down all enemies for a short duration, making them easier to target.",
    type: "spell",
    cost: 25,
    effect: "slow_all",
    rarity: "common"
  },

  healSpell: {
    name: "Repair Nanobots",
    description: "Restores health to all towers and increases their damage temporarily.",
    type: "spell",
    cost: 40,
    effect: "heal_towers",
    rarity: "uncommon"
  },

  shieldSpell: {
    name: "Energy Shield",
    description: "Prevents the next 3 enemies from reaching the goal, regardless of your defenses.",
    type: "spell",
    cost: 60,
    effect: "shield_goal",
    rarity: "rare"
  },

  meteorSpell: {
    name: "Meteor Storm",
    description: "Calls down meteors that deal massive area damage across the battlefield.",
    type: "spell",
    cost: 80,
    stats: {
      damage: 150,
      areaOfEffect: 5
    },
    effect: "meteor_storm",
    rarity: "epic"
  },

  freezeSpell: {
    name: "Absolute Zero",
    description: "Freezes all enemies in place for several seconds, stopping their movement completely.",
    type: "spell",
    cost: 50,
    effect: "freeze_all",
    rarity: "rare"
  },

  // Upgrade Cards
  damageUpgrade: {
    name: "Weapon Enhancement",
    description: "Permanently increases damage of a selected tower by 50%.",
    type: "upgrade",
    cost: 40,
    stats: {
      damage: 15
    },
    rarity: "common"
  },

  rangeUpgrade: {
    name: "Targeting System",
    description: "Permanently increases range of a selected tower, allowing it to hit distant enemies.",
    type: "upgrade",
    cost: 35,
    stats: {
      range: 3
    },
    rarity: "common"
  },

  fireRateUpgrade: {
    name: "Overclocked Core",
    description: "Permanently increases fire rate of a selected tower, making it shoot faster.",
    type: "upgrade",
    cost: 45,
    stats: {
      fireRate: 1
    },
    rarity: "uncommon"
  },

  multiUpgrade: {
    name: "Multi-Target System",
    description: "Allows a tower to target multiple enemies simultaneously.",
    type: "upgrade",
    cost: 75,
    effect: "multi_target",
    rarity: "rare"
  },

  criticalUpgrade: {
    name: "Critical Strike Module",
    description: "Gives a tower a chance to deal double damage with critical hits.",
    type: "upgrade",
    cost: 60,
    effect: "critical_chance",
    rarity: "uncommon"
  },

  pierceUpgrade: {
    name: "Armor Piercing Rounds",
    description: "Tower projectiles ignore enemy armor and can pass through multiple enemies.",
    type: "upgrade",
    cost: 55,
    effect: "armor_pierce",
    rarity: "uncommon"
  },

  explosiveUpgrade: {
    name: "Explosive Ammunition",
    description: "Tower attacks gain area of effect damage, hitting nearby enemies.",
    type: "upgrade",
    cost: 70,
    stats: {
      areaOfEffect: 2
    },
    rarity: "rare"
  },

  // Legendary Cards
  omegaTower: {
    name: "Omega Destroyer",
    description: "The ultimate tower. Extreme damage, range, and fire rate. Costs a fortune but worth it.",
    type: "tower",
    cost: 500,
    stats: {
      damage: 200,
      range: 25,
      fireRate: 5,
      areaOfEffect: 4
    },
    rarity: "legendary"
  },

  nuclearSpell: {
    name: "Nuclear Strike",
    description: "Devastates the entire battlefield, eliminating all enemies instantly. Use with caution!",
    type: "spell",
    cost: 200,
    stats: {
      damage: 9999
    },
    effect: "nuclear_strike",
    rarity: "legendary"
  },

  ascensionUpgrade: {
    name: "Tower Ascension",
    description: "Evolves a tower to its ultimate form, dramatically improving all stats.",
    type: "upgrade",
    cost: 150,
    stats: {
      damage: 50,
      range: 5,
      fireRate: 2
    },
    effect: "tower_ascension",
    rarity: "legendary"
  },

  // Economic Cards
  moneySpell: {
    name: "Gold Rush",
    description: "Instantly gain a large amount of money to spend on towers and upgrades.",
    type: "spell",
    cost: 20,
    effect: "gain_money",
    rarity: "common"
  },

  interestUpgrade: {
    name: "Investment Portfolio",
    description: "Gain passive income each wave based on your current money reserves.",
    type: "upgrade",
    cost: 80,
    effect: "passive_income",
    rarity: "rare"
  },

  // Utility Cards
  repairSpell: {
    name: "Emergency Repair",
    description: "Instantly restores a damaged tower to full functionality and removes debuffs.",
    type: "spell",
    cost: 30,
    effect: "repair_tower",
    rarity: "common"
  },

  scanSpell: {
    name: "Enemy Scanner",
    description: "Reveals information about incoming enemies and their weaknesses.",
    type: "spell",
    cost: 15,
    effect: "scan_enemies",
    rarity: "common"
  },

  barrierSpell: {
    name: "Energy Barrier",
    description: "Creates a temporary wall that blocks enemy movement for a short time.",
    type: "spell",
    cost: 45,
    effect: "create_barrier",
    rarity: "uncommon"
  }
};

/**
 * Card rarity weights for random generation
 */
export const cardRarityWeights = {
  common: 50,     // 50% chance
  uncommon: 30,   // 30% chance  
  rare: 15,       // 15% chance
  epic: 4,        // 4% chance
  legendary: 1    // 1% chance
};

/**
 * Starting deck configuration
 */
export const startingDeck = [
  'basicTower',
  'basicTower', 
  'basicTower',
  'damageSpell',
  'damageSpell',
  'rangeUpgrade',
  'damageUpgrade',
  'laserTower'
];

/**
 * Get a random card based on rarity weights
 */
export function getRandomCard(): Omit<Card, 'id'> {
  const totalWeight = Object.values(cardRarityWeights).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedRarity: keyof typeof cardRarityWeights = 'common';
  
  for (const [rarity, weight] of Object.entries(cardRarityWeights)) {
    random -= weight;
    if (random <= 0) {
      selectedRarity = rarity as keyof typeof cardRarityWeights;
      break;
    }
  }
  
  // Filter cards by rarity
  const cardsOfRarity = Object.values(cardData).filter(card => card.rarity === selectedRarity);
  
  // Return random card of selected rarity
  const randomIndex = Math.floor(Math.random() * cardsOfRarity.length);
  return cardsOfRarity[randomIndex];
}

/**
 * Get cards by type
 */
export function getCardsByType(type: Card['type']): Array<Omit<Card, 'id'>> {
  return Object.values(cardData).filter(card => card.type === type);
}

/**
 * Get cards by rarity
 */
export function getCardsByRarity(rarity: Card['rarity']): Array<Omit<Card, 'id'>> {
  return Object.values(cardData).filter(card => card.rarity === rarity);
}

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useTowerDefense } from "./useTowerDefense";
import { cardData } from "../../data/cardData";
import * as THREE from "three";

export interface Card {
  id: string;
  name: string;
  description: string;
  type: 'tower' | 'spell' | 'upgrade';
  cost: number;
  stats?: {
    damage?: number;
    range?: number;
    fireRate?: number;
    areaOfEffect?: number;
  };
  effect?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface CardsState {
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  maxHandSize: number;
  
  // Actions
  initializeCards: () => void;
  drawCard: () => boolean;
  playCard: (cardId: string) => boolean;
  discardCard: (cardId: string) => void;
  shuffleDeck: () => void;
  addCardToDeck: (card: Card) => void;
  removeCardFromHand: (cardId: string) => void;
  playTowerCard: (card: Card) => boolean;
  playSpellCard: (card: Card) => boolean;
  playUpgradeCard: (card: Card) => boolean;
}

export const useCards = create<CardsState>()(
  subscribeWithSelector((set, get) => ({
    hand: [],
    deck: [],
    discardPile: [],
    maxHandSize: 7,

    initializeCards: () => {
      // Create starting deck
      const startingDeck = [
        ...Array(3).fill(null).map(() => ({ ...cardData.basicTower, id: `card-${Math.random()}` })),
        ...Array(2).fill(null).map(() => ({ ...cardData.damageSpell, id: `card-${Math.random()}` })),
        ...Array(2).fill(null).map(() => ({ ...cardData.rangeUpgrade, id: `card-${Math.random()}` })),
        ...Array(1).fill(null).map(() => ({ ...cardData.laserTower, id: `card-${Math.random()}` })),
      ];
      
      set({
        deck: [...startingDeck],
        hand: [],
        discardPile: []
      });
      
      // Draw initial hand
      for (let i = 0; i < 3; i++) {
        get().drawCard();
      }
      
      console.log("Card system initialized with starting deck");
    },

    drawCard: () => {
      const { hand, deck, discardPile, maxHandSize } = get();
      
      // Check if hand is full
      if (hand.length >= maxHandSize) {
        console.log("Cannot draw card - hand is full");
        return false;
      }
      
      // Check if player has enough money
      const { money } = useTowerDefense.getState();
      if (money < 10) {
        console.log("Cannot draw card - not enough money");
        return false;
      }
      
      let currentDeck = [...deck];
      
      // If deck is empty, shuffle discard pile into deck
      if (currentDeck.length === 0) {
        if (discardPile.length === 0) {
          console.log("No cards left to draw");
          return false;
        }
        
        currentDeck = [...discardPile];
        get().shuffleDeck();
        set({ deck: currentDeck, discardPile: [] });
      }
      
      // Draw the top card
      const cardToDraw = currentDeck[0];
      const newDeck = currentDeck.slice(1);
      const newHand = [...hand, cardToDraw];
      
      set({
        hand: newHand,
        deck: newDeck
      });
      
      // Deduct money
      useTowerDefense.getState().money -= 10;
      
      console.log(`Drew card: ${cardToDraw.name}`);
      return true;
    },

    playCard: (cardId) => {
      const { hand } = get();
      const card = hand.find(c => c.id === cardId);
      
      if (!card) {
        console.log("Card not found in hand");
        return false;
      }
      
      const { money } = useTowerDefense.getState();
      if (money < card.cost) {
        console.log("Not enough money to play card");
        return false;
      }
      
      // Execute card effect based on type
      let success = false;
      
      switch (card.type) {
        case 'tower':
          success = get().playTowerCard(card);
          break;
        case 'spell':
          success = get().playSpellCard(card);
          break;
        case 'upgrade':
          success = get().playUpgradeCard(card);
          break;
      }
      
      if (success) {
        // Remove card from hand and deduct cost
        get().removeCardFromHand(cardId);
        useTowerDefense.setState(state => ({ money: state.money - card.cost }));
        
        console.log(`Played card: ${card.name}`);
        return true;
      }
      
      return false;
    },

    playTowerCard: (card: Card) => {
      // For now, place tower at a random valid position
      // In a full implementation, this would involve player selection
      const positions = [
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(5, 0, 0),
        new THREE.Vector3(-5, 0, 10),
        new THREE.Vector3(5, 0, 10),
        new THREE.Vector3(-5, 0, -10),
        new THREE.Vector3(5, 0, -10),
      ];
      
      const { towers } = useTowerDefense.getState();
      const availablePositions = positions.filter(pos => 
        !towers.some(tower => tower.position.distanceTo(pos) < 2)
      );
      
      if (availablePositions.length === 0) {
        console.log("No available positions for tower");
        return false;
      }
      
      const position = availablePositions[0];
      useTowerDefense.getState().placeTower(position, card.name);
      
      return true;
    },

    playSpellCard: (card: Card) => {
      // Spell cards have immediate effects
      const { enemies } = useTowerDefense.getState();
      
      switch (card.effect) {
        case 'damage_all':
          enemies.forEach(enemy => {
            useTowerDefense.getState().damageEnemy(enemy.id, card.stats?.damage || 50);
          });
          return true;
          
        case 'slow_all':
          // Slow all enemies (simplified implementation)
          useTowerDefense.setState(state => ({
            enemies: state.enemies.map(enemy => ({
              ...enemy,
              speed: enemy.speed * 0.5
            }))
          }));
          return true;
          
        default:
          console.log(`Unknown spell effect: ${card.effect}`);
          return false;
      }
    },

    playUpgradeCard: (card: Card) => {
      const { towers } = useTowerDefense.getState();
      
      if (towers.length === 0) {
        console.log("No towers to upgrade");
        return false;
      }
      
      // Upgrade the first tower (simplified)
      const towerToUpgrade = towers[0];
      
      useTowerDefense.setState(state => ({
        towers: state.towers.map(tower => 
          tower.id === towerToUpgrade.id ? {
            ...tower,
            level: tower.level + 1,
            damage: tower.damage + (card.stats?.damage || 10),
            range: tower.range + (card.stats?.range || 1),
            fireRate: tower.fireRate + (card.stats?.fireRate || 0.5),
          } : tower
        )
      }));
      
      return true;
    },

    discardCard: (cardId) => {
      const { hand, discardPile } = get();
      const card = hand.find(c => c.id === cardId);
      
      if (!card) {
        console.log("Card not found in hand");
        return;
      }
      
      set({
        hand: hand.filter(c => c.id !== cardId),
        discardPile: [...discardPile, card]
      });
      
      console.log(`Discarded card: ${card.name}`);
    },

    shuffleDeck: () => {
      set(state => ({
        deck: [...state.deck].sort(() => Math.random() - 0.5)
      }));
    },

    addCardToDeck: (card) => {
      set(state => ({
        deck: [...state.deck, { ...card, id: `card-${Math.random()}` }]
      }));
    },

    removeCardFromHand: (cardId) => {
      set(state => ({
        hand: state.hand.filter(c => c.id !== cardId)
      }));
    }
  }))
);

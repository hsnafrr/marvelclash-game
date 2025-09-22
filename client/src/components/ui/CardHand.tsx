import { useState } from "react";
import { useCards } from "@/lib/stores/useCards";
import { useTowerDefense } from "@/lib/stores/useTowerDefense";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CardHand() {
  const { hand, playCard, drawCard, discardCard } = useCards();
  const { money } = useTowerDefense();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    if (selectedCard === cardId) {
      setSelectedCard(null);
    } else {
      setSelectedCard(cardId);
    }
  };

  const handlePlayCard = (cardId: string) => {
    const success = playCard(cardId);
    if (success) {
      setSelectedCard(null);
    }
  };

  const handleDiscardCard = (cardId: string) => {
    discardCard(cardId);
    setSelectedCard(null);
  };

  if (hand.length === 0) {
    return (
      <Card className="bg-black/80 text-white border-gray-600">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-gray-400 mb-2">No cards in hand</p>
            <Button onClick={drawCard} size="sm">
              Draw Card ($10)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card Count and Draw Button */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-blue-600">
          Hand: {hand.length}/7
        </Badge>
        {hand.length < 7 && (
          <Button 
            onClick={drawCard} 
            size="sm"
            disabled={money < 10}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Draw Card ($10)
          </Button>
        )}
      </div>

      {/* Card Hand */}
      <div className="flex gap-2 max-w-screen-lg overflow-x-auto">
        {hand.map((card, index) => (
          <Card
            key={card.id}
            className={cn(
              "cursor-pointer transition-all duration-200 bg-black/90 text-white border-2",
              selectedCard === card.id 
                ? "border-yellow-400 transform scale-105 -translate-y-2" 
                : "border-gray-600 hover:border-gray-400",
              money < card.cost && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-3 w-32">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm truncate">{card.name}</h4>
                <Badge 
                  variant={money >= card.cost ? "default" : "destructive"}
                  className="text-xs"
                >
                  ${card.cost}
                </Badge>
              </div>

              {/* Card Type */}
              <div className="mb-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs border-current",
                    card.type === 'tower' && "text-blue-400",
                    card.type === 'spell' && "text-purple-400",
                    card.type === 'upgrade' && "text-green-400"
                  )}
                >
                  {card.type}
                </Badge>
              </div>

              {/* Card Description */}
              <p className="text-xs text-gray-300 mb-3 line-clamp-3">
                {card.description}
              </p>

              {/* Card Stats */}
              {card.stats && (
                <div className="text-xs space-y-1">
                  {card.stats.damage && (
                    <div className="flex justify-between">
                      <span>Damage:</span>
                      <span className="text-red-400">{card.stats.damage}</span>
                    </div>
                  )}
                  {card.stats.range && (
                    <div className="flex justify-between">
                      <span>Range:</span>
                      <span className="text-blue-400">{card.stats.range}</span>
                    </div>
                  )}
                  {card.stats.fireRate && (
                    <div className="flex justify-between">
                      <span>Fire Rate:</span>
                      <span className="text-yellow-400">{card.stats.fireRate}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card Actions */}
      {selectedCard && (
        <div className="flex gap-2">
          <Button
            onClick={() => handlePlayCard(selectedCard)}
            disabled={money < hand.find(c => c.id === selectedCard)?.cost!}
            className="bg-green-600 hover:bg-green-700"
          >
            Play Card
          </Button>
          <Button
            onClick={() => handleDiscardCard(selectedCard)}
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            Discard
          </Button>
          <Button
            onClick={() => setSelectedCard(null)}
            variant="ghost"
            className="hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

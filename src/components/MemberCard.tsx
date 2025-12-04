import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberCardProps {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  age?: number;
  city?: string | null;
  province?: string | null;
  handicap?: string | null;
  gender?: string | null;
  seekingRelationship?: boolean;
  showRelationshipStatus?: boolean;
  onLike?: (id: string) => void;
}

export const MemberCard = ({
  id,
  firstName,
  lastName,
  avatarUrl,
  age,
  city,
  province,
  handicap,
  gender,
  seekingRelationship,
  showRelationshipStatus,
  onLike,
}: MemberCardProps) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const displayName = `${firstName} ${lastName.charAt(0)}.`;
  
  return (
    <Card className="overflow-hidden hover:shadow-strong transition-all duration-300 group cursor-pointer animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage 
            src={avatarUrl || undefined} 
            alt={displayName}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <AvatarFallback className="rounded-none text-4xl bg-gradient-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Like Button Overlay */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white shadow-medium"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(id);
            }}
          >
            <Heart className="w-5 h-5 text-primary" />
          </Button>
        </div>

        {/* Gender Badge */}
        {gender && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {gender === 'man' ? '♂️ Man' : gender === 'vrouw' ? '♀️ Vrouw' : gender}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground truncate">
              {displayName}
            </h3>
            {age && (
              <p className="text-sm text-muted-foreground">
                {age} jaar
              </p>
            )}
          </div>

          {(city || province) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {[city, province].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {handicap && (
              <Badge variant="outline" className="text-xs">
                Handicap: {handicap}
              </Badge>
            )}
            {showRelationshipStatus && seekingRelationship && (
              <Badge className="text-xs bg-pink-500/10 text-pink-600 border-pink-200">
                💕 Zoekt relatie
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MemberCard } from "@/components/MemberCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  age: number | null;
  city: string | null;
  province: string | null;
  handicap: string | null;
  gender: string | null;
  bio: string | null;
  seeking_relationship: boolean | null;
}

const PROVINCES = [
  "Drenthe",
  "Flevoland",
  "Friesland",
  "Gelderland",
  "Groningen",
  "Limburg",
  "Noord-Brabant",
  "Noord-Holland",
  "Overijssel",
  "Utrecht",
  "Zeeland",
  "Zuid-Holland",
];

const HANDICAP_RANGES = [
  { value: "0-10", label: "0-10" },
  { value: "11-20", label: "11-20" },
  { value: "21-30", label: "21-30" },
  { value: "30+", label: "30+" },
];

const MembersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Profile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [isEliteMember, setIsEliteMember] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedHandicap, setSelectedHandicap] = useState<string>("all");
  const [ageMin, setAgeMin] = useState<string>("");
  const [ageMax, setAgeMax] = useState<string>("");
  const [seekingRelationshipFilter, setSeekingRelationshipFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMembers();
    checkMembershipStatus();
  }, [user, navigate]);

  const checkMembershipStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("memberships")
      .select("type")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    
    setIsEliteMember(data?.type === "elite");
  };

  useEffect(() => {
    applyFilters();
  }, [members, searchQuery, selectedProvince, selectedGender, selectedHandicap, ageMin, ageMax, seekingRelationshipFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Use the secure search_members function which returns only non-sensitive data
      const { data, error } = await supabase.rpc('search_members');

      if (error) throw error;

      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Er ging iets mis bij het laden van leden");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    // Search by name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.first_name.toLowerCase().includes(query) ||
          member.last_name.toLowerCase().includes(query)
      );
    }

    // Filter by province
    if (selectedProvince !== "all") {
      filtered = filtered.filter((member) => member.province === selectedProvince);
    }

    // Filter by gender
    if (selectedGender !== "all") {
      filtered = filtered.filter((member) => member.gender === selectedGender);
    }

    // Filter by handicap
    if (selectedHandicap !== "all") {
      filtered = filtered.filter((member) => member.handicap === selectedHandicap);
    }

    // Filter by age
    if (ageMin || ageMax) {
      filtered = filtered.filter((member) => {
        if (!member.age) return false;

        const min = ageMin ? parseInt(ageMin) : 0;
        const max = ageMax ? parseInt(ageMax) : 120;

        return member.age >= min && member.age <= max;
      });
    }

    // Filter by seeking relationship (only for Elite members)
    if (isEliteMember && seekingRelationshipFilter !== "all") {
      filtered = filtered.filter((member) => {
        if (seekingRelationshipFilter === "yes") {
          return member.seeking_relationship === true;
        }
        return member.seeking_relationship !== true;
      });
    }

    setFilteredMembers(filtered);
  };

  const handleLike = async (memberId: string) => {
    if (!user) return;

    try {
      // Check if match already exists
      const { data: existingMatch } = await supabase
        .from("matches")
        .select("*")
        .eq("user_id", user.id)
        .eq("matched_user_id", memberId)
        .single();

      if (existingMatch) {
        toast.info("Je hebt al interesse getoond in dit lid");
        return;
      }

      // Create new match
      const { error } = await supabase.from("matches").insert({
        user_id: user.id,
        matched_user_id: memberId,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Interesse getoond! 💚");
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Er ging iets mis");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProvince("all");
    setSelectedGender("all");
    setSelectedHandicap("all");
    setAgeMin("");
    setAgeMax("");
    setSeekingRelationshipFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ontdek <span className="text-primary">Leden</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Vind golfmaatjes en connecties die bij jou passen
            </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-8 shadow-medium animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Verberg" : "Toon"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>

            {showFilters && (
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Zoek op naam</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Voer naam in..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Province Filter */}
                  <div>
                    <Label>Provincie</Label>
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle provincies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle provincies</SelectItem>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <Label>Geslacht</Label>
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle</SelectItem>
                        <SelectItem value="man">Man</SelectItem>
                        <SelectItem value="vrouw">Vrouw</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Handicap Filter */}
                  <div>
                    <Label>Handicap</Label>
                    <Select value={selectedHandicap} onValueChange={setSelectedHandicap}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle</SelectItem>
                        {HANDICAP_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age Range */}
                  <div>
                    <Label>Leeftijd</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        min="18"
                        max="99"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={ageMax}
                        onChange={(e) => setAgeMax(e.target.value)}
                        min="18"
                        max="99"
                      />
                    </div>
                  </div>

                  {/* Seeking Relationship Filter - Only for Elite Members */}
                  {isEliteMember && (
                    <div>
                      <Label>Zoekt relatie</Label>
                      <Select value={seekingRelationshipFilter} onValueChange={setSeekingRelationshipFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Alle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle leden</SelectItem>
                          <SelectItem value="yes">Zoekt relatie</SelectItem>
                          <SelectItem value="no">Alleen golf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Results Counter */}
                <div className="text-sm text-muted-foreground">
                  {filteredMembers.length} {filteredMembers.length === 1 ? "lid" : "leden"} gevonden
                </div>
              </CardContent>
            )}
          </Card>

          {/* Members Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <Card className="p-12 text-center shadow-medium animate-fade-in">
              <p className="text-lg text-muted-foreground mb-4">
                Geen leden gevonden met deze filters
              </p>
              <Button onClick={clearFilters}>Reset filters</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  id={member.id}
                  firstName={member.first_name}
                  lastName={member.last_name}
                  avatarUrl={member.avatar_url}
                  age={member.age || undefined}
                  city={member.city}
                  province={member.province}
                  handicap={member.handicap}
                  gender={member.gender}
                  seekingRelationship={member.seeking_relationship || false}
                  showRelationshipStatus={isEliteMember}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MembersPage;

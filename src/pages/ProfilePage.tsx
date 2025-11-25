import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    city: "",
    province: "",
    handicap: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Kon profiel niet laden");
      return;
    }

    if (data) {
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        gender: data.gender || "",
        city: data.city || "",
        province: data.province || "",
        handicap: data.handicap || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setProfile({ ...profile, avatar_url: urlData.publicUrl });
      toast.success("Foto geüpload!");
    } catch (error) {
      toast.error("Upload mislukt");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        city: profile.city,
        province: profile.province,
        handicap: profile.handicap,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Profiel bijwerken mislukt");
    } else {
      toast.success("Profiel succesvol bijgewerkt!");
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 gradient-hero py-12 px-4">
        <div className="container max-w-2xl">
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="font-heading text-3xl text-center">Mijn Profiel</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                        <span>
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploaden...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Foto
                            </>
                          )}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Voornaam</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Achternaam</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Geslacht</Label>
                  <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer geslacht" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="vrouw">Vrouw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <Label htmlFor="province">Provincie</Label>
                  <Select value={profile.province} onValueChange={(value) => setProfile({ ...profile, province: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer provincie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drenthe">Drenthe</SelectItem>
                      <SelectItem value="Flevoland">Flevoland</SelectItem>
                      <SelectItem value="Friesland">Friesland</SelectItem>
                      <SelectItem value="Gelderland">Gelderland</SelectItem>
                      <SelectItem value="Groningen">Groningen</SelectItem>
                      <SelectItem value="Limburg">Limburg</SelectItem>
                      <SelectItem value="Noord-Brabant">Noord-Brabant</SelectItem>
                      <SelectItem value="Noord-Holland">Noord-Holland</SelectItem>
                      <SelectItem value="Overijssel">Overijssel</SelectItem>
                      <SelectItem value="Utrecht">Utrecht</SelectItem>
                      <SelectItem value="Zeeland">Zeeland</SelectItem>
                      <SelectItem value="Zuid-Holland">Zuid-Holland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">Stad</Label>
                  <Input
                    id="city"
                    placeholder="bijv. Amsterdam"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>

                {/* Handicap */}
                <div className="space-y-2">
                  <Label htmlFor="handicap">Golf Handicap</Label>
                  <Select value={profile.handicap} onValueChange={(value) => setProfile({ ...profile, handicap: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer handicap niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10">0-10 (Zeer ervaren)</SelectItem>
                      <SelectItem value="11-20">11-20 (Ervaren)</SelectItem>
                      <SelectItem value="20-30">20-30 (Gemiddeld)</SelectItem>
                      <SelectItem value="30+">30+ (Beginner)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Vertel iets over jezelf en je golfervaring..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary" size="lg" disabled={loading}>
                  {loading ? "Bezig..." : "Profiel Opslaan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

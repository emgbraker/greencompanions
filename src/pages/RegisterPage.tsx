import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";

const RegisterPage = () => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    province: "",
    handicap: "",
    seekingRelationship: false,
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Wachtwoord moet minimaal 8 tekens zijn");
      return;
    }

    if (!formData.gender || !formData.province || !formData.handicap) {
      toast.error("Vul alle verplichte velden in");
      return;
    }

    setLoading(true);
    
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.gender,
      formData.province,
      formData.handicap,
      formData.seekingRelationship
    );
    
    if (error) {
      toast.error(error.message || "Registratie mislukt");
    } else {
      toast.success("Account aangemaakt! Je bent nu ingelogd.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center gradient-hero py-12 px-4">
        <Card className="w-full max-w-md shadow-strong border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-heading font-bold text-2xl">G</span>
            </div>
            <CardTitle className="font-heading text-3xl">Word Lid van GreenConnect</CardTitle>
            <CardDescription className="text-base">
              Start gratis en ontmoet je perfecte golf partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam</Label>
                  <Input
                    id="firstName"
                    placeholder="Jan"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam</Label>
                  <Input
                    id="lastName"
                    placeholder="Jansen"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Geslacht *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer geslacht" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="vrouw">Vrouw</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Provincie *</Label>
                <Select 
                  value={formData.province} 
                  onValueChange={(value) => setFormData({ ...formData, province: value })}
                >
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

              <div className="space-y-2">
                <Label htmlFor="handicap">Golf Handicap *</Label>
                <Select 
                  value={formData.handicap} 
                  onValueChange={(value) => setFormData({ ...formData, handicap: value })}
                >
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

              <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Label className="text-base font-medium">Zoek je ook een relatie? *</Label>
                <p className="text-sm text-muted-foreground">
                  Als Elite lid kun je andere golfers vinden die ook een relatie zoeken.
                </p>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.seekingRelationship ? "default" : "outline"}
                    className={formData.seekingRelationship ? "gradient-primary" : ""}
                    onClick={() => setFormData({ ...formData, seekingRelationship: true })}
                  >
                    Ja, ik word Elite lid
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.seekingRelationship ? "default" : "outline"}
                    className={!formData.seekingRelationship ? "" : ""}
                    onClick={() => setFormData({ ...formData, seekingRelationship: false })}
                  >
                    Nee, alleen golf
                  </Button>
                </div>
                {formData.seekingRelationship && (
                  <p className="text-sm text-primary font-medium">
                    ✓ Je wordt Elite lid en kunt relatie-zoekende leden vinden
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jouw@email.nl"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimaal 8 tekens"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bevestig Wachtwoord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Herhaal wachtwoord"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-start space-x-2 py-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreeTerms: checked as boolean })
                  }
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                  Ik ga akkoord met de{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Algemene Voorwaarden
                  </Link>{" "}
                  en{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacybeleid
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={!formData.agreeTerms || loading}
              >
                {loading ? "Bezig..." : "Maak Account"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Of registreer met</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full" size="lg">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Al een account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RegisterPage;

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  package_type: "basic" | "premium" | "platinum";
}

interface GolfClub {
  id: string;
  name: string;
  description: string | null;
  location: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
}

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [golfClubs, setGolfClubs] = useState<GolfClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [sponsorsResult, clubsResult] = await Promise.all([
      supabase
        .from("sponsors")
        .select("*")
        .eq("active", true)
        .order("display_order"),
      supabase
        .from("golf_clubs")
        .select("*")
        .order("name")
    ]);

    if (!sponsorsResult.error && sponsorsResult.data) {
      setSponsors(sponsorsResult.data as Sponsor[]);
    }
    if (!clubsResult.error && clubsResult.data) {
      setGolfClubs(clubsResult.data as GolfClub[]);
    }
    setLoading(false);
  };

  const getPackageBadge = (packageType: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      platinum: "default",
      premium: "secondary",
      basic: "outline",
    };
    return (
      <Badge variant={variants[packageType] || "outline"} className="capitalize">
        {packageType}
      </Badge>
    );
  };

  const formatUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Onze Partners & Sponsoren
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ontdek onze vertrouwde partners die het mogelijk maken om golfers met elkaar te verbinden
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Sponsors Section */}
              {sponsors.length > 0 && (
                <section className="mb-16">
                  <h2 className="font-heading text-2xl font-bold mb-6">Sponsoren</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsors.map((sponsor) => (
                      <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          {sponsor.logo_url && (
                            <div className="mb-4 h-32 flex items-center justify-center bg-muted rounded-md">
                              <img
                                src={sponsor.logo_url}
                                alt={sponsor.name}
                                className="max-h-full max-w-full object-contain p-4"
                              />
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-xl">{sponsor.name}</CardTitle>
                            {getPackageBadge(sponsor.package_type)}
                          </div>
                          {sponsor.description && (
                            <CardDescription className="line-clamp-3">
                              {sponsor.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {sponsor.website_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              asChild
                            >
                              <a
                                href={formatUrl(sponsor.website_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Bezoek Website
                              </a>
                            </Button>
                          )}
                          <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                            {sponsor.contact_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${sponsor.contact_email}`} className="hover:underline">
                                  {sponsor.contact_email}
                                </a>
                              </div>
                            )}
                            {sponsor.contact_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${sponsor.contact_phone}`} className="hover:underline">
                                  {sponsor.contact_phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Golf Clubs Section */}
              {golfClubs.length > 0 && (
                <section className="mb-16">
                  <h2 className="font-heading text-2xl font-bold mb-6">Golfclubs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {golfClubs.map((club) => (
                      <Card key={club.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          {club.image_url && (
                            <div className="mb-4 h-32 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                              <img
                                src={club.image_url}
                                alt={club.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardTitle className="text-xl">{club.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {club.location}
                          </div>
                          {club.description && (
                            <CardDescription className="line-clamp-3">
                              {club.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {club.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              asChild
                            >
                              <a
                                href={formatUrl(club.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Bezoek Website
                              </a>
                            </Button>
                          )}
                          <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                            {club.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${club.email}`} className="hover:underline">
                                  {club.email}
                                </a>
                              </div>
                            )}
                            {club.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${club.phone}`} className="hover:underline">
                                  {club.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {sponsors.length === 0 && golfClubs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Momenteel geen actieve partners</p>
                </div>
              )}
            </>
          )}

          <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
            <h2 className="font-heading text-2xl font-bold mb-4">
              Word Partner van GreenConnect
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Bent u eigenaar van een golfclub, golfwinkel, golfschool of golfgerelateerd bedrijf? 
              Neem contact op om meer te weten te komen over onze partnership mogelijkheden.
            </p>
            <Button size="lg" asChild>
              <a href="/contact">Contact Opnemen</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorsPage;

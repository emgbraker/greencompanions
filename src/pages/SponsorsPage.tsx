import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Phone } from "lucide-react";

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

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("active", true)
      .order("display_order");

    if (!error && data) {
      setSponsors(data as Sponsor[]);
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
          ) : sponsors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Momenteel geen actieve sponsoren</p>
            </div>
          ) : (
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
                          href={sponsor.website_url}
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
          )}

          <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
            <h2 className="font-heading text-2xl font-bold mb-4">
              Word Partner van GreenConnect
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Bent u eigenaar van een golfclub, golfwinkel of golfgerelateerd bedrijf? 
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
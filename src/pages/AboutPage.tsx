import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Users, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground mb-6 animate-fade-in">
              Over <span className="text-primary">GreenConnect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up">
              Het premium platform waar golfpassie en betekenisvolle connecties samenkomen
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6">
                  Onze Missie
                </h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  GreenConnect is opgericht met een simpele maar krachtige gedachte: golf is leuker 
                  met de juiste mensen. Of je nu op zoek bent naar een speelmaatje, nieuwe vrienden, 
                  of zelfs de liefde van je leven – wij geloven dat de golfbaan de perfecte plek is 
                  om betekenisvolle connecties te maken.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Wij creëren een exclusieve community van volwassen golfenthousiastelingen die hun 
                  passie willen delen met gelijkgestemde mensen. GreenConnect combineert de elegantie 
                  van golf met moderne technologie om het matchen eenvoudig en plezierig te maken.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="shadow-soft border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="font-heading font-bold text-3xl text-foreground mb-2">5000+</div>
                    <p className="text-sm text-muted-foreground">Actieve Leden</p>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="font-heading font-bold text-3xl text-foreground mb-2">850+</div>
                    <p className="text-sm text-muted-foreground">Succesvolle Matches</p>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="font-heading font-bold text-3xl text-foreground mb-2">120+</div>
                    <p className="text-sm text-muted-foreground">Partner Clubs</p>
                  </CardContent>
                </Card>
                <Card className="shadow-soft border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="font-heading font-bold text-3xl text-foreground mb-2">100%</div>
                    <p className="text-sm text-muted-foreground">Veilig & Privé</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Onze Waarden
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De principes waar GreenConnect voor staat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Authenticiteit",
                  description: "Wij waarderen echte profielen en oprechte connecties. Elk lid wordt geverifieerd om een veilige en betrouwbare community te garanderen.",
                },
                {
                  title: "Inclusiviteit",
                  description: "GreenConnect verwelkomt golfers van alle niveaus – van beginners tot professionals. Iedereen verdient de kans om betekenisvolle connecties te maken.",
                },
                {
                  title: "Excellentie",
                  description: "Net als in golf streven we naar continue verbetering. We investeren in onze platform en community om de beste ervaring te bieden.",
                },
              ].map((value, index) => (
                <Card key={index} className="shadow-soft border-border">
                  <CardContent className="pt-6">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-8 text-center">
              Ons Verhaal
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p className="leading-relaxed">
                GreenConnect werd geboren uit persoonlijke ervaring. Onze oprichters, zelf fanatieke 
                golfers, merkten hoe moeilijk het was om speelmaatjes te vinden buiten hun vaste 
                circle. Ze zagen ook hoe golf een unieke basis vormt voor vriendschap en romantiek – 
                samen uren doorbrengen op de mooiste banen van Nederland, praten tussen de holes door, 
                en groeien door gedeelde uitdagingen.
              </p>
              <p className="leading-relaxed">
                In 2023 lanceerden we GreenConnect als het eerste Nederlandse platform speciaal voor 
                de golf community. Sindsdien hebben duizenden leden elkaar gevonden, van casual 
                speelmaatjes tot levenslange vriendschappen en romantische relaties. Onze leden 
                delen niet alleen een passie voor golf, maar ook waarden als respect, sportiviteit 
                en het nastreven van persoonlijke groei.
              </p>
              <p className="leading-relaxed">
                Vandaag de dag groeit GreenConnect nog steeds. We werken samen met meer dan 120 
                golfclubs in Nederland, organiseren exclusieve events, en blijven investeren in 
                functies die het matchen nog persoonlijker en effectiever maken. Onze community 
                is ons grootste kapitaal, en we zijn er trots op dat we een platform hebben 
                gecreëerd waar iedereen zich welkom voelt.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

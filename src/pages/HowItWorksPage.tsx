import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, Search, MessageCircle, Calendar, Heart, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import golfersYoung from "@/assets/golfers-young.jpg";
import stepProfile from "@/assets/step-profile.jpg";
import stepMatch from "@/assets/step-match.jpg";
import stepChat from "@/assets/step-chat.jpg";
import stepPlay from "@/assets/step-play.jpg";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground mb-6 animate-fade-in">
              Hoe Het <span className="text-primary">Werkt</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up">
              In vier eenvoudige stappen naar jouw perfecte golf connectie
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {[
                {
                  step: "01",
                  icon: UserPlus,
                  title: "Maak Je Profiel",
                  image: stepProfile,
                  description: "Begin met het aanmaken van je persoonlijke GreenConnect profiel. Vertel over jezelf, je golf ervaring, handicap, favoriete clubs en wat je zoekt – vriendschap, speelmaatjes of romantiek.",
                  details: [
                    "Upload foto's en vertel je golf verhaal",
                    "Geef je handicap en speelfrequentie aan",
                    "Deel je favoriete golfclubs en banen",
                    "Verifieer je profiel voor extra betrouwbaarheid",
                  ],
                },
                {
                  step: "02",
                  icon: Search,
                  title: "Ontdek Matches",
                  image: stepMatch,
                  description: "Browse door profielen van golfers in jouw regio. Gebruik onze slimme filters om te zoeken op leeftijd, handicap, afstand, golf voorkeuren en wat je zoekt in een connectie.",
                  details: [
                    "Filter op locatie, leeftijd en golf niveau",
                    "Bekijk gedetailleerde profielen met foto's",
                    "Lees over hun golf ervaring en interesses",
                    "Like profielen die je interesseren",
                  ],
                },
                {
                  step: "03",
                  icon: MessageCircle,
                  title: "Start een Gesprek",
                  image: stepChat,
                  description: "Wanneer jullie allebei interesse tonen, ontstaat er een match! Begin met chatten, leer elkaar beter kennen, en ontdek of er een klik is. Deel je favoriete golf momenten en praat over jullie volgende ronde.",
                  details: [
                    "Chat veilig binnen het platform",
                    "Deel je golf ervaringen en verhalen",
                    "Ontdek gemeenschappelijke interesses",
                    "Besluit samen wanneer je elkaar wilt ontmoeten",
                  ],
                },
                {
                  step: "04",
                  icon: Calendar,
                  title: "Speel Samen",
                  image: stepPlay,
                  description: "Plan je eerste ronde samen! Gebruik onze planning tool om een datum, tijd en golfclub af te spreken. Of doe mee aan een GreenConnect event om meerdere leden tegelijk te ontmoeten.",
                  details: [
                    "Plan rondes via de ingebouwde agenda",
                    "Kies uit partner golfclubs met korting",
                    "Doe mee aan exclusieve GreenConnect events",
                    "Bouw vriendschappen en relaties op de fairway",
                  ],
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl font-heading font-bold text-primary/20">
                        {step.step}
                      </div>
                      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                    <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <Card className="shadow-medium border-border overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full aspect-square object-cover"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Golfers Image */}
        <section className="py-0">
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
            <img 
              src={golfersYoung} 
              alt="Blije golfers op een zonnige golfbaan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                Ontmoet nieuwe golfvrienden
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Extra Functies
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                GreenConnect biedt meer dan alleen matchen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Veiligheid & Privacy",
                  description: "Je privacy is onze prioriteit. Alle profielen worden geverifieerd en je bepaalt zelf wat je deelt. Blokkeer en rapporteer functies zorgen voor een veilige omgeving.",
                },
                {
                  icon: Heart,
                  title: "Smart Matching",
                  description: "Ons algoritme houdt rekening met golf niveau, voorkeuren, locatie en persoonlijkheid om de beste matches voor je te vinden.",
                },
              ].map((feature, index) => (
                <Card key={index} className="shadow-soft border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-6">
              Klaar om te Starten?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Word gratis lid en ontmoet jouw perfecte golf connectie
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-lg px-8 py-6">
                Maak Je Profiel
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Calendar, Award, MapPin, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-golf.jpg";
import golfersImage from "@/assets/golfers-meeting.jpg";
import clubhouseImage from "@/assets/clubhouse.jpg";
const HomePage = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
              Vind Je Perfecte{" "}
              <span className="text-accent">Golf Partner</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              GreenConnect brengt golfenthousiastelingen samen voor vriendschap, speelmaatjes en romantische connecties. 
              Ontdek een community van mensen die jouw passie voor golf delen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-lg px-8 py-6 shadow-strong hover:shadow-medium transition-all">
                  Start Gratis
                </Button>
              </Link>
              <Link to="/hoe-het-werkt">
                <Button size="lg" variant="outline" className="bg-white/95 text-foreground text-lg px-8 py-6 border-2 hover:bg-white">
                  Hoe Het Werkt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
              Waarom <span className="text-primary">GreenConnect</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Het premium platform speciaal ontworpen voor de golf community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Heart,
            title: "Romantische Matches",
            description: "Vind liefde met iemand die jouw passie voor golf begrijpt en deelt."
          }, {
            icon: Users,
            title: "Golf Vrienden",
            description: "Bouw vriendschappen op met gelijkgestemde golfenthousiastelingen."
          }, {
            icon: Calendar,
            title: "Plan Rondes",
            description: "Organiseer golf sessies met je matches en speel samen op de mooiste banen."
          }, {
            icon: MapPin,
            title: "Vind Clubs",
            description: "Ontdek nieuwe golfclubs en ontmoet leden in jouw regio."
          }, {
            icon: Trophy,
            title: "Toernooien",
            description: "Doe mee aan exclusieve GreenConnect toernooien en events."
          }, {
            icon: Award,
            title: "Premium Community",
            description: "Word deel van een exclusieve community van serieuze golfers."
          }].map((feature, index) => <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-border hover:border-primary/50 animate-scale-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6">
                Verbinden op de <span className="text-primary">Fairway</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                GreenConnect maakt het eenvoudig om gelijkgestemde golfers te ontmoeten. 
                Maak je profiel, stel je voorkeuren in, en begin met matchen met mensen 
                die jouw passie voor golf delen.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Maak Je Profiel</h4>
                    <p className="text-muted-foreground">Vertel over jezelf en je golf ervaring</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Ontdek Matches</h4>
                    <p className="text-muted-foreground">Browse door profielen in jouw regio</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Speel Samen</h4>
                    <p className="text-muted-foreground">Plan een ronde en leer elkaar kennen</p>
                  </div>
                </li>
              </ul>
              <Link to="/hoe-het-werkt">
                <Button size="lg" className="gradient-primary">
                  Lees Meer
                </Button>
              </Link>
            </div>
            <div className="relative animate-scale-in">
              <img src={golfersImage} alt="Golfers ontmoeten elkaar" className="rounded-2xl shadow-strong w-full" />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-medium border border-border max-w-xs">
                <p className="text-sm text-muted-foreground mb-2">Nieuwste Match</p>
                <p className="font-heading font-semibold text-foreground">
                  "Fantastische ronde gehad! Meteen geklikt op de eerste hole."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: `url(${clubhouseImage})`
          }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70" />
            </div>
            <div className="relative px-8 py-16 md:py-24 text-center">
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-foreground mb-6 animate-fade-in">
                Klaar om te Beginnen?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-slide-up">
                Word vandaag nog lid en ontmoet honderden golfenthousiastelingen in Nederland
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                    Word Gratis Lid
                  </Button>
                </Link>
                <Link to="/lidmaatschappen">
                  <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white/10 text-lg px-8 py-6 text-green-700">
                    Bekijk Lidmaatschappen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default HomePage;
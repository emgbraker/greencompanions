import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Star, Crown, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MembershipPage = () => {
  const plans = [
    {
      name: "Basis",
      icon: Zap,
      price: "Gratis",
      period: "",
      description: "Perfect om te beginnen en de community te verkennen",
      features: [
        "Profiel aanmaken en beheren",
        "5 likes per dag",
        "Basis zoekfilters",
        "Chatten met matches",
        "Toegang tot community forum",
      ],
      cta: "Start Gratis",
      popular: false,
    },
    {
      name: "Premium",
      icon: Star,
      price: "€19,99",
      period: "/maand",
      description: "Voor serieuze golfers die meer willen ontdekken",
      features: [
        "Alles van Basis",
        "Onbeperkt liken",
        "Geavanceerde zoekfilters",
        "Zie wie je profiel heeft geliked",
        "Prioriteit in matching algoritme",
        "Geen advertenties",
        "10% korting bij partner clubs",
        "Toegang tot Premium events",
      ],
      cta: "Word Premium",
      popular: true,
    },
    {
      name: "Elite",
      icon: Crown,
      price: "€39,99",
      period: "/maand",
      description: "De ultieme GreenConnect ervaring voor exclusiviteit",
      features: [
        "Alles van Premium",
        "Profiel badge 'Elite Member'",
        "Persoonlijke matchmaker service",
        "VIP toegang tot exclusieve events",
        "Gratis greenfee deals",
        "20% korting bij partner clubs",
        "Voorrang bij toernooien",
        "Concierge service voor reserveringen",
        "Jaarlijkse Elite golfweekend",
      ],
      cta: "Word Elite",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground mb-6 animate-fade-in">
              Kies Je <span className="text-primary">Lidmaatschap</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up">
              Van gratis beginnen tot premium features – kies het plan dat bij jou past
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative shadow-soft hover:shadow-medium transition-all duration-300 ${
                    plan.popular
                      ? "border-2 border-primary shadow-medium scale-105 md:scale-110"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-heading font-semibold">
                        Populairste Keuze
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
                      <plan.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-heading text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="font-heading font-bold text-4xl text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="block">
                      <Button
                        className={`w-full ${
                          plan.popular ? "gradient-primary" : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Alle lidmaatschappen kunnen maandelijks worden opgezegd. Geen verborgen kosten.
              </p>
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Vragen over lidmaatschappen? Neem contact op →
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Waarom Upgraden?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium en Elite leden krijgen toegang tot exclusieve voordelen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Meer Matches",
                  description: "Verhoogde zichtbaarheid en prioriteit in het matching algoritme",
                },
                {
                  title: "Partner Voordelen",
                  description: "Exclusieve kortingen bij 120+ golfclubs door heel Nederland",
                },
                {
                  title: "Premium Events",
                  description: "VIP toegang tot GreenConnect golftoernooien en social events",
                },
                {
                  title: "Persoonlijke Service",
                  description: "Elite leden krijgen persoonlijke matchmaking en concierge service",
                },
              ].map((benefit, index) => (
                <Card key={index} className="shadow-soft border-border text-center">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MembershipPage;

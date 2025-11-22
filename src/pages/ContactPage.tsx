import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground mb-6 animate-fade-in">
              Neem <span className="text-primary">Contact</span> Op
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up">
              Heb je een vraag of suggestie? We horen graag van je!
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
                    Contact Informatie
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Ons team staat klaar om je te helpen. Voel je vrij om contact op te nemen via 
                    een van de onderstaande kanalen.
                  </p>
                </div>

                <Card className="shadow-soft border-border">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1">Email</h3>
                          <a
                            href="mailto:info@greenconnect.nl"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            info@greenconnect.nl
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1">
                            Telefoon
                          </h3>
                          <a
                            href="tel:+31208001234"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            +31 (0)20 800 1234
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1">Adres</h3>
                          <p className="text-sm text-muted-foreground">
                            Golfbaan 123
                            <br />
                            1234 AB Amsterdam
                            <br />
                            Nederland
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-foreground mb-1">
                            Bereikbaarheid
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ma-Vr: 9:00 - 18:00
                            <br />
                            Za-Zo: 10:00 - 16:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-medium border-border">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Stuur ons een bericht</CardTitle>
                    <CardDescription className="text-base">
                      We reageren meestal binnen 24 uur op werkdagen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Voornaam *</Label>
                          <Input id="firstName" placeholder="Jouw voornaam" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Achternaam *</Label>
                          <Input id="lastName" placeholder="Jouw achternaam" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="jouw@email.nl" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Onderwerp *</Label>
                        <Input id="subject" placeholder="Waar gaat je bericht over?" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Bericht *</Label>
                        <Textarea
                          id="message"
                          placeholder="Vertel ons waar we je mee kunnen helpen..."
                          rows={6}
                        />
                      </div>

                      <Button type="submit" size="lg" className="gradient-primary w-full md:w-auto">
                        Verstuur Bericht
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Veelgestelde Vragen
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Misschien staat je antwoord al in onze FAQ sectie
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/faq">Bekijk FAQ</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;

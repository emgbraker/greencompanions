import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-8">
            Privacy & Algemene Voorwaarden
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
                Privacybeleid
              </h2>
              <p className="leading-relaxed mb-4">
                GreenConnect respecteert de privacy van alle leden en bezoekers. Wij verzamelen 
                alleen gegevens die noodzakelijk zijn voor het functioneren van ons platform en 
                delen deze nooit zonder je toestemming met derden.
              </p>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                Welke gegevens verzamelen we?
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Persoonlijke informatie: naam, email, geboortedatum</li>
                <li>Profiel informatie: foto's, biografie, golf voorkeuren</li>
                <li>Gebruiksinformatie: matches, berichten, activiteit op het platform</li>
                <li>Technische gegevens: IP-adres, browser, apparaat type</li>
              </ul>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                Hoe gebruiken we je gegevens?
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Om je profiel en matches te tonen aan andere leden</li>
                <li>Om onze diensten te verbeteren en personaliseren</li>
                <li>Om je op de hoogte te houden van updates en nieuwe functies</li>
                <li>Om fraude en misbruik te voorkomen</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
                Algemene Voorwaarden
              </h2>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                1. Gebruik van het Platform
              </h3>
              <p className="leading-relaxed mb-4">
                GreenConnect is een platform voor volwassenen (18+) die golf delen als hobby. 
                Door je aan te melden ga je akkoord met onze community richtlijnen en beloof je 
                respectvol om te gaan met andere leden.
              </p>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                2. Account Veiligheid
              </h3>
              <p className="leading-relaxed mb-4">
                Je bent verantwoordelijk voor het beveiligen van je account en wachtwoord. 
                Deel je inloggegevens nooit met anderen. GreenConnect is niet aansprakelijk 
                voor ongeautoriseerde toegang tot je account.
              </p>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                3. Gedragsregels
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Wees respectvol en beleefd naar andere leden</li>
                <li>Geen harassment, discriminatie of ongepast gedrag</li>
                <li>Geen spam, commerciële promotie of misleidende content</li>
                <li>Rapporteer verdacht gedrag aan ons moderatie team</li>
              </ul>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                4. Lidmaatschappen & Betalingen
              </h3>
              <p className="leading-relaxed mb-4">
                Premium en Elite lidmaatschappen worden maandelijks automatisch verlengd. 
                Je kunt op elk moment opzeggen via je account instellingen. Restitutie van 
                reeds betaalde bedragen is niet mogelijk.
              </p>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                5. Wijzigingen
              </h3>
              <p className="leading-relaxed mb-4">
                GreenConnect behoudt zich het recht voor om deze voorwaarden te wijzigen. 
                We zullen je op de hoogte stellen van belangrijke wijzigingen via email.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Contact</h2>
              <p className="leading-relaxed">
                Heb je vragen over ons privacybeleid of algemene voorwaarden? 
                Neem contact met ons op via{" "}
                <a href="mailto:privacy@greenconnect.nl" className="text-primary hover:underline">
                  privacy@greenconnect.nl
                </a>
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Laatste update: {new Date().toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;

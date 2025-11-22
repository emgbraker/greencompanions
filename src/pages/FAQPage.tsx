import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQPage = () => {
  const faqs = [
    {
      question: "Wat is GreenConnect precies?",
      answer:
        "GreenConnect is een premium platform voor golfenthousiastelingen die op zoek zijn naar vriendschap, speelmaatjes of romantische connecties. We brengen mensen samen die hun passie voor golf delen en helpen ze betekenisvolle relaties op te bouwen, zowel op als buiten de golfbaan.",
    },
    {
      question: "Hoe werkt het matching systeem?",
      answer:
        "Ons matching systeem houdt rekening met meerdere factoren: jouw golf niveau, locatie, leeftijd, voorkeuren en wat je zoekt (vriendschap of romantiek). Je kunt door profielen browsen, mensen liken, en wanneer er een wederzijdse interesse is ontstaat er een match en kun je beginnen met chatten.",
    },
    {
      question: "Is GreenConnect gratis?",
      answer:
        "GreenConnect heeft een gratis basis lidmaatschap waarmee je een profiel kunt maken en beperkt kunt matchen (5 likes per dag). Voor onbeperkt matchen, geavanceerde filters en extra functies kun je upgraden naar Premium (€19,99/maand) of Elite (€39,99/maand). Beide kunnen maandelijks worden opgezegd.",
    },
    {
      question: "Voor wie is GreenConnect geschikt?",
      answer:
        "GreenConnect is bedoeld voor volwassenen (18+) die van golf houden en nieuwe mensen willen ontmoeten. Of je nu beginner bent of een lage handicap hebt – iedereen is welkom. Ons platform is populair bij mensen tussen de 30 en 75 jaar.",
    },
    {
      question: "Hoe veilig is mijn privacy?",
      answer:
        "Privacy en veiligheid zijn onze hoogste prioriteit. Je bepaalt zelf wat je deelt op je profiel. Al onze leden worden geverifieerd, en je kunt altijd iemand blokkeren of rapporteren. We delen nooit je persoonlijke gegevens met derden zonder je toestemming.",
    },
    {
      question: "Kan ik alleen mensen uit mijn regio vinden?",
      answer:
        "Ja! Je kunt filters instellen om alleen profielen te zien binnen een bepaalde straal van je locatie. Dit is handig om mensen te vinden met wie je daadwerkelijk kunt spelen. Je kunt de straal aanpassen tussen 10 en 100 kilometer.",
    },
    {
      question: "Organiseren jullie ook golf events?",
      answer:
        "Absoluut! Premium en Elite leden krijgen toegang tot exclusieve GreenConnect events, waaronder golf toernooien, social gatherings en clinics. Elite leden krijgen VIP toegang en worden uitgenodigd voor speciale events zoals ons jaarlijkse golfweekend.",
    },
    {
      question: "Hoe zeg ik mijn lidmaatschap op?",
      answer:
        "Je kunt je Premium of Elite lidmaatschap op elk moment opzeggen via je account instellingen. De opzegging gaat in aan het einde van je huidige betalingsperiode. Je kunt het platform daarna nog steeds gebruiken met een gratis basis account.",
    },
    {
      question: "Werken jullie samen met golfclubs?",
      answer:
        "Ja, we werken samen met meer dan 120 golfclubs in Nederland. Premium leden krijgen 10% korting en Elite leden 20% korting bij onze partner clubs. Ook organiseren we speciale GreenConnect dagen bij verschillende clubs.",
    },
    {
      question: "Wat als ik problemen ervaar met een ander lid?",
      answer:
        "Als je ongepast gedrag ervaart, kun je het lid direct blokkeren en rapporteren via zijn/haar profiel. Ons moderatie team onderzoekt elke melding serieus en neemt zo nodig actie. De veiligheid van onze community staat voorop.",
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
              Veelgestelde <span className="text-primary">Vragen</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-slide-up">
              Alles wat je wilt weten over GreenConnect
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 shadow-soft"
                >
                  <AccordionTrigger className="font-heading font-semibold text-lg text-left hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Staat je vraag er niet bij?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Neem contact met ons op en we helpen je graag verder
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors gradient-primary text-primary-foreground h-11 px-8"
            >
              Neem Contact Op
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;

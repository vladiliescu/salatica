# Design Doc — „Ce salată fac azi?"

## Contextul proiectului

Aplicație interactivă de tip „salad finder" construită pe baza unei conversații extinse despre combinații de ingrediente pentru salate. Utilizatorul gătește acasă, cumpără de la Lidl (România, Iași), și preferă salate de inspirație mediteraneană, italiană, grecească și românească. Aplicația trebuie să funcționeze ca un singur fișier HTML, fără dependențe externe obligatorii.


## Cerințele explicite ale utilizatorului

Utilizatorul a formulat clar următoarele cerințe:

**Format și arhitectură** — fișier HTML self-contained, bine arhitecturat. Nu un framework complex, nu mai multe fișiere, ci un singur document care funcționează independent.

**Interfață** — frumoasă și ușor de folosit. Utilizatorul apreciază concizia (a cerut în mod repetat „concis", „fără widget", „doar un paragraf", „doar lista de ingrediente") ceea ce indică preferință pentru UI curat, fără elemente inutile.

**Funcționalitate principală** — selectare de ingrediente disponibile, apoi afișarea salatelor posibile. Fluxul este: „am astea → ce pot face?"

**Sursă de ingrediente** — produse disponibile la Lidl. Nu ingrediente exotice sau greu de găsit.

**Sursă de rețete** — rețetele discutate în conversație, nu rețete generice. Utilizatorul a specificat „think of what I've liked so far."


## Intenția derivată din conversație

Dincolo de cerințele explicite, conversația a relevat câteva lucruri importante:

**Mod de gătit** — utilizatorul gătește simplu, rapid, din ce are. Nu caută rețete elaborate. Preferă salate care se asamblează în 10–15 minute. A cerut rețete „concise" de fiecare dată.

**Mod de decizie** — nu vrea să fie copleșit de opțiuni. Preferă să i se spună „du-te în direcția asta" decât să primească 10 variante egale. Când a întrebat „X sau Y?", a apreciat răspunsurile care au luat o poziție clară.

**Curiozitate exploratorie** — testează combinații noi pornind de la ce are. Întrebările au fost mereu „am X și Y, ce mai adaug?" — deci aplicația trebuie să funcționeze exact în această direcție.

**Bilingv natural** — conversația a alternat între română și engleză fără tranziție. Aplicația trebuie să reflecte acest lucru — interfață în română, dar fără a forța traduceri nenaturale.


## Principii culinare stabilite în conversație

Conversația a stabilit un set clar de reguli pe care utilizatorul le-a validat și care trebuie reflectate în rețetele din aplicație:

**Fiecare ingredient trebuie să aibă un rol distinct.** O salată bună are: ceva cremos, ceva sărat, ceva crocant, ceva acid. Dacă două ingrediente concurează pe același rol (ex: feta + telemea = dublu sărat-cremos), salata nu funcționează.

**Nu aglomera.** Tonul afumat are nevoie de spațiu, nu de competiție. Avocado nu merge peste tot. Când un ingredient e intens, restul trebuie să fie simplu.

**Lămâie vs. oțet** — lămâie pentru salate cu avocado (oțetul „face avocado-ul să aibă gust murdar"). Oțet de vin roșu pentru stil italian/grecesc. Balsamic doar pentru combinații dulci-sărate (căpșuni + feta). Lime pentru stil mexican.

**Bucăți distincte, nu piure.** Oul se taie în sferturi, nu se tocă. Avocado în felii, nu zdrobit. Tonul în fulgi mari. Feta sfărâmicioasă, nu cuburi.

**Ceapa roșie feliată subțire** — apare în aproape toate rețetele. Prea groasă domină totul.

**Semințele și nucile se prăjesc** — semințe de pin la tigaie uscată 2–3 minute. Dau crocant esențial.

**Caperele merg excelent cu tonul** — săratură ascuțită + briny tuna = combinație clasică.

**Fasole albă + ton e subestimată** — tonno e fagioli e una din cele mai naturale combinații.

**Telemeaua joacă rolul queso fresco** — funcționează în salate stil mexican ca substitut românesc.


## Decizii de design — interfață

**Ingredient chips (butoane toggle)** — am ales butoane pill/chip pentru selecție, nu checkbox-uri sau dropdown-uri. Motivele: se potrivesc pe mobile (tap-friendly), permit scanare vizuală rapidă, și dau feedback instant (culoare schimbată = selectat).

**Categorii de ingrediente** — ingredientele sunt grupate în 8 categorii cu emoji ca label vizual: Baze, Legume, Proteine, Brânzeturi, Pantry, Ierburi, Semințe & nuci, Fructe. Ordinea reflectă fluxul natural de gândire: „am o bază? da. legume? da. proteine? poate."

**Dressingul nu e selectabil** — am decis ca ingredientele de dressing (ulei, lămâie, oțet, sare, piper) să fie notate pe fiecare rețetă, nu selectabile. Motivul: toată lumea are ulei și sare, iar tipul de acid (lămâie/oțet/lime) e legat de rețetă, nu de ce „ai în frigider."

**Match percentage cu cerc SVG** — fiecare card de salată arată un cerc de progres cu procentul de ingrediente pe care le ai din rețetă. Verde = gata de făcut (100%, nu lipsește nimic). Portocaliu = aproape (îți mai trebuie 1–2). Cercul e mic (48px) și nu domină cardul.

**Ingrediente „have" vs. „need"** — în fiecare card, ingredientele pe care le ai sunt tag-uri verzi, cele care îți lipsesc sunt gri. Utilizatorul vede instant ce trebuie să mai cumpere.

**Tips pe fiecare rețetă** — fiecare card include un sfat din conversația noastră (italic, culoare accent). Acestea nu sunt sfaturi generice de pe internet, ci concluzii specifice din discuțiile noastre.

**Secțiuni de rezultate** — rezultatele sunt împărțite în trei grupuri cu titlu propriu: „Gata de făcut" (verde, nu lipsește nimic), „Aproape — îți mai trebuie 1–2" (portocaliu) și „Idei cu ce ai" (gri, mai departe). În grupurile „aproape" și „idei", fiecare card poartă un badge „Lipsește N" care spune exact câte ingrediente mai sunt necesare. Astfel prioritatea se vede din structură, nu doar din procent — iar utilizatorul nu primește niciodată un ecran gol când are ingrediente selectate.

**Filtre rapide + „Surprinde-mă"** — un singur radio alege cât de strict caut (nu se combină; are mereu o valoare selectată vizibil). Sub rânduri apare o linie de explicație pentru opțiunea activă, iar fiecare pastilă are și un tooltip cu aceeași descriere. Radio-ul restrânge doar ce se afișează, nu schimbă algoritmul:

- **Toate** (implicit) — model frigider: orice rețetă care folosește *măcar un* ingredient pe care îl ai.
- **Folosesc tot ce-am ales** — rețete care folosesc *fiecare* ingredient selectat (nimic din ce ai ales nu e ignorat); pot lipsi încă lucruri pe care nu le ai. Util pentru „am X, Y, Z — ce e construit fix pe astea?".
- **Exact ce am ales** — ca mai sus *și* gata de făcut: selecția ta = rețeta. Cel mai strict.
- **Gata de făcut** — rețete pe care le poți face acum (nu lipsește nimic), dar care pot ignora ingrediente în plus pe care le-ai ales.

Substituțiile contează: dacă o rețetă cere feta și ai ales telemea, telemea e considerată „folosită". Radio-ul nativ (ascuns vizual sub pastile) oferă navigare cu săgețile pentru tastatură; descrierea e `aria-live` ca să fie anunțată la schimbare. „Surprinde-mă" alege o singură rețetă din setul filtrat (preferând cele gata de făcut) și o afișează singură, cu buton de re-roll — în spiritul „nu mă copleși, ia o poziție". Tot blocul apare doar când există o selecție și rezultate.

**Bară de rezultate pe mobil** — panoul de ingrediente e înalt, așa că pe telefon rezultatele cad sub linia de vizibilitate. O bară fixă jos („N gata de făcut ↓") sare la rezultate la tap și dispare singură (IntersectionObserver) când rezultatele intră în cadru. Apare doar pe ecrane înguste (≤700px) și doar când ai o selecție.

**Accesibilitate** — chips-urile sunt `<button>`-uri cu `aria-pressed` care reflectă selecția; cercul de procent are alternativă text („Ai 4 din 6 ingrediente (67%)") iar SVG-ul decorativ e `aria-hidden`; tag-urile de ingrediente au `aria-label` „ai…"/„îți lipsește…" ca să nu se confunde la cititorul de ecran.


## Decizii de design — vizual

**Paletă de culori** — am ales tonuri calde inspirate din bucătăria mediteraneană. Background: #F8F6F1 (hârtie caldă, nu alb pur). Primary: #5A7A5C (verde salvie/ierburi). Accent: #C2613A (teracotă/roșie coaptă). Am evitat verdele neon sau portocaliul strident — trebuie să pară o bucătărie, nu o aplicație de fitness.

**Tipografie** — DM Serif Display pentru titluri (cald, cu personalitate, legat de lumea food/editorial) combinat cu Inter pentru text (clean, lizibil, fără distracții). Am ales DM Serif în loc de serif-uri mai comune (Playfair, Georgia) pentru că are un caracter mai intim, mai puțin „revistă de lux."

**Border-left pe carduri** — cardurile „ready" au un border verde la stânga, cele „almost" au portocaliu. Decizie subtilă dar eficientă: ochiul prinde prioritatea fără a citi textul.

**Spațiere generoasă** — gap-uri de 14px între carduri, padding interior de 20px. Aplicația trebuie să respire, mai ales pe mobile.

**Mobile-first** — breakpoint la 480px cu ajustări de padding și font-size. Chips-urile sunt suficient de mari pentru tap, cardurile sunt full-width.


## Arhitectura datelor

**Ingrediente (34 total)** — fiecare ingredient are: id unic (slug), nume afișat (în română), categorie. Am inclus doar ingrediente disponibile constant la Lidl România, nu produse sezoniere rare.

**Salate (32 total)** — fiecare salată are: nume, lista de ingrediente (referințe la id-uri), dressing (text descriptiv), și un tip (sfat din conversație). Rețetele provin din conversația noastră, plus câteva adăugate ulterior (ex. cele cu semințe de dovleac).

**Ingrediente interschimbabile** — anumite ingrediente joacă același rol și pot fi folosite unul în locul altuia. Sunt definite în grupuri (`SUB_GROUPS`): **feta ⇄ telemea** (brânză albă sărată) și **semințe de pin ⇄ floarea soarelui ⇄ dovleac** (crocant prăjit). Dacă o rețetă cere feta dar ai telemea, rețeta se potrivește — dar cardul afișează tot ingredientul canonic al rețetei, cu un indiciu discret („sau telemea"). Astfel știi mereu pentru ce a fost gândită rețeta, dar nu ești blocat de un singur ingredient. Regula din principiile culinare rămâne: nu folosi *ambele* membre ale unui grup în aceeași salată (dublu sărat-cremos).

**Algoritmul de matching (model „frigider")** — întrebarea aplicației e „ce pot face cu ce am?", cu două reguli care decurg din asta:

1. **Ingredientele în plus nu descalifică niciodată o rețetă.** Dacă ai ceva ce o rețetă nu folosește, rețeta tot apare — un frigider mai plin înseamnă mai multe opțiuni, nu mai puține (opusul comportamentului inițial, unde un ingredient în plus ascundea rețete).
2. **Selecția ta nu primește niciodată „nimic".** Orice rețetă care folosește măcar un ingredient pe care îl ai apare în rezultate. Pragurile de mai jos doar *prioritizează*, nu *exclud* — așa că „am doar ton" îți arată salatele cu ton, nu un ecran gol.

Pentru fiecare salată calculăm câte ingrediente ai (direct sau printr-un substitut) din total → procent, și o încadrăm într-un nivel (`tierOf`): **gata de făcut** (nu lipsește nimic), **aproape** (lipsesc 1–2 și ai deja majoritatea rețetei), sau **idei** (restul — rețete în care intră ce ai, dar mai departe). Sortare în fiecare nivel: cea mai completă întâi. Nivelul „idei" e plafonat (8 carduri) ca un singur ingredient foarte comun să nu umple ecranul.


## Inventarul rețetelor

Cele 32 de salate incluse, grupate după baza principală (unele au mai multe baze — ex. spanac + năut — și sunt numărate o singură dată):

**Pe bază de baby spinach (~12):** cu Ton și Fasole Albă, cu Avocado Kalamata și Năut, cu Feta și Năut, cu Avocado Kalamata și Ou, cu Roșii Uscate și Parmezan, cu Halloumi Prăjit, cu Ton Afumat, cu Struguri și Feta, cu Struguri și Gorgonzola, cu Roșii Cherry Telemea și Ou, cu Avocado și Semințe de Dovleac, cu Telemea și Semințe de Dovleac.

**Pe bază de năut (~9):** Nord-African, Românească, Mediteraneană, Italiană cu Ton, cu Ardei Copți, Tabbouleh, cu Struguri și Mentă, cu Roșii și Telemea, cu Ardei Copți și Dovleac.

**Pe bază de fasole albă (~6):** cu Ardei Copți și Rucola, Tonno e Fagioli, Bruschetta, cu Anghinare, Ton Afumat cu Fasole Albă, cu Roșii și Telemea.

**Pe bază de fasole roșie (3):** Stil Grecesc, Stil Mexican, cu Avocado și Telemea.

**Pe bază de ton (fără bază vegetală) (2):** cu Feta Capere și Rucola, cu Feta Stil Grecesc.


## Ce nu am inclus (și de ce)

**Căutare text** — cu 34 de ingrediente și 32 de rețete, nu e nevoie. Scanarea vizuală e suficientă la această scară.

**Salvare preferințe (localStorage)** — utilizatorul a cerut un fișier HTML simplu. Adăugarea de persistență ar complica fără beneficiu clar — selecția se face în 10 secunde.

**Porțiuni și cantități** — utilizatorul a cerut separat rețete concise (text simplu). Aplicația e pentru descoperire („ce pot face?"), nu pentru urmărirea rețetei pas cu pas.

**Filtru pe tip de dressing** — dressingul e notat pe fiecare card, dar nu e criteriu de filtrare. Nimeni nu deschide frigiderul și spune „am oțet de vin roșu, ce fac cu el?"

**Imagini** — nu am inclus fotografii ale salatelor. Ar fi crescut complexitatea fără beneficiu real — utilizatorul știe cum arată o salată de năut.


## Posibile îmbunătățiri viitoare

**Generare de listă de cumpărături** — selectezi salatele pe care vrei să le faci săptămâna asta, aplicația generează lista consolidată de ingrediente de cumpărat.

**Rețetă expandabilă** — tap pe un card deschide rețeta concisă completă (pași, cantități, timp), în stilul pe care utilizatorul l-a preferat în conversație.

**Adăugare de rețete noi** — un formular simplu pentru a adăuga combinații descoperite ulterior.

**Sezonalitate** — indicator vizual pentru ingredientele care sunt mai bune/ieftine în anumite luni (roșii vara, pere toamna).

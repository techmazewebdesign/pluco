type PolishPage = {
  title: string;
  description: string;
  points: readonly string[];
  related?: readonly [string, string][];
};

export const POLISH_PAGES = {
  'eu-residency': {
    title: 'Pobyt w Europie',
    description: 'Pomagamy porównać ścieżki pobytu w Europie związane z pracą, prowadzeniem firmy lub przeprowadzką z rodziną oraz uporządkować dokumenty.',
    points: ['Omawiamy cel przeprowadzki i dotychczasowy kraj zamieszkania.', 'Porównujemy możliwości i dokumenty dotyczące pracy, rodziny i środków finansowych.', 'W razie potrzeby koordynujemy dalszy kontakt z lokalnym specjalistą.'],
  },
  'spain-digital-nomad-visa': {
    title: 'Wiza dla cyfrowych nomadów w Hiszpanii',
    description: 'Pomagamy przygotować się do indywidualnej oceny hiszpańskiej wizy dla osób pracujących zdalnie, w tym uporządkować umowy i dokumenty dochodowe.',
    points: ['Przeglądamy sposób wykonywania pracy zdalnej i umowy.', 'Porządkujemy dokumenty potwierdzające dochody i doświadczenie zawodowe.', 'Ustalamy, jakie pytania dotyczące rodziny, ubezpieczenia i przygotowania wniosku wymagają dalszej weryfikacji.'],
  },
  'new-identity': {
    title: 'Planowanie drugiego obywatelstwa',
    description: 'Pomagamy sprawdzić, czy dana ścieżka drugiego obywatelstwa zasługuje na dalszą analizę, z uwzględnieniem obywatelstwa, historii pobytu i źródła środków.',
    points: ['Omawiamy dotychczasowe obywatelstwa i historię zamieszkania.', 'Porządkujemy dokumentację finansową oraz informacje potrzebne do weryfikacji.', 'Wskazujemy, które wymogi programu należy potwierdzić przed podjęciem zobowiązań.'],
  },
  'sao-tome-citizenship-by-investment': {
    title: 'Obywatelstwo Wysp Świętego Tomasza i Książęcej przez inwestycję',
    description: 'Wstępna analiza możliwości, kompletności dokumentów i zagadnień związanych z weryfikacją inwestora przed podjęciem decyzji.',
    points: ['Identyfikujemy informacje wymagające niezależnego potwierdzenia.', 'Porządkujemy dokumenty rodzinne oraz dowody pochodzenia środków.', 'Przed rozpoczęciem współpracy ustalamy jej zakres na piśmie.'],
  },
  'us-green-card': {
    title: 'Imigracja inwestycyjna do USA',
    description: 'Pomagamy uporządkować dokumentację rodzinną i finansową do wstępnej oceny ścieżki inwestycyjnej w USA przez odpowiednio wykwalifikowanego specjalistę.',
    points: ['Omawiamy cele rodziny i planowany kontekst inwestycji.', 'Porządkujemy dokumenty potwierdzające historię i źródło środków.', 'Przygotowujemy pytania do amerykańskiego doradcy imigracyjnego.'],
  },
  banking: {
    title: 'Wsparcie w sprawach bankowych',
    description: 'Pomagamy uporządkować dokumenty o pochodzeniu środków, historię korespondencji oraz odpowiedzi na pytania banku.',
    points: ['Przeglądamy dotychczasową korespondencję i zakres oczekiwanych dokumentów.', 'Porządkujemy informacje dotyczące dochodów, działalności i pochodzenia środków.', 'Koordynujemy kontakt z odpowiednim specjalistą, gdy sprawa wymaga dodatkowej oceny.'],
  },
  'banking-compliance': {
    title: 'Dokumentacja zgodności bankowej',
    description: 'Wsparcie przy przygotowywaniu dokumentacji na potrzeby kontroli zgodności w bankowości transgranicznej.',
    points: ['Ustalamy, czego dotyczy prośba banku.', 'Porządkujemy chronologię transakcji i dokumenty potwierdzające źródło środków.', 'Pomagamy przygotować jasne wyjaśnienia dla odpowiedniej instytucji.'],
  },
  'financial-discrimination': {
    title: 'Bariery w dostępie do usług finansowych',
    description: 'Pomagamy udokumentować problemy z dostępem do usług finansowych i przygotować sprawę do oceny przez właściwego specjalistę.',
    points: ['Zbieramy historię korespondencji i decyzji instytucji.', 'Porządkujemy fakty i określamy pytania, które wymagają wyjaśnienia.', 'Omawiamy możliwe dalsze kroki dostosowane do sytuacji.'],
  },
  'eu-company-registration': {
    title: 'Rejestracja spółki w Unii Europejskiej',
    description: 'Doradztwo w przygotowaniu do założenia spółki w UE oraz uporządkowaniu kwestii własności, działalności i dokumentacji bankowej.',
    points: ['Ustalamy cele działalności, strukturę właścicielską i potrzeby administracyjne.', 'Porządkujemy dokumenty wspólników i informacje biznesowe.', 'Koordynujemy dalsze działania z lokalnymi specjalistami od spraw spółek, księgowości i bankowości.'],
  },
  'international-contracts': {
    title: 'Umowy międzynarodowe',
    description: 'Pomagamy przygotować międzynarodową umowę do przeglądu i uporządkować warunki handlowe, zasady płatności oraz pytania do lokalnego prawnika.',
    points: ['Porządkujemy projekty umów i historię negocjacji.', 'Ustalamy obowiązki stron oraz kwestie języka, płatności i sporów.', 'Koordynujemy przegląd przez odpowiednio uprawnionego prawnika, gdy jest potrzebny.'],
  },
  'business-solutions': {
    title: 'Wsparcie dla firm w Europie',
    description: 'Pomagamy zaplanować wejście na rynek europejski, uporządkować administrację i przygotować rozwiązania cyfrowe z zespołem DESIVO.',
    points: ['Ustalamy cele firmy i potrzeby operacyjne.', 'Porządkujemy kwestie dotyczące spółki, rynku oraz procesów.', 'Określamy zakres pracy, zasoby i kolejne działania.'],
  },
  'dispute-resolution': {
    title: 'Spory transgraniczne',
    description: 'Pomagamy przygotować dokumentację i chronologię sporu transgranicznego do rozmów lub przeglądu przez właściwego specjalistę.',
    points: ['Zbieramy umowy, korespondencję i inne istotne materiały.', 'Odtwarzamy chronologię i ustalamy pilne kwestie do wyjaśnienia.', 'Koordynujemy przekazanie sprawy odpowiedniemu specjaliście.'],
  },
  'eu-property-purchase': {
    title: 'Zakup nieruchomości w Europie',
    description: 'Pomagamy przygotować dokumenty transakcji i finansowania oraz pytania do lokalnych doradców przy zakupie nieruchomości w Europie.',
    points: ['Ustalamy cel zakupu i planowany sposób korzystania z nieruchomości.', 'Porządkujemy dokumenty, uzgodnienia oraz informacje dotyczące finansowania.', 'Rozpatrujemy zakup i ewentualny wniosek pobytowy jako odrębne kwestie.'],
  },
  'iranian-clients': {
    title: 'Wsparcie dla klientów z Iranu',
    description: 'Informacje dla irańskich rodzin i przedsiębiorców zainteresowanych pobytem w Europie, dokumentacją bankową, rejestracją spółki lub innymi sprawami transgranicznymi.',
    points: ['Zaczynamy od ustalenia kraju pobytu, celu i zakresu sprawy.', 'Pomagamy uporządkować dokumenty i przygotować pytania do indywidualnej oceny.'],
    related: [['Przewodnik w języku perskim', '/fa/iranians-abroad']],
  },
  'about-us': {
    title: 'O Pluco Group',
    description: 'Pluco Group to warszawska spółka wspierająca klientów indywidualnych, rodziny międzynarodowe i przedsiębiorców w sprawach transgranicznych.',
    points: ['Zespół pomaga uporządkować dokumentację i ustalić dalsze kroki.', 'W sprawach wymagających kwalifikacji zawodowych koordynujemy współpracę z odpowiednimi niezależnymi specjalistami.', 'DESIVO wspiera projekty dotyczące rozwoju cyfrowego i procesów biznesowych.'],
  },
  industries: {
    title: 'Klienci i branże',
    description: 'Pracujemy z rodzinami międzynarodowymi, inwestorami i firmami, które potrzebują uporządkować sprawy związane z działalnością lub przeprowadzką za granicę.',
    points: ['Rodziny i osoby pracujące zdalnie planujące przeprowadzkę.', 'Przedsiębiorcy zakładający spółkę lub wchodzący na rynek europejski.', 'Inwestorzy analizujący sprawy nieruchomościowe i transgraniczne.'],
  },
  publications: {
    title: 'Publikacje i analizy',
    description: 'Materiały Pluco Group dotyczące mobilności międzynarodowej, bankowości i spraw transgranicznych.',
    points: [],
    related: [['Katalog publikacji w języku angielskim', '/publications'], ['Materiały w języku perskim', '/fa/iranians-abroad']],
  },
  consultants: {
    title: 'Konsultanci',
    description: 'Dobieramy formę wsparcia do rodzaju sprawy, kraju i potrzeb klienta.',
    points: ['Opisz krótko sprawę, abyśmy mogli ustalić, jaki rodzaj wsparcia jest potrzebny.'],
    related: [['Profile konsultantów w języku angielskim', '/consultants']],
  },
  contact: {
    title: 'Kontakt z Pluco Group',
    description: 'Skontaktuj się z zespołem w Warszawie, aby omówić sprawę lub przesłać poufne zapytanie.',
    points: [],
  },
  enquire: {
    title: 'Poufne zapytanie',
    description: 'Opisz krótko, czego dotyczy Twoja sprawa. Zespół Pluco Group skontaktuje się z Tobą w sprawie dalszych kroków.',
    points: [],
  },
  imprint: {
    title: 'Informacje o operatorze serwisu',
    description: 'Dane rejestrowe i kontaktowe PLUCO GROUP sp. z o.o., operatora serwisu plucogroup.com.',
    points: ['PLUCO GROUP SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Ksawerów 3, 02-656 Warszawa.', 'KRS 0000564904, NIP 5272739549, REGON 361874067.', 'DESIVO to dział Pluco Group zajmujący się rozwojem cyfrowym, systemami biznesowymi i automatyzacją. Zakres i warunki usług określa pisemne zlecenie.'],
  },
  disclaimer: {
    title: 'Zastrzeżenia prawne',
    description: 'Treści serwisu mają ogólny charakter informacyjny. Zakres i warunki usług ustalamy w pisemnym zleceniu.',
    points: ['Informacje w serwisie nie stanowią porady prawnej, podatkowej, finansowej, imigracyjnej ani inwestycyjnej.', 'Wysłanie zapytania nie tworzy stosunku prawnik–klient. Świadczenie usług zależy od ustalenia zakresu zlecenia, oceny sprawy i sprawdzenia ewentualnego konfliktu interesów.', 'W sprawach regulowanych pracę wykonuje odpowiednio uprawniony specjalista zgodnie z właściwymi przepisami.'],
    related: [['Pełne zastrzeżenia prawne w języku angielskim', '/disclaimer']],
  },
  'privacy-policy': {
    title: 'Polityka prywatności',
    description: 'Jak Pluco Group wykorzystuje dane przekazane przez formularze, newsletter i podczas korzystania z serwisu.',
    points: ['Możemy przetwarzać dane kontaktowe, dane firmowe, informacje techniczne i informacje z korespondencji, aby odpowiadać na zapytania, świadczyć usługi i chronić nasze prawa.', 'Opcjonalna analityka jest wyłączona do czasu wyrażenia zgody. Preferencje możesz zmienić w ustawieniach plików cookie.', 'W sprawie dostępu do danych, poprawienia lub usunięcia danych, sprzeciwu, przenoszenia danych albo cofnięcia zgody napisz na info@plucogroup.com.'],
    related: [['Pełna polityka prywatności w języku angielskim', '/privacy-policy']],
  },
} satisfies Record<string, PolishPage>;

export type PolishSlug = keyof typeof POLISH_PAGES;
export const polishSlugs = Object.keys(POLISH_PAGES) as PolishSlug[];

export function polishPage(slug: string): PolishPage | undefined {
  return Object.hasOwn(POLISH_PAGES, slug) ? POLISH_PAGES[slug as PolishSlug] : undefined;
}

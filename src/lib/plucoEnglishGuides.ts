export type EnglishGuideSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type EnglishGuide = {
  title: string;
  metadataTitle: string;
  description: string;
  searchIntent: string;
  keywords: readonly string[];
  persianPath: string;
  relatedServicePath: string;
  relatedServiceLabel: string;
  reviewedOn: string;
  readTime: string;
  sections: readonly EnglishGuideSection[];
  sources: readonly { label: string; url: string }[];
};

export const ENGLISH_GUIDES = {
  'choose-eu-residency-route': {
    title: 'How to Choose an EU Residency Route for Your Real Circumstances',
    metadataTitle: 'How to Choose the Right EU Residency Route',
    description:
      'A practical framework for comparing European residence routes by work, family, income, documentation, budget, and long-term obligations.',
    searchIntent: 'how to choose EU residency route',
    keywords: [
      'best EU residency option',
      'European residence permit comparison',
      'EU residency for international families',
    ],
    persianPath: '/fa/guides/choose-eu-residency-route',
    relatedServicePath: '/eu-residency',
    relatedServiceLabel: 'Review EU residency options',
    reviewedOn: '2026-07-26',
    readTime: '8 minute read',
    sections: [
      {
        heading: 'Start with the constraint, not the country',
        paragraphs: [
          'There is no single “best country for residency”. A route that works for a remote employee may not fit a company director, an investor, a family with school-age children, or a person whose income is difficult to document internationally.',
          'Begin by defining the real objective: work, company management, family reunification, study, investment, or a long-term personal base. Only then compare countries and permit categories against the same objective.',
        ],
        bullets: [
          'Current nationality and country of lawful residence',
          'Type, location, and continuity of income',
          'Needs of a spouse and dependent children',
          'Realistic application and maintenance budget',
          'Ability to provide banking, tax, and insurance evidence',
        ],
      },
      {
        heading: 'Compare eligibility and life after approval',
        paragraphs: [
          'A useful comparison covers legal eligibility, evidence quality, total cost, processing risk, renewal conditions, tax exposure, insurance, and physical-presence requirements. Focusing only on entry conditions can hide the obligations that determine whether the route remains sustainable.',
          'Official requirements should be checked again immediately before filing. Immigration rules, fees, consular procedures, and documentary standards can change.',
        ],
      },
      {
        heading: 'Recognise a credible preliminary assessment',
        paragraphs: [
          'A credible assessment identifies weaknesses as well as possible routes. It should ask about income, residence history, family members, insurance, criminal records, and source of funds before recommending a country.',
          'Before substantial payment, request a written scope that distinguishes professional fees, government charges, required evidence, third-party work, and matters outside the adviser’s control.',
        ],
      },
    ],
    sources: [
      {
        label: 'European Commission: EU Immigration Portal',
        url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal_en',
      },
    ],
  },
  'spain-digital-nomad-document-checklist': {
    title: 'Spain Digital Nomad Visa Document Checklist for International Applicants',
    metadataTitle: 'Spain Digital Nomad Visa Document Checklist',
    description:
      'How to organise remote-work, professional history, income, social-security, insurance, and family evidence before a Spain digital-nomad assessment.',
    searchIntent: 'Spain digital nomad visa document checklist',
    keywords: [
      'Spain remote work visa documents',
      'Spain digital nomad visa Iranian nationals',
      'international teleworker Spain evidence',
    ],
    persianPath: '/fa/guides/spain-digital-nomad-document-checklist',
    relatedServicePath: '/spain-digital-nomad-visa',
    relatedServiceLabel: 'Review a Spain digital-nomad case',
    reviewedOn: '2026-07-26',
    readTime: '9 minute read',
    sections: [
      {
        heading: 'Show that the work can genuinely be performed remotely',
        paragraphs: [
          'Spain’s international teleworker route is designed for third-country nationals who perform employment or professional activity remotely through digital means, primarily for organisations outside Spain. A job title alone does not establish this: duties, contracts, business activity, and the working arrangement should tell the same story.',
          'Employees and self-employed professionals require different evidence. An employee may need employer confirmation and employment-history documents; a contractor should be able to evidence genuine clients, contracts, invoices, and continuity of activity.',
        ],
      },
      {
        heading: 'Organise the file into five evidence groups',
        paragraphs: [
          'Early organisation exposes contradictions between contracts, bank credits, employer letters, corporate records, and application forms before translations and filings begin.',
        ],
        bullets: [
          'Identity, nationality, residence history, and criminal-record evidence',
          'Degree or relevant professional-experience documents',
          'Employment, client, and remote-work authorisation documents',
          'Income, invoices, bank credits, and continuity evidence',
          'Insurance, social-security, and accompanying-family documents',
        ],
      },
      {
        heading: 'Check legalisation and translation before bulk ordering',
        paragraphs: [
          'Foreign public documents may require legalisation, an apostille, or an official Spanish translation. The correct treatment depends on the issuing country, document, and authority receiving it.',
          'Financial thresholds and local procedures can change. Confirm the current official requirements for the applicant and each accompanying family member before relying on an amount quoted in an article or social post.',
        ],
      },
    ],
    sources: [
      {
        label: 'Spanish Ministry of Inclusion: international teleworkers',
        url: 'https://ciudadaniaexterior.inclusion.gob.es/gl/web/unidadgrandesempresas/teletrabajadores',
      },
      {
        label: 'Spanish Ministry of Foreign Affairs: national visa information',
        url: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Servicios-consulares.aspx',
      },
    ],
  },
  'eu-company-versus-residency': {
    title: 'EU Company Registration Is Not the Same as EU Residency',
    metadataTitle: 'EU Company Registration vs EU Residency',
    description:
      'The practical difference between owning a European company, managing it, working locally, holding a bank account, and obtaining a personal residence right.',
    searchIntent: 'does EU company registration give residency',
    keywords: [
      'European company versus residence permit',
      'EU company formation immigration',
      'company ownership right to work Europe',
    ],
    persianPath: '/fa/guides/eu-company-versus-residency',
    relatedServicePath: '/eu-company-registration',
    relatedServiceLabel: 'Review an EU company structure',
    reviewedOn: '2026-07-26',
    readTime: '7 minute read',
    sections: [
      {
        heading: 'The company and the individual have separate legal positions',
        paragraphs: [
          'Registering a legal entity may make a person a shareholder or director, but it does not automatically grant that person a visa, residence permit, or unrestricted local work right. Company law and immigration law answer different questions.',
          'Some countries offer entrepreneur or management-based residence routes, but those applications may examine the person’s role, business plan, funding, economic activity, and local benefit independently of incorporation.',
        ],
      },
      {
        heading: 'Choose the jurisdiction for the operating business',
        paragraphs: [
          'The appropriate country should reflect the market, management, staff, suppliers, tax position, and actual activity—not only the lowest advertised registration cost.',
        ],
        bullets: [
          'Where customers and commercial activity are located',
          'Where effective management takes place',
          'How payments and banking will operate',
          'How beneficial ownership and capital will be evidenced',
          'Which licences, tax filings, and annual reports are required',
        ],
      },
      {
        heading: 'Bank onboarding is a separate assessment',
        paragraphs: [
          'Successful incorporation does not guarantee a bank or payment account. Financial institutions separately assess ownership, business model, countries involved, customers, transaction flows, sanctions exposure, and customer due diligence.',
          'Company, tax, banking, and residence planning should therefore be coordinated before filing rather than treated as unrelated steps.',
        ],
      },
    ],
    sources: [
      {
        label: 'Your Europe: starting a business in the EU',
        url: 'https://europa.eu/youreurope/business/running-business/start-ups/starting-business/index_en.htm',
      },
      {
        label: 'European Commission: EU Immigration Portal',
        url: 'https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal_en',
      },
    ],
  },
  'source-of-funds-file': {
    title: 'How to Prepare a Source-of-Funds File for a European Bank',
    metadataTitle: 'Source-of-Funds Documents for European Banks',
    description:
      'A document-led method for explaining where a specific sum came from, who owns it, how it moved, and why the transaction makes economic sense.',
    searchIntent: 'source of funds documents European bank',
    keywords: [
      'source of funds evidence checklist',
      'European bank compliance documents',
      'source of wealth versus source of funds',
    ],
    persianPath: '/fa/guides/source-of-funds-file',
    relatedServicePath: '/banking',
    relatedServiceLabel: 'Review banking and source-of-funds evidence',
    reviewedOn: '2026-07-26',
    readTime: '10 minute read',
    sections: [
      {
        heading: 'Separate source of funds from source of wealth',
        paragraphs: [
          'Source of funds explains the origin of money used for a particular transaction—for example salary, a company distribution, a property sale, inheritance, or a loan. Source of wealth describes how a person accumulated their wider assets over time.',
          'A bank may ask about one or both depending on risk. The objective is not to create a persuasive story; it is to provide an explanation that remains consistent with independent documents, dates, amounts, and account movements.',
        ],
      },
      {
        heading: 'Build a file another reviewer can follow',
        paragraphs: [
          'Start with a one-page chronology, then connect every material claim to the relevant evidence and transaction trail.',
        ],
        bullets: [
          'Purpose and amount of the transaction',
          'Chronology showing how the funds were generated and moved',
          'Contract, employment, sale, gift, loan, or inheritance evidence',
          'Statements for originating, intermediary, and receiving accounts',
          'Relevant tax and company records',
          'Beneficial-owner and third-party explanations',
        ],
      },
      {
        heading: 'Resolve inconsistencies before submission',
        paragraphs: [
          'Differences in names, dates, amounts, currencies, ownership, or the role of an intermediary can delay a review. If funds passed through several accounts or countries, explain the legitimate reason for each stage.',
          'No adviser can compel a financial institution to accept a customer or transaction. The institution remains responsible for its customer due diligence, sanctions screening, and transaction-monitoring decisions.',
        ],
      },
    ],
    sources: [
      {
        label: 'European Commission: EU anti-money-laundering framework',
        url: 'https://finance.ec.europa.eu/financial-crime/anti-money-laundering-and-countering-financing-terrorism-eu-level_en',
      },
      {
        label: 'European Commission: due-diligence guidance',
        url: 'https://finance.ec.europa.eu/publications/guidance-due-diligence_en',
      },
    ],
  },
  'poland-company-registration-iranian-founders': {
    title: 'Poland Company Registration for Iranian Founders: Structure, Banking, and Residence',
    metadataTitle: 'Poland Company Registration for Iranian Founders',
    description:
      'A risk-aware preparation guide for Iranian founders considering a Polish company, covering legal form, ownership, activity, tax, banking, and personal immigration status.',
    searchIntent: 'Poland company registration Iranian founders',
    keywords: [
      'register company Poland Iranian national',
      'Polish company for Iranian entrepreneur',
      'Sp z oo Iranian shareholder',
    ],
    persianPath: '/fa/guides/poland-company-registration-iranian-founders',
    relatedServicePath: '/eu-company-registration',
    relatedServiceLabel: 'Review a Poland company plan',
    reviewedOn: '2026-07-26',
    readTime: '11 minute read',
    sections: [
      {
        heading: 'Select the legal form before preparing filings',
        paragraphs: [
          'A Polish limited liability company and a sole-trader registration have different eligibility, governance, tax, liability, and registration rules. A non-EU national’s ability to operate as a sole trader can depend on residence status, while a company must be analysed under the rules for its chosen legal form.',
          'The structure should reflect the real shareholders, directors, decision-making, business activity, and capital. Nominee or artificial arrangements create legal, banking, and beneficial-ownership risk.',
        ],
      },
      {
        heading: 'Prepare the operating file, not only the registration file',
        paragraphs: [
          'Registration is one stage. The company may also need a registered address, activity codes, tax registrations, accounting, beneficial-owner filings, contracts, and licences depending on what it will actually do.',
        ],
        bullets: [
          'Shareholders, directors, signatory powers, and beneficial ownership',
          'Business model, customers, suppliers, and target countries',
          'Registered address and place of effective management',
          'PKD activity codes, VAT position, and accounting plan',
          'Capital source and expected payment flows',
          'Banking and payment-provider onboarding evidence',
        ],
      },
      {
        heading: 'Keep company registration, banking, and residence separate',
        paragraphs: [
          'A registered company does not guarantee a bank account, and share ownership does not automatically create a residence or work right. Each institution or authority applies its own legal criteria and evidence requirements.',
          'For Iranian-linked structures, prepare a transparent explanation of lawful residence, business purpose, customers, source of capital, transaction countries, and sanctions controls. Do not conceal nationality, ownership, or payment routes.',
        ],
      },
    ],
    sources: [
      {
        label: 'Polish Ministry portal: registering a business',
        url: 'https://biznes.gov.pl/en/firma/doing-business-in-poland/company-registration-in-poland',
      },
      {
        label: 'Polish Ministry portal: what to know before registering',
        url: 'https://biznes.gov.pl/en/portal/001823',
      },
      {
        label: 'Polish National Court Register search',
        url: 'https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/',
      },
    ],
  },
  'spain-property-purchase-iranian-buyers': {
    title: 'Buying Property in Spain as an Iranian National: Legal and Banking Checks',
    metadataTitle: 'Buying Property in Spain as an Iranian National',
    description:
      'A guide for Iranian buyers covering title review, contracts, tax identification, source of funds, payment routes, and residence considerations.',
    searchIntent: 'buy property Spain Iranian national',
    keywords: [
      'Spain property purchase Iranian buyer',
      'source of funds Spanish property purchase',
      'buying house Spain non EU national documents',
    ],
    persianPath: '/fa/guides/spain-property-purchase-iranian-buyers',
    relatedServicePath: '/eu-property-purchase',
    relatedServiceLabel: 'Review a Spain property purchase',
    reviewedOn: '2026-07-26',
    readTime: '11 minute read',
    sections: [
      {
        heading: 'Confirm the buyer, property, and purpose before paying',
        paragraphs: [
          'Before a reservation payment or deposit, confirm who will own the property, whether financing is required, how the purchase funds were generated, and whether the objective is personal use, investment, or part of a separate residence strategy.',
          'Property ownership and immigration status are separate. A purchase should not proceed on the assumption that ownership alone creates a visa, residence right, or guaranteed immigration outcome.',
        ],
      },
      {
        heading: 'Run legal and transaction due diligence',
        paragraphs: [
          'Independent review should cover title, registered charges, seller authority, planning and occupancy issues, community debts where relevant, the contract, completion conditions, and allocation of taxes and expenses.',
        ],
        bullets: [
          'Identity, ownership structure, and Spanish tax-identification needs',
          'Land Registry information and registered encumbrances',
          'Seller authority and contract terms',
          'Planning, occupancy, and community documentation',
          'Taxes, professional fees, and completion costs',
          'Payment schedule and conditions for recovering a deposit',
        ],
      },
      {
        heading: 'Prepare the source and route of funds early',
        paragraphs: [
          'Banks, lawyers, notaries, and other obliged entities may request evidence explaining the beneficial owner, source, and transfer route of the purchase funds. A clean file connects the original economic event to account statements and the final payment.',
          'If Iran, third-country intermediaries, gifts, company funds, or multiple currencies are involved, obtain jurisdiction-specific sanctions and tax advice before moving money. Never split or disguise payments to avoid compliance review.',
        ],
      },
    ],
    sources: [
      {
        label: 'Your Europe: buying a house and national tax links',
        url: 'https://europa.eu/youreurope/citizens/residence/documents-formalities/buying-house/index_en.htm',
      },
      {
        label: 'Spanish Land Registrars',
        url: 'https://www.registradores.org/',
      },
      {
        label: 'Spanish Tax Agency',
        url: 'https://sede.agenciatributaria.gob.es/',
      },
    ],
  },
  'eu-bank-account-opening-iranian-nationals': {
    title: 'Opening a European Bank Account as an Iranian National: Evidence Checklist',
    metadataTitle: 'EU Bank Accounts for Iranian Nationals: Evidence Guide',
    description:
      'Evidence Iranian nationals living abroad should prepare for bank onboarding, including residence, tax, activity, source of funds and expected transactions.',
    searchIntent: 'open European bank account Iranian national',
    keywords: [
      'European bank account Iranian passport',
      'bank KYC documents Iranian national',
      'EU bank account source of funds checklist',
    ],
    persianPath: '/fa/guides/eu-bank-account-opening-iranian-nationals',
    relatedServicePath: '/banking',
    relatedServiceLabel: 'Review a bank onboarding file',
    reviewedOn: '2026-07-26',
    readTime: '10 minute read',
    sections: [
      {
        heading: 'Eligibility and acceptance are different questions',
        paragraphs: [
          'A person may be legally resident and still face detailed onboarding questions. Banks apply customer due diligence, sanctions controls, product eligibility, and internal risk policies. Requirements vary by country, institution, account type, residence, and intended activity.',
          'The EU right to a basic payment account applies in defined circumstances and is not a universal guarantee for every product, business account, country, or sanctions-sensitive situation.',
        ],
      },
      {
        heading: 'Prepare one consistent onboarding file',
        paragraphs: [
          'The application, supporting documents, and interview answers should describe the same identity, residence, occupation, tax position, funding, and expected account use.',
        ],
        bullets: [
          'Passport, lawful residence, address, and tax-residence evidence',
          'Employment, professional activity, company, or study documents',
          'Source-of-income and source-of-funds records',
          'Expected incoming and outgoing payment countries',
          'Purpose of the account and anticipated transaction levels',
          'Explanation of Iran-linked parties, travel, or transfers where relevant',
        ],
      },
      {
        heading: 'Avoid shortcuts that create a larger risk',
        paragraphs: [
          'Do not hide nationality, residence, beneficial ownership, counterparties, or the origin of funds. Do not use an address, director, shareholder, or payment narrative that does not reflect reality.',
          'If an institution declines the application, ask whether it can provide the applicable reason or complaint route. A different institution may have different product and risk criteria, but repeated inconsistent applications can make future explanations harder.',
        ],
      },
    ],
    sources: [
      {
        label: 'Your Europe: bank accounts in the EU',
        url: 'https://europa.eu/youreurope/citizens/consumers/financial-products-and-services/bank-accounts-eu/index_en.htm',
      },
      {
        label: 'European Banking Authority: consumer information',
        url: 'https://www.eba.europa.eu/activities/information-consumers',
      },
      {
        label: 'European Commission: national sanctions authorities',
        url: 'https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures/contacts-eu-sanctions_en',
      },
    ],
  },
} as const satisfies Record<string, EnglishGuide>;

export type EnglishGuideSlug = keyof typeof ENGLISH_GUIDES;

export function isEnglishGuideSlug(value: string): value is EnglishGuideSlug {
  return value in ENGLISH_GUIDES;
}

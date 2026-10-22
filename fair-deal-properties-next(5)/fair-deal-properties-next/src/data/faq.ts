/** Frequently asked questions. Published as FAQPage structured data on /faq. */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    "question": "What exactly makes Fair Deal Properties different from other Nigerian real estate firms?",
    "answer": "We are Nigeria's only firm that genuinely combines real estate agency with independent financial advisory in a single integrated engagement. We are not commission-only brokers. Every listing is independently verified before presentation. We have a dedicated diaspora advisory service. And our engagement continues post-transfer - not just until the commission is paid. Most critically: we list nothing we have not physically inspected and legally verified. This is not standard practice in Nigeria's market. It is our non-negotiable standard."
  },
  {
    "question": "How do you verify listings, and what does 'title verified' actually mean?",
    "answer": "Our verification process involves three steps: a physical site inspection conducted by our team (not delegated to third parties), a full document review (C of O, R of O, Survey Plans, Deed of Assignment chains), and an independent title search through our legal team with the relevant land registry. 'Title verified' means we have confirmed, in writing, that the title documents presented are genuine, that the ownership claim is supported by the registry records, and that there are no encumbrances or adverse claims we have been able to identify. You receive a written verification report before any commitment is made."
  },
  {
    "question": "I am based in the UK (or US/Canada). Can I really complete a property transaction without travelling to Nigeria?",
    "answer": "Yes - fully. Our Diaspora Advisory Package is specifically built for remote transactions. We have completed multiple transactions for clients in the UK, USA, Canada, and Europe without a single Nigeria visit required. We conduct the site inspection, manage the legal process, handle document custody, facilitate payments through secure channels, and provide video/photo evidence at every milestone. Many clients choose to visit post-transfer (to see their asset), but it is never required for the transaction itself."
  },
  {
    "question": "What are your fees, and how are you compensated?",
    "answer": "We are transparent about our compensation model because opacity in this area is one of our industry's biggest problems. We earn advisory fees and transaction facilitation fees, which are discussed and agreed in writing before any engagement begins. We do not receive undisclosed commissions from sellers or developers. Where we receive fees from both sides of a transaction, this is disclosed to both parties in advance. Our advisory-first model means our interests are aligned to your outcome - not to closing the fastest transaction at any cost."
  },
  {
    "question": "Do you provide financing directly, or only advise on it?",
    "answer": "We do not lend. We are not a financial institution and we do not hold or deploy capital on behalf of clients. Our financing advisory service involves needs assessment, lender introductions, term review and guidance, and deal structuring - all on an advisory basis. We maintain relationships with credible bridge-financing providers and can facilitate introductions where appropriate, ensuring you understand every term before you commit. This distinction - advising on financing rather than providing it - is important to maintaining our independence and our clients' trust."
  },
  {
    "question": "What happens after the title is transferred? Does your service end there?",
    "answer": "No. Post-transfer stewardship is part of our engagement, not an optional add-on. After title transfer, we continue to monitor your asset on the ground, provide quarterly market intelligence relevant to your holding, facilitate rental management referrals if you choose to let the property, and remain available for advisory on future disposal, reinvestment, or financing decisions. Your investment continues for years after the transaction - and so do we."
  },
  {
    "question": "Which cities and markets do you operate in?",
    "answer": "Our primary markets are Abuja (where we are headquartered), Lagos, and Port Harcourt. We operate actively and have on-ground verification capability in all three cities. For diaspora clients, we serve investors from the UK, USA, Canada, Europe, Middle East, and other jurisdictions. We do not claim to cover markets we cannot properly serve - if you are looking at an opportunity outside our active markets, we will tell you directly and help you identify the right local advisory resource."
  }
];

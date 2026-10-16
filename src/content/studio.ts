export const hero = {
  label: "Architecture & Interiors",
  typologies: ["Private houses", "Apartments & interiors", "Hospitality", "Cultural pavilions"],
  statement:
    "New houses, apartment renovations, and small hospitality and public interiors. Each begins with how light, climate and daily life move through the site, and ends in calm rooms made from a few lasting materials.",
  figureAsset: "hero-courtyard-dusk",
  figureCaption: "Courtyard House — the inner court in late afternoon. Conceptual project.",
  figureProject: "courtyard-house",
};

export const studio = {
  label: "Studio",
  heading: "We work slowly, from the site inward.",
  paragraphs: [
    "Every project begins as a careful negotiation between place and use. Before a wall is drawn, we study how light crosses the site through the day, how people will arrive, pause and gather, and which materials belong to the landscape around them.",
    "The result is architecture of few gestures: considered proportions, honest materials and details resolved until they disappear. Rooms feel calm because nothing in them is accidental.",
  ],
  asset: "studio-plaster-model",
  assetCaption: "Plaster massing model, Courtyard House.",
  principles: [
    {
      title: "Light",
      body: "Daylight is our first material. Openings, reveals and ceilings are shaped to give each room its own quality of light.",
    },
    {
      title: "Material",
      body: "We favour natural, durable materials that age with grace — stone, timber, lime and concrete.",
    },
    {
      title: "Proportion",
      body: "Measured relationships between rooms, openings and furniture bring a quiet order to everyday life.",
    },
    {
      title: "Context",
      body: "Climate, landscape and local craft set the terms of each design, not the other way around.",
    },
  ],
};

export const approach = {
  label: "Approach",
  heading: "How a project takes shape.",
  intro:
    "A clear sequence keeps every decision grounded, from the first visit to the site to the last joinery detail.",
  /** Each step ends in something the client sees and keeps. */
  sharedLabel: "Shared with you",
  bridge: "The first step is a conversation about your site.",
  steps: [
    {
      title: "Understand the site",
      body: "We begin by listening — to the brief, to the people it serves and to the site itself. Orientation, views, climate, history and regulation are recorded before any form is proposed.",
      shared: "A written brief and a record of the site",
    },
    {
      title: "Explore spatial possibilities",
      body: "Through sketches, plans and physical models we test several arrangements of rooms and thresholds, looking for the one that feels inevitable.",
      shared: "Sketches, plans and models of the options",
    },
    {
      title: "Decide material and light",
      body: "Materials are chosen alongside daylight studies. Stone, timber and finishes are sampled on site and observed in the light they will live in.",
      shared: "Daylight studies and material samples, seen on site",
    },
    {
      title: "Refine through detail",
      body: "Drawings resolve every junction — where floor meets wall, where door meets frame — so the finished space reads as calm and complete.",
      shared: "Detailed drawings of every junction",
    },
  ],
};

/**
 * The same viewpoint of the Reading Pavilion photographed (as generated
 * images) in afternoon light and at dusk — the two files align exactly, so
 * they can be compared directly.
 */
export const lightStudy = {
  label: "Light study",
  heading: "Daylight is the first material.",
  body: "The Reading Pavilion's long window sits at seated eye level. By day it frames the meadow for whoever is reading; after dark it turns the room into a lantern at the edge of the garden. One opening, placed with care, does both.",
  before: { asset: "reading-pavilion-hero", label: "Afternoon" },
  after: { asset: "reading-pavilion-dusk", label: "Dusk" },
  project: "reading-pavilion",
  caption: "Reading Pavilion, conceptual project — the same view in afternoon light and at dusk.",
};

export const materials = {
  label: "Materials & detail",
  heading: "A small palette, carefully handled.",
  intro:
    "We work with a limited range of natural materials and let craft, proportion and daylight do the rest.",
  items: [
    {
      name: "Limestone",
      asset: "material-limestone",
      note: "Honed, in long courses. Cool underfoot, warm in low sun.",
    },
    {
      name: "Oak",
      asset: "material-oak",
      note: "Oiled and quietly joined, used wherever the hand meets the building.",
    },
    {
      name: "Lime plaster",
      asset: "material-lime-plaster",
      note: "Breathable and soft-edged, it carries daylight across a wall.",
    },
    {
      name: "Board-formed concrete",
      asset: "material-board-concrete",
      note: "Cast against timber, it keeps a record of how it was made.",
    },
  ],
};

export const contact = {
  label: "Start a project",
  heading: "Tell us about the space you have in mind.",
  body: "Bring a site, a floor plan or only an idea — the brief does not need to be finished. The first conversation is about the place and what you want from it, and whether the studio's way of working suits the project.",
  includeHeading: "Useful to include",
  include: [
    "Where the site is, and what is there today",
    "A new building, a renovation or an interior",
    "Timing and budget, even if approximate",
    "How you hope the space will feel",
  ],
  conceptNote:
    "Linesform Studio is a portfolio concept. Enquiries are delivered only when an enquiry service has been connected, and a confirmation is shown only after delivery succeeds.",
};

/**
 * Linesform Studio is fictional, so it has no clients. These statements are
 * illustrative copy that shows how client feedback would be presented; the
 * page labels every one of them as such. Never add names, ratings or
 * photographs, and never mark them up as reviews in structured data.
 */
export const testimonials = {
  label: "Client perspectives",
  heading: "How a quieter process feels.",
  intro:
    "Linesform Studio is a portfolio concept, so there are no real clients to quote. The statements below are illustrative, written to show how client feedback would be presented here. They are not words from real people.",
  attributionPrefix: "Illustrative statement",
  items: [
    {
      quote:
        "The house asks very little of us. Morning light finds the kitchen, the court holds the evening, and nothing needs explaining.",
      context: "Private residence",
    },
    {
      quote:
        "Every material was tested in the room it would live in. By the time work began, there were no surprises left.",
      context: "Apartment renovation",
    },
    {
      quote: "Guests notice the calm before they notice the design — which is exactly what we asked for.",
      context: "Hospitality interior",
    },
  ],
};

export const faq = {
  label: "Questions",
  heading: "Before you get in touch.",
  intro:
    "Practical answers about how the studio works, as presented in this concept. Nothing here is a promise of availability, fees or timescales.",
  items: [
    {
      id: "project-types",
      question: "What types of projects does the studio take on?",
      answer:
        "Houses, apartments and interiors, renovations, hospitality interiors and small cultural or public buildings — the range shown in the selected work. Scale matters less than a clear site and a shared interest in a considered process.",
    },
    {
      id: "locations",
      question: "Which locations does the studio work in?",
      answer:
        "As a portfolio concept, Linesform Studio has no real service area. Location is discussed for each enquiry: travel, local regulations and the collaborators a site needs are agreed case by case rather than promised in advance.",
    },
    {
      id: "enquiry-contents",
      question: "What should a project enquiry include?",
      answer:
        "Where the site is and what is there today, what you would like to build or change, an indicative timeline and budget if you have them, and a few words about how you hope the space will feel. Drawings and photographs can follow later.",
    },
    {
      id: "unfinished-brief",
      question: "Do I need a finished brief or drawings first?",
      answer:
        "No. A site, a floor plan or only an idea is enough to begin. The brief is written together in the first stage of the process, which ends with a written brief and a record of the site.",
    },
    {
      id: "first-conversation",
      question: "How does the first conversation work?",
      answer:
        "An enquiry is answered with an open conversation about the site, the brief and its constraints. It is not a proposal: its purpose is to understand whether the studio's way of working suits the project.",
    },
    {
      id: "renovations",
      question: "Does the studio work on renovations and interiors?",
      answer:
        "Yes. The Atelier Apartment reworks a 1930s apartment, and Hotel Calcare is an interior within a former stone workshop. Existing buildings receive the same attention to light, material and proportion as new ones.",
    },
    {
      id: "timelines-budgets",
      question: "What should I know about timelines and budgets?",
      answer:
        "Both depend on the site, the scope and the approvals a project needs, so the studio does not quote standard durations or fees. An indicative budget range in your enquiry — or simply “not yet defined” — helps frame the first conversation honestly.",
    },
    {
      id: "concept",
      question: "Is Linesform Studio a real practice?",
      answer:
        "No. It is a fictional practice created by Midline Seven as a portfolio concept. The projects, sites and images are design studies, and the form says plainly whether an enquiry was delivered — it never reports success unless delivery is confirmed.",
    },
  ],
};

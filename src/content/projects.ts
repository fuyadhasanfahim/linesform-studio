export interface ProjectFact {
  label: string;
  value: string;
}

export interface GalleryItem {
  asset: string;
  caption: string;
}

export interface MaterialNote {
  name: string;
  note: string;
}

export interface SpatialNote {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Always identified as conceptual — these are not real commissions. */
  location: string;
  year: number;
  summary: string;
  intro: string;
  heroAsset: string;
  /** A 3:4 image used where a layout calls for a portrait card. */
  portraitAsset: string;
  facts: ProjectFact[];
  concept: {
    heading: string;
    paragraphs: string[];
  };
  gallery: GalleryItem[];
  materials: MaterialNote[];
  spatialNotes: SpatialNote[];
  quote: string;
  closing: string;
}

export const projects: Project[] = [
  {
    slug: "courtyard-house",
    title: "Courtyard House",
    category: "Private residence",
    location: "Conceptual site · coastal hinterland",
    year: 2026,
    summary:
      "A single-storey house arranged around a walled court, where thick limestone walls temper the heat and frame the sky.",
    intro:
      "Set into a dry, gently sloping site, the Courtyard House turns inward. A sequence of rooms wraps a central court planted with a single olive tree, so that every space looks onto shade, water and changing light.",
    heroAsset: "courtyard-house-hero",
    portraitAsset: "courtyard-house-living",
    facts: [
      { label: "Typology", value: "Private residence" },
      { label: "Site", value: "Conceptual · Mediterranean climate" },
      { label: "Area", value: "c. 320 m² (conceptual)" },
      { label: "Status", value: "Concept study, 2026" },
    ],
    concept: {
      heading: "A house that holds the light still.",
      paragraphs: [
        "The plan is organised by one gesture: a continuous limestone wall that encloses the court and steps outward to become the house. Deep window reveals and a generous roof overhang filter the summer sun while letting low winter light reach far into the rooms.",
        "Living spaces open fully to the court through oak-framed glazing. Bedrooms sit behind thicker walls for coolness and quiet. Between them, a covered loggia becomes the most used room of the house for most of the year.",
      ],
    },
    gallery: [
      {
        asset: "hero-courtyard-dusk",
        caption: "The inner court in late afternoon, its shallow pool reflecting the walls.",
      },
      {
        asset: "courtyard-house-living",
        caption: "Living room: honed limestone, oiled oak and a framed view to the court.",
      },
      {
        asset: "material-limestone",
        caption: "Limestone laid in long, low courses, honed to a soft sheen.",
      },
    ],
    materials: [
      { name: "Limestone", note: "Load-bearing walls in local stone, honed inside and out." },
      { name: "Oiled oak", note: "Window frames, doors and built-in joinery." },
      { name: "Lime render", note: "Breathable interior walls with softened edges." },
      { name: "Terracotta", note: "Unglazed tiles to the roof and the court paving." },
    ],
    spatialNotes: [
      {
        title: "Orientation",
        body: "Rooms face the court rather than the road. The main living space opens south-east to catch the morning light.",
      },
      {
        title: "Thermal mass",
        body: "Walls of 600 mm stone store the cool of the night and release it slowly through the day.",
      },
      {
        title: "Thresholds",
        body: "A shaded loggia mediates between inside and outside, extending the living area through most of the year.",
      },
    ],
    quote: "Every room looks onto shade, water or sky — never onto nothing.",
    closing:
      "The Courtyard House is a study in how a modest footprint, built from the ground it stands on, can offer privacy, comfort and a daily connection to light and season.",
  },
  {
    slug: "atelier-apartment",
    title: "Atelier Apartment",
    category: "Apartment renovation",
    location: "Conceptual site · 1930s city block",
    year: 2025,
    summary:
      "A top-floor apartment reorganised into calm, plaster-lined rooms connected by a single wall of oak joinery.",
    intro:
      "In an apartment of small, disconnected rooms, the design removes partitions to recover the building's original proportions and the long view from street to courtyard.",
    heroAsset: "atelier-apartment-hero",
    portraitAsset: "atelier-apartment-kitchen",
    facts: [
      { label: "Typology", value: "Apartment renovation" },
      { label: "Site", value: "Conceptual · upper floor, historic block" },
      { label: "Area", value: "c. 140 m² (conceptual)" },
      { label: "Status", value: "Concept study, 2025" },
    ],
    concept: {
      heading: "One spine, many rooms.",
      paragraphs: [
        "A continuous oak joinery wall runs the length of the plan, holding storage, the kitchen and a study desk. On either side, rooms are defined by soft lime-plaster walls and slender steel-framed screens that share daylight without giving up privacy.",
        "Original window openings are restored and lined in oak, giving each window a seat and making the thickness of the old walls part of daily life.",
      ],
    },
    gallery: [
      {
        asset: "atelier-apartment-kitchen",
        caption: "The kitchen sits within the oak spine, beneath a single stone shelf.",
      },
      {
        asset: "atelier-apartment-passage",
        caption: "A curved plaster wall softens the passage to the bedrooms.",
      },
      {
        asset: "material-lime-plaster",
        caption: "Lime plaster carries daylight across the walls in soft gradients.",
      },
    ],
    materials: [
      { name: "Lime plaster", note: "Hand-trowelled walls and ceilings in a warm off-white." },
      { name: "Rift-sawn oak", note: "Joinery spine, window linings and seats, oiled." },
      { name: "Blackened steel", note: "Slim frames to the internal glazed screens." },
      { name: "Honed stone", note: "Kitchen worktop, shelf and thresholds." },
    ],
    spatialNotes: [
      {
        title: "Cross-ventilation",
        body: "Opening the plan restores air movement between the street and courtyard elevations.",
      },
      {
        title: "Storage wall",
        body: "Everything that needs a place is held within the oak spine, so the rooms themselves can stay empty and calm.",
      },
      {
        title: "Window seats",
        body: "Deep oak-lined reveals turn each window into a place to sit, read and watch the street.",
      },
    ],
    quote: "Renovation as subtraction: remove what blocks the light, then add only what is needed.",
    closing:
      "The Atelier Apartment explores how an ordinary city interior can be made generous through a single, well-made piece of architecture rather than many small interventions.",
  },
  {
    slug: "hotel-calcare",
    title: "Hotel Calcare",
    category: "Boutique hospitality interior",
    location: "Conceptual site · former stone workshop",
    year: 2026,
    summary:
      "Twelve guest rooms and a lounge set within the walls of a former stonemason's workshop, finished in travertine, linen and timber.",
    intro:
      "Hotel Calcare imagines a second life for a disused stone workshop. The heavy masonry shell is kept and repaired; inside, a lighter timber structure introduces rooms of human scale.",
    heroAsset: "hotel-calcare-hero",
    portraitAsset: "hotel-calcare-room",
    facts: [
      { label: "Typology", value: "Hospitality interior" },
      { label: "Site", value: "Conceptual · adaptive reuse" },
      { label: "Programme", value: "12 rooms, lounge, garden" },
      { label: "Status", value: "Concept study, 2026" },
    ],
    concept: {
      heading: "A heavy shell, a light interior.",
      paragraphs: [
        "The workshop's thick stone walls and tall arched openings define the character of the place. New elements stand slightly apart from them: chestnut floors and partitions that can be read, and one day removed, as a separate layer.",
        "Travertine, cut from the same region as the original stone, is used where water and touch are concentrated — at the fireplace, the reception desk and in every bathroom.",
      ],
    },
    gallery: [
      {
        asset: "hotel-calcare-room",
        caption: "A guest room: limewashed walls, linen and a deep stone window.",
      },
      {
        asset: "hotel-calcare-bath",
        caption: "Bathing rooms are lined entirely in honed travertine.",
      },
      {
        asset: "material-oak",
        caption: "Oiled oak joinery, detailed with shadow gaps instead of handles.",
      },
    ],
    materials: [
      { name: "Travertine", note: "Honed, for floors, basins and the lounge fireplace." },
      { name: "Chestnut and oak", note: "New timber floors, beams and joinery." },
      { name: "Lime wash", note: "Over repaired masonry, letting the old stone show through." },
      { name: "Linen", note: "Curtains, upholstery and bedding in natural tones." },
    ],
    spatialNotes: [
      {
        title: "Arrival",
        body: "Guests enter through the original cart door into a double-height lounge organised around the fire.",
      },
      {
        title: "Guest rooms",
        body: "Each room has a single deep window into the thick wall, set low enough to sit in.",
      },
      {
        title: "Bathing",
        body: "Bathrooms are treated as small stone rooms rather than fitted pods, lit by daylight wherever possible.",
      },
    ],
    quote:
      "Guests should feel the weight of the old walls and the warmth of the new rooms in the same moment.",
    closing:
      "Hotel Calcare proposes a hospitality interior grounded in repair and restraint, where the history of the building is part of the comfort it offers.",
  },
  {
    slug: "reading-pavilion",
    title: "Reading Pavilion",
    category: "Cultural pavilion",
    location: "Conceptual site · edge of a public garden",
    year: 2025,
    summary:
      "A small public reading room in a garden: a board-formed concrete shelter opened to the landscape through one long window.",
    intro:
      "The Reading Pavilion is a single room for reading, writing and looking out. Placed where a public garden meets an informal meadow, it offers shelter and stillness to anyone who walks in.",
    heroAsset: "reading-pavilion-hero",
    portraitAsset: "reading-pavilion-interior",
    facts: [
      { label: "Typology", value: "Cultural pavilion" },
      { label: "Site", value: "Conceptual · public garden" },
      { label: "Area", value: "c. 90 m² (conceptual)" },
      { label: "Status", value: "Concept study, 2025" },
    ],
    concept: {
      heading: "One room, one window, one long table.",
      paragraphs: [
        "A low concrete volume, cast against rough timber boards, sits lightly on a gravel plinth. A single long window frames the meadow at seated eye level, while a clerestory slot above washes the rear wall with daylight.",
        "Inside, everything is made for staying: a long oak table, built-in shelves and a deep window bench. Larch lines the soffit outside and returns as a warm ceiling within.",
      ],
    },
    gallery: [
      {
        asset: "reading-pavilion-interior",
        caption: "The reading room, with its long oak table and clerestory light.",
      },
      {
        asset: "reading-pavilion-dusk",
        caption: "At dusk the long window becomes a lantern at the edge of the meadow.",
      },
      {
        asset: "material-board-concrete",
        caption: "Board-formed concrete keeps a record of how it was made.",
      },
    ],
    materials: [
      { name: "Board-formed concrete", note: "Walls and roof, cast against rough-sawn boards." },
      { name: "Larch", note: "External soffit and internal ceiling, left to weather." },
      { name: "Oak", note: "Reading table, shelving and window bench." },
      { name: "Glass", note: "One frameless long window and a high clerestory." },
    ],
    spatialNotes: [
      {
        title: "Approach",
        body: "A gravel path crosses the meadow and arrives at a deep porch before the door.",
      },
      {
        title: "Daylight",
        body: "Low side light for reading, high indirect light for calm — never direct sun on the table.",
      },
      {
        title: "Openness",
        body: "No reception desk and no fixed programme: the pavilion is open to anyone in the garden.",
      },
    ],
    quote: "A building small enough to be understood at a glance, and quiet enough to stay in for hours.",
    closing:
      "The Reading Pavilion tests how a modest public building, made from very few materials, can give a neighbourhood a room of its own.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectIndex(slug: string): number {
  return projects.findIndex((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = getProjectIndex(slug);
  return projects[(index + 1) % projects.length];
}

export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

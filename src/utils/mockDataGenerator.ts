import { Application } from '@/types/planning';

const streets = [
  "High Street", "Station Road", "Church Street", "Mill Lane", "School Lane",
  "Atterbury Boulevard", "Silbury Boulevard", "Midsummer Boulevard", "Saxon Street",
  "Portway", "Chaffron Way", "Childs Way", "Marlborough Street", "Grafton Street",
  "Watling Street", "Tongwell Street", "Brickhill Street", "Shenley Road"
];

const areas = [
  "Bletchley", "Wolverton", "Stony Stratford", "Newport Pagnell", "Woburn Sands",
  "Olney", "Central Milton Keynes", "Shenley Church End", "Shenley Brook End",
  "Walnut Tree", "Wavendon", "Loughton", "Great Linford", "Bradwell",
  "Two Mile Ash", "Bancroft", "Bradville", "Broughton"
];

const types = [
  "Extension Residential",
  "Extension Commercial",
  "New Build Residential",
  "New Build Commercial",
  "Change of Use",
  "Listed Building",
  "Conservation Area",
  "Outline Planning"
];

const statuses = [
  "Under Review",
  "Approved",
  "Declined",
  "Pending Decision",
  "Withdrawn",
  "Awaiting Documents"
];

const officers = [
  "Lisa Johnson", "Mark Thompson", "Sarah Williams", "David Chen", 
  "Emma Wilson", "James Roberts", "Patricia Lee", "Michael Brown",
  "Robert Taylor", "John Davies"
];

const wards = [
  "Campbell Park", "Central Milton Keynes", "Woughton", "Bradwell",
  "Stantonbury", "Olney", "Newport Pagnell", "Bletchley East",
  "Bletchley West", "Wolverton", "Stony Stratford", "Loughton"
];

const planningImages = [
  "/lovable-uploads/5138b4f3-8820-4457-9664-4a7f54b617a9.png",
  "/lovable-uploads/2a1a1b3d-4e95-4458-a340-d34de8863e11.png",
  "/lovable-uploads/fee12637-0d93-4e12-8044-b053cc205245.png"
];

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateReference = (index: number): string => {
  const year = new Date().getFullYear();
  return `MK/${year}/${String(index + 1).padStart(4, '0')}`;
};

// Generate random coordinates within London area
const generateRandomLondonCoordinates = (): [number, number] => {
  // London approximate bounds
  const londonBounds = {
    minLat: 51.28,
    maxLat: 51.686,
    minLng: -0.489,
    maxLng: 0.236
  };

  const lat = londonBounds.minLat + Math.random() * (londonBounds.maxLat - londonBounds.minLat);
  const lng = londonBounds.minLng + Math.random() * (londonBounds.maxLng - londonBounds.minLng);

  return [lat, lng];
};

export const generateMockApplications = (count: number): Application[] => {
  const applications: Application[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const threeMonthsAhead = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  for (let i = 0; i < count; i++) {
    const submissionDate = getRandomDate(threeMonthsAgo, now);
    const decisionDue = getRandomDate(now, threeMonthsAhead);
    const consultationEnd = new Date(decisionDue);
    consultationEnd.setDate(decisionDue.getDate() - 14);

    const houseNumber = Math.floor(Math.random() * 300) + 1;
    const street = getRandomElement(streets);
    const area = getRandomElement(areas);
    
    const application: Application = {
      id: i + 1,
      title: `${getRandomElement([
        "Proposed", "New", "Renovation of", "Conversion of", "Extension to"
      ])} ${getRandomElement([
        "Single Storey", "Two Storey", "Three Storey", "Double", "Rear", "Side"
      ])} ${getRandomElement([
        "Extension", "Development", "Building", "Property", "Complex", "Structure"
      ])}`,
      address: `${houseNumber} ${street}, ${area}, Milton Keynes, MK${Math.floor(Math.random() * 17) + 1} ${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      status: getRandomElement(statuses),
      distance: `${(Math.random() * 5).toFixed(1)} miles`,
      reference: generateReference(i),
      description: `${getRandomElement([
        "Development comprising", "Proposal for", "Application for", "Planning permission sought for"
      ])} ${getRandomElement([
        "construction", "conversion", "extension", "alteration", "renovation"
      ])} of ${getRandomElement([
        "residential property", "commercial premises", "existing building", "vacant site"
      ])} including ${getRandomElement([
        "internal modifications", "external alterations", "landscaping works", "parking provisions"
      ])} and ${getRandomElement([
        "associated works", "amenity improvements", "infrastructure updates", "sustainable features"
      ])}.`,
      applicant: `${getRandomElement([
        "Mr", "Mrs", "Ms", "Dr"
      ])} ${getRandomElement([
        "Smith", "Jones", "Williams", "Brown", "Taylor", "Davies", "Wilson", "Evans"
      ])}`,
      submissionDate: submissionDate.toISOString().split('T')[0],
      decisionDue: decisionDue.toISOString().split('T')[0],
      type: getRandomElement(types),
      ward: getRandomElement(wards),
      officer: getRandomElement(officers),
      consultationEnd: consultationEnd.toISOString().split('T')[0],
      image: getRandomElement(planningImages),
      coordinates: generateRandomLondonCoordinates()
    };

    applications.push(application);
  }

  return applications;
};
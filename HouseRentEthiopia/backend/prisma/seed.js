const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// This id represents a demo Supabase auth user you can replace with your own.
const DEMO_OWNER_ID = '00000000-0000-4000-8000-000000000001';

const houses = [
  {
    title: 'Modern 2 Bedroom Apartment in Bole',
    description:
      'Bright and modern apartment near Bole Medhanialem, close to Friendship Park, banks, and restaurants. Includes parking, 24h security, and fiber internet ready.',
    price: 45000,
    address: 'Bole Medhanialem, Atlas, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 8.9806,
    longitude: 38.7995,
    bedrooms: 2,
    bathrooms: 2,
    houseType: 'APARTMENT',
  },
  {
    title: 'Spacious Villa with Garden in Bole Bulbula',
    description:
      'Large villa with a private garden, 4 bedrooms, maids quarter, garage for two cars, and gated compound. Ideal for families.',
    price: 120000,
    address: 'Bole Bulbula, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 8.9695,
    longitude: 38.8043,
    bedrooms: 4,
    bathrooms: 3,
    houseType: 'VILLA',
  },
  {
    title: 'Cozy Condominium near Meskel Square',
    description:
      'Recently finished 10/90 and 20/80 condominium unit near Meskel Square. Walking distance to transport hubs and city center.',
    price: 18000,
    address: 'Meskel Square, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 9.01,
    longitude: 38.761,
    bedrooms: 1,
    bathrooms: 1,
    houseType: 'CONDOMINIUM',
  },
  {
    title: 'Studio Apartment in Kazanchis',
    description:
      'Compact, fully furnished studio perfect for professionals. Walking distance to UNECA, IT Park, and several embassies.',
    price: 22000,
    address: 'Kazanchis, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 9.015,
    longitude: 38.755,
    bedrooms: 0,
    bathrooms: 1,
    houseType: 'STUDIO',
  },
  {
    title: '3 Bed Townhouse in CMC Area',
    description:
      'Modern townhouse in a quiet CMC neighborhood with three bedrooms, backyard, and easy access to Mall of Addis and Bole Road.',
    price: 65000,
    address: 'CMC, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 8.9936,
    longitude: 38.8126,
    bedrooms: 3,
    bathrooms: 2,
    houseType: 'TOWNHOUSE',
  },
  {
    title: 'Affordable Apartment near Piassa',
    description:
      'Classic apartment in the historic Piassa/Arada district, close to markets, schools, and the National Museum.',
    price: 15000,
    address: 'Piassa, Addis Ababa',
    city: 'Addis Ababa',
    latitude: 9.03,
    longitude: 38.7422,
    bedrooms: 1,
    bathrooms: 1,
    houseType: 'APARTMENT',
  },
];

async function main() {
  const owner = await prisma.user.upsert({
    where: { id: DEMO_OWNER_ID },
    update: {},
    create: {
      id: DEMO_OWNER_ID,
      name: 'Demo Owner',
      email: 'demo.owner@houserentethiopia.com',
      password: null,
      role: 'OWNER',
      phoneNumber: '+251911000000',
    },
  });
  console.log(`Seeded owner: ${owner.name} (${owner.id})`);

  for (const h of houses) {
    const existing = await prisma.house.findFirst({
      where: { latitude: h.latitude, longitude: h.longitude },
    });
    if (existing) {
      console.log(`Skipping duplicate coordinates: ${h.title}`);
      continue;
    }
    await prisma.house.create({
      data: { ...h, ownerId: owner.id },
    });
    console.log(`Created house: ${h.title}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.premiumListing.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@houserentethiopia.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+251911000000',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create House Owners
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@example.com',
      password: hashedPassword,
      firstName: 'Abebe',
      lastName: 'Kebede',
      phone: '+251911111111',
      role: 'OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@example.com',
      password: hashedPassword,
      firstName: 'Tigist',
      lastName: 'Haile',
      phone: '+251922222222',
      role: 'OWNER',
    },
  });
  console.log(`✅ Owners created: ${owner1.email}, ${owner2.email}`);

  // Create Renters
  const renter1 = await prisma.user.create({
    data: {
      email: 'renter1@example.com',
      password: hashedPassword,
      firstName: 'Dawit',
      lastName: 'Tadesse',
      phone: '+251933333333',
      role: 'RENTER',
    },
  });

  const renter2 = await prisma.user.create({
    data: {
      email: 'renter2@example.com',
      password: hashedPassword,
      firstName: 'Sara',
      lastName: 'Mekonnen',
      phone: '+251944444444',
      role: 'RENTER',
    },
  });
  console.log(`✅ Renters created: ${renter1.email}, ${renter2.email}`);

  // Create Listings for Owner 1
  const listing1 = await prisma.listing.create({
    data: {
      ownerId: owner1.id,
      title: 'Modern 3-Bedroom Apartment in Bole',
      description: 'A beautifully furnished 3-bedroom apartment in the heart of Bole, Addis Ababa. Features modern kitchen, spacious living room, and a balcony with city views. Close to shopping malls and restaurants. 24/7 security and underground parking available.',
      price: 45000,
      address: 'Bole Road, Near Edna Mall',
      city: 'Addis Ababa',
      latitude: 9.0054,
      longitude: 38.7636,
      bedrooms: 3,
      bathrooms: 2,
      houseType: 'APARTMENT',
      status: 'AVAILABLE',
      isPremium: true,
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      ownerId: owner1.id,
      title: 'Cozy Studio near Meskel Square',
      description: 'Perfect studio apartment for a single professional or student. Fully furnished with a kitchenette, modern bathroom, and high-speed WiFi. Walking distance to Meskel Square and public transportation.',
      price: 15000,
      address: 'Kazanchis, Near Meskel Square',
      city: 'Addis Ababa',
      latitude: 9.0147,
      longitude: 38.7613,
      bedrooms: 1,
      bathrooms: 1,
      houseType: 'STUDIO',
      status: 'AVAILABLE',
    },
  });

  // Create Listings for Owner 2
  const listing3 = await prisma.listing.create({
    data: {
      ownerId: owner2.id,
      title: 'Spacious Villa in CMC',
      description: 'Luxurious 4-bedroom villa with a private garden and parking for 3 cars. Features a large kitchen, dining room, and a living area with fireplace. Ideal for families. Quiet neighborhood with 24/7 guard service.',
      price: 85000,
      address: 'CMC Road, Michael Area',
      city: 'Addis Ababa',
      latitude: 9.0379,
      longitude: 38.8353,
      bedrooms: 4,
      bathrooms: 3,
      houseType: 'VILLA',
      status: 'AVAILABLE',
      isPremium: true,
    },
  });

  const listing4 = await prisma.listing.create({
    data: {
      ownerId: owner2.id,
      title: '2-Bedroom Condo in Sarbet',
      description: 'Modern 2-bedroom condominium with an open floor plan. Features include a gym, swimming pool access, and rooftop terrace. Located in a secure compound with elevator access.',
      price: 35000,
      address: 'Sarbet, Behind Friendship Park',
      city: 'Addis Ababa',
      latitude: 8.9806,
      longitude: 38.7578,
      bedrooms: 2,
      bathrooms: 2,
      houseType: 'CONDO',
      status: 'AVAILABLE',
    },
  });

  const listing5 = await prisma.listing.create({
    data: {
      ownerId: owner2.id,
      title: 'Family House in Hawassa',
      description: 'Beautiful standalone house near Lake Hawassa. 3 bedrooms, large backyard, and a peaceful atmosphere. Perfect for families who love nature. Close to schools and the city center.',
      price: 25000,
      address: 'Piazza Area, Near the Lake',
      city: 'Hawassa',
      latitude: 7.0622,
      longitude: 38.4763,
      bedrooms: 3,
      bathrooms: 2,
      houseType: 'HOUSE',
      status: 'AVAILABLE',
    },
  });

  console.log(`✅ Listings created: ${listing1.title}, ${listing2.title}, ${listing3.title}, ${listing4.title}, ${listing5.title}`);

  // Create Premium Listing records
  await prisma.premiumListing.create({
    data: {
      listingId: listing1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      amountPaid: 500,
      status: 'ACTIVE',
    },
  });

  await prisma.premiumListing.create({
    data: {
      listingId: listing3.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amountPaid: 500,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Premium listings created');

  // Create Favorites
  await prisma.favorite.create({
    data: { userId: renter1.id, listingId: listing1.id },
  });
  await prisma.favorite.create({
    data: { userId: renter1.id, listingId: listing3.id },
  });
  await prisma.favorite.create({
    data: { userId: renter2.id, listingId: listing2.id },
  });
  console.log('✅ Favorites created');

  // Create a Conversation between renter1 and owner1 about listing1
  const conversation1 = await prisma.conversation.create({
    data: {
      listingId: listing1.id,
      participants: {
        createMany: {
          data: [
            { userId: renter1.id },
            { userId: owner1.id },
          ],
        },
      },
    },
  });

  // Create Messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation1.id,
        senderId: renter1.id,
        content: 'Hello! I am interested in the 3-bedroom apartment in Bole. Is it still available?',
        isRead: true,
      },
      {
        conversationId: conversation1.id,
        senderId: owner1.id,
        content: 'Yes, it is still available! Would you like to schedule a visit?',
        isRead: true,
      },
      {
        conversationId: conversation1.id,
        senderId: renter1.id,
        content: 'That would be great! How about this Saturday afternoon?',
        isRead: false,
      },
    ],
  });
  console.log('✅ Conversations and messages created');

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: owner1.id,
        type: 'NEW_MESSAGE',
        title: 'New message from Dawit',
        content: 'You have a new message about "Modern 3-Bedroom Apartment in Bole"',
        link: `/chat/${conversation1.id}`,
        isRead: false,
      },
      {
        userId: renter1.id,
        type: 'LISTING_UPDATE',
        title: 'Listing price updated',
        content: 'The price for "Spacious Villa in CMC" has been updated.',
        link: `/listings/${listing3.id}`,
        isRead: false,
      },
    ],
  });
  console.log('✅ Notifications created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('  Admin:   admin@houserentethiopia.com / Password123!');
  console.log('  Owner 1: owner1@example.com / Password123!');
  console.log('  Owner 2: owner2@example.com / Password123!');
  console.log('  Renter 1: renter1@example.com / Password123!');
  console.log('  Renter 2: renter2@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

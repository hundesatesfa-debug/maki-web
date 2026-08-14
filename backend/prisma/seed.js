"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    // Clean existing data (respect foreign keys)
    await prisma.transactionAuditLog.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.payoutAccount.deleteMany();
    await prisma.dispute.deleteMany();
    await prisma.adminLog.deleteMany();
    await prisma.notificationPreference.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.premiumListing.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.listingImage.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash('Password123!', 12);
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
            verifiedBadge: true,
            kycStatus: 'APPROVED',
            responseRate: 98,
            responseTimeHours: 2.5,
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
            verifiedBadge: true,
            kycStatus: 'APPROVED',
            responseRate: 95,
            responseTimeHours: 4,
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
            amenities: '["Wifi","Parking","24/7 Security","Elevator","Balcony","Furnished","Kitchen","Hot Water"]',
            imageUrls: JSON.stringify([
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
            ]),
            availableFrom: new Date(),
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
            amenities: '["Wifi","Furnished","Kitchenette","Hot Water","Laundry"]',
            imageUrls: JSON.stringify([
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
            ]),
            availableFrom: new Date(),
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
            amenities: '["Wifi","Parking","Garden","Fireplace","Gym","Security Guard","Furnished","Kitchen"]',
            imageUrls: JSON.stringify([
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop',
            ]),
            availableFrom: new Date(),
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
            amenities: '["Wifi","Gym","Swimming Pool","Elevator","Parking","24/7 Security"]',
            imageUrls: JSON.stringify([
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop',
            ]),
            availableFrom: new Date(),
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
            amenities: '["Parking","Garden","Furnished","Kitchen","Hot Water"]',
            imageUrls: JSON.stringify([
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop',
            ]),
            availableFrom: new Date(),
        },
    });
    console.log(`✅ Listings created: ${listing1.title}, ${listing2.title}, ${listing3.title}, ${listing4.title}, ${listing5.title}`);
    // Create listing images (mirror of imageUrls for consistency)
    const imageSets = {
        [listing1.id]: JSON.parse(listing1.imageUrls),
        [listing2.id]: JSON.parse(listing2.imageUrls),
        [listing3.id]: JSON.parse(listing3.imageUrls),
        [listing4.id]: JSON.parse(listing4.imageUrls),
        [listing5.id]: JSON.parse(listing5.imageUrls),
    };
    for (const [listingId, urls] of Object.entries(imageSets)) {
        for (const [index, url] of urls.entries()) {
            await prisma.listingImage.create({
                data: {
                    listingId,
                    url,
                    publicId: url.split('/').pop() || url,
                    order: index,
                },
            });
        }
    }
    console.log('✅ Listing images created');
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
    // Create a Booking + Payment + Review for a richer dataset
    const booking1 = await prisma.booking.create({
        data: {
            propertyId: listing1.id,
            tenantId: renter1.id,
            landlordId: owner1.id,
            moveInDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            durationMonths: 12,
            status: 'CONFIRMED',
            monthlyRent: 45000,
            depositAmount: 90000,
            message: 'Booking confirmed for the 3-bedroom apartment in Bole.',
        },
    });
    await prisma.payment.create({
        data: {
            bookingId: booking1.id,
            amount: 90000,
            currency: 'ETB',
            paymentGateway: 'BANK_TRANSFER',
            paymentReference: 'TXN-2026-0001',
            status: 'COMPLETED',
            paymentType: 'DEPOSIT',
            idempotencyKey: 'idem-booking1-deposit',
        },
    });
    await prisma.contract.create({
        data: {
            bookingId: booking1.id,
            status: 'PENDING',
        },
    });
    await prisma.review.create({
        data: {
            bookingId: booking1.id,
            reviewerId: renter1.id,
            revieweeId: owner1.id,
            reviewType: 'LANDLORD',
            rating: 5,
            text: 'Very responsive and professional landlord. The apartment is exactly as described!',
            isVerified: true,
            status: 'PUBLISHED',
        },
    });
    console.log('✅ Booking, payment, contract and review created');
    // Create Notifications (new Notification schema)
    await prisma.notification.createMany({
        data: [
            {
                userId: owner1.id,
                type: 'NEW_MESSAGE',
                title: 'New message from Dawit',
                message: 'You have a new message about "Modern 3-Bedroom Apartment in Bole"',
                relatedId: conversation1.id,
                relatedType: 'CONVERSATION',
                channels: '["IN_APP"]',
                status: 'PENDING',
                isRead: false,
            },
            {
                userId: renter1.id,
                type: 'BOOKING_ACCEPTED',
                title: 'Booking confirmed',
                message: 'Your booking for "Modern 3-Bedroom Apartment in Bole" has been confirmed.',
                relatedId: booking1.id,
                relatedType: 'BOOKING',
                channels: '["IN_APP"]',
                status: 'PENDING',
                isRead: false,
            },
        ],
    });
    // Create notification preferences for all users
    await prisma.notificationPreference.createMany({
        data: [admin.id, owner1.id, owner2.id, renter1.id, renter2.id].flatMap((userId) => [
            { userId, channel: 'IN_APP', enabled: true },
            { userId, channel: 'EMAIL', enabled: true },
            { userId, channel: 'SMS', enabled: false },
            { userId, channel: 'PUSH', enabled: false },
        ]),
    });
    console.log('✅ Notifications and preferences created');
    // Admin log
    await prisma.adminLog.create({
        data: {
            adminId: admin.id,
            action: 'SEED_DATABASE',
            targetId: listing1.id,
            targetType: 'LISTING',
            changes: JSON.stringify({ note: 'Database seeded with sample data' }),
            reason: 'Initial setup',
        },
    });
    console.log('✅ Admin log created');
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
//# sourceMappingURL=seed.js.map
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Experience = require('./models/Experience');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate styled SVG artwork for local images
const createSampleSvg = (filename, title, subtitle, bgGrad1, bgGrad2, iconPath) => {
  const filePath = path.join(uploadsDir, filename);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgGrad1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${bgGrad2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="800" height="500" fill="url(#grad)"/>
  
  <!-- Subtle decorative travel elements -->
  <circle cx="720" cy="80" r="140" fill="white" opacity="0.06"/>
  <circle cx="80" cy="420" r="180" fill="white" opacity="0.05"/>
  <path d="M 0,400 Q 250,330 500,420 T 800,380 L 800,500 L 0,500 Z" fill="rgba(0,0,0,0.25)"/>

  <!-- Centered emblem / illustration badge -->
  <g transform="translate(400, 200)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="60" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
    ${iconPath}
  </g>

  <!-- Typography overlay -->
  <rect x="50" y="320" width="700" height="130" rx="16" fill="rgba(15, 23, 42, 0.65)" filter="url(#shadow)"/>
  <text x="75" y="365" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#FFFFFF">${title}</text>
  <text x="75" y="405" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="400" fill="#E2E8F0">${subtitle}</text>
  <rect x="75" y="425" width="90" height="6" rx="3" fill="#F59E0B"/>
</svg>`;
  fs.writeFileSync(filePath, svg.trim());
};

const setupImages = () => {
  createSampleSvg(
    'rome-colosseum.svg',
    'Colosseum & Ancient Rome at Twilight',
    'Rome, Italy • Culture & Heritage • Expert Historian Guide',
    '#991B1B',
    '#451A03',
    '<circle cx="0" cy="-6" r="30" fill="none" stroke="#FDE047" stroke-width="3"/><path d="M -20,18 L 20,18 M -14,24 L 14,24 M -8,30 L 8,30" stroke="#FDE047" stroke-width="3"/>'
  );

  createSampleSvg(
    'tokyo-ramen.svg',
    'Secret Alleyways Ramen & Izakaya Crawl',
    'Tokyo, Japan • Food & Culinary • Shinjuku Hidden Gems',
    '#1E293B',
    '#BE123C',
    '<path d="M -24,-8 Q 0,-28 24,-8 Q 18,24 -20,22 Z" fill="#FDE047" opacity="0.8"/><circle cx="0" cy="0" r="16" fill="#F97316"/>'
  );

  createSampleSvg(
    'kyoto-bamboo.svg',
    'Arashiyama Bamboo Grove & Tea Zen',
    'Kyoto, Japan • Nature & Adventure • Morning Serenity',
    '#065F46',
    '#064E3B',
    '<line x1="-12" y1="-32" x2="-12" y2="32" stroke="#34D399" stroke-width="6"/><line x1="12" y1="-32" x2="12" y2="32" stroke="#34D399" stroke-width="6"/>'
  );

  createSampleSvg(
    'paris-pastry.svg',
    'Authentic French Pastry & Macaron Workshop',
    'Paris, France • Food & Culinary • Le Marais Kitchen',
    '#701A75',
    '#4A044E',
    '<ellipse cx="0" cy="-10" rx="28" ry="14" fill="#F472B6"/><ellipse cx="0" cy="10" rx="28" ry="14" fill="#F472B6"/><rect x="-26" y="-6" width="52" height="12" rx="4" fill="#FDE047"/>'
  );

  createSampleSvg(
    'barcelona-gaudi.svg',
    'Hidden Gaudí & Modernist Architecture Walk',
    'Barcelona, Spain • Art & Craft • Gothic Quarter & Eixample',
    '#0369A1',
    '#1E3A8A',
    '<polygon points="0,-32 28,18 -28,18" fill="none" stroke="#38BDF8" stroke-width="4"/><circle cx="0" cy="-2" r="8" fill="#F59E0B"/>'
  );

  createSampleSvg(
    'swiss-alps.svg',
    'Swiss Alps Panorama Glacier Ridge Hike',
    'Interlaken, Switzerland • Nature & Adventure • Panoramic Peaks',
    '#0F172A',
    '#0284C7',
    '<polygon points="-32,24 0,-24 32,24" fill="none" stroke="#E0F2FE" stroke-width="4"/><polygon points="8,24 24,0 40,24" fill="none" stroke="#BAE6FD" stroke-width="3"/>'
  );

  createSampleSvg(
    'amsterdam-jazz.svg',
    'Historic Canal Cruise with Live Candlelight Jazz',
    'Amsterdam, Netherlands • Nightlife & Music • Prinsengracht Canal',
    '#312E81',
    '#1E1B4B',
    '<path d="M -18,12 L -18,-18 L 18,-6 L 18,18 M -18,12 A 8,8 0 1,1 -26,20 A 8,8 0 0,1 -18,12 M 18,18 A 8,8 0 1,1 10,26 A 8,8 0 0,1 18,18" fill="none" stroke="#FBBF24" stroke-width="3"/>'
  );

  createSampleSvg(
    'bali-yoga.svg',
    'Sacred Water Temple Yoga & Sound Healing',
    'Ubud, Bali • Wellness & Yoga • Tropical Jungle Sanctuary',
    '#14532D',
    '#115E59',
    '<circle cx="0" cy="-16" r="10" fill="#FDE047"/><path d="M -18,14 C -18,-6 18,-6 18,14 Z" fill="none" stroke="#FDE047" stroke-width="3"/><circle cx="0" cy="22" r="6" fill="#A7F3D0"/>'
  );
  console.log('Sample visual assets generated in server/uploads/');
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localguide';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // Setup visual SVG files
    setupImages();

    // Clear existing collections
    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Experience.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    // 1. Create Users (1 Admin, 2 Guides, 2 Tourists)
    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'Elena Rostova',
        email: 'admin@localguide.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Marco Rossi',
        email: 'marco.guide@localguide.com',
        password: 'password123',
        role: 'guide'
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.guide@localguide.com',
        password: 'password123',
        role: 'guide'
      },
      {
        name: 'Alice Walker',
        email: 'alice@traveler.com',
        password: 'password123',
        role: 'tourist'
      },
      {
        name: 'Bob Martin',
        email: 'bob@traveler.com',
        password: 'password123',
        role: 'tourist'
      }
    ]);

    const admin = users[0];
    const marco = users[1];
    const sarah = users[2];
    const alice = users[3];
    const bob = users[4];

    console.log(`Created ${users.length} users successfully.`);

    // 2. Create 8 Experiences
    console.log('Creating sample experiences...');
    const experiencesData = [
      {
        title: 'Colosseum & Ancient Rome at Twilight',
        description: 'Skip the crowds and step back into imperial history. Walk through the arena floor under the golden evening light and discover the untold stories of gladiators with a licensed archaeologist.',
        category: 'Culture & Heritage',
        location: 'Rome, Piazza del Colosseo 1',
        price: 65,
        duration: '3 hours',
        maxGroupSize: 10,
        images: ['/uploads/rome-colosseum.svg'],
        guide: marco._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Secret Alleyways Ramen & Izakaya Crawl',
        description: 'Venture into the neon-lit backstreets of Shinjuku and Omoide Yokocho. Taste artisan tonkotsu ramen, melt-in-your-mouth yakitori skewers, and regional sake at neighborhood bars tourists never find.',
        category: 'Food & Culinary',
        location: 'Tokyo, Shinjuku Golden Gai',
        price: 85,
        duration: '3.5 hours',
        maxGroupSize: 8,
        images: ['/uploads/tokyo-ramen.svg'],
        guide: sarah._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Arashiyama Bamboo Grove & Zen Tea Ceremony',
        description: 'Immerse yourself in Kyoto’s iconic bamboo forest at dawn before the crowds arrive. Afterwards, enter a secluded 300-year-old temple for a private matcha whisking and mindfulness workshop.',
        category: 'Nature & Adventure',
        location: 'Kyoto, Arashiyama Sagatenryuji',
        price: 75,
        duration: '4 hours',
        maxGroupSize: 6,
        images: ['/uploads/kyoto-bamboo.svg'],
        guide: sarah._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Authentic French Pastry & Macaron Workshop',
        description: 'Master the delicate art of French choux pastry, tart shells, and silk-smooth ganache inside a sunlit Parisian atelier in Le Marais. Take home your own decorative box of handcrafted macarons.',
        category: 'Food & Culinary',
        location: 'Paris, 18 Rue des Rosiers, Le Marais',
        price: 95,
        duration: '2.5 hours',
        maxGroupSize: 6,
        images: ['/uploads/paris-pastry.svg'],
        guide: marco._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Hidden Gaudí & Modernist Architecture Walk',
        description: 'Explore the vibrant artistic revolution of Catalonia. Beyond the Sagrada Familia, uncover secret residences, colorful mosaic gardens, and modernist masterworks with an architectural historian.',
        category: 'Art & Craft',
        location: 'Barcelona, Passeig de Gràcia 43',
        price: 55,
        duration: '3 hours',
        maxGroupSize: 12,
        images: ['/uploads/barcelona-gaudi.svg'],
        guide: marco._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Swiss Alps Panorama Glacier Ridge Hike',
        description: 'Breathtaking alpine meadows, turquoise glacial streams, and dramatic mountain peaks. A guided hike customized to your fitness level with fondue lunch overlooking the Eiger and Jungfrau.',
        category: 'Nature & Adventure',
        location: 'Interlaken, Bahnhofstrasse 25',
        price: 120,
        duration: '6 hours',
        maxGroupSize: 8,
        images: ['/uploads/swiss-alps.svg'],
        guide: sarah._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Historic Canal Cruise with Live Candlelight Jazz',
        description: 'Glide along Amsterdam’s UNESCO world-heritage canals aboard an eco-friendly salon boat. Enjoy fine Dutch artisanal cheeses and craft beer while listening to an intimate live jazz trio.',
        category: 'Nightlife & Music',
        location: 'Amsterdam, Prinsengracht 263',
        price: 70,
        duration: '2 hours',
        maxGroupSize: 15,
        images: ['/uploads/amsterdam-jazz.svg'],
        guide: marco._id,
        avgRating: 0,
        numReviews: 0
      },
      {
        title: 'Sacred Water Temple Yoga & Sound Healing',
        description: 'Begin your morning with restorative vinyasa yoga nestled beside lush rice terraces. Conclude with Tibetan singing bowl sound healing and an authentic Balinese floral purification blessing.',
        category: 'Wellness & Yoga',
        location: 'Ubud, Jalan Raya Ubud, Bali',
        price: 50,
        duration: '3 hours',
        maxGroupSize: 10,
        images: ['/uploads/bali-yoga.svg'],
        guide: sarah._id,
        avgRating: 0,
        numReviews: 0
      }
    ];

    const createdExperiences = await Experience.insertMany(experiencesData);
    console.log(`Created ${createdExperiences.length} experiences.`);

    // 3. Create Sample Bookings (Alice & Bob)
    console.log('Creating sample bookings...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);

    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

    const bookings = await Booking.create([
      {
        user: alice._id,
        experience: createdExperiences[0]._id, // Rome
        date: tomorrow,
        guests: 2,
        totalPrice: createdExperiences[0].price * 2,
        status: 'confirmed'
      },
      {
        user: alice._id,
        experience: createdExperiences[1]._id, // Tokyo Ramen
        date: nextWeek,
        guests: 1,
        totalPrice: createdExperiences[1].price * 1,
        status: 'confirmed'
      },
      {
        user: bob._id,
        experience: createdExperiences[0]._id, // Rome
        date: inTwoWeeks,
        guests: 3,
        totalPrice: createdExperiences[0].price * 3,
        status: 'confirmed'
      },
      {
        user: bob._id,
        experience: createdExperiences[3]._id, // Paris Pastry
        date: tomorrow,
        guests: 2,
        totalPrice: createdExperiences[3].price * 2,
        status: 'confirmed'
      }
    ]);
    console.log(`Created ${bookings.length} sample bookings.`);

    // 4. Create Sample Reviews
    console.log('Creating sample reviews and calculating ratings...');
    const reviewsData = [
      {
        user: alice._id,
        experience: createdExperiences[0]._id,
        rating: 5,
        comment: 'Marco was unbelievable! His knowledge of Roman history made the Colosseum come alive. Seeing the arena at sunset with no crowds is something I will never forget!'
      },
      {
        user: bob._id,
        experience: createdExperiences[0]._id,
        rating: 4,
        comment: 'Fantastic tour and very well organized. Marco is super friendly and answered all of our questions. Highly recommended for couples and families.'
      },
      {
        user: alice._id,
        experience: createdExperiences[1]._id,
        rating: 5,
        comment: 'The ramen was out of this world! Sarah knows every small tavern in Shinjuku. We had dishes we never would have discovered on our own.'
      },
      {
        user: bob._id,
        experience: createdExperiences[3]._id,
        rating: 5,
        comment: 'The macaron workshop in Paris was a highlight of our European vacation. The chef was patient and the pastries tasted bakery-perfect.'
      }
    ];

    await Review.insertMany(reviewsData);

    // 5. Recalculate avgRating & numReviews for affected experiences
    for (const exp of createdExperiences) {
      const stats = await Review.aggregate([
        { $match: { experience: exp._id } },
        {
          $group: {
            _id: '$experience',
            numReviews: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      ]);

      if (stats.length > 0) {
        await Experience.findByIdAndUpdate(exp._id, {
          avgRating: Math.round(stats[0].avgRating * 10) / 10,
          numReviews: stats[0].numReviews
        });
      }
    }

    console.log('\n=============================================');
    console.log('🎉 LOCALGUIDE DATABASE SEEDED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('\nTEST ACCOUNTS READY FOR LOGIN (Password for all: password123):');
    console.log('------------------------------------------------------------');
    console.log('1. Admin:   admin@localguide.com');
    console.log('2. Guide:   marco.guide@localguide.com');
    console.log('3. Guide:   sarah.guide@localguide.com');
    console.log('4. Tourist: alice@traveler.com');
    console.log('5. Tourist: bob@traveler.com');
    console.log('------------------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

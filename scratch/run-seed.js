const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // We will manually define the data here or read it, but since we're in JS, let's just parse the TS files using regex.
  // Actually, wait, it's easier to just write the data in this script.
  // But to be completely accurate, let's read the TS files and use regex to extract the arrays.

  console.log("Seeding Flights...");
  const flightsContent = fs.readFileSync(path.join(__dirname, '../src/app/(client)/flights/page.tsx'), 'utf-8');
  const flightsMatch = flightsContent.match(/export const FLIGHTS = (\[[\s\S]*?\]);/);
  if (flightsMatch) {
    const flightsArray = eval(flightsMatch[1]);
    for (const flight of flightsArray) {
      await prisma.flight.create({
        data: {
          airline: flight.airline,
          departure: flight.departure,
          destination: flight.destination,
          price: parseFloat(flight.price.replace('£', '')),
          status: "AVAILABLE"
        }
      });
    }
    console.log(`Seeded ${flightsArray.length} flights.`);
  }

  console.log("Seeding Packages...");
  const umrahContent = fs.readFileSync(path.join(__dirname, '../src/app/(client)/umrah/page.tsx'), 'utf-8');
  
  const parsePackages = async (regex, stars) => {
    const match = umrahContent.match(regex);
    if (match) {
      const arr = eval(match[1]);
      for (const pkg of arr) {
        await prisma.package.create({
          data: {
            title: pkg.title,
            type: "UMRAH",
            destination: "Makkah & Madinah",
            duration: pkg.title.split(' ')[0], // e.g. "7"
            price: parseFloat(pkg.price.replace('£', '')),
            description: `A beautiful ${stars}-star Umrah package.`,
            includedServices: "Visa, Flights, Hotels",
            images: JSON.stringify([pkg.image]),
            travelDates: "Flexible",
            availability: true,
            stars: stars
          }
        });
      }
      console.log(`Seeded ${arr.length} ${stars}-star packages.`);
    }
  };

  await parsePackages(/export const threeStarPackages = (\[[\s\S]*?\]);/, 3);
  await parsePackages(/export const fourStarPackages = (\[[\s\S]*?\]);/, 4);
  await parsePackages(/export const fiveStarPackages = (\[[\s\S]*?\]);/, 5);

  console.log("Seeding Blogs...");
  const blogContent = fs.readFileSync(path.join(__dirname, '../src/lib/blogData.ts'), 'utf-8');
  const blogMatch = blogContent.match(/export const blogPostsData: BlogPost\[\] = (\[[\s\S]*?\]);/);
  if (blogMatch) {
    const blogsArray = eval(blogMatch[1]);
    for (const blog of blogsArray) {
      await prisma.blog.create({
        data: {
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          readTime: blog.readTime,
          date: blog.date,
          image: blog.image
        }
      });
    }
    console.log(`Seeded ${blogsArray.length} blogs.`);
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: string; // Full HTML/markdown-style rich content
}

export const blogPostsData: BlogPost[] = [
  {
    id: "blog-1",
    slug: "step-by-step-guide-how-to-perform-umrah",
    title: "Step-by-Step Guide on How to Perform Umrah",
    excerpt: "A complete spiritual and practical guide detailing Ihram, Tawaf, Sa'i, and Halq/Taqsir for pilgrims planning their holy journey.",
    category: "Umrah Guide",
    readTime: "6 min read",
    date: "May 15, 2026",
    image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Introduction to Umrah</h2>
<p>Umrah is a voluntary act of worship that can be performed at any time of the year. Though not obligatory like Hajj, it is a deeply spiritual journey that millions of Muslims undertake each year to seek forgiveness, closeness to Allah, and spiritual renewal.</p>

<h2>Step 1: Enter the State of Ihram</h2>
<p>Before reaching the Miqat (the designated boundary point), pilgrims must enter the sacred state of Ihram. This involves:</p>
<ul>
  <li>Taking a full ritual bath (Ghusl)</li>
  <li>Men wearing two white seamless sheets (Izar and Rida); women wearing modest, loose-fitting attire</li>
  <li>Making the intention (Niyyah) for Umrah</li>
  <li>Reciting the Talbiyah: <em>"Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk, innal hamda wan-ni'mata laka wal-mulk, la shareeka lak"</em></li>
</ul>
<p><strong>Important:</strong> Once in Ihram, certain actions are prohibited including cutting hair or nails, using perfume, sexual intercourse, and hunting.</p>

<h2>Step 2: Tawaf — Circumambulation of the Ka'bah</h2>
<p>Upon arriving in Makkah and entering Masjid al-Haram, you perform Tawaf — circumambulating (walking around) the Ka'bah seven times in an anti-clockwise direction.</p>
<ul>
  <li>Start from the Black Stone (Hajr al-Aswad) corner, kissing or pointing to it</li>
  <li>Complete 7 circuits keeping the Ka'bah on your left</li>
  <li>Recite supplications and dhikr throughout</li>
  <li>After Tawaf, pray two rakats behind Maqam Ibrahim if possible</li>
  <li>Drink Zamzam water</li>
</ul>

<h2>Step 3: Sa'i — Walking Between Safa and Marwah</h2>
<p>Sa'i commemorates the actions of Hajar (AS), the wife of Ibrahim (AS), who ran between the hills of Safa and Marwah in search of water for her son Ismail (AS).</p>
<ul>
  <li>Begin at Safa, making Du'a facing the Ka'bah</li>
  <li>Walk to Marwah (men should jog between the green lights)</li>
  <li>Complete 7 circuits (Safa to Marwah = 1, Marwah to Safa = 2, ending at Marwah)</li>
  <li>Recite supplications and remember the trial of Hajar (AS)</li>
</ul>

<h2>Step 4: Halq or Taqsir — Cutting the Hair</h2>
<p>After completing Sa'i, men shave their heads completely (Halq) or significantly shorten their hair (Taqsir). Women cut a small portion of hair (approximately a finger's width). This act signifies the completion of Umrah and marks the exit from the state of Ihram.</p>

<h2>After Umrah: Recommended Acts</h2>
<p>After completing your Umrah, it is highly recommended to:</p>
<ul>
  <li>Visit Masjid al-Nabawi in Madinah and send blessings upon the Prophet ﷺ</li>
  <li>Perform Ziyarat of historical sites in Makkah and Madinah</li>
  <li>Spend time in prayer and reflection in the Masjid al-Haram</li>
  <li>Drink plenty of Zamzam water and share it with family back home</li>
</ul>

<h2>Tips for a Successful Umrah</h2>
<ul>
  <li>Plan your Tawaf during off-peak hours (late night or early morning) to avoid crowds</li>
  <li>Wear comfortable, worn-in footwear for the extensive walking</li>
  <li>Stay hydrated — Makkah can be extremely hot</li>
  <li>Travel with a reputable, ATOL and IATA accredited agency like Terrific Travel</li>
  <li>Learn basic Arabic phrases and supplications before your journey</li>
</ul>
    `,
  },
  {
    id: "blog-2",
    slug: "best-places-visit-makkah-madinah-ziyarat",
    title: "Best Places to Visit in Makkah & Madinah (Ziyarat)",
    excerpt: "Discover the historical significance and spiritual power of Jabal al-Nour, Mount Uhud, Quba Mosque, and other holy sites in the Hijaz.",
    category: "Ziyarat Guide",
    readTime: "8 min read",
    date: "May 10, 2026",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>The Sacred Ziyarat of Makkah Al-Mukarramah</h2>
<p>Beyond performing the rites of Umrah, Makkah and its surroundings are home to countless historical and spiritual landmarks that connect pilgrims deeply with the history of Islam.</p>

<h2>Jabal al-Nour (Mountain of Light)</h2>
<p>This is the mountain where the Cave of Hira (Ghar Hira) is located — the sacred cave where the first verses of the Qur'an were revealed to the Prophet Muhammad ﷺ. The climb takes approximately 30–45 minutes and is a profound spiritual experience. The view of Makkah from the top is breathtaking.</p>

<h2>Jabal Thawr</h2>
<p>Mount Thawr contains the cave where the Prophet ﷺ and Abu Bakr (RA) sought refuge during the Hijra (migration) to Madinah. This site is of immense historical significance and is a reminder of the early trials and sacrifices of Islam.</p>

<h2>Masjid al-Ji'ranah</h2>
<p>One of the Miqat points for Umrah, this mosque is located on the outskirts of Makkah and is where the Prophet ﷺ distributed the spoils of the Battle of Hunayn and entered Ihram. Many pilgrims visit to perform additional Umrah from this Miqat.</p>

<h2>The Sacred Ziyarat of Al-Madinah Al-Munawwarah</h2>

<h2>Masjid al-Nabawi (The Prophet's Mosque)</h2>
<p>The mosque built by the Prophet ﷺ himself, containing his blessed grave. Sending abundant Salawat (blessings) upon the Prophet ﷺ here is of extraordinary spiritual merit. The Riyadhul Jannah (Garden of Paradise) area within the mosque is particularly blessed.</p>

<h2>Masjid Quba</h2>
<p>The first mosque ever built in Islam, constructed by the Prophet ﷺ upon his arrival in Madinah. Praying two rakats in Masjid Quba is equivalent in reward to performing Umrah, according to authentic hadith. A visit here is considered essential.</p>

<h2>Masjid al-Qiblatayn (Mosque of the Two Qiblas)</h2>
<p>The mosque where the direction of prayer was changed from Jerusalem (Al-Quds) to Makkah (the Ka'bah) during the time of the Prophet ﷺ. This is a unique and historically significant site that every pilgrim should visit.</p>

<h2>Mount Uhud</h2>
<p>The site of the famous Battle of Uhud, where 70 Companions of the Prophet ﷺ were martyred, including his beloved uncle Hamza ibn Abdul-Muttalib (RA). The Uhud Martyrs' Cemetery (Shuhada Uhud) is a deeply moving place for reflection and prayer for the martyrs.</p>

<h2>Jannat al-Baqi (The Garden of Heaven)</h2>
<p>The main cemetery of Madinah, where many of the Prophet's ﷺ family members, wives, and companions are buried. Visiting and making du'a for the deceased here is a Sunnah practice observed by pilgrims throughout history.</p>
    `,
  },
  {
    id: "blog-3",
    slug: "essential-packing-list-umrah-2026",
    title: "Essential Packing List for Umrah: 2026 Edition",
    excerpt: "Make sure your journey is comfortable and spiritual with our ultimate checklist covering clothing, travel essentials, and medical tips.",
    category: "Travel Tips",
    readTime: "4 min read",
    date: "May 08, 2026",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>The Complete Umrah Packing Checklist for 2026</h2>
<p>Packing correctly for Umrah ensures you can focus entirely on your spiritual journey without being distracted by discomfort or forgotten essentials. Here is our comprehensive, pilgrim-tested guide.</p>

<h2>Ihram Garments (Men)</h2>
<ul>
  <li>2–3 sets of Ihram cloth (white, seamless, good quality)</li>
  <li>Ihram belt or safety pins to secure the cloth</li>
  <li>Comfortable sandals (Hawai or open-toed)</li>
</ul>

<h2>Modest Clothing (Women)</h2>
<ul>
  <li>Loose, modest abayas in breathable fabrics (cotton or linen)</li>
  <li>Multiple hijabs (light colours for heat)</li>
  <li>Socks and comfortable closed shoes for Sa'i and Tawaf</li>
  <li>Gloves (some scholars recommend for women touching the Hajr al-Aswad area)</li>
</ul>

<h2>Toiletries (Fragrance-Free While in Ihram)</h2>
<ul>
  <li>Unscented soap and shampoo</li>
  <li>Unscented moisturiser (Makkah is very dry)</li>
  <li>Miswak (natural toothbrush)</li>
  <li>Unscented deodorant</li>
  <li>Small towels</li>
</ul>

<h2>Health & Medical Essentials</h2>
<ul>
  <li>Personal prescription medications with a doctor's letter</li>
  <li>Paracetamol and ibuprofen for pain/fever</li>
  <li>Rehydration sachets (ORS)</li>
  <li>Blister plasters for feet</li>
  <li>Sun cream (SPF 50+)</li>
  <li>Hand sanitiser and wet wipes</li>
  <li>Face masks (dust and air quality)</li>
  <li>A small first aid kit</li>
</ul>

<h2>Documents & Essentials</h2>
<ul>
  <li>Valid passport (minimum 6 months validity)</li>
  <li>Umrah visa (arrange via your travel agent)</li>
  <li>Flight tickets and hotel booking confirmations</li>
  <li>Travel insurance documents</li>
  <li>Emergency contact card</li>
  <li>Saudi riyals (cash) and a travel card</li>
</ul>

<h2>Spiritual Essentials</h2>
<ul>
  <li>Pocket-sized Qur'an</li>
  <li>Du'a book (Umrah supplications)</li>
  <li>Tasbeeh (prayer beads)</li>
  <li>Small prayer mat</li>
  <li>Zamzam-approved water bottle</li>
</ul>

<h2>Practical Accessories</h2>
<ul>
  <li>Money belt/neck pouch for safety</li>
  <li>Power bank (large capacity)</li>
  <li>Universal travel adaptor (Saudi uses type G)</li>
  <li>Lightweight backpack for Ziyarat day trips</li>
  <li>Ear plugs for sleeping in shared hotels</li>
</ul>
    `,
  },
  {
    id: "blog-4",
    slug: "understanding-nuances-ihram-rules",
    title: "Understanding the Nuances of Ihram Rules",
    excerpt: "Learn the precise regulations, prohibitions, and conditions for entering the state of Ihram safely and devoutly.",
    category: "Fiqh Guide",
    readTime: "5 min read",
    date: "May 05, 2026",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>What is Ihram?</h2>
<p>Ihram is the sacred state that a Muslim must enter before performing Hajj or Umrah. It represents a state of spiritual purity, detachment from worldly desires, and total submission to Allah. The word "Ihram" itself comes from the Arabic root meaning "to make sacred or forbidden."</p>

<h2>When Must Ihram Be Entered?</h2>
<p>Ihram must be entered before crossing the Miqat — the designated boundary points set by the Prophet ﷺ for those intending to perform Hajj or Umrah. The five main Miqat points are:</p>
<ul>
  <li><strong>Dhul Hulayfah (Abyar Ali)</strong> — For those coming from Madinah and nearby</li>
  <li><strong>Al-Juhfah (Rabigh)</strong> — For those coming from the direction of Syria, Egypt, North Africa</li>
  <li><strong>Qarn al-Manazil (As-Sayl al-Kabir)</strong> — For those coming from Najd (central Arabia)</li>
  <li><strong>Yalamlam</strong> — For those coming from Yemen, India, Pakistan</li>
  <li><strong>Dhat Irq</strong> — For those coming from Iraq</li>
</ul>
<p>Travellers from the UK typically pass over or near Yalamlam or Al-Juhfah, depending on the flight path. Your travel agent will advise you on the correct Miqat for your route.</p>

<h2>The Prohibitions of Ihram</h2>
<p>Once in Ihram, the following actions are prohibited:</p>
<ul>
  <li>Cutting or removing hair from anywhere on the body</li>
  <li>Trimming or cutting fingernails or toenails</li>
  <li>Using perfumed products (soap, shampoo, creams, etc.)</li>
  <li>Sexual intercourse and intimate physical contact with a spouse</li>
  <li>Getting married or performing a marriage contract</li>
  <li>Hunting or killing animals (insects may be removed if harmful)</li>
  <li>Men wearing stitched clothing or covering the head</li>
  <li>Women covering their face with a niqab or their hands with gloves (though some scholars allow this)</li>
</ul>

<h2>What If a Prohibition is Violated?</h2>
<p>If a prohibition is violated accidentally or out of necessity (e.g., you must shave for a medical procedure), there are expiation options (Fidya) which include fasting, giving charity, or offering an animal sacrifice. Consult a scholar if this situation arises.</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>Applying perfume after intending Ihram at the Miqat</li>
  <li>Forgetting to make the Niyyah (intention) before crossing the Miqat</li>
  <li>Men wearing underwear beneath the Ihram cloth</li>
  <li>Arguing, using foul language, or displaying anger while in Ihram</li>
</ul>
    `,
  },
  {
    id: "blog-5",
    slug: "how-to-book-rawdah-appointment-nusuk-app",
    title: "How to Book Rawdah Appointment via Nusuk App",
    excerpt: "A complete step-by-step walkthrough on securing your slot for praying in the Riyadhul Jannah using the official Nusuk application.",
    category: "Tech Guide",
    readTime: "4 min read",
    date: "May 02, 2026",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>What is the Rawdah?</h2>
<p>The Rawdah (Riyadhul Jannah — Garden of Paradise) refers to the area between the Prophet's ﷺ grave and his minbar (pulpit) inside Masjid al-Nabawi in Madinah. The Prophet ﷺ said: "Between my house and my pulpit is a garden from the gardens of Paradise." (Bukhari & Muslim). Access is controlled and requires an official appointment through the Nusuk app.</p>

<h2>Downloading the Nusuk App</h2>
<p>The Nusuk platform is the official Saudi Ministry of Hajj and Umrah digital gateway. Download it from:</p>
<ul>
  <li><strong>iOS:</strong> Apple App Store — search "Nusuk"</li>
  <li><strong>Android:</strong> Google Play Store — search "Nusuk"</li>
  <li><strong>Web:</strong> nusuk.sa (for desktop booking)</li>
</ul>

<h2>Creating Your Nusuk Account</h2>
<ol>
  <li>Open the Nusuk app and select your preferred language</li>
  <li>Click "Register" and choose "Visitor from outside Saudi Arabia"</li>
  <li>Enter your passport number and nationality</li>
  <li>Provide a valid email address and phone number for OTP verification</li>
  <li>Complete your profile with your full name as it appears on your passport</li>
</ol>

<h2>Booking the Rawdah Appointment (Step by Step)</h2>
<ol>
  <li>Log into your Nusuk account</li>
  <li>From the home screen, select "Services"</li>
  <li>Tap "Prophet's Mosque" services</li>
  <li>Select "Rawdah Visit Permit"</li>
  <li>Choose your preferred date and time slot (slots open approximately 2 weeks in advance)</li>
  <li>Select the number of visitors (each person needs their own permit)</li>
  <li>Confirm and save your QR code — this will be scanned at the entrance</li>
</ol>

<h2>Tips for Securing a Slot</h2>
<ul>
  <li>Slots open at midnight Saudi time — be ready to book as soon as they open</li>
  <li>Early morning slots (Fajr time) tend to be less crowded</li>
  <li>Book for yourself and family members using separate accounts</li>
  <li>Have your passport details ready as they are required during booking</li>
  <li>Save a screenshot of the QR code offline in case of poor signal</li>
</ul>

<h2>On the Day of Your Visit</h2>
<ul>
  <li>Arrive at Masjid al-Nabawi at least 30 minutes before your slot</li>
  <li>Enter through the designated Rawdah gates (your Nusuk app will show which gate)</li>
  <li>Present your QR code and passport/ID to the officer</li>
  <li>You will have approximately 15–30 minutes in the Rawdah — make the most of your prayers and du'a</li>
</ul>
    `,
  },
  {
    id: "blog-6",
    slug: "top-health-fitness-tips-pilgrims",
    title: "Top Health and Fitness Tips for Pilgrims",
    excerpt: "How to physically prepare for the intense walking required during Tawaf and Sa'i, with nutritional and hydration protocols.",
    category: "Health Tips",
    readTime: "7 min read",
    date: "April 28, 2026",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Why Physical Preparation Matters for Umrah</h2>
<p>Umrah is a physically demanding journey. Between Tawaf, Sa'i, Ziyarat tours, and daily prayers in the Haram, pilgrims can walk 15–20 kilometres per day on hard marble floors. The extreme heat of Makkah (often exceeding 40°C in summer) adds further physical strain. Proper preparation can make the difference between a comfortable, spiritually focused experience and an exhausting one.</p>

<h2>Start Training 2–3 Months Before Your Trip</h2>
<p>Begin a gradual walking training programme:</p>
<ul>
  <li><strong>Month 3 before:</strong> Walk 30 minutes per day on flat surfaces</li>
  <li><strong>Month 2 before:</strong> Increase to 45–60 minutes; include uphill walking</li>
  <li><strong>Month 1 before:</strong> Walk 1–2 hours daily; train on hard floors (shopping centres etc.) to condition your feet</li>
  <li><strong>Footwear:</strong> Train in the actual sandals or shoes you plan to wear for Umrah</li>
</ul>

<h2>Hydration is Non-Negotiable</h2>
<p>Dehydration is the most common medical issue for pilgrims. Guidelines:</p>
<ul>
  <li>Drink 3–4 litres of water per day during the pilgrimage</li>
  <li>Consume Zamzam water whenever available — it is deeply blessed and nutritionally rich</li>
  <li>Carry a water bottle at all times, especially during Tawaf and Sa'i</li>
  <li>Avoid excessive caffeine (tea/coffee) which contributes to dehydration</li>
  <li>Use oral rehydration salts (ORS) if you feel dizzy or nauseous</li>
</ul>

<h2>Nutrition During Your Pilgrimage</h2>
<ul>
  <li>Eat light, balanced meals — heavy food can cause lethargy during worship</li>
  <li>Pack high-energy snacks: dates, nuts, dried fruit</li>
  <li>Avoid street food from unknown vendors to prevent stomach upset</li>
  <li>Take a good quality multivitamin and electrolyte supplements daily</li>
</ul>

<h2>Foot and Blister Care</h2>
<ul>
  <li>Wear well-fitting, broken-in footwear — never perform Sa'i in new shoes</li>
  <li>Use blister prevention gel or Vaseline on pressure points before walking</li>
  <li>Pack blister plasters and change socks frequently</li>
  <li>Soak feet in warm water each evening and apply moisturiser</li>
</ul>

<h2>Managing the Heat</h2>
<ul>
  <li>Perform Tawaf during early morning (after Fajr) or late night when temperatures are lower</li>
  <li>Wear a light umbrella or hat (outside Ihram only) for sun protection</li>
  <li>Seek shade frequently and take rest breaks inside the Haram</li>
  <li>Apply high SPF sun cream to exposed skin</li>
</ul>

<h2>Medical Considerations</h2>
<ul>
  <li>Consult your GP 8 weeks before departure — ensure all vaccinations are up to date (meningitis and flu are often required for Saudi entry)</li>
  <li>Carry sufficient prescription medications with a GP letter</li>
  <li>Elderly or chronically ill pilgrims should consider travel health insurance with medical evacuation cover</li>
  <li>Do not push through serious pain or illness — the Haram has first aid stations and medical teams on duty 24 hours</li>
</ul>
    `,
  },
  {
    id: "blog-7",
    slug: "top-tips-for-surviving-long-haul-flights",
    title: "Top 10 Tips for Surviving Long-Haul Flights",
    excerpt: "Make your 12+ hour journey a breeze with these expert tips on hydration, seating, and sleep strategies.",
    category: "Flight Guide",
    readTime: "5 min read",
    date: "June 02, 2026",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Surviving the Long Haul</h2>
<p>Long-haul flights can be exhausting, but with the right preparation, you can step off the plane feeling refreshed and ready for your holiday.</p>

<h2>1. Hydration is Key</h2>
<p>The cabin air is incredibly dry. Drink plenty of water before, during, and after your flight. Avoid alcohol and excessive caffeine, as they dehydrate you further.</p>

<h2>2. Dress Comfortably</h2>
<p>Wear loose, breathable layers. Temperatures on planes fluctuate, so a light sweater or scarf is essential. Compression socks can also help improve circulation and reduce swelling.</p>

<h2>3. Choose the Right Seat</h2>
<p>If you plan to sleep, a window seat is ideal so you have something to lean against and won't be disturbed. If you like to stretch or visit the lavatory often, opt for an aisle seat.</p>

<h2>4. Pack a Survival Kit</h2>
<p>Include travel-sized moisturiser, lip balm, a toothbrush, noise-cancelling headphones, an eye mask, and a neck pillow in your carry-on.</p>
    `,
  },
  {
    id: "blog-8",
    slug: "when-is-the-best-time-to-book-flights",
    title: "When is the Best Time to Book Flights?",
    excerpt: "Stop guessing and start saving. Discover the optimal booking windows for domestic and international travel.",
    category: "Flight Tips",
    readTime: "6 min read",
    date: "June 10, 2026",
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>The Secret to Cheap Flights</h2>
<p>Timing your booking correctly can save you hundreds of pounds. While there is no magic day of the week to book, there are optimal booking windows.</p>

<h2>International Flights</h2>
<p>For international flights, the best time to book is usually between 2 and 6 months before your departure date. If you are travelling during peak seasons (summer or Christmas), book even earlier.</p>

<h2>Domestic Flights</h2>
<p>For shorter domestic flights, booking 1 to 3 months in advance usually yields the best prices.</p>

<h2>Be Flexible</h2>
<p>If you can be flexible with your travel dates by a few days, use the "flexible dates" feature on booking platforms to see when flights are cheapest. Flying mid-week (Tuesday and Wednesday) is often cheaper than the weekend.</p>
    `,
  },
  {
    id: "blog-9",
    slug: "how-to-get-upgraded-on-your-next-flight",
    title: "How to Score an Upgrade on Your Next Flight",
    excerpt: "Want to fly Business Class without the price tag? Here are the best strategies to increase your chances of a free upgrade.",
    category: "Travel Hacks",
    readTime: "4 min read",
    date: "June 15, 2026",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>The Elusive Free Upgrade</h2>
<p>While airlines are becoming stricter with free upgrades, it is still possible if you know the right strategies.</p>

<h2>1. Join the Frequent Flyer Programme</h2>
<p>Airlines prioritize their loyal members. Even if you only have base status, being a member puts you ahead of non-members on the upgrade list.</p>

<h2>2. Fly Solo</h2>
<p>It is much easier for an airline to upgrade a single passenger to fill one empty Business Class seat than to upgrade a couple or a family.</p>

<h2>3. Travel During Off-Peak Business Hours</h2>
<p>Business class is often full during the workweek. Flying on weekends or holidays means fewer business travellers, increasing your chances of finding an empty premium seat.</p>

<h2>4. Just Ask (Politely)</h2>
<p>Sometimes, all it takes is a polite question at the check-in desk or the gate. Dress smartly, smile, and ask if there are any operational upgrades available.</p>
    `,
  },
  {
    id: "blog-10",
    slug: "navigating-airport-security-like-a-pro",
    title: "Navigating Airport Security Like a Pro",
    excerpt: "Breeze through security checkpoints with our expert advice on packing, dressing, and preparing for the scanners.",
    category: "Flight Guide",
    readTime: "3 min read",
    date: "June 18, 2026",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Bypass the Queues</h2>
<p>Airport security doesn't have to be a stressful bottleneck if you know the rules.</p>
<h2>1. Dress for Success</h2>
<p>Wear slip-on shoes and avoid belts or excessive jewellery that will trigger the metal detectors.</p>
<h2>2. The Liquid Rule</h2>
<p>Keep all liquids under 100ml in a single, clear, resealable plastic bag. Have this bag easily accessible at the top of your carry-on.</p>
<h2>3. Electronics Ready</h2>
<p>Laptops and large tablets usually need to be taken out of your bag. Keep them in an easily accessible compartment.</p>
    `,
  },
  {
    id: "blog-11",
    slug: "jet-lag-cures-that-actually-work",
    title: "Jet Lag Cures That Actually Work",
    excerpt: "Crossing multiple time zones? Use these scientifically backed methods to reset your body clock quickly.",
    category: "Travel Hacks",
    readTime: "4 min read",
    date: "June 21, 2026",
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Beat the Time Zone Shift</h2>
<p>Jet lag can ruin the first few days of a trip. Here is how to fight it effectively.</p>
<h2>1. Shift Your Sleep Schedule Before You Leave</h2>
<p>Start going to bed an hour earlier or later (depending on your destination) a few days before your flight.</p>
<h2>2. Fast During the Flight</h2>
<p>Studies suggest that fasting during the flight and eating a high-protein meal at the normal breakfast time of your destination can help reset your circadian rhythm.</p>
<h2>3. Seek Sunlight</h2>
<p>Light exposure is the most powerful tool to reset your internal clock. Get out in the sun as soon as you arrive during the daytime.</p>
    `,
  },
  {
    id: "blog-12",
    slug: "understanding-airline-baggage-allowances",
    title: "Understanding Airline Baggage Allowances",
    excerpt: "Avoid unexpected fees at the check-in desk by mastering the complex world of airline baggage rules.",
    category: "Flight Tips",
    readTime: "5 min read",
    date: "June 25, 2026",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    content: `
<h2>Don't Get Caught Out</h2>
<p>Every airline has different rules for cabin and hold luggage. Always check the specific weight and dimension limits on your ticket.</p>
<h2>Weigh Your Bags at Home</h2>
<p>Invest in a cheap digital luggage scale. It will save you from repacking in front of everyone at the check-in desk.</p>
<h2>Wear Your Heaviest Items</h2>
<p>If you are travelling hand-luggage only and are close to the weight limit, wear your heaviest jacket and shoes on the plane.</p>
    `,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPostsData.find((post) => post.slug === slug);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

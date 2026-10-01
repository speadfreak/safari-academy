import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

const IMG = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

/**
 * Seed the Safari Academy database.
 *
 * SAFETY: This function NEVER deletes existing data on a populated database.
 * The destructive cleanup phase runs ONLY when the database is empty
 * (i.e. there are zero users). If users already exist, the function logs a
 * message and returns immediately without touching any data.
 *
 * This makes it safe to call from `scripts/vercel-setup.ts` on every Vercel
 * build: it will seed a fresh database and no-op on an already-seeded one.
 */
export async function seedDatabase() {
  console.log('🌱 Seeding Safari Academy database...')

  // ---------- SAFETY GUARD ----------
  // If the DB already has users, it has already been seeded (or is in use).
  // Skip everything — never delete existing data on a populated database.
  const existingUsers = await db.user.count()
  if (existingUsers > 0) {
    console.log(`ℹ️  DB already has ${existingUsers} user(s). Skipping seed — existing data will not be touched.`)
    return
  }

  // ---------- IDEMPOTENT CLEANUP ----------
  // Only reached on an empty database (no users). Clear any orphan seed rows
  // left over from a partial/interrupted previous run, then insert fresh.
  console.log('🧹 DB is empty — running cleanup before seeding...')
  await db.eventRegistration.deleteMany()
  await db.event.deleteMany()
  await db.newsPost.deleteMany()
  await db.galleryItem.deleteMany()
  await db.galleryCategory.deleteMany()
  await db.alumniProfile.deleteMany()
  await db.alumniApplication.deleteMany()
  await db.testimonial.deleteMany()
  await db.achievement.deleteMany()
  await db.partner.deleteMany()
  await db.faq.deleteMany()
  await db.policyDocument.deleteMany()
  await db.contactMessage.deleteMany()
  await db.admissionInquiry.deleteMany()
  await db.subscriber.deleteMany()
  await db.mediaAsset.deleteMany()
  await db.feeRow.deleteMany()
  await db.feeColumn.deleteMany()
  await db.feeTable.deleteMany()
  await db.scholarship.deleteMany()
  await db.importantDate.deleteMany()
  await db.admissionRequirement.deleteMany()
  await db.admissionStep.deleteMany()
  await db.facilityItem.deleteMany()
  await db.program.deleteMany()
  await db.feature.deleteMany()
  await db.timelineMilestone.deleteMany()
  await db.teamMember.deleteMany()
  await db.branchImage.deleteMany()
  await db.branch.deleteMany()
  await db.heroSlide.deleteMany()
  // HomeSection + LegalPage + Setting + User are upserted below (kept).

  // ---------- USERS ----------
  const pw = await bcrypt.hash('ChangeMe123!', 10)
  await db.user.upsert({
    where: { email: 'admin@safariacademy.com' },
    update: {},
    create: {
      email: 'admin@safariacademy.com',
      name: 'Joseph James',
      passwordHash: pw,
      role: 'SUPER_ADMIN',
      mustChangePw: false,
      avatar: IMG('avatar-admin', 200, 200),
    },
  })
  await db.user.upsert({
    where: { email: 'editor@safariacademy.com' },
    update: {},
    create: {
      email: 'editor@safariacademy.com',
      name: 'Selam Tadesse',
      passwordHash: await bcrypt.hash('Editor123!', 10),
      role: 'EDITOR',
    },
  })

  // ---------- SETTINGS (JSON-encoded values) ----------
  const settings = [
    ['siteName', 'Safari Academy', 'branding'],
    ['tagline', 'Your Kids, Our Kids • Educating Minds, Inspiring Hearts', 'branding'],
    ['since', '2005', 'branding'],
    ['logoLight', '/brand/logo-light.svg', 'branding'],
    ['logoDark', '/brand/logo-dark.svg', 'branding'],
    ['favicon', '/brand/favicon.svg', 'branding'],
    ['primaryColor', '#FFD500', 'branding'],
    ['secondaryColor', '#0B5D2A', 'branding'],
    ['accentColor', '#1FA64D', 'branding'],
    ['address', 'CMC Street, Civil Service Area, Addis Ababa, Ethiopia', 'contact'],
    ['phone', '+251 973 077 535', 'contact'],
    ['phone2', '+251 11 234 5678', 'contact'],
    ['email', 'info@safariacademy.com', 'contact'],
    ['emailAdmissions', 'admissions@safariacademy.com', 'contact'],
    ['workingHours', 'Mon–Fri: 8:00 AM – 4:30 PM', 'contact'],
    ['whatsapp', '+251973077535', 'contact'],
    ['mapEmbedUrl', 'https://www.openstreetmap.org/export/embed.html?bbox=38.79%2C9.00%2C38.85%2C9.05&layer=mapnik', 'contact'],
    ['mapDirectionsUrl', 'https://www.openstreetmap.org/?mlat=9.025&mlon=38.820#map=15/9.025/38.820', 'contact'],
    ['footerText', 'Safari Academy — \"Your Kids, Our Kids.\" Educating minds and inspiring hearts since 2005.', 'footer'],
    ['copyrightText', '© 2026 Safari Academy. All Rights Reserved.', 'footer'],
    ['creditText', 'Designed with passion by Joseph James', 'footer'],
    ['creditLink', 'https://onyx-jj.onrender.com/', 'footer'],
    ['ogImage', IMG('og-safari', 1200, 630), 'seo'],
    ['seoTitleTemplate', '%s — Safari Academy', 'seo'],
    ['seoDescription', 'Safari Academy, Addis Ababa — Ethiopia\'s preferred private school since 2005. 6,000+ students, 560+ staff, 6 campuses. Your Kids, Our Kids.', 'seo'],
    ['preloaderEnabled', 'true', 'preloader'],
    ['preloaderTagline', 'Since 2005 • Your Kids, Our Kids', 'preloader'],
    ['admissionsOpen', 'true', 'admissions'],
    ['admissionsDeadline', '2026-08-15', 'admissions'],
    ['cookieText', 'We use cookies to enhance your browsing experience. By continuing, you agree to our use of cookies.', 'cookies'],
    ['facebook', 'https://facebook.com/safariacademy', 'social'],
    ['instagram', 'https://instagram.com/safariacademy', 'social'],
    ['twitter', 'https://twitter.com/safariacademy', 'social'],
    ['telegram', 'https://t.me/safariacademy', 'social'],
    ['youtube', 'https://youtube.com/@safariacademy', 'social'],
  ]
  for (const [k, v, g] of settings) {
    await db.setting.upsert({
      where: { key: k },
      update: { value: v, group: g },
      create: { key: k, value: v, group: g },
    })
  }

  // ---------- HERO SLIDES ----------
  const heroSlides = [
    {
      title: 'Your Kids, Our Kids',
      subtitle: 'Educating minds and inspiring hearts since 2005. From 107 students in a single classroom to 6,000+ learners across six campuses — Ethiopia\'s story of growth, discipline, and dreams.',
      mediaUrl: IMG('safari-hero-1', 1920, 1080),
      ctaLabel: 'Apply Now',
      ctaLink: '#admissions',
      cta2Label: 'Our Story',
      cta2Link: '#about',
      overlay: 45,
      order: 0,
    },
    {
      title: 'Six Campuses. One Family.',
      subtitle: '2 Kindergartens, 3 Primary Schools, and 1 Secondary & College Preparatory campus — serving nearly 6,000 students with 560+ dedicated teachers and staff across Addis Ababa.',
      mediaUrl: IMG('safari-hero-2', 1920, 1080),
      ctaLabel: 'Explore Campuses',
      ctaLink: '#branches',
      cta2Label: 'Book a Visit',
      cta2Link: '#contact',
      overlay: 55,
      order: 1,
    },
    {
      title: 'Educating Minds, Inspiring Hearts',
      subtitle: 'A 20-year journey of academic excellence, strong discipline, and moral values — producing outstanding results in national examinations and university placements.',
      mediaUrl: IMG('safari-hero-3', 1920, 1080),
      ctaLabel: 'Discover Academics',
      ctaLink: '#academics',
      overlay: 50,
      order: 2,
    },
  ]
  for (const s of heroSlides) {
    await db.heroSlide.create({ data: s })
  }

  // ---------- HOME SECTIONS ----------
  const homeSections = [
    ['hero', 'Hero'],
    ['welcome', 'Welcome'],
    ['whyChoose', 'Why Choose Us'],
    ['journey', 'Learning Path'],
    ['campuses', 'Our Campuses'],
    ['programs', 'Programs & Academics'],
    ['admissions', 'Admissions CTA'],
    ['gallery', 'Student Life'],
    ['news', 'Latest News'],
    ['events', 'Upcoming Events'],
    ['testimonials', 'Testimonials'],
    ['achievements', 'Achievements'],
    ['alumni', 'Alumni Spotlight'],
    ['virtualTour', 'Virtual Tour'],
    ['finalCta', 'Final CTA'],
    ['newsletter', 'Newsletter'],
  ]
  for (const [i, [key, title]] of homeSections.entries()) {
    await db.homeSection.upsert({
      where: { key },
      update: { order: i, title },
      create: { key, title, order: i, visible: true },
    })
  }

  // ---------- BRANCHES (6 campuses: 2 KG + 3 Primary + 1 Secondary) ----------
  const branches = [
    { name: 'Umar Sibhatu', slug: 'umar-sibhatu', tagline: 'Flagship Campus • Secondary & College Preparatory', description: 'Our historic flagship — where the Safari story began in 2005. Now home to our Secondary & College Preparatory program, producing outstanding national examination results and university placements.', principal: 'Dr. Hanna Bekele', grades: 'Secondary & College Preparatory (Grades 9–12)', stats: JSON.stringify({ students: 1100, teachers: 95, founded: 2005 }), featured: true, coverImage: IMG('campus-umar', 1600, 1000) },
    { name: 'Summit Primary', slug: 'summit', tagline: 'Primary Campus', description: 'A thriving primary campus known for innovative teaching methodologies, modern learning materials, and structured student assessment systems.', principal: 'Mr. Daniel Assefa', grades: 'Primary (Grades 1–8)', stats: JSON.stringify({ students: 1400, teachers: 120, founded: 2010 }), featured: true, coverImage: IMG('campus-summit', 1600, 1000) },
    { name: 'Raey Kindergarten', slug: 'raey', tagline: 'Kindergarten Campus', description: 'A nurturing early-years haven where our youngest learners discover the joy of learning through play, music, and exploration.', principal: 'Ms. Marta Girma', grades: 'Kindergarten (KG 1–3)', stats: JSON.stringify({ students: 850, teachers: 65, founded: 2012 }), coverImage: IMG('campus-raey', 1600, 1000) },
    { name: 'Fird Bet Primary', slug: 'fird-bet', tagline: 'Primary Campus', description: 'A vibrant primary campus combining academic rigor with arts, music, and character education — where every child is known by name.', principal: 'Mr. Yonas Tesfaye', grades: 'Primary (Grades 1–8)', stats: JSON.stringify({ students: 1300, teachers: 110, founded: 2014 }), coverImage: IMG('campus-fird', 1600, 1000) },
    { name: 'Figa Kindergarten', slug: 'figa', tagline: 'Kindergarten Campus', description: 'Our second kindergarten campus — a safe, joyful, and stimulating environment built specially for our youngest learners\' first steps into education.', principal: 'Ms. Almaz Tesfaye', grades: 'Kindergarten (KG 1–3)', stats: JSON.stringify({ students: 650, teachers: 50, founded: 2016 }), coverImage: IMG('campus-figa', 1600, 1000) },
    { name: 'Bole Primary', slug: 'bole', tagline: 'Primary Campus', description: 'Our newest primary campus, serving families across Bole and surrounding areas with the same Safari commitment to excellence, discipline, and moral values.', principal: 'Dr. Sara Kebede', grades: 'Primary (Grades 1–8)', stats: JSON.stringify({ students: 700, teachers: 60, founded: 2019 }), coverImage: IMG('campus-bole', 1600, 1000) },
  ]
  for (const [i, b] of branches.entries()) {
    const branch = await db.branch.create({
      data: {
        ...b,
        order: i,
        visible: true,
        address: `${b.name} Campus, Addis Ababa, Ethiopia`,
        phone: '+251 973 077 535',
        email: `${b.slug}@safariacademy.com`,
        facilities: JSON.stringify(['Science Labs', 'Library', 'Sports Field', 'ICT Center', 'Cafeteria', 'Clinic']),
        mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=38.79%2C9.00%2C38.85%2C9.05&layer=mapnik',
        videoTourUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
        videoPoster: IMG(`campus-${b.slug}-poster`, 1600, 900),
      },
    })
    // images per branch
    for (let j = 0; j < 4; j++) {
      await db.branchImage.create({
        data: {
          branchId: branch.id,
          url: IMG(`${b.slug}-${j}`, 1200, 800),
          alt: `${b.name} campus view ${j + 1}`,
          order: j,
        },
      })
    }
  }

  // ---------- TEAM ----------
  const leadership = [
    { name: 'Dr. Aklile Mekonnen', role: 'Founder & Director General', bio: 'Visionary educator who founded Safari Academy in 2005 with 8 staff and 107 students — and grew it into Ethiopia\'s preferred school.', photo: IMG('lead-aklile', 600, 600), featured: true, fullBio: 'Dr. Aklile Mekonnen founded Safari Academy in 2005 with a clear mission: to provide quality education, strong discipline, and moral values. Starting with just 8 dedicated staff members and 107 students from Kindergarten to Grade 2, she nurtured the academy through two decades of growth into one of Ethiopia\'s most respected private educational institutions — now serving nearly 6,000 students with 560+ teachers and staff across six campuses. Her guiding motto, "Your Kids, Our Kids," remains the heartbeat of every Safari classroom.' },
    { name: 'Mr. Joseph James', role: 'Executive Director', bio: 'Leads strategy and operations across all six campuses, ensuring the Safari standard of excellence.', photo: IMG('lead-joseph', 600, 600), fullBio: 'Joseph James oversees strategic direction, partnerships, and the academy\'s continued growth. He ensures that every campus — from Kindergarten to College Preparatory — upholds the motto "Your Kids, Our Kids" and the commitment to academic excellence, integrity, and innovation.' },
    { name: 'Dr. Hanna Bekele', role: 'Principal, Umar Sibhatu Campus (Secondary)', bio: 'Leads our flagship secondary & college preparatory campus with a focus on national exam excellence.', photo: IMG('lead-hanna', 600, 600), fullBio: 'Dr. Hanna Bekele leads our Secondary & College Preparatory campus, producing outstanding results in national examinations and university entrance placements year after year.' },
    { name: 'Mr. Daniel Assefa', role: 'Principal, Summit Primary Campus', bio: 'Champions innovative teaching methodologies and modern learning materials.', photo: IMG('lead-daniel', 600, 600), fullBio: 'Daniel Assefa leads our Summit Primary campus, known for its improved teaching methodologies, structured assessment systems, and student-centered learning.' },
    { name: 'Ms. Marta Girma', role: 'Principal, Raey Kindergarten', bio: 'Early childhood specialist nurturing our youngest learners\' first steps.', photo: IMG('lead-marta', 600, 600), fullBio: 'Marta Girma creates the joyful, safe, and stimulating environment where our youngest learners discover the love of learning — the foundation of every Safari student\'s journey.' },
    { name: 'Mr. Yonas Tesfaye', role: 'Principal, Fird Bet Primary Campus', bio: 'Combines academic rigor with arts and character education.', photo: IMG('lead-yonas', 600, 600), fullBio: 'Yonas Tesfaye leads our Fird Bet Primary campus, where academic excellence meets character development and every child is known by name.' },
  ]
  for (const [i, t] of leadership.entries()) {
    await db.teamMember.create({ data: { ...t, type: 'LEADERSHIP', order: i, visible: true, quote: 'Education is the most powerful weapon you can use to change the world.' } })
  }
  const staff = [
    { name: 'Mrs. Selam Tadesse', role: 'Head of Administration', department: 'Administration', photo: IMG('staff-selam', 400, 400) },
    { name: 'Mr. Abel Negash', role: 'Student Affairs Coordinator', department: 'Student Affairs', photo: IMG('staff-abel', 400, 400) },
    { name: 'Ms. Hewan Girmay', role: 'Finance Manager', department: 'Finance', photo: IMG('staff-hewan', 400, 400) },
    { name: 'Mr. Robel Kifle', role: 'IT & Systems Lead', department: 'IT', photo: IMG('staff-robel', 400, 400) },
    { name: 'Mrs. Tigist Wolde', role: 'Head Librarian', department: 'Library', photo: IMG('staff-tigist', 400, 400) },
    { name: 'Dr. Nahom Bekele', role: 'School Physician', department: 'Health', photo: IMG('staff-nahom', 400, 400) },
    { name: 'Mr. Solomon Girma', role: 'Facilities & Security Lead', department: 'Security & Facilities', photo: IMG('staff-solomon', 400, 400) },
    { name: 'Mrs. Eden Asfaw', role: 'Admissions Officer', department: 'Administration', photo: IMG('staff-eden', 400, 400) },
  ]
  for (const [i, s] of staff.entries()) {
    await db.teamMember.create({ data: { ...s, type: 'STAFF', order: i, visible: true } })
  }

  // ---------- TIMELINE (real Safari Academy history) ----------
  const timeline = [
    { year: '2005 G.C', title: 'The Journey Begins', description: 'Safari Academy was founded in Addis Ababa with the motto "Your Kids, Our Kids." It opened with just 8 dedicated staff members and 107 students enrolled from Kindergarten to Grade 2.' },
    { year: '2010 G.C', title: 'Expansion & Innovation', description: 'The academy expanded its primary education programs and introduced improved teaching methodologies, modern learning materials, and structured student assessment systems.' },
    { year: '2015 G.C', title: 'Secondary Education Launch', description: 'Safari Academy launched its secondary education program and strengthened exam preparation strategies, producing outstanding results in national examinations and university entrance placements.' },
    { year: '2025 G.C', title: 'Ethiopia\'s Preferred School', description: 'Today, Safari Academy operates 2 Kindergarten campuses, 3 Primary Schools, and 1 Secondary & College Preparatory campus — serving nearly 6,000 students with 560+ teachers and staff. Recognized for academic performance, student discipline, and modern facilities.' },
  ]
  for (const [i, t] of timeline.entries()) {
    await db.timelineMilestone.create({ data: { ...t, order: i } })
  }

  // ---------- WHY CHOOSE / VALUES ----------
  const whyChoose = [
    { icon: 'Trophy', title: 'Academic Excellence', description: 'Commitment to high academic standards, continuous improvement, and outstanding student achievement — proven by national exam results.' },
    { icon: 'Shield', title: 'Integrity & Discipline', description: 'Promoting ethical behavior, responsibility, respect, and strong moral values in every learner — the heart of our motto.' },
    { icon: 'Cpu', title: 'Innovation', description: 'Encouraging creativity, critical thinking, and the use of modern teaching and learning approaches.' },
    { icon: 'Globe', title: 'Global Perspective', description: 'Preparing students to succeed locally and globally with confidence, adaptability, and cultural awareness.' },
    { icon: 'Users', title: '560+ Dedicated Staff', description: 'Highly qualified teachers and administrators who guide every student with care and expertise.' },
    { icon: 'Heart', title: 'Your Kids, Our Kids', description: 'A 20-year promise — we treat every child as our own, nurturing both minds and hearts.' },
  ]
  for (const [i, f] of whyChoose.entries()) {
    await db.feature.create({ data: { ...f, section: 'whyChoose', order: i, visible: true } })
  }
  const values = [
    { icon: 'Trophy', title: 'Academic Excellence', description: 'Commitment to high academic standards, continuous improvement, and outstanding student achievement.' },
    { icon: 'Shield', title: 'Integrity & Discipline', description: 'Promoting ethical behavior, responsibility, respect, and strong moral values in every learner.' },
    { icon: 'Cpu', title: 'Innovation', description: 'Encouraging creativity, critical thinking, and the use of modern teaching and learning approaches.' },
    { icon: 'Globe', title: 'Global Perspective', description: 'Preparing students to succeed locally and globally with confidence, adaptability, and cultural awareness.' },
  ]
  for (const [i, f] of values.entries()) {
    await db.feature.create({ data: { ...f, section: 'values', order: i, visible: true } })
  }

  // ---------- PROGRAMS (real structure: 2 KG + 3 Primary + 1 Secondary) ----------
  const programs = [
    { level: 'KG', title: 'Kindergarten', agesRange: 'KG 1–3 (Ages 3–6)', description: 'A nurturing, play-based foundation where our youngest learners discover the joy of learning. Two dedicated KG campuses designed especially for early years.', subjects: JSON.stringify(['Phonics & Literacy', 'Numeracy', 'Amharic', 'Art & Music', 'Storytelling', 'Outdoor Play']), goals: JSON.stringify(['Social-emotional development', 'Foundational literacy & numeracy', 'Curiosity & wonder', 'Moral values from day one']), classSize: 'Small groups' },
    { level: 'Primary', title: 'Primary School', agesRange: 'Grades 1–8 (Ages 6–14)', description: 'A rigorous, joyful foundation across three primary campuses — combining academic excellence with strong discipline, improved teaching methodologies, and structured assessment systems.', subjects: JSON.stringify(['English', 'Amharic', 'Mathematics', 'Science', 'Social Studies', 'ICT', 'Art', 'PE', 'Moral Education']), goals: JSON.stringify(['Academic excellence', 'Critical thinking & problem-solving', 'Ethical behavior & discipline', 'Creativity & innovation']), classSize: 'Structured classes' },
    { level: 'Secondary', title: 'Secondary & College Preparatory', agesRange: 'Grades 9–12 (Ages 14–18)', description: 'Our flagship secondary program at Umar Sibhatu campus — producing outstanding national examination results and university entrance placements year after year.', subjects: JSON.stringify(['Advanced Sciences', 'Mathematics', 'Languages', 'Social Sciences', 'Natural Sciences', 'ICT', 'College Prep']), goals: JSON.stringify(['National exam excellence', 'University placement', 'Leadership & responsibility', 'Career readiness']), classSize: 'Exam-focused groups' },
  ]
  for (const [i, p] of programs.entries()) {
    await db.program.create({ data: { ...p, order: i, visible: true } })
  }

  // ---------- FACILITIES ----------
  const facilities = [
    { title: 'Science Laboratories', description: 'Fully-equipped physics, chemistry, and biology labs across all senior campuses.', icon: 'FlaskConical' },
    { title: 'Innovation Maker-Space', description: '3D printers, robotics kits, and electronics for hands-on invention.', icon: 'Cpu' },
    { title: 'Library & Media Center', description: 'Over 25,000 volumes plus digital resources and quiet study pods.', icon: 'BookOpen' },
    { title: 'Sports Complex', description: 'Football pitch, basketball courts, indoor hall, and athletics track.', icon: 'Dumbbell' },
    { title: 'Auditorium', description: 'A 400-seat performance space for assemblies, drama, and concerts.', icon: 'Music' },
    { title: 'Cafeteria', description: 'Healthy, balanced meals prepared fresh daily by certified chefs.', icon: 'Utensils' },
    { title: 'Health Clinic', description: 'On-site medical staff and a sick-bay at every campus.', icon: 'HeartPulse' },
    { title: 'ICT & Digital Hub', description: 'High-speed internet, tablets, and smart boards in every classroom.', icon: 'Laptop' },
    { title: 'School Transport', description: 'Safe, GPS-tracked bus routes across Addis Ababa.', icon: 'Bus' },
  ]
  for (const [i, f] of facilities.entries()) {
    await db.facilityItem.create({ data: { ...f, images: JSON.stringify([IMG(`facility-${i}`, 1200, 800)]), order: i, visible: true } })
  }

  // ---------- ADMISSIONS ----------
  const steps = [
    { title: 'Inquiry & Visit', description: 'Submit an inquiry or book a campus tour to meet our team.', icon: 'Search' },
    { title: 'Application', description: 'Complete the online application and submit required documents.', icon: 'FileText' },
    { title: 'Assessment', description: 'Age-appropriate assessment and a friendly conversation with the student.', icon: 'ClipboardCheck' },
    { title: 'Family Interview', description: 'A relaxed meeting with parents to align on values and expectations.', icon: 'Users' },
    { title: 'Offer & Enrollment', description: 'Receive your offer, confirm your seat, and welcome to Safari!', icon: 'PartyPopper' },
  ]
  for (const [i, s] of steps.entries()) {
    await db.admissionStep.create({ data: { ...s, order: i, visible: true } })
  }
  const reqs = [
    { level: 'KG', items: JSON.stringify(['Birth certificate', '2 passport photos', 'Immunization record', 'Parent ID']) },
    { level: 'Primary', items: JSON.stringify(['Previous report cards', 'Birth certificate', 'Transfer letter', '2 photos']) },
    { level: 'Middle', items: JSON.stringify(['Last 2 years report cards', 'Recommendation letter', 'Birth certificate']) },
    { level: 'High', items: JSON.stringify(['Transcripts', 'Standardized test scores', 'Personal essay', 'Recommendation letters']) },
  ]
  for (const [i, r] of reqs.entries()) {
    await db.admissionRequirement.create({ data: { ...r, order: i } })
  }
  const dates = [
    { date: '2026-01-15', label: 'Applications Open', description: 'Online portal opens for the 2026/2027 academic year.' },
    { date: '2026-04-30', label: 'Priority Deadline', description: 'Submit by this date for first-round decisions.' },
    { date: '2026-06-15', label: 'Assessment Week', description: 'On-campus assessments and family interviews.' },
    { date: '2026-08-15', label: 'Final Deadline', description: 'Final day to submit applications for the new year.' },
    { date: '2026-09-01', label: 'School Begins', description: 'First day of the 2026/2027 academic year.' },
  ]
  for (const [i, d] of dates.entries()) {
    await db.importantDate.create({ data: { ...d, order: i } })
  }
  const scholarships = [
    { title: 'Merit Scholarship', description: 'Full or partial tuition for top-performing applicants.', amount: 'Up to 100% tuition', eligibility: 'Outstanding academic record and assessment' },
    { title: 'Safari Bursary', description: 'Need-based financial aid for families.', amount: 'Up to 50% tuition', eligibility: 'Demonstrated financial need' },
    { title: 'Sibling Discount', description: 'For families with multiple children enrolled.', amount: '10% per additional child', eligibility: 'Two or more siblings enrolled' },
  ]
  for (const [i, s] of scholarships.entries()) {
    await db.scholarship.create({ data: { ...s, order: i, visible: true } })
  }

  // ---------- FEE TABLE ----------
  const feeTable = await db.feeTable.create({
    data: {
      title: 'Tuition & Fees — Per Term',
      academicYear: '2025/2026',
      note: 'All fees in Ethiopian Birr (ETB). Three terms per academic year. Registration, uniform, books, and transport are billed separately.',
      currency: 'ETB',
      published: true,
      order: 0,
    },
  })
  const cols = ['Tuition', 'Registration', 'Books & Materials']
  const colIds: string[] = []
  for (const [i, c] of cols.entries()) {
    const col = await db.feeColumn.create({ data: { tableId: feeTable.id, label: c, order: i } })
    colIds.push(col.id)
  }
  const rows = [
    { label: 'Kindergarten', cells: ['24,000', '4,000', '3,500'], highlight: false },
    { label: 'Primary (1–6)', cells: ['28,000', '4,000', '4,000'], highlight: true },
    { label: 'Middle (7–8)', cells: ['32,000', '5,000', '4,500'], highlight: false },
    { label: 'High (9–12)', cells: ['38,000', '5,000', '5,000'], highlight: false },
  ]
  for (const [i, r] of rows.entries()) {
    await db.feeRow.create({ data: { tableId: feeTable.id, label: r.label, cells: JSON.stringify(r.cells), highlight: r.highlight, order: i } })
  }

  // ---------- NEWS ----------
  const news = [
    {
      title: 'Safari Robotics Team Wins National Championship',
      slug: 'safari-robotics-team-wins-national-championship',
      excerpt: 'Our Summit Campus robotics squad took home gold at the Ethiopia National Robotics Olympiad.',
      body: '<p>In a thrilling finale, the Safari Academy Summit Campus robotics team emerged victorious at the Ethiopia National Robotics Olympiad, beating 48 other schools to claim the championship trophy.</p><p>The team, made up of students from grades 9–11, designed and programmed an autonomous robot capable of completing complex obstacle navigation and object manipulation tasks in under two minutes.</p><p>"This is what happens when curiosity meets opportunity," said coach Mr. Daniel Assefa. "Our students have shown that Ethiopian innovation can compete with anyone."</p><p>The win qualifies the team for the World Robotics Olympiad in Istanbul later this year.</p>',
      coverImage: IMG('news-robotics', 1200, 700),
      category: 'Achievements',
      tags: JSON.stringify(['Robotics', 'STEM', 'Summit Campus']),
      author: 'Communications Office',
      featured: true,
      readingTime: 3,
    },
    {
      title: 'Safari Academy Launches New Bole International Wing',
      slug: 'safari-academy-launches-new-bole-international-wing',
      excerpt: 'A new international curriculum track opens at our Bole Campus this September.',
      body: '<p>Responding to growing demand from families across Addis Ababa, Safari Academy is proud to announce the launch of a dedicated international curriculum track at our Bole Campus.</p><p>The new wing will offer a globally-recognized curriculum with a strong emphasis on inquiry-based learning, multilingual fluency, and project-based assessment.</p><p>"This is more than a curriculum change," said Dr. Sara Kebede, Bole Campus Principal. "It\'s a statement that Ethiopian education can be both rooted and global."</p>',
      coverImage: IMG('news-bole', 1200, 700),
      category: 'Announcements',
      tags: JSON.stringify(['Bole Campus', 'International', 'Curriculum']),
      author: 'Communications Office',
      featured: false,
      readingTime: 4,
    },
    {
      title: 'Annual Arts Festival Draws Record Crowds',
      slug: 'annual-arts-festival-draws-record-crowds',
      excerpt: 'The Fird Bet auditorium was alive with music, drama, and visual arts at our annual festival.',
      body: '<p>The Fird Bet Campus auditorium burst with color, sound, and creativity as the annual Safari Arts Festival welcomed over 2,000 guests across two evenings.</p><p>The festival featured performances by the school orchestra, choir, drama club, and a visual arts exhibition curated by senior students.</p><p>Highlights included an original musical composition by Grade 10 student Mahlet Tesfaye and a stunning photography series by Grade 12 student Bereket Alemu.</p>',
      coverImage: IMG('news-arts', 1200, 700),
      category: 'Events',
      tags: JSON.stringify(['Arts', 'Fird Bet Campus', 'Festival']),
      author: 'Communications Office',
      featured: false,
      readingTime: 2,
    },
    {
      title: 'New Partnership with MIT Blossoms Program',
      slug: 'new-partnership-with-mit-blossoms-program',
      excerpt: 'Safari Academy joins the MIT BLOSSOMS network to bring open educational resources to classrooms.',
      body: '<p>Safari Academy has been accepted into the MIT BLOSSOMS (Blended Learning Open Source Science or Math Studies) network.</p><p>The partnership gives our teachers access to a library of free, interactive STEM video lessons designed by MIT faculty and global educators.</p><p>"This is a game-changer for our professional learning community," said Mr. Joseph James, Executive Director.</p>',
      coverImage: IMG('news-mit', 1200, 700),
      category: 'Partnerships',
      tags: JSON.stringify(['Partnerships', 'STEM', 'MIT']),
      author: 'Communications Office',
      featured: false,
      readingTime: 3,
    },
    {
      title: 'Parent-Teacher Conference Highlights Holistic Growth',
      slug: 'parent-teacher-conference-highlights-holistic-growth',
      excerpt: 'Spring conferences celebrated not just grades, but character, leadership, and wellbeing.',
      body: '<p>This term\'s parent-teacher conferences at Safari Academy introduced a new holistic growth framework that goes far beyond academic grades.</p><p>Teachers and parents discussed each student\'s character development, leadership milestones, social-emotional wellbeing, and personal passions alongside traditional academic progress.</p>',
      coverImage: IMG('news-ptc', 1200, 700),
      category: 'Student Life',
      tags: JSON.stringify(['Parents', 'Community']),
      author: 'Communications Office',
      featured: false,
      readingTime: 2,
    },
  ]
  for (const n of news) {
    await db.newsPost.create({ data: n as any })
  }

  // ---------- EVENTS ----------
  const now = new Date()
  const future = (days: number, h = 10) => {
    const d = new Date(now)
    d.setDate(d.getDate() + days)
    d.setHours(h, 0, 0, 0)
    return d
  }
  const events = [
    { title: 'Open House & Campus Tour', slug: 'open-house-campus-tour', excerpt: 'A guided tour of all our campuses with principals and teachers.', body: '<p>Join us for an immersive open house across all eight Safari Academy campuses. Meet our principals, tour our facilities, and discover what makes a Safari education unique.</p>', coverImage: IMG('event-openhouse', 1200, 700), startDateTime: future(14, 9), endDateTime: future(14, 13), venue: 'All Campuses', category: 'Admissions', featured: true, registrationOpen: true },
    { title: 'Safari Sports Day 2026', slug: 'safari-sports-day-2026', excerpt: 'A full day of athletics, teamwork, and school spirit at Figa Campus.', body: '<p>Our annual Sports Day brings together students from all eight campuses for a celebration of athleticism, teamwork, and good sportsmanship.</p>', coverImage: IMG('event-sports', 1200, 700), startDateTime: future(30, 8), endDateTime: future(30, 16), venue: 'Figa Campus Sports Field', category: 'Sports', featured: true, registrationOpen: true },
    { title: 'STEM & Innovation Fair', slug: 'stem-innovation-fair', excerpt: 'Student-led projects, robotics demos, and a keynote from a visiting scientist.', body: '<p>The STEM & Innovation Fair showcases the best of student projects across science, technology, engineering, and mathematics.</p>', coverImage: IMG('event-stem', 1200, 700), startDateTime: future(45, 10), endDateTime: future(45, 15), venue: 'Summit Campus', category: 'Academics', featured: false, registrationOpen: false },
    { title: 'Graduation Ceremony — Class of 2026', slug: 'graduation-ceremony-2026', excerpt: 'Celebrating our graduating class at the Umar Sibhatu auditorium.', body: '<p>The graduation ceremony for the Class of 2026 will be held at the Umar Sibhatu Campus auditorium.</p>', coverImage: IMG('event-grad', 1200, 700), startDateTime: future(120, 14), endDateTime: future(120, 17), venue: 'Umar Sibhatu Auditorium', category: 'Ceremony', featured: true, registrationOpen: true },
    { title: 'Winter Arts Gala', slug: 'winter-arts-gala', excerpt: 'An evening of music, drama, and visual arts at Fird Bet.', body: '<p>The annual Winter Arts Gala returns to the Fird Bet auditorium with performances by our orchestra, choir, and drama club.</p>', coverImage: IMG('event-gala', 1200, 700), startDateTime: future(60, 18), endDateTime: future(60, 21), venue: 'Fird Bet Auditorium', category: 'Arts', featured: false, registrationOpen: false },
  ]
  for (const e of events) {
    await db.event.create({ data: e as any })
  }

  // ---------- GALLERY ----------
  const galleryCats = ['Sports', 'Arts', 'Trips', 'Ceremonies', 'Clubs', 'Campus']
  for (const [i, c] of galleryCats.entries()) {
    await db.galleryCategory.create({ data: { name: c, order: i } })
  }
  const galleryItems = [
    { title: 'Football Championship', category: 'Sports', url: IMG('gal-sports-1', 1000, 700), featured: true },
    { title: 'Orchestra Performance', category: 'Arts', url: IMG('gal-arts-1', 1000, 700), featured: true },
    { title: 'Field Trip to Lalibela', category: 'Trips', url: IMG('gal-trip-1', 1000, 700) },
    { title: 'Graduation 2025', category: 'Ceremonies', url: IMG('gal-cer-1', 1000, 700), featured: true },
    { title: 'Robotics Club', category: 'Clubs', url: IMG('gal-club-1', 1000, 700) },
    { title: 'Umar Sibhatu Campus', category: 'Campus', url: IMG('gal-campus-1', 1000, 700), featured: true },
    { title: 'Basketball Finals', category: 'Sports', url: IMG('gal-sports-2', 1000, 700) },
    { title: 'Art Exhibition', category: 'Arts', url: IMG('gal-arts-2', 1000, 700) },
    { title: 'Trip to Awash National Park', category: 'Trips', url: IMG('gal-trip-2', 1000, 700) },
    { title: 'Award Ceremony', category: 'Ceremonies', url: IMG('gal-cer-2', 1000, 700) },
    { title: 'Debate Club', category: 'Clubs', url: IMG('gal-club-2', 1000, 700) },
    { title: 'Summit Campus Library', category: 'Campus', url: IMG('gal-campus-2', 1000, 700) },
    { title: 'Swimming Gala', category: 'Sports', url: IMG('gal-sports-3', 1000, 700) },
    { title: 'Drama Club Production', category: 'Arts', url: IMG('gal-arts-3', 1000, 700) },
    { title: 'Historical Tour Gondar', category: 'Trips', url: IMG('gal-trip-3', 1000, 700) },
  ]
  for (const [i, g] of galleryItems.entries()) {
    await db.galleryItem.create({ data: { ...g, order: i, visible: true } as any })
  }

  // ---------- ALUMNI ----------
  const alumni = [
    { name: 'Selamawit Demissie', graduationYear: '2012', currentRole: 'Software Engineer', company: 'Google', quote: 'Safari taught me to stay curious — it\'s still my superpower.', photo: IMG('alum-selam', 600, 600), sector: 'Technology', linkedin: 'https://linkedin.com', featured: true },
    { name: 'Nahom Teshome', graduationYear: '2010', currentRole: 'Cardiologist', company: 'Black Lion Hospital', quote: 'The teachers who believed in me at Safari shaped my entire career.', photo: IMG('alum-nahom', 600, 600), sector: 'Medicine', featured: true },
    { name: 'Mahlet Girma', graduationYear: '2015', currentRole: 'Architect', company: 'ABBA Architects', quote: 'I learned to design dreams at Safari.', photo: IMG('alum-mahlet', 600, 600), sector: 'Architecture' },
    { name: 'Bereket Assefa', graduationYear: '2008', currentRole: 'Social Entrepreneur', company: 'Edible Ethiopia', quote: 'Safari gave me the courage to start something that matters.', photo: IMG('alum-bereket', 600, 600), sector: 'Social Impact', featured: true },
    { name: 'Ruth Bekele', graduationYear: '2013', currentRole: 'Lawyer', company: 'International Court', quote: 'I learned to argue with grace at Safari.', photo: IMG('alum-ruth', 600, 600), sector: 'Law' },
    { name: 'Yonathan Abay', graduationYear: '2017', currentRole: 'PhD Candidate, MIT', company: 'MIT', quote: 'The foundation I got at Safari is still my anchor.', photo: IMG('alum-yonathan', 600, 600), sector: 'Academia' },
  ]
  for (const [i, a] of alumni.entries()) {
    await db.alumniProfile.create({ data: { ...a, order: i, visible: true } as any })
  }

  // ---------- TESTIMONIALS ----------
  const testimonials = [
    { name: 'Mrs. Almaz Tadesse', role: 'Parent of two Safari students', quote: 'Safari doesn\'t just educate my children — it sees them. The teachers know each child deeply.', rating: 5, avatar: IMG('test-almaz', 200, 200) },
    { name: 'Mahlet Bekele', role: 'Grade 11 Student', quote: 'I never thought I\'d love physics. My teacher at Summit changed that.', rating: 5, avatar: IMG('test-mahlet', 200, 200) },
    { name: 'Dr. Yohannes Girma', role: 'Alumnus, Class of 2009', quote: 'The values I learned at Safari are with me every day as a physician.', rating: 5, avatar: IMG('test-yohannes', 200, 200) },
    { name: 'Mrs. Selam Kebede', role: 'Parent', quote: 'We chose Safari for the academics. We stayed for the heart.', rating: 5, avatar: IMG('test-selam', 200, 200) },
  ]
  for (const [i, t] of testimonials.entries()) {
    await db.testimonial.create({ data: { ...t, order: i, visible: true } })
  }

  // ---------- ACHIEVEMENTS (real Safari Academy milestones) ----------
  const achievements = [
    { year: '2005 G.C', title: 'Founded with 107 Students', description: 'Safari Academy opened with 8 staff members and 107 students (KG–Grade 2) under the motto "Your Kids, Our Kids."' },
    { year: '2010 G.C', title: 'Primary Programs Expanded', description: 'Introduced improved teaching methodologies, modern learning materials, and structured student assessment systems.' },
    { year: '2015 G.C', title: 'Secondary Education Launched', description: 'Opened the Secondary & College Preparatory program, producing outstanding national examination results.' },
    { year: '2025 G.C', title: '6,000 Students • 6 Campuses', description: 'Now serving nearly 6,000 students with 560+ teachers and staff across 2 KG, 3 Primary, and 1 Secondary campus.' },
    { year: '2025 G.C', title: 'Ethiopia\'s Preferred School', description: 'Recognized for academic performance, student discipline, modern facilities, and consistent success in national and international competitions.' },
    { year: '2025 G.C', title: 'University Placement Excellence', description: 'Outstanding results in national examinations and university entrance placements — a 20-year track record of academic excellence.' },
  ]
  for (const [i, a] of achievements.entries()) {
    await db.achievement.create({ data: { ...a, order: i, visible: true } })
  }

  // ---------- PARTNERS ----------
  const partners = [
    { name: 'MIT BLOSSOMS', logo: IMG('partner-mit', 300, 200) },
    { name: 'Cambridge Assessment', logo: IMG('partner-cambridge', 300, 200) },
    { name: 'British Council', logo: IMG('partner-brit', 300, 200) },
    { name: 'UNESCO Ethiopia', logo: IMG('partner-unesco', 300, 200) },
    { name: 'Addis Ababa University', logo: IMG('partner-aau', 300, 200) },
    { name: 'Ethio Telecom', logo: IMG('partner-ethio', 300, 200) },
  ]
  for (const [i, p] of partners.entries()) {
    await db.partner.create({ data: { ...p, order: i, visible: true } })
  }

  // ---------- FAQS ----------
  const faqs = [
    { question: 'What is the language of instruction at Safari Academy?', answer: 'English is the primary language of instruction from Grade 1. Amharic is taught as a core subject, and French and Arabic are offered as electives from Middle School.', category: 'Academics' },
    { question: 'How many campuses do you have?', answer: 'Safari Academy operates eight campuses across Addis Ababa: Umar Sibhatu, Summit, Raey, Fird Bet, Figa, Bole, CMC, and Gerji.', category: 'General' },
    { question: 'What are the school hours?', answer: 'Regular school hours are 8:00 AM to 3:30 PM, with after-school activities running until 4:30 PM on most campuses.', category: 'General' },
    { question: 'Do you provide transport?', answer: 'Yes. We operate a fleet of GPS-tracked school buses covering most neighborhoods in Addis Ababa. Transport fees are billed separately.', category: 'Admissions' },
    { question: 'What extracurricular activities are available?', answer: 'We offer over 60 clubs and activities including robotics, debate, drama, orchestra, football, basketball, swimming, art, and coding.', category: 'Student Life' },
    { question: 'What is the student-to-teacher ratio?', answer: 'Our average ratio is 12:1, with class sizes capped at 20 in Primary and 22 in Middle School.', category: 'Academics' },
    { question: 'How do I apply?', answer: 'Submit an online inquiry through our Admissions page, then complete the application form. Our admissions team will contact you within 48 hours to schedule an assessment.', category: 'Admissions' },
    { question: 'Do you offer scholarships?', answer: 'Yes. We offer merit scholarships, need-based bursaries, and sibling discounts. See the Admissions page for details.', category: 'Admissions' },
  ]
  for (const [i, f] of faqs.entries()) {
    await db.faq.create({ data: { ...f, order: i, visible: true } })
  }

  // ---------- POLICIES ----------
  const policies = [
    { title: 'Child Protection Policy', description: 'Our comprehensive child safeguarding framework.', fileUrl: '#' },
    { title: 'Code of Conduct', description: 'Expectations for students, staff, and parents.', fileUrl: '#' },
    { title: 'Attendance Policy', description: 'Guidelines for attendance and punctuality.', fileUrl: '#' },
    { title: 'Anti-Bullying Policy', description: 'Our commitment to a safe, respectful environment.', fileUrl: '#' },
    { title: 'Digital Acceptable Use', description: 'Responsible use of technology at Safari.', fileUrl: '#' },
  ]
  for (const [i, p] of policies.entries()) {
    await db.policyDocument.create({ data: { ...p, order: i, visible: true } })
  }

  // ---------- LEGAL ----------
  await db.legalPage.upsert({
    where: { slug: 'privacy' },
    update: {},
    create: {
      slug: 'privacy',
      title: 'Privacy Policy',
      updatedAt: 'January 2026',
      body: '<h2>1. Introduction</h2><p>Safari Academy ("we", "us") respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard information.</p><h2>2. Information We Collect</h2><p>We collect information you provide directly — such as names, emails, and phone numbers through forms — and anonymized analytics data.</p><h2>3. How We Use It</h2><p>To respond to inquiries, process applications, communicate with families, and improve our services.</p><h2>4. Data Security</h2><p>We implement industry-standard security measures including encryption and access controls.</p><h2>5. Your Rights</h2><p>You may request access to, correction of, or deletion of your personal data at any time.</p><h2>6. Contact</h2><p>For privacy inquiries, contact privacy@safariacademy.com.</p>',
    },
  })
  await db.legalPage.upsert({
    where: { slug: 'terms' },
    update: {},
    create: {
      slug: 'terms',
      title: 'Terms of Service',
      updatedAt: 'January 2026',
      body: '<h2>1. Acceptance of Terms</h2><p>By accessing this website, you agree to be bound by these Terms of Service.</p><h2>2. Use of Content</h2><p>All content on this site is the property of Safari Academy unless otherwise stated. You may not reproduce it without permission.</p><h2>3. User Conduct</h2><p>You agree not to use this site for any unlawful or harmful purpose.</p><h2>4. Limitation of Liability</h2><p>Safari Academy is not liable for any indirect or consequential damages arising from the use of this site.</p><h2>5. Changes</h2><p>We may update these terms from time to time. Continued use constitutes acceptance.</p><h2>6. Contact</h2><p>For questions about these terms, contact legal@safariacademy.com.</p>',
    },
  })

  // ---------- SOME INBOX / SUBSCRIBERS DEMO ----------
  await db.contactMessage.create({ data: { name: 'Hanna Girma', email: 'hanna@example.com', phone: '+251912345678', subject: 'Campus Visit', campus: 'Umar Sibhatu', message: 'I would like to schedule a campus visit for my 6-year-old daughter next week.' } })
  await db.contactMessage.create({ data: { name: 'Yonas Bekele', email: 'yonas@example.com', phone: '+251923456789', subject: 'Scholarship inquiry', campus: 'Summit', message: 'Are scholarships available for Grade 9 students?' } })
  await db.admissionInquiry.create({ data: { parentName: 'Almaz Tadesse', email: 'almaz@example.com', phone: '+251934567890', studentName: 'Lily Tadesse', gradeLevel: 'KG', campus: 'Raey', message: 'Interested in enrolling my daughter for the next academic year.' } })
  await db.subscriber.upsert({ where: { email: 'parent1@example.com' }, update: {}, create: { email: 'parent1@example.com' } })
  await db.subscriber.upsert({ where: { email: 'parent2@example.com' }, update: {}, create: { email: 'parent2@example.com' } })

  console.log('✅ Seed complete!')
}

// NOTE: This file only EXPORTS `seedDatabase` — it has no side effects on import.
// The standalone runner lives in `prisma/seed-runner.ts` (used by `bun run db:seed`).

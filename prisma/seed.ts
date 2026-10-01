import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

const IMG = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

async function main() {
  console.log('🌱 Seeding Safari Academy database...')

  // ---------- IDEMPOTENT CLEANUP ----------
  // Safe to run multiple times: clear seed content first (users + settings are upserted below).
  // Order matters due to foreign keys.
  console.log('🧹 Clearing existing seed data...')
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
    ['tagline', 'Nurturing Young Minds • Building Ethiopia\'s Future Leaders', 'branding'],
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
    ['footerText', 'Safari Academy — where curiosity meets character, and every learner finds their spark.', 'footer'],
    ['copyrightText', '© 2026 Safari Academy. All Rights Reserved.', 'footer'],
    ['creditText', 'Designed with passion by Joseph James', 'footer'],
    ['creditLink', 'https://onyx-jj.onrender.com/', 'footer'],
    ['ogImage', IMG('og-safari', 1200, 630), 'seo'],
    ['seoTitleTemplate', '%s — Safari Academy', 'seo'],
    ['seoDescription', 'Safari Academy, Addis Ababa — a future-forward, multi-campus school nurturing young minds since 2005.', 'seo'],
    ['preloaderEnabled', 'true', 'preloader'],
    ['preloaderTagline', 'Since 2005 • Nurturing Young Minds', 'preloader'],
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
      title: 'Where Young Minds Take Flight',
      subtitle: 'A future-forward, multi-campus school in Addis Ababa — nurturing curiosity, character, and creativity since 2005.',
      mediaUrl: IMG('safari-hero-1', 1920, 1080),
      ctaLabel: 'Apply Now',
      ctaLink: '#admissions',
      cta2Label: 'Virtual Tour',
      cta2Link: '#virtual-tour',
      overlay: 45,
      order: 0,
    },
    {
      title: 'Eight Campuses. One Spirit.',
      subtitle: 'From Umar Sibhatu to Summit, Raey, Fird Bet, Figa and beyond — discover a campus near you.',
      mediaUrl: IMG('safari-hero-2', 1920, 1080),
      ctaLabel: 'Explore Campuses',
      ctaLink: '#branches',
      cta2Label: 'Book a Visit',
      cta2Link: '#contact',
      overlay: 55,
      order: 1,
    },
    {
      title: 'Learning That Feels Like an Adventure',
      subtitle: 'Future-ready curriculum, world-class facilities, and a Safari spirit of discovery.',
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

  // ---------- BRANCHES (8 campuses) ----------
  const branches = [
    { name: 'Umar Sibhatu', slug: 'umar-sibhatu', tagline: 'The Flagship Campus', description: 'Our historic flagship campus in the heart of Addis Ababa, blending heritage with cutting-edge learning spaces. Home to over 1,200 students from KG to High School.', principal: 'Dr. Hanna Bekele', grades: 'KG, Primary, Middle, High', stats: JSON.stringify({ students: 1240, teachers: 86, founded: 2005 }), featured: true, coverImage: IMG('campus-umar', 1600, 1000) },
    { name: 'Summit', slug: 'summit', tagline: 'The Innovation Campus', description: 'Perched at Summit area, this campus leads our STEM and innovation programs with state-of-the-art labs and a maker-space.', principal: 'Mr. Daniel Assefa', grades: 'Primary, Middle, High', stats: JSON.stringify({ students: 820, teachers: 58, founded: 2010 }), featured: true, coverImage: IMG('campus-summit', 1600, 1000) },
    { name: 'Raey', slug: 'raey', tagline: 'The Early Years Hub', description: 'A nurturing environment tailored for our youngest learners, with play-based learning and bright, open classrooms.', principal: 'Ms. Marta Girma', grades: 'KG, Primary', stats: JSON.stringify({ students: 540, teachers: 38, founded: 2012 }), coverImage: IMG('campus-raey', 1600, 1000) },
    { name: 'Fird Bet', slug: 'fird-bet', tagline: 'The Arts & Culture Campus', description: 'Where creativity flourishes — music halls, art studios, and a 400-seat auditorium.', principal: 'Mr. Yonas Tesfaye', grades: 'Primary, Middle, High', stats: JSON.stringify({ students: 690, teachers: 49, founded: 2014 }), coverImage: IMG('campus-fird', 1600, 1000) },
    { name: 'Figa', slug: 'figa', tagline: 'The Sports Academy', description: 'Built around wellness and athletics, with full-size football pitch, basketball courts, and an indoor sports hall.', principal: 'Coach Bereket Alemu', grades: 'Primary, Middle, High', stats: JSON.stringify({ students: 610, teachers: 44, founded: 2016 }), coverImage: IMG('campus-figa', 1600, 1000) },
    { name: 'Bole', slug: 'bole', tagline: 'The International Wing', description: 'An international curriculum track serving families across Bole and surrounding areas.', principal: 'Dr. Sara Kebede', grades: 'KG, Primary, Middle, High', stats: JSON.stringify({ students: 720, teachers: 51, founded: 2018 }), coverImage: IMG('campus-bole', 1600, 1000) },
    { name: 'Cmc', slug: 'cmc', tagline: 'The Future-Ready Campus', description: 'Our newest campus with future-ready classrooms, immersive technology, and sustainable design.', principal: 'Mr. Nahom Solomon', grades: 'KG, Primary, Middle', stats: JSON.stringify({ students: 480, teachers: 35, founded: 2021 }), coverImage: IMG('campus-cmc', 1600, 1000) },
    { name: 'Gerji', slug: 'gerji', tagline: 'The Community Campus', description: 'A vibrant, community-driven campus fostering local engagement and global outlook.', principal: 'Ms. Ruth Tadesse', grades: 'KG, Primary', stats: JSON.stringify({ students: 410, teachers: 30, founded: 2023 }), coverImage: IMG('campus-gerji', 1600, 1000) },
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
    { name: 'Dr. Aklile Mekonnen', role: 'Founder & Director General', bio: 'Visionary educator with 30+ years shaping Ethiopia\'s future leaders.', photo: IMG('lead-aklile', 600, 600), featured: true, fullBio: 'Dr. Aklile Mekonnen founded Safari Academy in 2005 with a vision of a school where every child\'s curiosity is celebrated. With a PhD in Educational Leadership from Addis Ababa University and decades of teaching experience, she has grown the academy into eight thriving campuses serving over 5,000 students.' },
    { name: 'Mr. Joseph James', role: 'Executive Director', bio: 'Leads strategy and innovation across all eight campuses.', photo: IMG('lead-joseph', 600, 600), fullBio: 'Joseph James brings a global perspective to Safari Academy, having worked in educational leadership across three continents. He oversees strategic direction, partnerships, and the academy\'s digital transformation.' },
    { name: 'Dr. Hanna Bekele', role: 'Principal, Umar Sibhatu Campus', bio: 'Doctorate in Curriculum Development, 22 years of service.', photo: IMG('lead-hanna', 600, 600), fullBio: 'Dr. Hanna Bekele leads our flagship campus with warmth and rigor. She pioneered our bilingual curriculum framework.' },
    { name: 'Mr. Daniel Assefa', role: 'Principal, Summit Campus', bio: 'STEM advocate and innovation lab founder.', photo: IMG('lead-daniel', 600, 600), fullBio: 'Daniel founded Safari\'s first maker-space and leads our award-winning robotics program.' },
    { name: 'Ms. Marta Girma', role: 'Principal, Raey Campus', bio: 'Early childhood specialist.', photo: IMG('lead-marta', 600, 600), fullBio: 'Marta is a passionate advocate for play-based learning and has shaped our early-years philosophy.' },
    { name: 'Mr. Yonas Tesfaye', role: 'Director of Arts & Culture', bio: 'Award-winning composer and educator.', photo: IMG('lead-yonas', 600, 600), fullBio: 'Yonas leads our orchestra, choir, and visual arts programs across all campuses.' },
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

  // ---------- TIMELINE ----------
  const timeline = [
    { year: '2005', title: 'The Journey Begins', description: 'Safari Academy opens its doors at Umar Sibhatu with 80 students and a bold vision.' },
    { year: '2010', title: 'Summit Campus Opens', description: 'Our second campus launches, introducing the STEM-focused track.' },
    { year: '2014', title: 'Arts & Culture Campus', description: 'Fird Bet campus opens with a 400-seat auditorium.' },
    { year: '2018', title: 'International Wing', description: 'Bole campus launches with a full international curriculum.' },
    { year: '2021', title: 'Future-Ready Campus', description: 'CMC campus opens with immersive technology and sustainable design.' },
    { year: '2024', title: '5,000+ Students', description: 'Safari Academy now serves over 5,000 students across 8 campuses.' },
  ]
  for (const [i, t] of timeline.entries()) {
    await db.timelineMilestone.create({ data: { ...t, order: i } })
  }

  // ---------- WHY CHOOSE / VALUES ----------
  const whyChoose = [
    { icon: 'Sparkles', title: 'Future-Ready Curriculum', description: 'STEM, robotics, coding, and critical thinking woven into every grade.' },
    { icon: 'Heart', title: 'Character-First Education', description: 'We grow kind, courageous, and ethical young leaders.' },
    { icon: 'Languages', title: 'Bilingual Excellence', description: 'Fluent in English and Amharic, with French and Arabic options.' },
    { icon: 'Trophy', title: 'Award-Winning Programs', description: 'National robotics champions and regional debate winners.' },
    { icon: 'Users', title: 'Small Class Sizes', description: '1:12 teacher-student ratio for personalized attention.' },
    { icon: 'Globe', title: 'Global Outlook', description: 'Partnerships across 6 countries and growing.' },
  ]
  for (const [i, f] of whyChoose.entries()) {
    await db.feature.create({ data: { ...f, section: 'whyChoose', order: i, visible: true } })
  }
  const values = [
    { icon: 'Compass', title: 'Curiosity', description: 'We follow our questions wherever they lead.' },
    { icon: 'Shield', title: 'Integrity', description: 'We do what is right, even when no one is watching.' },
    { icon: 'HandHeart', title: 'Compassion', description: 'We care for our community and our planet.' },
    { icon: 'Flame', title: 'Excellence', description: 'We pursue our personal best in all we do.' },
  ]
  for (const [i, f] of values.entries()) {
    await db.feature.create({ data: { ...f, section: 'values', order: i, visible: true } })
  }

  // ---------- PROGRAMS ----------
  const programs = [
    { level: 'KG', title: 'Kindergarten', agesRange: '3–6 years', description: 'Play-based, child-led learning that builds a lifelong love of discovery.', subjects: JSON.stringify(['Phonics', 'Numeracy', 'Art & Music', 'Storytelling', 'Outdoor Play']), goals: JSON.stringify(['Social-emotional skills', 'Foundational literacy', 'Curiosity & wonder']), classSize: '12 per class' },
    { level: 'Primary', title: 'Primary School', agesRange: '6–11 years', description: 'A rigorous, joyful foundation in literacy, numeracy, science, and the arts.', subjects: JSON.stringify(['English', 'Amharic', 'Mathematics', 'Science', 'Social Studies', 'Art', 'PE']), goals: JSON.stringify(['Reading fluency', 'Problem-solving', 'Collaboration']), classSize: '20 per class' },
    { level: 'Middle', title: 'Middle School', agesRange: '11–14 years', description: 'A bridge years program exploring identity, passion, and deeper inquiry.', subjects: JSON.stringify(['STEM', 'Languages', 'Humanities', 'Coding', 'Design', 'Music']), goals: JSON.stringify(['Critical thinking', 'Self-direction', 'Project-based learning']), classSize: '22 per class' },
    { level: 'High', title: 'High School', agesRange: '14–18 years', description: 'College-prep with AP-style tracks, dual enrollment, and global partnerships.', subjects: JSON.stringify(['Advanced Sciences', 'Mathematics', 'Literature', 'Economics', 'Computer Science', 'Foreign Languages']), goals: JSON.stringify(['University readiness', 'Leadership', 'Career exploration']), classSize: '18 per class' },
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

  // ---------- ACHIEVEMENTS ----------
  const achievements = [
    { year: '2025', title: 'National Robotics Champions', description: 'Gold medal at the Ethiopia National Robotics Olympiad.' },
    { year: '2024', title: 'Top IB Results Nationwide', description: '100% pass rate with 4 perfect scores.' },
    { year: '2024', title: 'East African Debate Cup', description: 'Winners of the East African Schools Debate Championship.' },
    { year: '2023', title: 'Cambridge Excellence Award', description: 'Recognized for outstanding international curriculum delivery.' },
    { year: '2022', title: '5,000+ Students Enrolled', description: 'Crossed the 5,000-student milestone across all campuses.' },
    { year: '2021', title: 'Green School Certification', description: 'Awarded for sustainability and environmental education.' },
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

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

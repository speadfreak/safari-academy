export interface Settings {
  siteName: string
  tagline: string
  since: string
  logoLight: string
  logoDark: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  address: string
  phone: string
  phone2: string
  email: string
  emailAdmissions: string
  workingHours: string
  whatsapp: string
  mapEmbedUrl: string
  mapDirectionsUrl: string
  footerText: string
  copyrightText: string
  creditText: string
  creditLink: string
  ogImage: string
  seoTitleTemplate: string
  seoDescription: string
  preloaderEnabled: string
  preloaderTagline: string
  admissionsOpen: string
  admissionsDeadline: string
  cookieText: string
  facebook: string
  instagram: string
  twitter: string
  telegram: string
  youtube: string
  [k: string]: string
}

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  mediaType: string
  mediaUrl: string
  posterUrl: string | null
  ctaLabel: string | null
  ctaLink: string | null
  cta2Label: string | null
  cta2Link: string | null
  overlay: number
  order: number
  visible: boolean
}

export interface HomeSection { id: string; key: string; title: string; order: number; visible: boolean }

export interface BranchImage { id: string; url: string; alt: string | null; caption: string | null; order: number }
export interface Branch {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string
  address: string | null
  phone: string | null
  email: string | null
  principal: string | null
  grades: string | null
  facilities: string[]
  stats: Record<string, number>
  mapEmbedUrl: string | null
  videoTourUrl: string | null
  videoPoster: string | null
  panorama360: string | null
  coverImage: string | null
  order: number
  visible: boolean
  featured: boolean
  images: BranchImage[]
}

export interface TeamMember {
  id: string
  type: string
  name: string
  role: string
  department: string | null
  bio: string | null
  fullBio: string | null
  education: string | null
  yearsOfService: number | null
  quote: string | null
  photo: string | null
  email: string | null
  phone: string | null
  linkedin: string | null
  twitter: string | null
  featured: boolean
  order: number
  visible: boolean
}

export interface TimelineMilestone { id: string; year: string; title: string; description: string; icon: string | null; order: number }
export interface Feature { id: string; section: string; icon: string | null; title: string; description: string; order: number; visible: boolean }
export interface Program {
  id: string; level: string; title: string; agesRange: string | null; description: string;
  subjects: string[] | null; goals: string[] | null; classSize: string | null; icon: string | null; order: number; visible: boolean
}
export interface FacilityItem { id: string; title: string; description: string; icon: string | null; images: string[]; order: number; visible: boolean }

export interface AdmissionStep { id: string; title: string; description: string; icon: string | null; order: number; visible: boolean }
export interface AdmissionRequirement { id: string; level: string; items: string[]; order: number }
export interface ImportantDate { id: string; date: string; label: string; description: string | null; order: number }
export interface Scholarship { id: string; title: string; description: string; amount: string | null; eligibility: string | null; order: number; visible: boolean }

export interface FeeColumn { id: string; label: string; order: number }
export interface FeeRow { id: string; label: string; cells: string[]; highlight: boolean; order: number }
export interface FeeTable {
  id: string; title: string; academicYear: string; note: string | null; currency: string;
  pdfUrl: string | null; published: boolean; order: number; columns: FeeColumn[]; rows: FeeRow[]
}

export interface NewsPost {
  id: string; title: string; slug: string; excerpt: string | null; body: string;
  coverImage: string | null; gallery: string[] | null; category: string | null; tags: string[] | null;
  author: string | null; status: string; featured: boolean; publishedAt: string; readingTime: number | null; createdAt: string; updatedAt: string
}

export interface EventItem {
  id: string; title: string; slug: string; excerpt: string | null; body: string;
  coverImage: string | null; gallery: string[] | null; startDateTime: string; endDateTime: string | null;
  venue: string | null; branchId: string | null; category: string | null; status: string;
  featured: boolean; registrationOpen: boolean; mapEmbedUrl: string | null; createdAt: string; updatedAt: string
  _count?: { registrations: number }
}

export interface GalleryItem { id: string; title: string | null; caption: string | null; type: string; url: string; poster: string | null; category: string; branchId: string | null; featured: boolean; order: number; visible: boolean }
export interface GalleryCategory { id: string; name: string; order: number }

export interface AlumniProfile {
  id: string; name: string; graduationYear: string; currentRole: string | null; company: string | null;
  quote: string | null; bio: string | null; photo: string | null; sector: string | null;
  linkedin: string | null; twitter: string | null; featured: boolean; order: number; visible: boolean
}

export interface Testimonial { id: string; name: string; role: string | null; quote: string; rating: number; avatar: string | null; order: number; visible: boolean }
export interface Achievement { id: string; year: string; title: string; description: string | null; icon: string | null; order: number; visible: boolean }
export interface Partner { id: string; name: string; logo: string | null; link: string | null; order: number; visible: boolean }
export interface Faq { id: string; question: string; answer: string; category: string; order: number; visible: boolean }
export interface PolicyDocument { id: string; title: string; description: string | null; fileUrl: string | null; order: number; visible: boolean }
export interface LegalPage { id: string; slug: string; title: string; body: string; updatedAt: string | null }

export interface BootstrapData {
  settings: Settings
  heroSlides: HeroSlide[]
  homeSections: HomeSection[]
  branches: Branch[]
  news: NewsPost[]
  events: EventItem[]
  galleryItems: GalleryItem[]
  galleryCategories: GalleryCategory[]
  alumni: AlumniProfile[]
  testimonials: Testimonial[]
  achievements: Achievement[]
  partners: Partner[]
  faqs: Faq[]
  policies: PolicyDocument[]
  teamLeadership: TeamMember[]
  teamStaff: TeamMember[]
  timeline: TimelineMilestone[]
  features: Feature[]
  programs: Program[]
  facilities: FacilityItem[]
  admissionSteps: AdmissionStep[]
  admissionRequirements: AdmissionRequirement[]
  importantDates: ImportantDate[]
  scholarships: Scholarship[]
  feeTables: FeeTable[]
  legalPages: LegalPage[]
}

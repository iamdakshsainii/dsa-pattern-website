// lib/community-config.js
// Configuration for Codex Community integration

export const COMMUNITY_CONFIG = {
  name: 'Codex Community',
  founder: 'Daksh Saini',
  tagline: 'Join 1500+ students mastering DSA together',

  // Social Links
  links: {
    whatsapp: 'https://chat.whatsapp.com/JbGXT1pjy0a020qAhGGmCx',
    telegram: null, // Optional: Add if you have telegram
    discord: null,  // Optional: Add if you have discord
    linkedin: null, // Optional: Add your LinkedIn
  },

  // Community Stats
  stats: {
    members: '1500+',
    companies: '10+',
    placements: '50+',
    avgPackage: '12 LPA'
  },

  // Features/Benefits
  features: [
    {
      icon: '💬',
      title: 'Daily Discussions',
      description: 'Active problem-solving discussions'
    },
    {
      icon: '🤝',
      title: 'Peer Support',
      description: 'Get help when you are stuck'
    },
    {
      icon: '📚',
      title: 'Resources',
      description: 'Curated study materials and tips'
    },
    {
      icon: '🎯',
      title: 'Mock Interviews',
      description: 'Practice with peers before real interviews'
    },
    {
      icon: '🏆',
      title: 'Weekly Contests',
      description: 'Compete and improve together'
    },
    {
      icon: '💼',
      title: 'Job Referrals',
      description: 'Get referrals from senior members'
    }
  ],

  // Success Stories (Update with real testimonials)
  testimonials: [
    {
      name: 'Rahul Kumar',
      role: 'SDE @ Amazon',
      image: null, // Optional: Add image URL
      text: 'Codex Community helped me crack my dream job. The daily practice and peer support were invaluable.',
      package: '42 LPA'
    },
    {
      name: 'Priya Sharma',
      role: 'SDE @ Google',
      image: null,
      text: 'The mock interviews and problem discussions in Codex gave me the confidence to ace my interviews.',
      package: '58 LPA'
    },
    {
      name: 'Amit Verma',
      role: 'SDE @ Microsoft',
      image: null,
      text: 'Best DSA learning community. Got referrals and constant motivation from amazing peers.',
      package: '44 LPA'
    }
  ],

  // Community Rules/Guidelines
  rules: [
    'Be respectful and supportive',
    'No spam or promotional content',
    'Share knowledge and help others',
    'Active participation encouraged',
    'Keep discussions relevant to DSA/interviews'
  ],

  // Banner Settings
  banner: {
    enabled: true,
    dismissible: true,
    message: 'Join our community of 1500+ students preparing for top tech companies!',
    ctaText: 'Join Now',
    backgroundColor: 'from-green-600 to-emerald-600'
  }
}

// Helper function to check if WhatsApp link is configured
export function isWhatsAppConfigured() {
  return COMMUNITY_CONFIG.links.whatsapp &&
         !COMMUNITY_CONFIG.links.whatsapp.includes('YOUR_WHATSAPP_LINK')
}

// Helper function to get primary community link
export function getPrimaryCommunityLink() {
  return COMMUNITY_CONFIG.links.whatsapp || '#'
}

// Helper function to get all configured social links
export function getConfiguredLinks() {
  return Object.entries(COMMUNITY_CONFIG.links)
    .filter(([_, url]) => url !== null && url !== '')
    .map(([platform, url]) => ({ platform, url }))
}

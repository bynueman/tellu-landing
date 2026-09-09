import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, type Variants } from 'framer-motion';
import {
  Sun, Moon, Globe, Menu, X, ArrowRight, ExternalLink,
  Send, CheckCircle2, Building2, Phone, Mail, MapPin,
  ArrowUpRight, Cpu, BarChart3, Network, Lightbulb, Target,
  Handshake, ChevronDown, Check, Zap, Sparkles,
  Store, Briefcase, Laptop, ShieldCheck, Layers,
  Terminal, Activity,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE & CONSTANTS — STRICT ANTI-SLOP: no rainbow gradient text
// Brand colors only as micro-indicator dots, border highlights, icon badges
// ─────────────────────────────────────────────────────────────────────────────
const BG_DARK  = '#08090C';
const BG_LIGHT = '#F8FAFC';

// Accent colors: used ONLY for tiny dots, active border, icon tint
const ACC = {
  tech: {
    dot:    '#FF9700',
    border: 'rgba(255,151,0,0.25)',
    text:   '#FF9700',
    subtle: 'rgba(255,151,0,0.06)',
  },
  growth: {
    dot:    '#C8ED00',
    border: 'rgba(200,237,0,0.25)',
    text:   '#B8D900',
    subtle: 'rgba(200,237,0,0.06)',
  },
  partner: {
    dot:    '#38B5EF',
    border: 'rgba(56,181,239,0.25)',
    text:   '#38B5EF',
    subtle: 'rgba(56,181,239,0.06)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MOTION CONFIG — Ultra-smooth Awwwards & Apple standard curves
// ─────────────────────────────────────────────────────────────────────────────
const VP = { once: false, amount: 0.15 } as const;
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const FADE_LEFT: Variants = {
  hidden: { opacity: 0, x: -28 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const FADE_RIGHT: Variants = {
  hidden: { opacity: 0, x: 28 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
const BTN_TAP   = { scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 25 } } as const;
const BTN_HVR   = { scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 20 } } as const;
const CARD_HVR  = { y: -6, transition: { type: 'spring', stiffness: 350, damping: 22 } } as const;

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS — Bilingual: Santai tapi profesional
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  id: {
    nav: {
      home: 'Beranda',
      ecosystem: 'Ekosistem',
      solutions: 'Solusi Bisnis',
      about: 'Tentang Kami',
      cta: 'Mulai Kolaborasi',
    },
    megaMenu: {
      col1Title: '01 // TEKNOLOGI & INFRASTRUKTUR',
      col1Items: [
        { name: 'YukWebsite.online', desc: 'Solusi web instan, landing page ekspres & UMKM', href: 'https://yukwebsite.online', external: true, track: 4, icon: Globe },
        { name: 'TELLU Systems', desc: 'Sistem POS realtime, inventori, dan software operasional kustom', href: undefined, external: false, track: 5, icon: Cpu },
        { name: 'Cloud & AI Tooling', desc: 'Infrastruktur cloud terdistribusi dan automasi AI', href: undefined, external: false, track: 1, icon: Zap },
      ],
      col2Title: '02 // AKSELERASI BISNIS',
      col2Items: [
        { name: 'Conversion Pipelines', desc: 'Optimasi jalur akuisisi dan konversi lead ke WhatsApp', href: undefined, external: false, track: 2, icon: Target },
        { name: 'Brand Modernization', desc: 'Peningkatan positioning dan identitas otoritas digital', href: undefined, external: false, track: 2, icon: Sparkles },
        { name: 'Data-Driven Growth', desc: 'Analitik performa terukur dan strategi retensi pasar', href: undefined, external: false, track: 2, icon: BarChart3 },
      ],
      col3Title: '03 // SINERGI & ALIANSI',
      col3Items: [
        { name: 'Jaringan Reseller', desc: 'Program distribusi resmi dan lisensi ekosistem teknologi', href: undefined, external: false, track: 3, icon: Network },
        { name: 'Joint Ventures', desc: 'Inkubasi bersama dan kemitraan strategis multi-industri', href: undefined, external: false, track: 3, icon: Handshake },
        { name: 'Enterprise Advisory', desc: 'Konsultasi arsitektur sistem dan solusi bisnis terpadu', href: undefined, external: false, track: 0, icon: Building2 },
      ],
      footerText: 'Diskusikan arsitektur sistem dan akselerasi bisnis Anda langsung dengan tim eksekutif TELLU.',
      footerCta: 'Jadwalkan Konsultasi Khusus',
    },
    hero: {
      headline: 'Tiga Fondasi Skala\nEkosistem Bisnis.',
      sub: 'Ekosistem digital terpadu untuk akselerasi dan ekspansi enterprise — ditopang rekayasa teknologi presisi, strategi pertumbuhan berbasis data, dan aliansi kemitraan strategis.',
      cta1: 'Jelajah Ekosistem',
      cta2: 'Jadwalkan Konsultasi',
      coord: '7.7956° LS · 110.3695° BT · Yogyakarta Tech Hub',
    },
    metrics: {
      label: 'Fondasi Institusional',
      headline: 'Kekuatan ekosistem yang teruji.',
      items: [
        { value: '3 Pilar', label: 'Ekosistem Terintegrasi', desc: 'Teknologi, Growth, dan Kemitraan bergerak serentak tanpa sekat birokrasi.' },
        { value: '99.9%',  label: 'Target Uptime SLA',      desc: 'Arsitektur cloud terdistribusi dengan standar keamanan enterprise.' },
        { value: '100%',   label: 'Kepemilikan IP Penuh',   desc: 'Seluruh source code, aset digital, dan hak cipta diserahkan 100%.' },
        { value: 'YGY',    label: 'Hub Rekayasa Talenta',   desc: 'Efisiensi modal tinggi dengan standar rekayasa software kelas dunia.' },
      ],
    },
    ticker: [
      'CUSTOM SOFTWARE ARCHITECTURE', 'CLOUD SAAS PLATFORMS', 'AI WORKFLOW AUTOMATION',
      'FULL-FUNNEL PERFORMANCE', 'RESELLER SYNDICATE NETWORK', 'HIGH-CONVERSION DIGITAL PRESENCE',
    ],
    marquee: {
      services: [
        'Web POS Realtime', 'Landing Page Express', 'Multi-Branch Cloud',
        'WhatsApp Automated Pipeline', 'Bespoke SaaS Engine', 'Corporate ERP Modular',
        'B2B Tender Consortium', 'AI Chatbot Integrations', 'Multi-Outlet Inventory',
        'Custom CRM System', 'SEO Dominance Engine', 'Performance Ads Funnel',
      ],
      tech: [
        'PostgreSQL', 'Laravel Architecture', 'React / Next.js', 'Payment Gateways',
        'Meta Ads API', 'GA4 Analytics', 'Docker & Kubernetes', 'AWS / GCP Cloud',
        'TypeScript', 'Python FastAPI', 'Stripe / Midtrans', 'Cloudflare Edge',
      ],
    },
    pillars: {
      label: 'Tiga Pilar Ekosistem',
      headline: 'Satu ekosistem.\nTiga fondasi kokoh.',
      items: [
        {
          num: '01',
          name: 'Teknologi & Infrastruktur',
          tag: 'Kami Bangun',
          acc: 'tech' as const,
          Icon: Cpu,
          headline: 'Infrastruktur modern yang siap menopang ekspansi bisnis.',
          desc: 'Kami rekayasa website korporat berkecepatan tinggi, platform cloud SaaS multi-tenant, microservices terdistribusi, hingga otomasi AI workflow dan pipeline DevOps yang scalable.',
          capabilities: [
            'Web Architecture & Instant Portals', 'Cloud SaaS & API Gateway',
            'Otomasi AI & Workflow Bot', 'DevOps & High-Availability Infra', 'Distributed Microservices',
          ],
          cta: 'Jelajahi Solusi Teknologi',
          track: 0,
        },
        {
          num: '02',
          name: 'Akselerasi Bisnis',
          tag: 'Kami Akselerasi',
          acc: 'growth' as const,
          Icon: BarChart3,
          headline: 'Mesin pertumbuhan agresif yang berakar pada data valid.',
          desc: 'Bukan sekadar iklan. Kami rancang strategi akuisisi multi-channel, optimasi conversion rate (CRO), otoritas brand yang berwibawa, dan dominasi SEO organik yang berkelanjutan.',
          capabilities: [
            'Performance Acquisition Ads', 'Brand Positioning & Authority',
            'Search Engine Dominance (SEO)', 'WhatsApp Automated Lead Funnel', 'Business Intelligence Analytics',
          ],
          cta: 'Akselerasi Growth Bisnis',
          track: 2,
        },
        {
          num: '03',
          name: 'Sinergi & Aliansi',
          tag: 'Kami Sindikasi',
          acc: 'partner' as const,
          Icon: Network,
          headline: 'Aliansi strategis untuk membuka pasar baru lebih cepat.',
          desc: 'Pertumbuhan terbaik terjadi lewat kolaborasi. Kami sediakan skema joint venture, jaringan reseller terstruktur, lisensi white-label, dan konsorsium tender B2B maupun institusi.',
          capabilities: [
            'Strategic Joint Venture (JV)', 'Agency Reseller Network',
            'White-Label Technology License', 'Enterprise Tender Consortium', 'B2B Distribution Alliance',
          ],
          cta: 'Gabung Jaringan Sindikasi',
          track: 3,
        },
      ],
    },
    archetypes: {
      label: 'Coda Blueprint Simulator',
      headline: 'Pilih Model Bisnis,\nEksplorasi Alur Skala Usaha.',
      sub: 'Simulasi alur pertumbuhan modular yang disesuaikan dengan profil dan skala operasional perusahaan Anda.',
      tabs: [
        {
          id: 'retail',
          name: 'Retail & Multi-Outlet',
          icon: Store,
          acc: 'tech' as const,
          badge: 'High-Volume Transactions',
          summary: 'Infrastruktur POS terdistribusi real-time, sinkronisasi inventori antar-cabang, dan pipeline retensi membership pelanggan.',
          steps: [
            { phase: '01. Pondasi', desc: 'Deploy TELLU Systems POS multi-cabang + inventori cloud tersentralisasi' },
            { phase: '02. Mesin', desc: 'Otomasi broadcast WhatsApp CRM promo dan integrasi payment gateway QRIS' },
            { phase: '03. Ekspansi', desc: 'Sindikasi franchise dan sistem royalti reseller multi-kota' },
          ],
          impact: 'Efisiensi stok 35% lebih presisi, rekonsiliasi kasir 100% otomatis, retensi pelanggan naik 2.4x.',
          cta: 'Terapkan Blueprint Retail',
          track: 5,
        },
        {
          id: 'agency',
          name: 'Jasa Profesional & Agensi',
          icon: Briefcase,
          acc: 'growth' as const,
          badge: 'High-Ticket Conversion',
          summary: 'Web korporat otoritatif berkecepatan tinggi, sistem funnel lead inbound presisi, dan pipeline proposal instan.',
          steps: [
            { phase: '01. Pondasi', desc: 'Arsitektur web korporat via YukWebsite dengan SEO dominan dan authority showcase' },
            { phase: '02. Mesin', desc: 'Paid acquisition funnel terarah ke WhatsApp concierge executive' },
            { phase: '03. Ekspansi', desc: 'Lisensi white-label solusi TELLU untuk di-resell ke klien korporat agensi' },
          ],
          impact: 'Lead conversion meningkat hingga 48%, closing cycle 3x lebih cepat, margin revenue bertambah.',
          cta: 'Terapkan Blueprint Agensi',
          track: 2,
        },
        {
          id: 'saas',
          name: 'Produk Digital & SaaS',
          icon: Laptop,
          acc: 'partner' as const,
          badge: 'Scalable Recurring Engine',
          summary: 'Arsitektur cloud native scalable, multi-tenant database security, dan konsorsium kemitraan distribusi B2B.',
          steps: [
            { phase: '01. Pondasi', desc: 'Cloud microservices, API Gateway, dan telemetry observability enterprise' },
            { phase: '02. Mesin', desc: 'Product-Led Growth (PLG) analytics dan email automated lifecycle retention' },
            { phase: '03. Ekspansi', desc: 'Joint venture dan sindikasi tender korporat lintas ekosistem TELLU' },
          ],
          impact: 'Target SLA uptime 99.9%, zero cloud overhead waste, akses langsung ke jaringan distribusi B2B.',
          cta: 'Terapkan Blueprint SaaS',
          track: 1,
        },
      ],
    },
    ventures: {
      label: 'Unit Usaha Aktif',
      headline: 'Lengan operasional\nekosistem TELLU.',
      sub: 'Tiga unit khusus yang aktif bergerak di bidang kehadiran digital, infrastruktur korporasi, dan sindikasi pertumbuhan.',
      v: [
        { name: 'YukWebsite.online', tag: 'Aktif · Flagship', acc: 'tech' as const, domain: 'yukwebsite.online', desc: 'Unit digital TELLU untuk web korporat berkecepatan tinggi, deployment cepat, dan toko online turnkey.', btn: 'Kunjungi Website', href: 'https://yukwebsite.online', external: true },
        { name: 'TELLU Systems',      tag: 'Internal · Cloud Platform', acc: 'partner' as const, domain: 'Enterprise Cloud SaaS', desc: 'Platform cloud: POS terdistribusi, ERP modular, sinkronisasi inventaris real-time, dan telemetri analitik.', btn: 'Minta Akses Demo', href: undefined, external: false },
        { name: 'TELLU Growth Studio',tag: 'Strategis · Market Labs',   acc: 'growth' as const, domain: 'Market Acceleration Hub',desc: 'Lab akselerasi: inkubasi unit usaha, optimasi funnel performa tinggi, ko-kreasi brand, dan validasi pasar.', btn: 'Kirim Proposal',  href: undefined, external: false },
      ],
    },
    workflow: {
      label: 'Alur Kerja Transparan',
      headline: 'Metodologi Eksekusi Terstruktur.',
      sub: 'Proses rekayasa transparan dengan akuntabilitas penuh pada setiap fase implementasi.',
      steps: [
        { num: '01', title: 'Discovery & Brief',    phase: 'Fase 1 · Minggu 1',     desc: 'Kami bedah tantangan strategis enterprise, tentukan KPI terukur, dan rancang ruang lingkup solusi secara presisi.', deliverable: 'Scope Document & Action Plan' },
        { num: '02', title: 'System Blueprinting',  phase: 'Fase 2 · Minggu 2',     desc: 'Perancangan arsitektur teknologi, wireframe interaktif, rancangan database, atau formulasi strategi go-to-market.', deliverable: 'Technical Spec & UI/UX Prototype' },
        { num: '03', title: 'Precision Build',       phase: 'Fase 3 · Minggu 3 - 6', desc: 'Eksekusi rekayasa kode dengan standar clean architecture, integrasi sistem, dan testing menyeluruh.', deliverable: 'Staging Environment & QA Reports' },
        { num: '04', title: 'Handover & Growth',    phase: 'Fase 4 · Berkelanjutan', desc: 'Peluncuran ke live production, serah terima 100% source code, training tim internal, dan pendampingan berkala.', deliverable: 'Production Deployment & SLA Support' },
      ],
    },
    faq: {
      label: 'Tanya Jawab & Transparansi',
      headline: 'Pertanyaan yang sering diajukan.',
      sub: 'Jawaban jelas tentang hak milik, jaminan teknis, dan skema kemitraan bisnis.',
      items: [
        { q: 'Apakah hak cipta source code dan seluruh aset digital menjadi milik klien 100%?', a: 'Ya, mutlak. Setelah serah terima, seluruh IP, repositori kode, akun cloud, dan aset kreatif menjadi hak milik eksklusif perusahaan Anda tanpa royalti terselubung.' },
        { q: 'Bisa kustom software dari nol atau hanya menggunakan template?', a: 'Kami melayani keduanya. Untuk peluncuran cepat, unit YukWebsite menyediakan modul siap pakai. Untuk sistem korporat, tim kami membangun platform custom dari nol dengan tech stack modern.' },
        { q: 'Bagaimana garansi bug dan SLA pasca serah terima?', a: 'Setiap project mencakup garansi perbaikan bug 30–90 hari. Kami juga sediakan paket managed services dengan jaminan uptime 99.9% dan response time darurat di bawah 2 jam.' },
        { q: 'Bagaimana cara bergabung dalam program kemitraan atau Reseller?', a: 'TELLU terbuka untuk model revenue-sharing, partnership reseller berjenjang, maupun joint venture. Klik tombol konsultasi dan pilih jalur kemitraan untuk dialog langsung dengan tim kami.' },
        { q: 'Apakah TELLU bersedia menandatangani NDA?', a: 'Tentu. Kerahasiaan ide bisnis dan strategi korporasi adalah prioritas kami. Kami siap menandatangani mutual NDA sebelum diskusi mendalam dimulai.' },
      ],
    },
    syndicate: {
      label: 'Mulai Kolaborasi',
      headline: 'Yuk, mulai diskusi\nstrategis hari ini.',
      sub: 'TELLU terbuka untuk korporasi, entitas dana teknologi, dan agensi yang ingin membangun software kustom, joint venture, atau integrasi jaringan bisnis.',
      channels: [
        { label: 'Email Korporasi', value: 'corporate@tellu.co.id' },
        { label: 'Kantor Pusat', value: 'Yogyakarta Tech Hub, D.I.Y, Indonesia' },
      ],
      cta: 'Jadwalkan Sesi Diskusi',
      wa: 'Chat Langsung via WhatsApp',
      note: 'Diskusi bersifat rahasia. Perjanjian NDA tersedia atas permintaan.',
    },
    footer: {
      desc: 'Membangun ekosistem bisnis digital inklusif melalui sinergi teknologi, percepatan pasar, dan kemitraan terstruktur.',
      rights: 'Hak cipta dilindungi undang-undang.',
    },
    about: {
      heroLabel: 'Tentang Ekosistem',
      headline: 'Kenali tim di balik\nekosistem TELLU.',
      sub: 'Kami adalah kolektif builder, strategis, dan connector yang percaya bahwa bisnis yang tangguh dibangun di atas fondasi teknologi kokoh, strategi terarah, dan kolaborasi saling menguntungkan.',
      mission: { label: 'Misi Kami', text: 'Membangun ekosistem bisnis digital yang inklusif dan berdampak — di mana pilar teknologi, pertumbuhan, dan kemitraan bekerja sebagai satu mesin pengungkit yang saling memperkuat.' },
      vision:  { label: 'Visi Kami', text: 'Menjadi holding ekosistem digital terdepan di Asia Tenggara yang mendefinisikan standar baru cara perusahaan berkembang dan bersaing di era ekonomi modern.' },
      team: {
        label: 'Tim Kepemimpinan',
        members: [
          { name: 'Chief Executive Officer',  role: 'Teknologi & Strategi Produk',   initial: 'CEO' },
          { name: 'Chief Technology Officer', role: 'Arsitektur Sistem & Cloud Infra', initial: 'CTO' },
          { name: 'Head of Growth',           role: 'Performance & Brand Authority', initial: 'HOG' },
          { name: 'Head of Partnerships',     role: 'B2B Syndication & Alliance',   initial: 'HOP' },
        ],
      },
      values: {
        label: 'Nilai Fundamental',
        items: [
          { icon: Lightbulb, title: 'Inovasi Presisi',        desc: 'Kami tidak sekadar mengikuti tren, kami mencari solusi teknis paling tepat guna.' },
          { icon: Target,    title: 'Fokus Pada Outcome',     desc: 'Setiap strategi harus menghasilkan dampak bisnis yang terukur nyata.' },
          { icon: Handshake, title: 'Kemitraan Jangka Panjang', desc: 'Pertumbuhan sejati hanya tercapai ketika semua mitra dalam ekosistem ikut tumbuh.' },
        ],
      },
    },
    modal: {
      title: 'Mulai Sesi Konsultasi',
      sub: 'PT Tiga Ekosistem Lintas Usaha (TELLU)',
      trackLabel: 'Pilih Kategori Kerjasama',
      tracks: [
        'Custom Software & Core Tech',
        'Cloud Infra & DevOps SaaS',
        'Growth & Performance Marketing',
        'Strategic JV & Partnerships',
        'Web Korporat (YukWebsite)',
        'Demo Akses TELLU Systems',
      ],
      company: 'Nama Perusahaan / Organisasi *',
      contact: 'Nama Perwakilan *',
      email: 'Email Korporasi *',
      phone: 'Nomor WhatsApp / Telepon *',
      scope: 'Rangkuman Kebutuhan Proyek',
      scopePH: 'Ceritakan tantangan bisnis, timeline, atau kebutuhan teknis...',
      submit: 'Kirim Formulir Pengajuan',
      wa: 'WhatsApp Konsultasi Langsung',
      successTitle: 'Pengajuan Telah Diterima!',
      successSub: 'Tim kami akan menghubungi Anda dalam 1×24 jam kerja.',
      close: 'Tutup Dialog',
    },
  },
  en: {
    nav: {
      home: 'Home',
      ecosystem: 'Ecosystem',
      solutions: 'Solutions',
      about: 'About Us',
      cta: 'Start Dialogue',
    },
    megaMenu: {
      col1Title: '01 // TECHNOLOGY & INFRASTRUCTURE',
      col1Items: [
        { name: 'YukWebsite.online', desc: 'Instant turnkey web, rapid landing pages & commercial scale', href: 'https://yukwebsite.online', external: true, track: 4, icon: Globe },
        { name: 'TELLU Systems', desc: 'Realtime POS engine, inventory sync & bespoke corporate ERP', href: undefined, external: false, track: 5, icon: Cpu },
        { name: 'Cloud & AI Tooling', desc: 'Distributed cloud architecture & intelligent AI automation', href: undefined, external: false, track: 1, icon: Zap },
      ],
      col2Title: '02 // BUSINESS ACCELERATION',
      col2Items: [
        { name: 'Conversion Pipelines', desc: 'High-conversion acquisition funnels & WhatsApp lead pipelines', href: undefined, external: false, track: 2, icon: Target },
        { name: 'Brand Modernization', desc: 'Authoritative brand positioning & modern digital presence', href: undefined, external: false, track: 2, icon: Sparkles },
        { name: 'Data-Driven Growth', desc: 'Measurable performance analytics & sustainable retention strategy', href: undefined, external: false, track: 2, icon: BarChart3 },
      ],
      col3Title: '03 // SYNERGY & ALLIANCES',
      col3Items: [
        { name: 'Reseller Network', desc: 'Official distribution syndicate & licensed technology models', href: undefined, external: false, track: 3, icon: Network },
        { name: 'Joint Ventures', desc: 'Co-incubation & cross-industry strategic equity alliances', href: undefined, external: false, track: 3, icon: Handshake },
        { name: 'Enterprise Advisory', desc: 'System architecture consulting & integrated corporate solutions', href: undefined, external: false, track: 0, icon: Building2 },
      ],
      footerText: 'Discuss your specific enterprise architecture directly with TELLU’s executive team.',
      footerCta: 'Book Advisory Session',
    },
    hero: {
      headline: 'Three Ways to\nGrow Business.',
      sub: 'An integrated digital ecosystem built to scale your enterprise — through bespoke technology architecture, data-backed growth acceleration, and strategic syndication alliances.',
      cta1: 'Explore Ecosystem',
      cta2: 'Start a Dialogue',
      coord: '7.7956° S · 110.3695° E · Yogyakarta Tech Hub',
    },
    metrics: {
      label: 'Institutional Baseline',
      headline: 'Battle-tested ecosystem metrics.',
      items: [
        { value: '3 Pillars', label: 'Integrated Ecosystem',   desc: 'Technology, Growth, and Partnerships acting in unison without bureaucratic friction.' },
        { value: '99.9%',     label: 'Target SLA Uptime',     desc: 'Enterprise distributed cloud infrastructure built for high concurrency.' },
        { value: '100%',      label: 'Complete IP Ownership', desc: 'All source code, digital assets, and IP fully transferred to the client.' },
        { value: 'YGY',       label: 'Engineering Talent Hub', desc: 'High capital efficiency backed by global software engineering standards.' },
      ],
    },
    ticker: [
      'CUSTOM SOFTWARE ARCHITECTURE', 'CLOUD SAAS PLATFORMS', 'AI WORKFLOW AUTOMATION',
      'FULL-FUNNEL PERFORMANCE', 'RESELLER SYNDICATE NETWORK', 'HIGH-CONVERSION DIGITAL PRESENCE',
    ],
    marquee: {
      services: [
        'Web POS Realtime', 'Landing Page Express', 'Multi-Branch Cloud',
        'WhatsApp Automated Pipeline', 'Bespoke SaaS Engine', 'Corporate ERP Modular',
        'B2B Tender Consortium', 'AI Chatbot Integrations', 'Multi-Outlet Inventory',
        'Custom CRM System', 'SEO Dominance Engine', 'Performance Ads Funnel',
      ],
      tech: [
        'PostgreSQL', 'Laravel Architecture', 'React / Next.js', 'Payment Gateways',
        'Meta Ads API', 'GA4 Analytics', 'Docker & Kubernetes', 'AWS / GCP Cloud',
        'TypeScript', 'Python FastAPI', 'Stripe / Midtrans', 'Cloudflare Edge',
      ],
    },
    pillars: {
      label: 'Three Ecosystem Pillars',
      headline: 'One ecosystem.\nThree foundational pillars.',
      items: [
        {
          num: '01',
          name: 'Technology & Infrastructure',
          tag: 'We Architect',
          acc: 'tech' as const,
          Icon: Cpu,
          headline: 'High-availability infrastructure engineered for sustainable growth.',
          desc: 'We engineer high-speed corporate web platforms, multi-tenant cloud SaaS engines, distributed microservices, AI automated workflows, and battle-tested DevOps pipelines.',
          capabilities: [
            'Web Architecture & Instant Portals', 'Cloud SaaS & API Gateway',
            'AI Automation & Agent Bots', 'DevOps & Resilient Cloud Infra', 'Distributed Microservices',
          ],
          cta: 'Explore Technology Solutions',
          track: 0,
        },
        {
          num: '02',
          name: 'Business Acceleration',
          tag: 'We Accelerate',
          acc: 'growth' as const,
          Icon: BarChart3,
          headline: 'Aggressive commercial scaling rooted in verified data analytics.',
          desc: 'Beyond superficial traffic — we engineer full-funnel acquisition, conversion rate optimization (CRO), authoritative brand positioning, and sustainable organic SEO leadership.',
          capabilities: [
            'Performance Acquisition Ads', 'Brand Positioning & Authority',
            'Search Engine Dominance (SEO)', 'WhatsApp Automated Lead Funnel', 'Business Intelligence Analytics',
          ],
          cta: 'Accelerate Business Growth',
          track: 2,
        },
        {
          num: '03',
          name: 'Synergy & Alliances',
          tag: 'We Syndicate',
          acc: 'partner' as const,
          Icon: Network,
          headline: 'Strategic syndication to unlock new distribution channels.',
          desc: 'Sustainable scale happens through alliances. We structure joint ventures, tiered agency reseller networks, white-label licenses, and corporate/governmental tender consortiums.',
          capabilities: [
            'Strategic Joint Venture (JV)', 'Agency Reseller Network',
            'White-Label Technology License', 'Enterprise Tender Consortium', 'B2B Distribution Alliance',
          ],
          cta: 'Join Syndication Network',
          track: 3,
        },
      ],
    },
    archetypes: {
      label: 'Coda Blueprint Simulator',
      headline: 'Choose your archetype,\npreview your growth engine.',
      sub: 'Modular growth simulations tailored to your enterprise profile and operational scale.',
      tabs: [
        {
          id: 'retail',
          name: 'Retail & Multi-Outlet',
          icon: Store,
          acc: 'tech' as const,
          badge: 'High-Volume Transactions',
          summary: 'Real-time distributed POS infrastructure, cross-branch inventory sync, and automated customer retention pipelines.',
          steps: [
            { phase: '01. Baseline', desc: 'Deploy TELLU Systems multi-outlet POS + centralized cloud inventory' },
            { phase: '02. Engine', desc: 'Automate WhatsApp CRM promo triggers and unified QRIS/card payment integration' },
            { phase: '03. Scale', desc: 'Franchise syndication with multi-region tiered reseller accounting' },
          ],
          impact: '35% higher stock precision, 100% automated cash reconciliation, 2.4x customer retention.',
          cta: 'Deploy Retail Blueprint',
          track: 5,
        },
        {
          id: 'agency',
          name: 'Professional Services',
          icon: Briefcase,
          acc: 'growth' as const,
          badge: 'High-Ticket Conversion',
          summary: 'High-speed authoritative web presence, precision inbound lead funnels, and turnkey proposal workflows.',
          steps: [
            { phase: '01. Baseline', desc: 'Architect corporate web portal via YukWebsite with dominant SEO and authority case studies' },
            { phase: '02. Engine', desc: 'Targeted paid acquisition funnel straight into WhatsApp executive concierge' },
            { phase: '03. Scale', desc: 'White-label licensing of TELLU platforms to resell directly to enterprise clients' },
          ],
          impact: 'Lead conversion up 48%, 3x faster closing cycles, higher recurring margin retention.',
          cta: 'Deploy Agency Blueprint',
          track: 2,
        },
        {
          id: 'saas',
          name: 'Digital Products & SaaS',
          icon: Laptop,
          acc: 'partner' as const,
          badge: 'Scalable Recurring Engine',
          summary: 'Scalable cloud native systems, multi-tenant security architecture, and B2B syndicate distribution access.',
          steps: [
            { phase: '01. Baseline', desc: 'Cloud microservices, robust API Gateway, and enterprise telemetry observability' },
            { phase: '02. Engine', desc: 'Product-Led Growth (PLG) telemetry and automated lifecycle retention triggers' },
            { phase: '03. Scale', desc: 'Joint venture co-incubation and institutional corporate tender syndication' },
          ],
          impact: '99.9% target SLA uptime, zero wasted cloud overhead, direct entry to established enterprise channels.',
          cta: 'Deploy SaaS Blueprint',
          track: 1,
        },
      ],
    },
    ventures: {
      label: 'Operating Arms',
      headline: 'Dedicated operating arms\nof the TELLU ecosystem.',
      sub: 'Three specialized entities dedicated to digital presence, corporate cloud systems, and market expansion.',
      v: [
        { name: 'YukWebsite.online', tag: 'Active · Flagship', acc: 'tech' as const, domain: 'yukwebsite.online', desc: "TELLU's digital arm for high-velocity corporate web architecture, instant deployment, and turnkey commerce.", btn: 'Visit Website', href: 'https://yukwebsite.online', external: true },
        { name: 'TELLU Systems',      tag: 'Internal · Cloud Platform', acc: 'partner' as const, domain: 'Enterprise Cloud SaaS', desc: 'Operational cloud: distributed POS, modular ERP, real-time inventory telemetry, and unified intelligence.', btn: 'Request Demo Access', href: undefined, external: false },
        { name: 'TELLU Growth Studio',tag: 'Strategic · Market Labs',   acc: 'growth' as const, domain: 'Market Acceleration Hub',desc: 'Market expansion lab: new venture incubation, high-performance funnels, and brand co-creation.', btn: 'Submit Proposal', href: undefined, external: false },
      ],
    },
    workflow: {
      label: 'Transparent Workflow',
      headline: 'How we collaborate with you.',
      sub: 'Zero bureaucratic slowdowns. Structured, transparent milestones from day one.',
      steps: [
        { num: '01', title: 'Discovery & Brief',   phase: 'Phase 1 · Week 1',     desc: 'We dissect your core business challenges, define quantifiable KPIs, and blueprint the project scope with clarity.', deliverable: 'Scope Document & Action Plan' },
        { num: '02', title: 'System Blueprinting', phase: 'Phase 2 · Week 2',     desc: 'Designing tech architecture, interactive wireframes, database schemas, or go-to-market syndication frameworks.', deliverable: 'Technical Spec & UI/UX Prototype' },
        { num: '03', title: 'Precision Build',      phase: 'Phase 3 · Weeks 3–6', desc: 'Clean architecture coding, system integration, and rigorous QA with transparent weekly progress updates.', deliverable: 'Staging Environment & QA Reports' },
        { num: '04', title: 'Handover & Growth',   phase: 'Phase 4 · Ongoing',    desc: 'Production deployment, 100% source code handover, internal team training, and continuous maintenance.', deliverable: 'Production Deployment & SLA Support' },
      ],
    },
    faq: {
      label: 'Institutional FAQ',
      headline: 'Frequently asked questions.',
      sub: 'Clear answers on intellectual property, engineering standards, and partnership models.',
      items: [
        { q: 'Will our company own 100% of the source code and digital assets?', a: 'Yes, unconditionally. Upon completion and handover, all IP, repositories, cloud credentials, and creative assets become the sole property of your company.' },
        { q: 'Do you build custom software from scratch or use templates?', a: 'Both, based on scope. Through YukWebsite we deploy rapid modular frameworks. Through our Technology pillar, we architect bespoke enterprise systems from scratch.' },
        { q: 'What are your bug warranty terms and SLAs?', a: 'Every engagement includes a complimentary 30–90 day warranty for bug fixes, plus optional managed service tiers with 99.9% uptime SLAs.' },
        { q: 'How can our company join the Joint Venture or Reseller syndicate?', a: 'TELLU regularly structures revenue-sharing ventures and tiered reseller frameworks. Click the consultation button to connect directly with our partnership team.' },
        { q: 'Is TELLU open to signing an NDA?', a: 'Absolutely. Client confidentiality is fundamental. We sign mutual NDAs before any deep technical or strategic disclosures take place.' },
      ],
    },
    syndicate: {
      label: 'Start Collaboration',
      headline: 'Begin a strategic\nenterprise dialogue.',
      sub: 'TELLU engages with forward-thinking corporations, investment funds, and distributors seeking custom software, joint ventures, or reseller integration.',
      channels: [
        { label: 'Corporate Inquiries', value: 'corporate@tellu.co.id' },
        { label: 'Headquarters', value: 'Yogyakarta Tech Hub, D.I.Y, Indonesia' },
      ],
      cta: 'Schedule Discovery Session',
      wa: 'Direct WhatsApp Concierge',
      note: 'Strictly confidential. Mutual NDAs executed upon request.',
    },
    footer: {
      desc: 'Building an inclusive digital business ecosystem through high-velocity engineering, data-backed scaling, and structured syndication.',
      rights: 'All rights reserved.',
    },
    about: {
      heroLabel: 'About The Ecosystem',
      headline: 'Meet the architects\nbehind TELLU.',
      sub: 'We are a collective of builders, strategists, and connectors dedicated to proving that resilient businesses thrive on solid software, precise growth, and high-trust alliances.',
      mission: { label: 'Our Mission', text: 'To build an inclusive, high-leverage digital ecosystem where technology, growth, and partnership function as a unified, self-reinforcing scaling engine.' },
      vision:  { label: 'Our Vision',  text: "To establish Southeast Asia's benchmark digital ecosystem holding, redefining how ambitious enterprises innovate and compete globally." },
      team: {
        label: 'Leadership Syndicate',
        members: [
          { name: 'Chief Executive Officer',  role: 'Technology & Product Strategy',   initial: 'CEO' },
          { name: 'Chief Technology Officer', role: 'System Architecture & Cloud Infra', initial: 'CTO' },
          { name: 'Head of Growth',           role: 'Performance & Brand Authority',   initial: 'HOG' },
          { name: 'Head of Partnerships',     role: 'B2B Syndication & Alliances',     initial: 'HOP' },
        ],
      },
      values: {
        label: 'Core Tenets',
        items: [
          { icon: Lightbulb, title: 'Precision Innovation',    desc: 'We disregard hollow hype to engineer high-utility, capital-efficient digital systems.' },
          { icon: Target,    title: 'Outcome-Driven',         desc: 'Every line of code and marketing initiative must deliver measurable business impact.' },
          { icon: Handshake, title: 'Enduring Partnerships',  desc: 'True ecosystem growth only occurs when all stakeholders prosper in alignment.' },
        ],
      },
    },
    modal: {
      title: 'Initiate Strategic Consultation',
      sub: 'PT Tiga Ekosistem Lintas Usaha (TELLU)',
      trackLabel: 'Select Partnership Channel',
      tracks: [
        'Custom Software & Core Tech',
        'Cloud Infra & DevOps SaaS',
        'Growth & Performance Marketing',
        'Strategic JV & Partnerships',
        'Corporate Web (YukWebsite)',
        'TELLU Systems Platform Demo',
      ],
      company: 'Company / Organization Name *',
      contact: 'Representative Name *',
      email: 'Corporate Email *',
      phone: 'WhatsApp / Phone Number *',
      scope: 'Project Overview & Scope',
      scopePH: 'Briefly describe your objectives, target timeline, or technical requirements...',
      submit: 'Submit Consultation Request',
      wa: 'Direct WhatsApp Concierge',
      successTitle: 'Inquiry Successfully Received!',
      successSub: 'Our executive team will respond within 24 business hours.',
      close: 'Close Window',
    },
  },
};

type Lang = 'id' | 'en';

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  openModal: (track?: number) => void;
  bg: string;
  surface: string;
  border: string;
  textPri: string;
  textSec: string;
  textDim: string;
  t: typeof T['id'];
}

const Ctx = createContext<AppCtx | null>(null);
const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
};

// ─────────────────────────────────────────────────────────────────────────────
// PRELOADER — Cinematic T → E → L → L → U, once per session
// ─────────────────────────────────────────────────────────────────────────────
function Preloader({ onDone }: { onDone: () => void }) {
  const letters = ['T', 'E', 'L', 'L', 'U'] as const;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < letters.length) {
      const t = setTimeout(() => setIndex(p => p + 1), 380);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 240);
    return () => clearTimeout(t);
  }, [index, onDone, letters.length]);

  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#08090C] overflow-hidden select-none"
    >
      {/* Single-letter dead-center viewport */}
      <div className="relative z-10 flex items-center justify-center w-48 h-48 sm:w-60 sm:h-60">
        <AnimatePresence mode="wait">
          {index < letters.length && (
            <motion.span
              key={`letter-${index}`}
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
              exit={{    opacity: 0, scale: 1.18, filter: 'blur(14px)' }}
              transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono font-black text-8xl md:text-9xl tracking-tighter text-white select-none"
            >
              {letters[index]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Corporate wordmark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-white/40 select-none"
      >
        PT TIGA EKOSISTEM LINTAS USAHA
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INFINITE MARQUEE — Ultra-smooth, relaxed 40s linear loop
// ─────────────────────────────────────────────────────────────────────────────
function MarqueePill({
  label,
  accent,
}: {
  label: string;
  accent?: string;
  dark?: boolean;
}) {
  return (
    <motion.span
      whileHover={{ y: -3, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-2 mx-3 px-4 py-2.5 rounded-full whitespace-nowrap text-xs font-mono font-medium select-none transition-colors duration-200 bg-white dark:bg-[#0D0F15] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 shadow-sm cursor-default"
      style={{
        borderLeftWidth: accent ? '3px' : '1px',
        borderLeftColor: accent || undefined,
      }}
    >
      {label}
    </motion.span>
  );
}

function InfiniteMarquee() {
  const { dark, t } = useApp();
  const services = t.marquee.services;
  const tech     = t.marquee.tech;

  // Quadruple data array to ensure seamless looping without any gaps or reset stutter
  const loopedServices = [...services, ...services, ...services, ...services];
  const loopedTech     = [...tech,     ...tech,     ...tech,     ...tech];

  return (
    <div className="w-full overflow-hidden py-4 space-y-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" aria-hidden="true">
      {/* Track 1 — slides smoothly to the LEFT with relaxed 68s linear loop calibrated for 60Hz */}
      <div className="relative overflow-hidden flex">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 68,
            ease: 'linear',
          }}
          style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
          className="flex w-max"
        >
          {loopedServices.map((s, i) => (
            <MarqueePill key={i} label={s} accent={ACC.tech.dot} dark={dark} />
          ))}
        </motion.div>
      </div>

      {/* Track 2 — slides smoothly to the RIGHT with relaxed 76s linear loop calibrated for 60Hz */}
      <div className="relative overflow-hidden flex">
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 76,
            ease: 'linear',
          }}
          style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
          className="flex w-max"
        >
          {loopedTech.map((s, i) => (
            <MarqueePill key={i} label={s} accent={ACC.partner.dot} dark={dark} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING ROUNDED PILL NAVBAR & CODA-STYLE MEGA-MENU
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const { lang, setLang, dark, setDark, openModal, t } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Dimmed backdrop when Mega-Menu is open */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMegaOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Floating Rounded Capsule/Pill Navbar Wrapper */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl pointer-events-none">
        <nav
          className="pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full bg-white/80 dark:bg-[#0D0F15]/85 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/40 dark:shadow-2xl dark:shadow-black/60 transition-all"
        >
          {/* Left: Minimalist logo mark + bold wordmark in 'Cabinet Grotesk' */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/tellu-logo.png"
              alt="TELLU Emblem"
              className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
            />
            <span
              className="font-display font-black text-lg tracking-wider text-slate-900 dark:text-white transition-colors"
              style={{ fontFamily: "'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif" }}
            >
              TELLU
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {/* Ekosistem Mega-Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setMegaOpen(prev => !prev)}
                className={`flex items-center gap-1.5 py-1 font-mono text-xs uppercase tracking-wider transition-all ${
                  megaOpen
                    ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`}
                aria-expanded={megaOpen}
              >
                <span>{t.nav.ecosystem}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'opacity-60'
                  }`}
                />
              </button>
            </div>

            {/* Solusi Bisnis Direct Anchor Link */}
            <a
              href="#ventures"
              className="font-mono text-xs uppercase tracking-wider text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors py-1"
            >
              {t.nav.solutions}
            </a>

            {/* Tentang Kami Route Link */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                }`
              }
            >
              {t.nav.about}
            </NavLink>
          </div>

          {/* Right Utilities: Lang Switcher + Dark/Light Toggle + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold">{lang.toUpperCase()}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Primary Action Button: 'Mulai Kolaborasi' */}
            <motion.button
              whileHover={BTN_HVR}
              whileTap={BTN_TAP}
              onClick={() => openModal(0)}
              className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full font-sans text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition shadow-sm"
            >
              <span>{t.nav.cta}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="p-2 rounded-full md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto md:hidden mt-3 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl backdrop-blur-2xl bg-white/95 dark:bg-[#0D0F15]/95 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition py-2"
              >
                {t.nav.about}
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  openModal(0);
                }}
                className="mt-2 w-full py-3 rounded-full font-sans text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-center shadow-sm"
              >
                {t.nav.cta}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Coda-Style Floating Mega-Menu Panel — Positioned True Viewport Centered */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%', scale: 0.98, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, x: '-50%', scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed top-[88px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 pointer-events-auto"
          >
            <div
              style={{ backgroundColor: dark ? 'rgba(8, 9, 12, 0.98)' : 'rgba(255, 255, 255, 0.98)' }}
              className="p-8 md:p-10 rounded-3xl bg-white/98 dark:bg-[#08090C]/98 border border-slate-200 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10 dark:shadow-black/80 backdrop-blur-2xl overflow-hidden text-slate-900 dark:text-white"
            >
              {/* 3 Pillars Dedicated Functional Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* COLUMN 1: TECHNOLOGY */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold mb-4 block">
                    {t.megaMenu.col1Title}
                  </span>
                  <div className="space-y-4">
                    {t.megaMenu.col1Items.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setMegaOpen(false);
                            if (item.href) {
                              window.open(item.href, '_blank', 'noopener,noreferrer');
                            } else {
                              openModal(item.track);
                            }
                          }}
                          className="group flex items-start gap-3.5 p-2.5 -mx-2.5 rounded-2xl cursor-pointer transition-all hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors"
                          >
                            <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors break-words">
                                {item.name}
                              </span>
                              {item.external && <ExternalLink className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5 break-words">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 2: GROWTH */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold mb-4 block">
                    {t.megaMenu.col2Title}
                  </span>
                  <div className="space-y-4">
                    {t.megaMenu.col2Items.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setMegaOpen(false);
                            openModal(item.track);
                          }}
                          className="group flex items-start gap-3.5 p-2.5 -mx-2.5 rounded-2xl cursor-pointer transition-all hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] group-hover:border-lime-500/40 group-hover:bg-lime-500/10 transition-colors"
                          >
                            <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-lime-500 transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors break-words">
                              {item.name}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5 break-words">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* COLUMN 3: PARTNERSHIP */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold mb-4 block">
                    {t.megaMenu.col3Title}
                  </span>
                  <div className="space-y-4">
                    {t.megaMenu.col3Items.map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setMegaOpen(false);
                            openModal(item.track);
                          }}
                          className="group flex items-start gap-3.5 p-2.5 -mx-2.5 rounded-2xl cursor-pointer transition-all hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-colors"
                          >
                            <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors break-words">
                              {item.name}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5 break-words">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clean Coda-Style Bottom Bar */}
              <div
                className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed break-words">
                  {t.megaMenu.footerText}
                </p>
                <button
                  onClick={() => {
                    setMegaOpen(false);
                    openModal(0);
                  }}
                  className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors whitespace-nowrap"
                >
                  <span>{t.megaMenu.footerCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  const { dark, border, textDim, textPri, t } = useApp();
  return (
    <footer style={{ borderTop: `1px solid ${border}`, background: dark ? '#060709' : '#F1F5F9' }}
      className="py-16 md:py-24 px-6 sm:px-8 w-full">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <img src="/tellu-logo.png" alt="TELLU" className="w-7 h-7 object-contain opacity-80" />
            <span
              className="font-display font-black text-base tracking-wider"
              style={{ fontFamily: "'Cabinet Grotesk', 'Plus Jakarta Sans', sans-serif", color: textPri }}
            >
              TELLU
            </span>
          </div>
          <p className="font-sans text-xs leading-relaxed max-w-sm text-slate-400">{t.footer.desc}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: textDim }}>{t.hero.coord}</p>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-wider font-semibold" style={{ color: textPri }}>Tiga Pilar</p>
          <ul className="space-y-2 font-sans text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACC.tech.dot }} />01. Teknologi & Infrastruktur
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACC.growth.dot }} />02. Akselerasi Bisnis
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACC.partner.dot }} />03. Sinergi & Kemitraan
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-wider font-semibold" style={{ color: textPri }}>Tata Kelola</p>
          <p className="font-sans text-xs leading-relaxed" style={{ color: textDim }}>
            PT Tiga Ekosistem Lintas Usaha beroperasi di bawah payung hukum Republik Indonesia.
          </p>
          <p className="font-mono text-[10px] pt-2" style={{ color: textDim }}>
            © {new Date().getFullYear()} TELLU. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSULTATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ open, initialTrack, onClose }: { open: boolean; initialTrack: number; onClose: () => void }) {
  const { dark, border, textPri, textSec, textDim, t } = useApp();
  const [track, setTrack] = useState(initialTrack);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', contact: '', email: '', phone: '', scope: '' });
  const tm = t.modal;

  useEffect(() => { if (open) { setTrack(initialTrack); setSubmitted(false); } }, [open, initialTrack]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: 10, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{ background: dark ? '#0D0F14' : '#FFFFFF', borderColor: border }}
            className="relative z-10 w-full max-w-lg rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b" style={{ borderColor: border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)', borderColor: border }}>
                  <Building2 className="w-5 h-5" style={{ color: textPri }} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base" style={{ color: textPri }}>{tm.title}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: textDim }}>{tm.sub}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg opacity-55 hover:opacity-100 transition" style={{ color: textSec }} aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h4 className="font-sans text-xl font-bold" style={{ color: textPri }}>{tm.successTitle}</h4>
                <p className="font-sans text-sm max-w-xs mx-auto text-slate-600 dark:text-slate-400">{tm.successSub}</p>
                <button onClick={onClose} className="mt-4 px-6 py-2.5 rounded-full font-sans text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition shadow-sm">{tm.close}</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="mt-5 space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: textDim }}>{tm.trackLabel}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tm.tracks.map((name, i) => (
                      <button key={i} type="button" onClick={() => setTrack(i)}
                        className={`text-left font-sans text-xs p-3 rounded-xl border transition-all leading-snug flex items-center justify-between ${
                          track === i
                            ? 'font-bold border-slate-900 bg-slate-900 text-white dark:border-white/30 dark:bg-white/10 dark:text-white shadow-sm'
                            : 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                        }`}
                        style={{ borderColor: track === i ? undefined : border, color: track === i ? undefined : textSec }}>
                        <span>{name}</span>
                        {track === i && <Check className="w-3.5 h-3.5 flex-shrink-0 text-amber-500 ml-1.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'company', label: tm.company, type: 'text' },
                    { key: 'contact', label: tm.contact, type: 'text' },
                    { key: 'email',   label: tm.email,   type: 'email' },
                    { key: 'phone',   label: tm.phone,   type: 'tel' },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: textDim }}>{label}</label>
                      <input required type={type} value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="w-full px-3 py-2 font-sans text-xs rounded-xl border bg-transparent focus:outline-none focus:border-slate-900 dark:focus:border-white/40 transition"
                        style={{ borderColor: border, color: textPri }} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: textDim }}>{tm.scope}</label>
                  <textarea rows={2} placeholder={tm.scopePH} value={form.scope}
                    onChange={e => setForm({ ...form, scope: e.target.value })}
                    className="w-full px-3 py-2 font-sans text-xs rounded-xl border bg-transparent focus:outline-none focus:border-slate-900 dark:focus:border-white/40 transition resize-none"
                    style={{ borderColor: border, color: textPri }} />
                </div>

                <div className="pt-3 space-y-2.5">
                  <motion.button whileHover={BTN_HVR} whileTap={BTN_TAP} type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-md transition">
                    <Send className="w-3.5 h-3.5" /> <span>{tm.submit}</span>
                  </motion.button>
                  <motion.a whileHover={{ y: -1 }} whileTap={BTN_TAP}
                    href="https://wa.me/6281234567890?text=Halo%20TELLU%2C%20kami%20ingin%20berdiskusi%20kemitraan."
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-xs uppercase tracking-[0.16em] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.04] transition border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                    style={{ color: textSec }}>
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> <span>{tm.wa}</span>
                  </motion.a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SCENE: DRAMATIC "ENVELOPE / SUNRISE" PARALLAX (HLV/SUKU TERRAIN)
// ─────────────────────────────────────────────────────────────────────────────
function SukuTerrainStage({ heroRef }: { heroRef: React.RefObject<HTMLDivElement | null> }) {
  const { dark } = useApp();

  // Scroll parallax bound to hero section offset
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Inertial spring smoothing for silky-smooth physics calibrated for 60Hz viscous drag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,       // decreased from 90 to eliminate snap/jerk
    damping: 32,         // increased from 24 to introduce smooth viscous drag
    mass: 0.8,           // increased from 0.2 to give physical momentum
    restDelta: 0.0001,
  });

  // Logo starts submerged behind the dunes, smoothly rises higher into the freed space, and STOPS cleanly below the CTA buttons
  const logoY       = useTransform(smoothProgress, [0, 0.16], [90, -75], { clamp: true });
  const logoScale   = useTransform(smoothProgress, [0, 0.16], [0.90, 1.02], { clamp: true });
  const logoOpacity = useTransform(smoothProgress, [0, 0.10], [0.70, 1.0], { clamp: true });

  return (
    <div
      className="relative w-full pointer-events-none overflow-visible"
      style={{ minHeight: '520px', height: 'clamp(480px, 58vh, 660px)' }}
    >
      {/* ── LAYER 1: THE FLOATING EMBLEM (Middle, z-10) ── */}
      {/* Elevated with subtle warm sunrise ambient lighting overlay */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center overflow-visible pointer-events-none"
        style={{ paddingTop: '20px', paddingBottom: '20px' }}
      >
        <motion.img
          src="/tellu-logo.png"
          alt="TELLU Emblem"
          style={{
            y: logoY,
            scale: logoScale,
            opacity: logoOpacity,
            width: 'clamp(320px, 40vw, 500px)',
            maxWidth: '500px',
            objectFit: 'contain',
            filter: dark
              ? 'drop-shadow(0 18px 36px rgba(0,0,0,0.65)) drop-shadow(0 -10px 40px rgba(255, 151, 0, 0.18))'
              : 'drop-shadow(0 8px 24px rgba(0,0,0,0.06)) drop-shadow(0 -6px 20px rgba(255, 151, 0, 0.12))',
            mixBlendMode: dark ? 'normal' : 'multiply',
          }}
        />
      </div>

      {/* ── LAYER 2: FOREGROUND DUNE RIDGES (z-20) ── */}
      {/* Pinned to bottom, fill color strictly matches page background */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none" style={{ height: '52%' }}>
        <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="midDune" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor={dark ? '#0C0E14' : '#E2E8F0'} stopOpacity="0.96" />
              <stop offset="100%" stopColor={dark ? '#08090C' : '#F8FAFC'} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Mid dune shape */}
          <path d="M0 70 C 220 35, 480 90, 760 55 C 1040 20, 1260 75, 1440 45 L 1440 280 L 0 280 Z" fill="url(#midDune)" />
          {/* Primary front dune — strictly matches page background */}
          <path
            d="M0 90 C 200 55, 440 105, 720 70 C 1000 35, 1240 85, 1440 60 L 1440 280 L 0 280 Z"
            className="fill-[#F8FAFC] dark:fill-[#08090C] transition-colors duration-300"
            fill={dark ? '#08090C' : '#F8FAFC'}
          />
          {/* Clean razor-thin 1px neutral hairline ridge without colored neon rim */}
          <path d="M0 90 C 200 55, 440 105, 720 70 C 1000 35, 1240 85, 1440 60" stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'} strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ZIGZAG 3 PILLARS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ZigzagPillars() {
  const { textPri, textDim, t, openModal } = useApp();
  const pillars = t.pillars.items;

  return (
    <section id="pillars" className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full space-y-20 lg:space-y-24">
      <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="max-w-2xl mb-16">
        <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>
          {t.pillars.label}
        </p>
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight whitespace-pre-line" style={{ color: textPri }}>
          {t.pillars.headline}
        </h2>
      </motion.div>

      {/* Block 01: Technology (Text Left, Visual Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div variants={FADE_LEFT} initial="hidden" whileInView="show" viewport={VP} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACC.tech.dot }} />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: ACC.tech.text }}>
              {pillars[0].num} // {pillars[0].tag}
            </span>
          </div>
          <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-snug" style={{ color: textPri }}>
            {pillars[0].headline}
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {pillars[0].desc}
          </p>
          <div className="space-y-2.5 pt-2">
            {pillars[0].capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: ACC.tech.dot }} />
                <span className="font-sans text-sm text-slate-700 dark:text-slate-300">{cap}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <motion.button
              whileHover={BTN_HVR} whileTap={BTN_TAP}
              onClick={() => openModal(pillars[0].track)}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-80 transition"
              style={{ color: ACC.tech.text }}
            >
              <span>{pillars[0].cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Telemetry Visual Right */}
        <motion.div
          variants={FADE_RIGHT} initial="hidden" whileInView="show" viewport={VP}
          whileHover={CARD_HVR}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D0F15] shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative overflow-hidden space-y-5 flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Gateway Telemetry</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">SLA 99.9% Uptime</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <span className="text-slate-600 dark:text-slate-400">API Endpoint Concurrency</span>
              <span className="text-amber-500 font-bold">12,450 req/sec</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <span className="text-slate-600 dark:text-slate-400">Database Microservices</span>
              <span className="text-emerald-500 font-bold">PostgreSQL v16 HA</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <span className="text-slate-600 dark:text-slate-400">Edge Cache Hit Ratio</span>
              <span className="text-cyan-500 font-bold">98.6%</span>
            </div>
          </div>
          <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 opacity-80 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            <span>&gt; pipeline deployed to live production</span>
          </div>
        </motion.div>
      </div>

      {/* Block 02: Growth (Visual Left, Text Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Growth Visual Left */}
        <motion.div
          variants={FADE_LEFT} initial="hidden" whileInView="show" viewport={VP}
          whileHover={CARD_HVR}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D0F15] shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative overflow-hidden space-y-5 order-2 lg:order-1 flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Conversion Engine</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">ROAS 4.8x Active</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">Omni-Channel Inbound</span>
                <span className="text-lime-600 dark:text-lime-400 font-bold">+184% MoM</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-lime-500 w-[84%]" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-slate-400">WhatsApp Lead Qualification</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">48% Closing</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-cyan-500 w-[68%]" />
              </div>
            </div>
          </div>
          <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 opacity-80 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-lime-500" />
            <span>&gt; full-funnel telemetry actively optimized</span>
          </div>
        </motion.div>

        {/* Text Right */}
        <motion.div variants={FADE_RIGHT} initial="hidden" whileInView="show" viewport={VP} className="space-y-6 order-1 lg:order-2">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACC.growth.dot }} />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: ACC.growth.text }}>
              {pillars[1].num} // {pillars[1].tag}
            </span>
          </div>
          <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-snug" style={{ color: textPri }}>
            {pillars[1].headline}
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {pillars[1].desc}
          </p>
          <div className="space-y-2.5 pt-2">
            {pillars[1].capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: ACC.growth.dot }} />
                <span className="font-sans text-sm text-slate-700 dark:text-slate-300">{cap}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <motion.button
              whileHover={BTN_HVR} whileTap={BTN_TAP}
              onClick={() => openModal(pillars[1].track)}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-80 transition"
              style={{ color: ACC.growth.text }}
            >
              <span>{pillars[1].cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Block 03: Partnership (Text Left, Visual Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <motion.div variants={FADE_LEFT} initial="hidden" whileInView="show" viewport={VP} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACC.partner.dot }} />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: ACC.partner.text }}>
              {pillars[2].num} // {pillars[2].tag}
            </span>
          </div>
          <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-snug" style={{ color: textPri }}>
            {pillars[2].headline}
          </h3>
          <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {pillars[2].desc}
          </p>
          <div className="space-y-2.5 pt-2">
            {pillars[2].capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: ACC.partner.dot }} />
                <span className="font-sans text-sm text-slate-700 dark:text-slate-300">{cap}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <motion.button
              whileHover={BTN_HVR} whileTap={BTN_TAP}
              onClick={() => openModal(pillars[2].track)}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-80 transition"
              style={{ color: ACC.partner.text }}
            >
              <span>{pillars[2].cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Network Topology Visual Right */}
        <motion.div
          variants={FADE_RIGHT} initial="hidden" whileInView="show" viewport={VP}
          whileHover={CARD_HVR}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D0F15] shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative overflow-hidden space-y-5 flex flex-col justify-between h-full"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">Syndicate Topology</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cross-Industry Alliances</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-slate-900 dark:text-white font-semibold">Tiered Reseller Network</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">12 Agency Distribution Hubs</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">ACTIVE</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-slate-900 dark:text-white font-semibold">Joint Venture Incubation</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">3 Co-Created Commercial Brands</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">SCALING</span>
            </div>
          </div>
          <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 opacity-80 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>&gt; mutual revenue-share syndication in motion</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODA-STYLE INTERACTIVE ARCHETYPE SWITCHER (CANVAS)
// ─────────────────────────────────────────────────────────────────────────────
function CodaArchetypeCanvas() {
  const { border, textPri, textSec, textDim, dark, t, openModal } = useApp();
  const tabs = t.archetypes.tabs;
  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const active = tabs.find(tab => tab.id === activeId) ?? tabs[0];
  const acc = ACC[active.acc];

  return (
    <section id="archetypes" className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
      <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>
          {t.archetypes.label}
        </p>
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight whitespace-pre-line mb-6" style={{ color: textPri }}>
          {t.archetypes.headline}
        </h2>
        <p className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {t.archetypes.sub}
        </p>
      </motion.div>

      {/* Segmented Archetype Tabs */}
      <motion.div
        variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
        className="flex flex-wrap gap-2 p-1.5 rounded-2xl mb-10 w-fit backdrop-blur-md"
        style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.04)', border: `1px solid ${border}` }}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeId;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-colors duration-200"
              style={{
                color: isActive ? (dark ? '#0F172A' : '#FFFFFF') : textSec,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeArchetypeTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-white shadow-md"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Interactive Blueprint Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0D14] shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative overflow-hidden space-y-8 flex flex-col justify-between"
        >
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold border"
                style={{ color: acc.text, borderColor: acc.border, background: acc.subtle }}>
                {active.badge}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white mt-3">
                {active.name}
              </h3>
            </div>
            <motion.button
              whileHover={BTN_HVR} whileTap={BTN_TAP}
              onClick={() => openModal(active.track)}
              className="px-6 py-3 rounded-full font-sans text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition shadow-sm w-fit"
            >
              {active.cta}
            </motion.button>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {active.summary}
          </p>

          {/* 3 Step Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {active.steps.map((st, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-2"
              >
                <span className="font-mono text-xs font-bold" style={{ color: acc.dot }}>
                  {st.phase}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Impact Statement */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: acc.dot }} />
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              <span className="text-slate-900 dark:text-white font-semibold">Proyeksi Dampak:</span> {active.impact}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Home() {
  const { border, surface, textPri, textSec, textDim, dark, t, openModal } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const tv = t.ventures;
  const tw = t.workflow;
  const tf = t.faq;
  const ts = t.syndicate;
  const tm = t.metrics;

  const btnPrimary = 'flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-sans text-[13px] font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm transition';
  const btnOutline  = 'flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-sans text-[13px] font-semibold border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:text-white dark:hover:border-white/30 transition';

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          1. HERO — dramatic sunrise parallax, no badge above headline
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[680px] md:min-h-[820px] flex flex-col justify-between overflow-visible pt-44 md:pt-52 pb-20"
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)'
            : 'linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Headlines — SOLID white/dark, zero gradient text */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-8 max-w-4xl mx-auto w-full">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.10, duration: 0.70, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-[-0.04em] leading-[1.08] whitespace-pre-line mb-6 text-slate-900 dark:text-white"
          >
            {t.hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-normal text-sm sm:text-base leading-relaxed max-w-2xl mb-9 text-slate-600 dark:text-slate-400"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.60 }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <motion.a href="#pillars" whileHover={BTN_HVR} whileTap={BTN_TAP} className={`w-full sm:w-auto ${btnPrimary}`}>
              {t.hero.cta1} <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.button whileHover={BTN_HVR} whileTap={BTN_TAP}
              onClick={() => openModal(0)}
              className={`w-full sm:w-auto ${btnOutline}`}>
              {t.hero.cta2}
            </motion.button>
          </motion.div>
        </div>

        {/* Dramatic Envelope / Sunrise Parallax Terrain Stage */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 1.1, ease: 'easeOut' }}
          className="relative z-10 mt-6 md:mt-8 overflow-visible">
          <SukuTerrainStage heroRef={heroRef} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2. INFINITE MARQUEE CAROUSEL (SLOW & SMOOTH)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 w-full" style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <InfiniteMarquee />
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3. METRICS STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16 text-center max-w-xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{tm.label}</p>
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.03em]" style={{ color: textPri }}>{tm.headline}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tm.items.map((item, i) => {
            const accList = [ACC.tech, ACC.partner, ACC.growth, ACC.tech];
            const ac = accList[i];
            return (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.08, duration: 0.55, type: 'spring', bounce: 0.32 }}
                whileHover={CARD_HVR}
                style={{ background: surface, borderColor: border }}
                className="rounded-2xl border p-6 sm:p-8 flex flex-col justify-between h-full gap-4 relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: ac.dot }} />
                    <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-55" style={{ color: ac.text }}>{item.label}</span>
                  </div>
                  <p className="font-display font-black text-3xl sm:text-4xl tracking-tight" style={{ color: textPri }}>{item.value}</p>
                </div>
                <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Ticker strip */}
        <div style={{ borderColor: border, background: dark ? '#0A0C11' : '#F1F5F9' }}
          className="mt-8 rounded-2xl border py-3 px-4 overflow-hidden">
          <div className="flex items-center gap-8 whitespace-nowrap animate-pulse font-mono text-xs uppercase tracking-[0.22em] opacity-50">
            {t.ticker.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2" style={{ color: textSec }}>
                <span style={{ color: ACC.tech.dot }}>❖</span> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          4. ZIGZAG 3 PILLARS SHOWCASE
      ════════════════════════════════════════════════════════════════════ */}
      <ZigzagPillars />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          5. CODA-STYLE INTERACTIVE ARCHETYPE CANVAS
      ════════════════════════════════════════════════════════════════════ */}
      <CodaArchetypeCanvas />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          6. OPERATING VENTURES
      ════════════════════════════════════════════════════════════════════ */}
      <section id="ventures" className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{tv.label}</p>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight whitespace-pre-line mb-6" style={{ color: textPri }}>{tv.headline}</h2>
          <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tv.sub}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tv.v.map((v, i) => {
            const ac = ACC[v.acc];
            return (
              <motion.div key={v.name} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.10, duration: 0.55, type: 'spring', bounce: 0.32 }}
                whileHover={CARD_HVR}
                style={{ background: surface, borderColor: border }}
                className="rounded-3xl border p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full gap-6 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-bold px-2.5 py-1 rounded-full border"
                      style={{ color: ac.text, borderColor: ac.border, background: ac.subtle }}>
                      {v.tag}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ background: ac.dot }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-tight" style={{ color: textPri }}>{v.name}</h3>
                    <p className="font-mono text-xs mt-0.5 opacity-55" style={{ color: textDim }}>{v.domain}</p>
                  </div>
                  <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{v.desc}</p>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: border }}>
                  {v.external ? (
                    <motion.a whileHover={{ x: 4 }} whileTap={BTN_TAP} href={v.href!}
                      target="_blank" rel="noopener noreferrer" style={{ color: ac.text }}
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] font-semibold">
                      <span>{v.btn}</span><ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  ) : (
                    <motion.button whileHover={{ x: 4 }} whileTap={BTN_TAP}
                      onClick={() => openModal(i === 1 ? 5 : 3)} style={{ color: ac.text }}
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] font-semibold">
                      <span>{v.btn}</span><ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          7. WORKFLOW STEPS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="workflow" className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{tw.label}</p>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight whitespace-pre-line mb-6" style={{ color: textPri }}>{tw.headline}</h2>
          <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tw.sub}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tw.steps.map((step, i) => {
            const stepColors = [ACC.tech, ACC.partner, ACC.growth, ACC.tech];
            const ac = stepColors[i];
            return (
              <motion.div key={step.num} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.09, duration: 0.55, type: 'spring', bounce: 0.32 }}
                whileHover={CARD_HVR}
                style={{ background: surface, borderColor: border }}
                className="rounded-2xl border p-6 sm:p-8 flex flex-col justify-between h-full gap-5 relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: ac.dot, borderColor: ac.border, background: ac.subtle }}>
                      {step.num}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-50" style={{ color: textDim }}>{step.phase}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg tracking-tight mb-2" style={{ color: textPri }}>{step.title}</h3>
                  <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.desc}</p>
                </div>
                <div className="pt-3 border-t" style={{ borderColor: border }}>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-50 mb-1" style={{ color: textDim }}>Output Utama</p>
                  <p className="font-sans text-xs font-semibold flex items-center gap-1.5" style={{ color: ac.text }}>
                    <Check className="w-3.5 h-3.5" /> <span>{step.deliverable}</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          8. FAQ ACCORDION
      ════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 md:py-32 px-6 sm:px-8 max-w-4xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{tf.label}</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.03em] mb-6" style={{ color: textPri }}>{tf.headline}</h2>
          <p className="font-sans font-normal text-sm leading-relaxed max-w-lg mx-auto text-slate-600 dark:text-slate-400">{tf.sub}</p>
        </motion.div>

        <div className="space-y-3">
          {tf.items.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                style={{ background: surface, borderColor: border }}
                className="rounded-2xl border overflow-hidden">
                <button onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4">
                  <span className="font-sans font-semibold text-sm sm:text-base leading-snug" style={{ color: textPri }}>{item.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                    style={{
                      borderColor: isOpen ? ACC.tech.border : border,
                      background: isOpen ? ACC.tech.subtle : 'transparent',
                      color: isOpen ? ACC.tech.dot : textSec,
                    }}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="px-5 sm:px-6 pb-6 pt-1 font-sans text-sm leading-relaxed border-t text-slate-600 dark:text-slate-400"
                        style={{ borderColor: border }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full"><div style={{ borderTop: `1px solid ${border}` }} /></div>

      {/* ════════════════════════════════════════════════════════════════════
          9. STRATEGIC SYNDICATE CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section id="syndicate" className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div variants={FADE_LEFT} initial="hidden" whileInView="show" viewport={VP} className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{ts.label}</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-tight whitespace-pre-line mb-6" style={{ color: textPri }}>{ts.headline}</h2>
            <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{ts.sub}</p>

            <div className="space-y-3 pt-2">
              {ts.channels.map((ch, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i === 0
                    ? <Mail className="w-4 h-4 flex-shrink-0" style={{ color: ACC.partner.dot }} />
                    : <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: ACC.tech.dot }} />}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-55" style={{ color: textDim }}>{ch.label}</p>
                    <p className="font-sans text-sm font-medium" style={{ color: textSec }}>{ch.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={FADE_RIGHT} initial="hidden" whileInView="show" viewport={VP}
            style={{ background: surface, borderColor: border }}
            className="rounded-3xl border p-6 sm:p-8 lg:p-10 space-y-4 shadow-xl">
            <motion.button whileHover={BTN_HVR} whileTap={BTN_TAP} onClick={() => openModal(0)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-sans text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm transition">
              <Building2 className="w-4 h-4" /> <span>{ts.cta}</span>
            </motion.button>
            <motion.a whileHover={BTN_HVR} whileTap={BTN_TAP}
              href="https://wa.me/6281234567890?text=Halo%20TELLU%2C%20kami%20ingin%20berdiskusi%20kemitraan."
              target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-mono text-xs uppercase tracking-[0.18em] border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 dark:border-white/15 dark:text-slate-300 dark:hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> <span>{ts.wa}</span>
            </motion.a>
            <p className="text-center font-mono text-xs uppercase tracking-[0.18em] opacity-50 pt-1" style={{ color: textDim }}>{ts.note}</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function About() {
  const { border, surface, textDim, dark, textPri, t, openModal } = useApp();
  const ta = t.about;
  const btnPrimary = 'flex items-center justify-center gap-2 px-7 py-3 rounded-full font-sans text-[13px] font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm transition';

  return (
    <>
      <section className="relative pt-44 md:pt-52 pb-20 px-6 sm:px-8 w-full">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.55 }}
            className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-3">
            {ta.heroLabel}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.70, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-[-0.04em] leading-[1.08] whitespace-pre-line mb-6 text-slate-900 dark:text-white">
            {ta.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.65 }}
            className="font-sans font-normal text-sm sm:text-base leading-relaxed max-w-2xl text-slate-600 dark:text-slate-400">
            {ta.sub}
          </motion.p>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[ta.mission, ta.vision].map((item, i) => {
            const ac = i === 0 ? ACC.tech : ACC.partner;
            return (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.10, duration: 0.55, type: 'spring', bounce: 0.32 }}
                style={{ background: surface, borderColor: border }}
                className="rounded-3xl border p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between h-full">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] font-bold mb-3 opacity-70" style={{ color: ac.text }}>{item.label}</p>
                  <p className="font-sans font-normal text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{ta.team.label}</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">Orkestrator di balik layar.</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ta.team.members.map((member, i) => {
            return (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.09, duration: 0.55, type: 'spring', bounce: 0.32 }}
                whileHover={CARD_HVR}
                style={{ background: surface, borderColor: border }}
                className="rounded-2xl border p-6 sm:p-8 flex flex-col items-center text-center justify-between h-full gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-sm font-extrabold"
                  style={{ background: dark ? '#13161F' : '#F1F5F9', border: `1px solid ${border}`, color: textPri }}>
                  {member.initial}
                </div>
                <div>
                  <p className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white">{member.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] opacity-60 mt-1 leading-snug" style={{ color: textDim }}>{member.role}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full">
        <div style={{ borderTop: `1px solid ${border}` }} />
      </div>

      <section className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP} className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-55 mb-3" style={{ color: textDim }}>{ta.values.label}</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">Prinsip yang memandu eksekusi kami.</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ta.values.items.map(({ icon: Icon, title, desc }, i) => {
            return (
              <motion.div key={i} variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}
                transition={{ delay: i * 0.10, duration: 0.55, type: 'spring', bounce: 0.32 }}
                whileHover={CARD_HVR}
                style={{ background: surface, borderColor: border }}
                className="rounded-2xl border p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full gap-4">
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: dark ? '#13161F' : '#F1F5F9', border: `1px solid ${border}` }}>
                    <Icon className="w-5 h-5" style={{ color: textPri }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3 text-slate-900 dark:text-white">{title}</h3>
                  <p className="font-sans font-normal text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 sm:px-8 max-w-6xl mx-auto w-full text-center">
        <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={VP}>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.03em] mb-6 text-slate-900 dark:text-white">
            {t.syndicate.headline.replace('\n', ' ')}
          </h2>
          <motion.button whileHover={BTN_HVR} whileTap={BTN_TAP} onClick={() => openModal(0)}
            className={`mx-auto ${btnPrimary}`}>
            {t.nav.cta} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(() => {
    try { return sessionStorage.getItem('tellu_intro_seen') === 'true'; } catch { return false; }
  });

  const handlePreloaderDone = () => {
    try { sessionStorage.setItem('tellu_intro_seen', 'true'); } catch { /* ignore */ }
    setPreloaderDone(true);
  };

  const [lang, setLang] = useState<Lang>('id');
  const [dark, setDark] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrack, setModalTrack] = useState(0);

  const bg      = dark ? BG_DARK  : BG_LIGHT;
  const surface = dark ? '#0D0F15' : '#FFFFFF';
  const border  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const textPri = dark ? '#F1F5F9' : '#0F172A';
  const textSec = dark ? '#94A3B8' : '#64748B';
  const textDim = dark ? '#475569' : '#94A3B8';

  const openModal  = (idx = 0) => { setModalTrack(idx); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  const ctx: AppCtx = { lang, setLang, dark, setDark, openModal, bg, surface, border, textPri, textSec, textDim, t: T[lang] };

  return (
    <Ctx.Provider value={ctx}>
      <BrowserRouter>
        <div
          className="min-h-screen overflow-x-clip antialiased selection:bg-[#FF9700]/20 bg-[#F8FAFC] dark:bg-[#08090C] text-slate-900 dark:text-white transition-colors duration-300"
        >
          {/* Preloader */}
          <AnimatePresence>
            {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
          </AnimatePresence>

          {/* Routes */}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"      element={<Home />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>

          {/* Global modal */}
          <Modal open={modalOpen} initialTrack={modalTrack} onClose={closeModal} />
        </div>
      </BrowserRouter>
    </Ctx.Provider>
  );
}

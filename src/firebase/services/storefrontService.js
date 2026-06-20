import { db } from '../config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fileToBase64, resizeImageBase64 } from '../../utils/imageUtils';

const STOREFRONT_DOC = 'storefront';
const COLLECTION = 'settings';

// ── Default hero settings ─────────────────────────────────────────────────────
export const DEFAULT_HERO = {
  heading: 'WELCOME TO THE\nFUTURE OF APPAREL',
  subText: "India's First 3D Graphic-Designed T-Shirts",
  btnLabel: 'SHOP NOW',
  btnLink: '#collections',
  bgImage: 'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=80&w=2069&auto=format&fit=crop',
  bgColor: '#000000',
  headingColor: '#FFFFFF',
  subColor: 'rgba(255,255,255,0.75)',
};

// ── Default banner settings ───────────────────────────────────────────────────
export const DEFAULT_BANNERS = [
  {
    id: 1,
    heading: 'New Arrivals',
    subText: 'Fresh drops. Crafted for the bold.',
    btnLabel: 'SHOP NOW',
    btnLink: '/collections/new-arrivals',
    bgImage: '',
    bgColor: '#6B0F10',
    headingColor: '#F5EDD8',
    subColor: '#BFA882',
    btnStyle: 'outline',
    btnBorderColor: '#F5EDD8',
    btnTextColor: '#F5EDD8',
    btnHoverBg: '#F5EDD8',
    btnHoverText: '#4c0e0e',
  },
  {
    id: 2,
    heading: 'Best Sellers',
    subText: 'Community favorites.',
    btnLabel: 'EXPLORE',
    btnLink: '/collections/best-sellers',
    bgImage: '',
    bgColor: '#4c0e0e',
    headingColor: '#F5EDD8',
    subColor: '#BFA882',
    btnStyle: 'outline',
    btnBorderColor: '#F5EDD8',
    btnTextColor: '#F5EDD8',
    btnHoverBg: '#F5EDD8',
    btnHoverText: '#4c0e0e',
  },
  {
    id: 3,
    heading: 'The Edit',
    subText: 'Handpicked. Curated. Yours.',
    btnLabel: 'VIEW ALL',
    btnLink: '/collections',
    bgImage: '',
    bgColor: '#4c0e0e',
    headingColor: '#F5EDD8',
    subColor: '#BFA882',
    btnStyle: 'outline',
    btnBorderColor: '#F5EDD8',
    btnTextColor: '#F5EDD8',
    btnHoverBg: '#F5EDD8',
    btnHoverText: '#4c0e0e',
  },
];

// ── Get hero settings from Firestore ─────────────────────────────────────────
export const getHeroSettings = async () => {
  try {
    const ref = doc(db, COLLECTION, STOREFRONT_DOC);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().hero) {
      return { ...DEFAULT_HERO, ...snap.data().hero };
    }
    return DEFAULT_HERO;
  } catch (err) {
    console.error('getHeroSettings error:', err);
    return DEFAULT_HERO;
  }
};

// ── Save hero settings to Firestore ──────────────────────────────────────────
export const saveHeroSettings = async (heroData, imageFile = null, mobileImageFile = null) => {
  let bgImage = heroData.bgImage;
  let bgImageMobile = heroData.bgImageMobile || '';

  if (imageFile) {
    try {
      const base64 = await fileToBase64(imageFile);
      bgImage = await resizeImageBase64(base64, 1920, 1080, 0.7);
    } catch (err) {
      console.error('Error processing hero image:', err);
    }
  }

  if (mobileImageFile) {
    try {
      const base64 = await fileToBase64(mobileImageFile);
      bgImageMobile = await resizeImageBase64(base64, 768, 1280, 0.7);
    } catch (err) {
      console.error('Error processing hero mobile image:', err);
    }
  }

  const ref = doc(db, COLLECTION, STOREFRONT_DOC);
  await setDoc(ref, { hero: { ...heroData, bgImage, bgImageMobile } }, { merge: true });
};

// ── Get banner settings from Firestore ───────────────────────────────────────
export const getBannerSettings = async () => {
  try {
    const ref = doc(db, COLLECTION, STOREFRONT_DOC);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().banners) {
      return snap.data().banners;
    }
    return DEFAULT_BANNERS;
  } catch (err) {
    console.error('getBannerSettings error:', err);
    return DEFAULT_BANNERS;
  }
};

// ── Save banner settings to Firestore ────────────────────────────────────────
export const saveBannerSettings = async (bannersData) => {
  const ref = doc(db, COLLECTION, STOREFRONT_DOC);
  // Note: We're not handling individual banner file uploads here yet as it's more complex for an array.
  // We'll handle banner image conversion in the UI component before calling this if needed.
  await setDoc(ref, { banners: bannersData }, { merge: true });
};

// ── Get logo settings from Firestore ─────────────────────────────────────────
export const getLogoSettings = async () => {
  try {
    const ref = doc(db, COLLECTION, STOREFRONT_DOC);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().logo) {
      return snap.data().logo;
    }
    return { imageUrl: '' };
  } catch (err) {
    console.error('getLogoSettings error:', err);
    return { imageUrl: '' };
  }
};

// ── Save logo settings to Firestore ──────────────────────────────────────────
export const saveLogoSettings = async (logoData, imageFile = null) => {
  let imageUrl = logoData.imageUrl;

  if (imageFile) {
    try {
      const base64 = await fileToBase64(imageFile);
      imageUrl = await resizeImageBase64(base64, 400, 200, 0.9);
    } catch (err) {
      console.error('Error processing logo image:', err);
    }
  }

  const ref = doc(db, COLLECTION, STOREFRONT_DOC);
  await setDoc(ref, { logo: { ...logoData, imageUrl } }, { merge: true });
};


/**
 * slugUtils.js
 * Central utility for converting category names <-> URL-safe slugs.
 * Used by CollectionCategoryPage, CollectionsIndexPage, Header dropdown,
 * ShopByCategory, and any future component that links to /collections/:slug.
 *
 * Auto-scaling guarantee:
 * The route /collections/:slug is ONE dynamic route — no new code needed when
 * a category is added in Firebase. These helpers ensure names always round-trip
 * to the same slug regardless of capitalisation or spacing.
 */

// Special virtual categories that have no Firebase document
export const SPECIAL_CATEGORIES = [
  { slug: 'new-arrivals', name: 'New Arrivals', sortBy: 'createdAt', sortOrder: 'desc' },
  { slug: 'best-sellers', name: 'Best Sellers', sortBy: 'position', sortOrder: 'asc' },
  { slug: 'limited-run', name: 'Limited Run', sortBy: 'position', sortOrder: 'asc' },
];

/**
 * Convert a human-readable category name to a URL slug.
 * e.g. "3D Graphic Design" → "3d-graphic-design"
 *      "MAYA Universe"     → "maya-universe"
 */
export const categoryNameToSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '')   // strip non-alphanumeric (except hyphens)
    .replace(/-+/g, '-')          // collapse consecutive hyphens
    .replace(/^-|-$/g, '');       // trim leading/trailing hyphens
};

/**
 * Resolve a URL slug back to a category name.
 * Checks special virtual categories first, then matches against the live
 * categories array fetched from Firebase.
 *
 * Returns null if no match found (triggers 404 state in the page component).
 */
export const slugToCategoryName = (slug, categories = []) => {
  if (!slug) return null;

  // 1. Check special virtual categories
  const special = SPECIAL_CATEGORIES.find((s) => s.slug === slug);
  if (special) return special.name;

  // 2. Match against Firebase categories (case-insensitive slug comparison)
  const match = categories.find(
    (cat) => categoryNameToSlug(cat.name) === slug
  );
  return match ? match.name : null;
};

/**
 * Get sort options for a given slug.
 * Special slugs have their own sort; regular categories default to newest-first.
 */
export const getSortOptionsForSlug = (slug) => {
  const special = SPECIAL_CATEGORIES.find((s) => s.slug === slug);
  if (special) return { sortBy: special.sortBy, sortOrder: special.sortOrder };
  return { sortBy: 'createdAt', sortOrder: 'desc' };
};

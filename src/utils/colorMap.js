/**
 * Color Mapping Utility
 * Maps color names to valid CSS hex values
 */

const colorMap = {
  // Standard colors
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#A52A2A',
  'gray': '#808080',
  'grey': '#808080',
  'silver': '#C0C0C0',
  'gold': '#FFD700',
  'beige': '#F5F5DC',
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'tan': '#D2B48C',
  'khaki': '#F0E68C',
  'navy': '#000080',
  'teal': '#008080',
  'maroon': '#800000',
  'lime': '#00FF00',
  'aqua': '#00FFFF',
  'fuchsia': '#FF00FF',
  'olive': '#808000',
  'cyan': '#00FFFF',
  'magenta': '#FF00FF',

  // Non-standard colors - Black variations
  'charcoal black': '#36454F',
  'charcoal': '#36454F',
  'jet black': '#0A0A0A',
  'midnight black': '#191970',
  'obsidian': '#0B0B0B',
  'onyx': '#0F0F0F',
  'carbon': '#1C1C1C',
  'coal': '#1C1C1C',
  'dark gray': '#A9A9A9',
  'dark grey': '#A9A9A9',
  'dark charcoal': '#333333',

  // Non-standard colors - Blue variations
  'navy blue': '#000080',
  'royal blue': '#4169E1',
  'sky blue': '#87CEEB',
  'baby blue': '#89CFF0',
  'powder blue': '#B0E0E6',
  'steel blue': '#4682B4',
  'cornflower blue': '#6495ED',
  'denim': '#1560BD',
  'cobalt blue': '#0047AB',
  'turquoise': '#40E0D0',
  'azure': '#007FFF',
  'cerulean': '#007BA7',
  'indigo': '#4B0082',
  'sapphire': '#0F52BA',
  'electric blue': '#7DF9FF',
  'ice blue': '#D0F0F0',
  'light blue': '#ADD8E6',
  'pale blue': '#ADD8E6',
  'deep blue': '#00008B',
  'ocean blue': '#006994',
  'dodger blue': '#1E90FF',

  // Non-standard colors - Green variations
  'olive green': '#808000',
  'forest green': '#228B22',
  'lime green': '#32CD32',
  'sea green': '#2E8B57',
  'mint green': '#98FF98',
  'emerald': '#50C878',
  'hunter green': '#355E3B',
  'sage green': '#9DC183',
  'army green': '#4B5320',
  'dark green': '#006400',
  'light green': '#90EE90',
  'pale green': '#98FB98',
  'moss green': '#8A9A5B',
  'jade': '#00A86B',
  'teal green': '#008080',
  'pine green': '#01796F',
  'grass green': '#7CFC00',
  'chartreuse': '#DFFF00',
  'pear': '#D1E231',
  'celadon': '#ACE1AF',

  // Non-standard colors - Red variations
  'burgundy': '#800020',
  'maroon red': '#800000',
  'crimson': '#DC143C',
  'scarlet': '#FF2400',
  'ruby': '#E0115F',
  'cherry': '#DE3163',
  'rose': '#FF007F',
  'dark red': '#8B0000',
  'fire engine red': '#CE2029',
  'brick red': '#B22222',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'tomato': '#FF6347',
  'carmine': '#960018',
  'vermilion': '#E34234',
  'blood red': '#660000',
  'wine': '#722F37',
  'merlot': '#722F37',
  'raspberry': '#E30B5D',
  'strawberry': '#FC5A8D',

  // Non-standard colors - Brown variations
  'coffee': '#6F4E37',
  'espresso': '#3C2415',
  'mocha': '#967BB6',
  'cappuccino': '#B8956C',
  'chocolate': '#7B3F00',
  'cocoa': '#D2691E',
  'cinnamon': '#D2691E',
  'caramel': '#C68E17',
  'amber': '#FFBF00',
  'chestnut': '#954535',
  'sienna': '#A0522D',
  'saddle brown': '#8B4513',
  'russet': '#80461B',
  'auburn': '#A52A2A',
  'copper': '#B87333',
  'bronze': '#CD7F32',
  'camel': '#C19A6B',
  'fawn': '#E5AA70',
  'taupe': '#483C32',
  'walnut': '#785C44',
  'mahogany': '#C04000',

  // Non-standard colors - Purple variations
  'lavender': '#E6E6FA',
  'lilac': '#C8A2C8',
  'violet': '#8B00FF',
  'plum': '#DDA0DD',
  'mauve': '#E0B0FF',
  'orchid': '#DA70D6',
  'fuchsia': '#FF00FF',
  'magenta': '#FF00FF',
  'amethyst': '#9966CC',
  'grape': '#6F2DA8',
  'eggplant': '#614051',
  'dark purple': '#4B0082',
  'light purple': '#D8BFD8',
  'pale purple': '#D8BFD8',
  'deep purple': '#301934',
  'royal purple': '#7851A9',
  'periwinkle': '#CCCCFF',
  'thistle': '#D8BFD8',
  'wisteria': '#C9A0DC',

  // Non-standard colors - Pink variations
  'hot pink': '#FF69B4',
  'deep pink': '#FF1493',
  'light pink': '#FFB6C1',
  'pale pink': '#FFD6DC',
  'rose pink': '#FF66CC',
  'carnation': '#FFA6C9',
  'blush': '#DE5D83',
  'dusty rose': '#BC8F8F',
  'peach': '#FFCBA4',
  'coral pink': '#F88379',
  'salmon pink': '#FF91A4',
  'bubblegum': '#FFC1CC',
  'fuchsia pink': '#FF77FF',
  'magenta pink': '#FF00FF',
  'pastel pink': '#FFD1DC',
  'shell pink': '#F8E4E4',

  // Non-standard colors - Orange variations
  'tangerine': '#FF9966',
  'apricot': '#FBCEB1',
  'peach orange': '#FFCBA4',
  'coral orange': '#FF7F50',
  'burnt orange': '#CC5500',
  'pumpkin': '#FF7518',
  'carrot': '#ED9121',
  'rust': '#B7410E',
  'terracotta': '#E2725B',
  'sunset orange': '#FD5E53',
  'persimmon': '#EC5800',
  'mandarin': '#F37A48',
  'blood orange': '#CF4E35',
  'saffron': '#F4C430',
  'ginger': '#B06500',

  // Non-standard colors - Yellow variations
  'golden yellow': '#FFD700',
  'sunflower': '#FFC512',
  'butter': '#FFFFE0',
  'lemon': '#FFFACD',
  'canary': '#FFEF00',
  'cream yellow': '#FFFDD0',
  'mustard': '#FFDB58',
  'honey': '#EB9605',
  'amber yellow': '#FFBF00',
  'corn': '#FBEC5D',
  'saffron yellow': '#F4C430',
  'pale yellow': '#FFFFE0',
  'light yellow': '#FFFFE0',
  'dark yellow': '#FFD700',
  'ochre': '#CC7722',

  // Non-standard colors - Gray variations
  'light gray': '#D3D3D3',
  'light grey': '#D3D3D3',
  'dark gray': '#A9A9A9',
  'dark grey': '#A9A9A9',
  'slate gray': '#708090',
  'slate grey': '#708090',
  'charcoal gray': '#36454F',
  'steel gray': '#4682B4',
  'pearl gray': '#EAE0C8',
  'silver gray': '#C0C0C0',
  'smoke gray': '#71797E',
  'cool gray': '#8C92AC',
  'warm gray': '#9E9E9E',
  'taupe gray': '#8B8589',
  'dove gray': '#6E7F80',
  'ash gray': '#B2BEB5',
  'dim gray': '#696969',
  'dim grey': '#696969',

  // Non-standard colors - White variations
  'off white': '#FAF9F6',
  'ivory white': '#FFFFF0',
  'cream white': '#FFFDD0',
  'pearl white': '#EAE0C8',
  'snow white': '#FFFAFA',
  'milk white': '#FEFEFE',
  'eggshell': '#F0EAD6',
  'alabaster': '#FAFAFA',
  'bone white': '#E3DAC9',
  'ghost white': '#F8F8FF',
  'antique white': '#FAEBD7',
  'blanched almond': '#FFEBCD',
  'bisque': '#FFE4C4',
  'navajo white': '#FFDEAD',

  // Non-standard colors - Beige/Tan variations
  'sand': '#C2B280',
  'sand beige': '#F4A460',
  'camel tan': '#C19A6B',
  'earth': '#5D4037',
  'natural': '#F5F5DC',
  'linen': '#FAF0E6',
  'ecru': '#C2B280',
  'fawn beige': '#E5AA70',
  'wheat': '#F5DEB3',
  'buff': '#F0DC82',
  'biscuit': '#FFE4C4',
  'almond': '#EFDECD',

  // Non-standard colors - Metallic colors
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'brass': '#B5A642',
  'silver metallic': '#C0C0C0',
  'gold metallic': '#FFD700',
  'platinum': '#E5E4E2',
  'chrome': '#A8A9AD',
  'nickel': '#727472',
  'steel': '#71797E',
  'iron': '#434B4D',
  'titanium': '#878787',

  // Non-standard colors - Gemstone colors
  'emerald green': '#50C878',
  'ruby red': '#E0115F',
  'sapphire blue': '#0F52BA',
  'amethyst purple': '#9966CC',
  'topaz': '#FFC87C',
  'jade green': '#00A86B',
  'turquoise blue': '#40E0D0',
  'peridot': '#B4E04E',
  'garnet': '#9B2335',
  'aquamarine': '#7FFFD4',
  'tanzanite': '#7D3C98',
  'morganite': '#F5C7D7',
  'kunzite': '#FFC0CB',
  'moonstone': '#E6E6FA',

  // Non-standard colors - Nature colors
  'leaf green': '#7CFC00',
  'grass green': '#7CFC00',
  'moss': '#8A9A5B',
  'fern green': '#4F7942',
  'pine': '#01796F',
  'forest': '#228B22',
  'sky': '#87CEEB',
  'ocean': '#006994',
  'sea': '#006994',
  'river': '#4A90A4',
  'lake': '#5D8AA8',
  'mountain': '#6B8E23',
  'earth brown': '#5D4037',
  'dirt brown': '#8B4513',
  'clay': '#B7410E',
  'mud': '#5D4037',
  'sandstone': '#C2B280',
  'limestone': '#A4A4A4',
  'granite': '#696969',

  // Non-standard colors - Fashion colors
  'nude': '#E3BC9A',
  'blush nude': '#DE5D83',
  'taupe fashion': '#483C32',
  'camel fashion': '#C19A6B',
  'champagne': '#F7E7CE',
  'champagne gold': '#F7E7CE',
  'rose gold': '#B76E79',
  'copper rose': '#996666',
  'dusty pink': '#BC8F8F',
  'mauve fashion': '#E0B0FF',
  'lavender fashion': '#E6E6FA',
  'sage': '#9DC183',
  'olive fashion': '#808000',
  'mustard fashion': '#FFDB58',
  'rust fashion': '#B7410E',
  'terracotta fashion': '#E2725B',
  'burgundy fashion': '#800020',
  'navy fashion': '#000080',
  'charcoal fashion': '#36454F',
  'midnight': '#191970',
  'midnight blue': '#191970',

  // Additional common colors
  'wine red': '#722F37',
  'wine': '#722F37',
  'merlot': '#722F37',
  'cabernet': '#722F37',
  'burgundy wine': '#800020',
  'deep burgundy': '#660033',
  'light burgundy': '#990033',
  'cranberry': '#9F0050',
  'pomegranate': '#F34723',
  'cherry red': '#DE3163',
  'cherry': '#DE3163',
  'dark cherry': '#960018',
  'wild cherry': '#DE3163',
  'black cherry': '#4A0404',

  'navy dark': '#000080',
  'navy light': '#4169E1',
  'royal navy': '#000080',
  'marine blue': '#000080',
  'admiral blue': '#000080',
  'peacock blue': '#006994',
  'teal blue': '#008080',
  'aqua blue': '#00FFFF',
  'baby blue light': '#89CFF0',
  'powder blue light': '#B0E0E6',
  'sky blue light': '#87CEEB',
  'cornflower': '#6495ED',

  'olive dark': '#556B2F',
  'olive light': '#9ACD32',
  'olive drab': '#6B8E23',
  'army olive': '#4B5320',
  'olive brown': '#6B4423',
  'olive grey': '#6B8E23',

  'forest dark': '#004D00',
  'forest light': '#228B22',
  'pine dark': '#0A2F0A',
  'pine light': '#01796F',
  'moss dark': '#4A5D23',
  'moss light': '#8A9A5B',
  'sage dark': '#5F7161',
  'sage light': '#9DC183',

  'charcoal dark': '#1C1C1C',
  'charcoal light': '#36454F',
  'carbon': '#1C1C1C',
  'coal dark': '#1C1C1C',
  'coal light': '#333333',

  'brown dark': '#3E2723',
  'brown light': '#8D6E63',
  'coffee dark': '#3C2415',
  'coffee light': '#6F4E37',
  'chocolate dark': '#3D2B1F',
  'chocolate light': '#7B3F00',
  'cinnamon dark': '#8B4513',
  'cinnamon light': '#D2691E',
  'caramel dark': '#A67B5B',
  'caramel light': '#C68E17',

  'purple dark': '#4B0082',
  'purple light': '#9370DB',
  'violet dark': '#4B0082',
  'violet light': '#8B00FF',
  'lavender dark': '#967BB6',
  'lavender light': '#E6E6FA',
  'lilac dark': '#9370DB',
  'lilac light': '#C8A2C8',
  'mauve dark': '#915C83',
  'mauve light': '#E0B0FF',

  'pink dark': '#C71585',
  'pink light': '#FFB6C1',
  'rose dark': '#B76E79',
  'rose light': '#FF007F',
  'coral dark': '#FF6F61',
  'coral light': '#FF7F50',
  'salmon dark': '#E9967A',
  'salmon light': '#FA8072',

  'orange dark': '#FF8C00',
  'orange light': '#FFB347',
  'tangerine dark': '#FF6347',
  'tangerine light': '#FF9966',
  'apricot dark': '#FB8D62',
  'apricot light': '#FBCEB1',
  'peach dark': '#FFCBA4',
  'peach light': '#FFDAB9',

  'yellow dark': '#F4C430',
  'yellow light': '#FFFFE0',
  'gold dark': '#DAA520',
  'gold light': '#FFD700',
  'mustard dark': '#FFDB58',
  'mustard light': '#FFEB3B',
  'lemon dark': '#F0E68C',
  'lemon light': '#FFFACD',

  'gray dark': '#696969',
  'gray light': '#D3D3D3',
  'grey dark': '#696969',
  'grey light': '#D3D3D3',
  'slate dark': '#2F4F4F',
  'slate light': '#708090',
  'silver dark': '#A9A9A9',
  'silver light': '#E0E0E0',

  'white dark': '#F5F5F5',
  'white light': '#FFFFFF',
  'off-white': '#FAF9F6',
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'pearl': '#EAE0C8',
  'eggshell': '#F0EAD6',
  'linen': '#FAF0E6',
  'alabaster': '#FAFAFA',
  'bone': '#E3DAC9',
  'ghost': '#F8F8FF',

  'beige dark': '#D2B48C',
  'beige light': '#F5F5DC',
  'tan dark': '#8B4513',
  'tan light': '#D2B48C',
  'sand dark': '#C2B280',
  'sand light': '#F4A460',
  'camel dark': '#8B4513',
  'camel light': '#C19A6B',
  'fawn dark': '#CD853F',
  'fawn light': '#E5AA70',
  'wheat dark': '#DAA520',
  'wheat light': '#F5DEB3'
};

/**
 * Get hex color code for a given color name
 * @param {string} colorName - The color name to look up
 * @returns {string} - The hex color code, or default gray if not found
 */
export function getColorHex(colorName) {
  if (!colorName || typeof colorName !== 'string') {
    return '#808080'; // Default gray
  }

  // Convert to lowercase and trim for case-insensitive lookup
  const normalizedColor = colorName.toLowerCase().trim();

  // Return the hex code if found, otherwise return default gray
  return colorMap[normalizedColor] || '#808080';
}

/**
 * Check if a color is light (for determining text/icon color)
 * @param {string} colorName - The color name to check
 * @returns {boolean} - True if the color is light, false otherwise
 */
export function isLightColor(colorName) {
  const hex = getColorHex(colorName);
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  
  // Return true if luminance is greater than 128 (middle of 0-255 range)
  return luminance > 128;
}

/**
 * Get appropriate text/icon color for a given background color
 * @param {string} colorName - The background color name
 * @returns {string} - 'black' for light backgrounds, 'white' for dark backgrounds
 */
export function getContrastColor(colorName) {
  return isLightColor(colorName) ? 'black' : 'white';
}

export default colorMap;

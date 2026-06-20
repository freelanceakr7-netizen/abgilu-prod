/**
 * Converts a File object to a Base64 string
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Resizes an image if it's too large for Firestore (1MB limit)
 * @param {string} base64Str 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @param {number} quality 0 to 1
 * @returns {Promise<string>}
 */
export const resizeImageBase64 = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Use WebP format for significantly smaller base64 strings and faster uploads
      resolve(canvas.toDataURL('image/webp', quality));
    };
  });
};

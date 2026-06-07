// रिव्यू के लिए सहायक फ़ंक्शन (Helper functions for reviews)

// रिव्यू का इंटरफ़ेस
export interface Review {
  text: string;
  date: string;
  flavor: string;
}

/**
 * रिव्यू टेक्स्ट को वैलिडेट करता है।
 * टेक्स्ट खाली नहीं होना चाहिए और 1000 अक्षरों से कम होना चाहिए।
 */
export function validateReview(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 1000;
}

/**
 * रिव्यू को डेटाबेस में सेव करने के लिए फ़ॉर्मेट करता है।
 */
export function formatReview(text: string, flavor: string): Review {
  return {
    text: text.trim(),
    date: "À l'instant",
    flavor: flavor || "Original",
  };
}

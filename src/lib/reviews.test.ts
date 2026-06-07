// reviews.ts के लिए यूनिट टेस्ट (Unit tests for reviews.ts)

import test from "node:test";
import assert from "node:assert";
import { validateReview, formatReview } from "./reviews.ts";

// validateReview फ़ंक्शन का टेस्ट
test("validateReview फ़ंक्शन के लिए टेस्ट", () => {
  // खाली स्ट्रिंग के लिए फ़ाल्स (false) आना चाहिए
  assert.strictEqual(validateReview(""), false);
  
  // केवल व्हाइटस्पेस के लिए फ़ाल्स (false) आना चाहिए
  assert.strictEqual(validateReview("   "), false);
  
  // सही स्ट्रिंग के लिए ट्रू (true) आना चाहिए
  assert.strictEqual(validateReview("बहुत ही बढ़िया मखाना!"), true);
  
  // बहुत लंबी स्ट्रिंग के लिए फ़ाल्स (false) आना चाहिए
  const longText = "a".repeat(1001);
  assert.strictEqual(validateReview(longText), false);
});

// formatReview फ़ंक्शन का टेस्ट
test("formatReview फ़ंक्शन के लिए टेस्ट", () => {
  const result = formatReview("  क्रंची और स्वादिष्ट  ", "Black Truffle");
  
  // टेक्स्ट ट्रिम होना चाहिए
  assert.strictEqual(result.text, "क्रंची और स्वादिष्ट");
  
  // फ़्लेवर सही होना चाहिए
  assert.strictEqual(result.flavor, "Black Truffle");
  
  // तारीख सही होनी चाहिए
  assert.strictEqual(result.date, "À l'instant");
  
  // अगर फ़्लेवर खाली है तो डिफ़ॉल्ट 'Original' होना चाहिए
  const defaultResult = formatReview("टेस्टी", "");
  assert.strictEqual(defaultResult.flavor, "Original");
});

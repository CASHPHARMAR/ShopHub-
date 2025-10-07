// DON'T DELETE THIS COMMENT - From javascript_gemini blueprint
// Using Gemini AI for SHOPHUB e-commerce features

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateProductDescription(productName: string, category?: string): Promise<string> {
  const prompt = `Generate a compelling, detailed product description for an e-commerce website.

Product Name: ${productName}
${category ? `Category: ${category}` : ''}

Write a persuasive description that highlights features, benefits, and appeals to potential buyers. Include:
1. A catchy opening statement
2. Key features and specifications
3. Benefits to the customer
4. Use case scenarios
5. Why customers should buy this product

Keep it professional, engaging, and around 150-200 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "A premium quality product that exceeds expectations.";
  } catch (error) {
    console.error("Error generating product description:", error);
    return "A high-quality product designed to meet your needs.";
  }
}

export async function intelligentSearch(query: string, products: any[]): Promise<any[]> {
  if (products.length === 0) return [];

  const productList = products.map((p, i) => 
    `${i + 1}. ${p.name} - ${p.shortDescription || p.longDescription || 'No description'}`
  ).join('\n');

  const prompt = `You are a smart e-commerce search assistant. Given this search query and product list, return the indices (1-based) of the most relevant products in order of relevance.

Search Query: "${query}"

Available Products:
${productList}

Return only a JSON array of indices (numbers only) for relevant products, ordered by relevance. For example: [3, 1, 5]
If no products match, return an empty array: []`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const indices = JSON.parse(response.text || "[]");
    return indices.map((i: number) => products[i - 1]).filter(Boolean);
  } catch (error) {
    console.error("Error in intelligent search:", error);
    // Fallback to basic search
    const searchLower = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(searchLower))
    );
  }
}

export async function recommendProducts(productName: string, allProducts: any[]): Promise<any[]> {
  if (allProducts.length === 0) return [];

  const productList = allProducts.map((p, i) => 
    `${i + 1}. ${p.name} (${p.category?.name || 'Uncategorized'})`
  ).join('\n');

  const prompt = `You are a smart product recommendation engine. Given a product, recommend 3-4 complementary or similar products that customers might also like.

Current Product: ${productName}

Available Products:
${productList}

Return only a JSON array of indices (1-based numbers) for recommended products. For example: [5, 2, 8, 3]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const indices = JSON.parse(response.text || "[]");
    return indices.slice(0, 4).map((i: number) => allProducts[i - 1]).filter(Boolean);
  } catch (error) {
    console.error("Error recommending products:", error);
    return allProducts.slice(0, 4);
  }
}

export async function summarizeReviews(reviews: any[]): Promise<{ summary: string; pros: string[]; cons: string[] }> {
  if (reviews.length === 0) {
    return { summary: "No reviews yet", pros: [], cons: [] };
  }

  const reviewTexts = reviews.map((r, i) => 
    `${i + 1}. Rating: ${r.rating}/5 - ${r.comment || 'No comment'}`
  ).join('\n');

  const prompt = `Analyze these product reviews and provide a summary with pros and cons.

Reviews:
${reviewTexts}

Return a JSON object with:
{
  "summary": "A brief 2-3 sentence summary of overall customer sentiment",
  "pros": ["List of positive points mentioned"],
  "cons": ["List of negative points or concerns"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            pros: { type: "array", items: { type: "string" } },
            cons: { type: "array", items: { type: "string" } },
          },
          required: ["summary", "pros", "cons"],
        },
      },
      contents: prompt,
    });

    return JSON.parse(response.text || '{"summary":"","pros":[],"cons":[]}');
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return {
      summary: `Based on ${reviews.length} reviews, customers rated this product ${avgRating.toFixed(1)}/5 stars.`,
      pros: ["Customers have shared positive feedback"],
      cons: []
    };
  }
}

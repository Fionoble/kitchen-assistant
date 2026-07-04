import { signal, computed } from "@preact/signals";

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

const defaultProfile = {
  name: "",
  dietaryRestrictions: [],
  allergies: [],
  appliances: [],
  servingSize: 2,
  skillLevel: "intermediate",
  apiKey: "",
};

export const profile = signal(loadFromStorage("kitchen-profile", defaultProfile));

// Republic gateway mode: when a gateway token is set, AI requests are routed
// through the Republic gateway worker instead of using a bring-your-own key.
const GATEWAY_TOKEN_KEY = "buddy_gateway_token";

export const gatewayToken = signal(localStorage.getItem(GATEWAY_TOKEN_KEY) || "");

export const isGatewayMode = computed(() => !!gatewayToken.value);

export function setGatewayToken(token) {
  localStorage.setItem(GATEWAY_TOKEN_KEY, token);
  gatewayToken.value = token;
}

export function clearGatewayToken() {
  localStorage.removeItem(GATEWAY_TOKEN_KEY);
  gatewayToken.value = "";
}

// AI is usable with either a gateway token or a personal OpenAI key.
export const hasApiKey = computed(() => !!gatewayToken.value || !!profile.value.apiKey);

export function updateProfile(updates) {
  profile.value = { ...profile.value, ...updates };
  localStorage.setItem("kitchen-profile", JSON.stringify(profile.value));
}

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Sodium",
  "Nut-Free",
  "Halal",
  "Kosher",
];

export const ALLERGY_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];

export const APPLIANCE_OPTIONS = [
  "Air Fryer",
  "Griddle",
  "Waffle Maker",
  "Instant Pot",
  "Slow Cooker",
  "Stand Mixer",
  "Food Processor",
  "Blender",
  "Sous Vide",
  "Smoker",
  "Bread Machine",
  "Rice Cooker",
  "Toaster Oven",
  "Dutch Oven",
  "Wok",
  "Cast Iron Skillet",
  "Grill",
  "Pizza Oven",
  "Dehydrator",
  "Ice Cream Maker",
];



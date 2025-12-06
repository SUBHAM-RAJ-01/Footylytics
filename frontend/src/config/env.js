// Environment Configuration with fallbacks for production
export const ENV_CONFIG = {
  // API URLs
  API_URL:
    import.meta.env.VITE_API_URL || "https://footylytics.onrender.com/api",

  // Supabase config
  SUPABASE_URL:
    import.meta.env.VITE_SUPABASE_URL ||
    "https://hahlmozurgvywogzauli.supabase.co",
  SUPABASE_ANON_KEY:
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhaGxtb3p1cmd2eXdvZ3phdWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzUxOTcsImV4cCI6MjA3NTAxMTE5N30.OpRpH_UOIxT-Cw0wqvMbDL_5tqnU5yj-WgBSJMt7_2c",

  // Stripe config
  STRIPE_PUBLIC_KEY:
    import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    "pk_test_51RON2JFy9kI1RIxkK5b5MlW8MPGV7x9TDutuVpi16f9eg1vWR49uCgFZOoALZ5Xp98byLqgO76SM6CabARJIonaS00QbI9U4Ij",
  STRIPE_PRICE_ID_MONTHLY:
    import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY ||
    "price_1SDwHmFy9kI1RIxkIsRfoJ8I",
  STRIPE_PRICE_ID_YEARLY:
    import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY ||
    "price_1SDwIRFy9kI1RIxkNrnKadP8",

  // App config
  APP_URL: import.meta.env.VITE_APP_URL || "https://footylytics.netlify.app",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Footylytics",
};

// Debug function to check config
export const debugEnvConfig = () => {
  console.log("🔧 Environment Configuration Check:");
  console.log("Mode:", import.meta.env.MODE);
  console.log("API URL:", ENV_CONFIG.API_URL);
  console.log("Supabase URL:", ENV_CONFIG.SUPABASE_URL);
  console.log(
    "Stripe Key:",
    ENV_CONFIG.STRIPE_PUBLIC_KEY ? "Loaded" : "Missing"
  );
  console.log("App URL:", ENV_CONFIG.APP_URL);

  // Check if environment variables are actually loaded
  const envVars = import.meta.env;
  console.log("Raw Environment Variables:", {
    VITE_API_URL: envVars.VITE_API_URL || "Not set - using fallback",
    VITE_SUPABASE_URL: envVars.VITE_SUPABASE_URL || "Not set - using fallback",
    VITE_STRIPE_PUBLIC_KEY: envVars.VITE_STRIPE_PUBLIC_KEY
      ? "Set"
      : "Not set - using fallback",
  });
};

export default ENV_CONFIG;

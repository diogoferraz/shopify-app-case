import react from "@vitejs/plugin-react";
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.ACCESS_KEY": JSON.stringify(process.env.ACCESS_KEY),
    "process.env.SHOP": JSON.stringify(process.env.SHOP),
    "process.env.SHOPIFY_API_SECRET": JSON.stringify(
      process.env.SHOPIFY_API_SECRET
    ),
  },
  plugins: [react()],
};

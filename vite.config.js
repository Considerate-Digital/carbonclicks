// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4000,
    strictPort: false,
  },
  test: {
    // jest like globals
    globals: true,
    environment: "jsdom",
    // in-source testing
    includeSource: ["src/**/*.{js,ts,svelte}"],
    // Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
    //setupFiles: ['setupTest.ts'],
    // Exclude files in c8
    coverage: {
      //exclude: ['setupTest.ts']
    },
    deps: {
      // Put Svelte component here, e.g., inline: [/svelte-multiselect/, /msw/]
      inline: [/msw/],
    },
    // Exclude playwright tests folder
    //        exclude: [...configDefaults.exclude, 'tests']
  },
  assetsInclude: ["**/*.md"],
};

export default config;

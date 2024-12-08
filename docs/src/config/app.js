/**
 * How to edit -
 * Only edit values in the right hand side of the colon (:)
 *
 * Read: https://planum-docs.vercel.app/configuration/app.html
 */

/**
 * App metadata
 */
export const META = {
    // icons and logos should be in the public directory
    // for public/favicon.ico, use "/favicon.ico"
    app_icon: "/favicon.svg",
    app_name: "Django Axor Auth Docs",
    app_description: "Documentation for Django Axor Auth",
    // app_url is where the app is hosted
    app_url: "https://django-axor.vercel.app/",
    favicon: "/favicon.ico",
    navbar: {
        logo: {
            // logo can be an image, text, or both
            style: "icon_with_text",
            // whatever style you choose, provide the necessary values
            variations: {
                icon_with_text: {
                    icon: "/logo.svg",
                    text: "Django Axor",
                },
                text_only: {
                    text: "Django Axor",
                },
                icon_only: {
                    icon: "/logo.svg",
                },
                full_logo: {
                    logo: "/logo.svg",
                    // avoid changing width and height and instead
                    // try to fit the logo in the given dimensions
                    width: 200,
                    height: 65,
                },
            },
        },
    },
};

/**
 * Declare any additional stylesheets or scripts that you want to include in the head.
 * `link` is for stylesheets and `scripts` is for scripts.
 *
 * The order in which you provide the links is the order in which they will be included in the head.
 */
export const INLCUDE = {
    links: [
        {
            href: "https://fonts.googleapis.com",
            rel: "preconnect",
        },
        {
            href: "https://fonts.gstatic.com",
            rel: "preconnect",
            crossorigin: true,
        },
        {
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Source+Code+Pro&display=swap",
            rel: "stylesheet",
        },
    ],
    scripts: [],
};

/**
 * This goes into tailwind.config.js theme.extend
 */
export const CUSTOMIZE = {
    fontFamily: {
        // Change font here to use your own
        sans: ["Inter", "sans-serif"],
        mono: ["Source Code Pro", "monospace"],
        serif: ["Inter", "sans-serif"],
    },
    colors: {
        primary: {
            // Change values below to change the primary color
            50: "#eef7ff",
            100: "#d9ecff",
            200: "#bcdfff",
            300: "#8eccff",
            400: "#58afff",
            500: "#328dff",
            600: "#2372f5",
            700: "#1457e1",
            800: "#1746b6",
            900: "#193e8f",
            950: "#142757",
        },
    },
};

export const SETTINGS = {
    // Experimental feature: It is recommended to keep this false.
    // If set to true, it will fetch the page content using JavaScript
    // and replace the current page content with the fetched content.
    dynamic_hydration: true,
};

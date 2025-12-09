/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Paleta minimalista con acentos pastel
				background: "#FFFFFF",
				foreground: "#0A0A0A",
				muted: "#F5F5F5",
				"muted-foreground": "#737373",
				border: "#E5E5E5",
				primary: {
					DEFAULT: "#0A0A0A",
					foreground: "#FFFFFF",
				},
				accent: {
					blue: "#A5D8FF",
					green: "#B2F2BB",
					yellow: "#FFEC99",
					pink: "#FCC2D7",
					purple: "#D0BFFF",
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

# Project Instructions: Ulrike's Personal Website

This repository contains the source code for Ulrike's personal portfolio website, a digital space showcasing work in data science, civil service, and creative web development.

---

## Project Overview
The project is a static website built with HTML, CSS, and JavaScript. It serves as a central hub for various sub-projects and professional information.

- **Main Entry Point:** `index.html`
- **Primary Styling:** `styles.css` (Vanilla CSS)
- **Key Features:**
    - **Resume & Profile:** Detailed overview of work and creative interests.
    - **Project Gallery:** Links to external (GitHub, Kaggle) and internal portfolio projects.
    - **Interactive Travel Map:** Located at `TravelMap/index.html`, powered by Leaflet.js and PapaParse.
    - **Sub-Projects:** Independent projects hosted within subdirectories (`LittleLemon/`, `LuckyShrub/`, `oscars/`).

---

## Building and Running
As a static website, there are no complex build or installation steps.

- **To View Locally:** Open `index.html` in any modern web browser.
- **Development Server:** For features like CSV loading in `TravelMap/index.html`, it is recommended to use a local live server (e.g., VS Code Live Server or `python -m http.server`).
- **Deployment:** The site is designed for hosting on GitHub Pages.

---

## Architecture & Data
- **Travel Map Data:** The markers on the travel map are dynamically loaded from `TravelMap/Data/mapPlaces.csv`.
- **Assets:** Images and visual assets are stored in the `pictures/` and `favicon_io/` directories.
- **Sub-Project Isolation:** Sub-projects like `LittleLemon` and `LuckyShrub` have their own encapsulated styles and structures within their respective folders.

---

- **Development Conventions**
- **Styling:** 
    - Prefer Vanilla CSS with a monochrome, terminal-inspired aesthetic.
    - Typography uses `JetBrains Mono` and `Pacifico` fonts.
    - Layouts utilize modern CSS Grid and Flexbox.
- **Modularity:** Maintain the separation of sub-projects to ensure they remain standalone and functional.
- **Data Management:** Keep `TravelMap/Data/mapPlaces.csv` updated with travel locations, ensuring the column structure (`city`, `visits`, `latitude`, `longitude`, `reviews`, `continent`) is preserved.

---

☀️ *Guided by the light, moving with the flow.*

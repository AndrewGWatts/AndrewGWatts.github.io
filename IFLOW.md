# iFlow Context: Andrew Watts Personal Website

## Project Overview

This is a static website project designed to showcase Andrew Watts' portfolio. It is primarily built using HTML, CSS, and vanilla JavaScript. The website features a responsive design that works well on both desktop and mobile devices.

Its core features include:

*   **Project Showcase**: Interactive carousels display web applications and web design projects.
*   **Services & Skills**: A clear listing of offered services, tools, and skills.
*   **Educational Resources**: A collection of AI-generated educational prompts.
*   **Responsive Layout**: Uses CSS media queries and JavaScript to dynamically adjust the layout for different screen sizes, particularly collapsing and expanding content (like services and prompt lists) on mobile devices.

## Project Structure and Key Files

*   **`index.html`**: The main entry point of the website, defining the overall structure and content areas (About Me, Projects, Skills, Prompts, Services, Contact, etc.).
*   **`main.js`**: The main JavaScript entry point for the website. Responsible for initializing components like carousels and "See More" buttons after the page loads, and handling window resize events.
*   **`data.js`**: Centrally stores all dynamic content data in JavaScript module format, including `webAppsData`, `webDesignData`, `servicesData`, and `promptsData`. This is the core data source for content-driven elements.
*   **`carouselLogic.js`**: Contains the `createCarousel` factory function used to dynamically generate and manage project carousels. Handles navigation, auto-scrolling, touch swiping, and responsive adjustments.
*   **`cardGenerators.js`**: Contains functions for dynamically generating HTML cards (project cards, service cards, prompt cards) based on data from `data.js`.
*   **`seeMoreServices.js` & `seeMorePrompts.js`**: Manage the "See More/Less" interaction logic for the services and prompts sections, dynamically showing or hiding content based on screen size.
*   **`utils.js`**: Stores general utility functions, such as `isMobile` for detecting if the current view is mobile.
*   **CSS Files**: Multiple CSS files (like `style.css`, `header.css`, `project-card.css`, etc.) are responsible for styling different parts of the website. The `README.md` mentions that `style.css` has been split and integrated into other more specific CSS files.

## Development and Running

### Running the Project

This is a static website that can be previewed directly by opening the `index.html` file in a browser. Alternatively, it can be deployed to any static website hosting service (such as GitHub Pages, Netlify, Vercel, etc.).

### Development Notes

*   **Content Updates**: To add or modify projects, services, prompts, etc., simply edit the corresponding arrays in the `data.js` file. The page will automatically render based on the data.
*   **Style Modifications**: Styles are distributed across multiple CSS files. When making changes, locate the corresponding file for adjustment.
*   **Interaction Logic**: JavaScript logic is highly modular, with `main.js` coordinating and other files handling specific functionalities. When modifying interactions, locate the corresponding `.js` file.
*   **Responsiveness**: Responsive behavior is primarily determined by the `isMobile()` function, with related components (carousels, services, prompts) being re-rendered when the window size changes.
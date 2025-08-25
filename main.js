import { createCarousel } from "./carouselLogic.js"; // Import the factory function
import { webAppsData, webDesignData, servicesData, promptsData, sectionsData } from "./data.js"; // Import all data
import { createProjectCard, createServiceCard, createPromptCard } from "./cardGenerators.js"; // Import all card generators
import { setupServicesSeeMore, handleServicesSectionResize } from "./seeMoreServices.js";
import { setupPromptsSeeMore, handlePromptSectionResize } from "./seeMorePrompts.js";
import { isMobile } from "./utils.js";

// Store carousel instances
let webAppsCarousel = null;
let webDesignCarousel = null;

// Function to update section titles from data.js
function updateSectionTitles() {
    document.getElementById('web-apps-title').textContent = sectionsData.featuredSectionOne;
    document.getElementById('web-design-title').textContent = sectionsData.featuredSectionTwo;
    document.getElementById('skills-title').textContent = sectionsData.listTitle;
    document.getElementById('prompts-title').textContent = sectionsData.textcardTitle;
    document.getElementById('services-title').textContent = sectionsData.listTitle2;
    document.getElementById('contact-title').textContent = sectionsData.contactTitle;
}

// Handle screen resize: reset state and re-render sections
let wasMobile = isMobile(); // Initialize state
window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
        // Breakpoint crossed, re-initialize elements that depend on structure/visibility
        // Re-initialize carousels to reset their state and listeners
        setupCarousels();
        setupPromptsSeeMore(); // Re-initialize prompts see more
        setupServicesSeeMore(); // Re-initialize services see more
        wasMobile = nowMobile;
    } else {
         // Same view (mobile/desktop) but window size changed, just update position/display
         webAppsCarousel?.handleResize(); // Update position for Web Apps carousel
         webDesignCarousel?.handleResize(); // Update position for Web Design carousel
         handlePromptSectionResize(); // Update prompt display based on new size (if any)
         handleServicesSectionResize(); // Update service display based on new size (if any)
    }
});

// Function to set up all carousels
function setupCarousels() {
    // Setup Web Apps carousel
    webAppsCarousel = createCarousel(
        'web-apps-carousel-container', // ID of the carousel container
        webAppsData,                 // Data for the carousel
        createProjectCard,           // Function to generate card HTML
        4000                         // Auto-scroll interval (4 seconds)
    );

     // Setup Web Design carousel
     webDesignCarousel = createCarousel(
        'web-design-carousel-container', // ID of the carousel container
        webDesignData,                 // Data for the carousel
        createProjectCard,             // Function to generate card HTML
        4000                           // Auto-scroll interval (4 seconds)
     );
}

// Theme switch logic
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check local storage for theme preference, default to dark if not set
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = false;
        }

        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

// Initial state setup on load
document.addEventListener('DOMContentLoaded', () => {
    updateSectionTitles(); // Set section titles on load
    setupCarousels(); // Populate and initialize carousels
    setupServicesSeeMore(); // Populate and initialize services see more
    setupPromptsSeeMore(); // Populate and initialize prompts see more
    setupThemeToggle(); // Initialize theme toggle
});
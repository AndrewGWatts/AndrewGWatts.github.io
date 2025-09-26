import { createCarousel } from "./carouselLogic.js"; // Import the factory function
import { webAppsData, webDesignData, servicesData, promptsData } from "./data.js"; // Import all data
import { createProjectCard, createServiceCard, createPromptCard } from "./cardGenerators.js"; // Import all card generators
import { setupServicesSeeMore, handleServicesSectionResize } from "./seeMoreServices.js";
import { setupPromptsSeeMore, handlePromptSectionResize } from "./seeMorePrompts.js";
import { isMobile } from "./utils.js";

// Store carousel instances
let webAppsCarousel = null;
let webDesignCarousel = null;

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

// Initial state setup on load
document.addEventListener('DOMContentLoaded', () => {
    setupCarousels(); // Populate and initialize carousels
    setupServicesSeeMore(); // Populate and initialize services see more
    setupPromptsSeeMore(); // Populate and initialize prompts see more
});
import { createCarousel } from "./carouselLogic.js"; // Import the factory function
import { pageContent } from "./data.js"; // Import pageContent
import { createProjectCard, createServiceCard, createPromptCard } from "./cardGenerators.js"; // Import all card generators
import { setupServicesSeeMore, handleServicesSectionResize } from "./seeMoreServices.js";
import { setupPromptsSeeMore, handlePromptSectionResize } from "./seeMorePrompts.js";
import { isMobile } from "./utils.js";
import { populateHeader, populateAbout, populateSkills, populateContact, populateFooter } from "./populateContent.js";

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

// Function to populate static content from pageContent
function populateStaticContent() {
    // Page Metadata
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = pageContent.metadata.title;

    populateHeader(pageContent.header);
    populateAbout(pageContent.about);

    // Web Apps
    const webAppsHeading = document.getElementById('web-apps-heading');
    if (webAppsHeading) webAppsHeading.textContent = pageContent.webApps.heading;

    // Web Design
    const webDesignHeading = document.getElementById('web-design-heading');
    if (webDesignHeading) webDesignHeading.textContent = pageContent.webDesign.heading;

    populateSkills(pageContent.skills);

    // Prompts
    const promptsHeading = document.getElementById('prompts-heading');
    if (promptsHeading) promptsHeading.textContent = pageContent.prompts.heading;
    const seeMorePromptsButton = document.getElementById('see-more-prompts');
    if (seeMorePromptsButton && seeMorePromptsButton.childNodes[0]) {
        seeMorePromptsButton.childNodes[0].nodeValue = pageContent.prompts.buttonTextMore + ' '; // Set text node
    }
    
    // Services
    const servicesHeading = document.getElementById('services-heading');
    if (servicesHeading) servicesHeading.textContent = pageContent.services.heading;
    const seeMoreServicesButton = document.getElementById('see-more-services');
    if (seeMoreServicesButton && seeMoreServicesButton.childNodes[0]) {
        seeMoreServicesButton.childNodes[0].nodeValue = pageContent.services.buttonTextMore + ' '; // Set text node
    }

    populateContact(pageContent.contact);
    populateFooter(pageContent.footer);
}

// Function to set up all carousels
function setupCarousels() {
    // Setup Web Apps carousel
    webAppsCarousel = createCarousel(
        'web-apps-carousel-container', // ID of the carousel container
        pageContent.webApps.projects,  // Data for the carousel from pageContent
        createProjectCard,           // Function to generate card HTML
        4000                         // Auto-scroll interval (4 seconds)
    );

     // Setup Web Design carousel
     webDesignCarousel = createCarousel(
        'web-design-carousel-container', // ID of the carousel container
        pageContent.webDesign.projects,  // Data for the carousel from pageContent
        createProjectCard,             // Function to generate card HTML
        4000                           // Auto-scroll interval (4 seconds)
     );
}

// Initial state setup on load
document.addEventListener('DOMContentLoaded', () => {
    populateStaticContent(); // Populate static content first
    setupCarousels(); // Populate and initialize carousels
    setupServicesSeeMore(); // Populate and initialize services see more
    setupPromptsSeeMore(); // Populate and initialize prompts see more
});
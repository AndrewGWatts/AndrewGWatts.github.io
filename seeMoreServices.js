import { pageContent } from "./data.js";
import { createServiceCard } from "./cardGenerators.js";
import { isMobile } from "./utils.js";

let servicesGrid;
let seeMoreServicesButton;
let serviceCards; // Collect all service cards

function toggleServicesVisibility() {
     if (!servicesGrid || !seeMoreServicesButton || serviceCards.length === 0) return;

    if (servicesGrid.classList.contains('services-expanded')) {
        // Currently expanded, hide details and cards beyond the first 3 on mobile
        servicesGrid.classList.remove('services-expanded');
        seeMoreServicesButton.innerHTML = pageContent.services.buttonTextMore + ' <i class="fas fa-chevron-down"></i>';
         const icon = seeMoreServicesButton.querySelector('i');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');

        // Manually hide details for all cards when collapsing on mobile
        if (isMobile()) {
             serviceCards.forEach(card => {
                  const details = card.querySelector('.service-details');
                  if (details) details.style.display = 'none';
             });
             // Manually hide cards beyond the first 3 on mobile
            serviceCards.forEach((card, index) => {
                if (index >= 3) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'flex'; // Ensure the first 3 are visible
                }
            });
        }


    } else {
        // Not expanded, show details for all cards and make all cards visible
        servicesGrid.classList.add('services-expanded');
        seeMoreServicesButton.innerHTML = pageContent.services.buttonTextLess + ' <i class="fas fa-chevron-up"></i>';
         const icon = seeMoreServicesButton.querySelector('i');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');

        // Manually show details for all cards when expanding
        serviceCards.forEach(card => {
             const details = card.querySelector('.service-details');
             if (details) details.style.display = 'block';
        });
         // Manually show all cards when expanding
         serviceCards.forEach(card => {
              card.style.display = 'flex'; // Assuming flex display
         });
    }
     // No need to re-select serviceDetails or serviceCards here, they are class-level
}

// Function to handle Services section display on resize/load
export function handleServicesSectionResize() {
    if (!servicesGrid || !seeMoreServicesButton || serviceCards.length === 0) return;

     const nowMobile = isMobile();
    if (nowMobile) {
         // On mobile, hide service details and cards beyond the first 3 initially and show button
         // Check if the grid is currently expanded
         if (!servicesGrid.classList.contains('services-expanded')) {
             // Only hide if not expanded on mobile resize
             serviceCards.forEach(card => {
                  const details = card.querySelector('.service-details');
                  if (details) details.style.display = 'none';
             });
              serviceCards.forEach((card, index) => {
                 if (index >= 3) {
                     card.style.display = 'none';
                 } else {
                     card.style.display = 'flex';
                 }
             });
             seeMoreServicesButton.innerHTML = pageContent.services.buttonTextMore + ' <i class="fas fa-chevron-down"></i>';
              const icon = seeMoreServicesButton.querySelector('i');
              icon.classList.remove('fa-chevron-up');
              icon.classList.add('fa-chevron-down');
         } else {
             // If it was expanded, ensure details are block and button text/icon is 'See Less'
             serviceCards.forEach(card => {
                  const details = card.querySelector('.service-details');
                 if (details) details.style.display = 'block'; // Explicitly set block if expanded
             });
              serviceCards.forEach(card => {
                  card.style.display = 'flex'; // All cards visible when expanded
              });
             seeMoreServicesButton.innerHTML = pageContent.services.buttonTextLess + ' <i class="fas fa-chevron-up"></i>';
             const icon = seeMoreServicesButton.querySelector('i');
             icon.classList.remove('fa-chevron-down');
             icon.classList.add('fa-chevron-up');
         }
        seeMoreServicesButton.style.display = 'flex'; // Ensure button is visible on mobile
    } else {
        // On desktop, always display service details and all cards, and hide button
        serviceCards.forEach(card => {
             const details = card.querySelector('.service-details');
             if (details) details.style.display = 'block'; // Explicitly set block
        });
         serviceCards.forEach(card => {
             card.style.display = 'flex'; // All cards visible on desktop
         });
        seeMoreServicesButton.style.display = 'none';
         // Ensure the expanded class is removed on desktop so it doesn't interfere on mobile resize
         servicesGrid.classList.remove('services-expanded');
    }
     // Re-select service cards after resize just in case (though unlikely to change elements)
    serviceCards = document.querySelectorAll('#services .service-card');
}

// Function to populate the Services grid and initialize see more logic
export function setupServicesSeeMore() {
    servicesGrid = document.getElementById('services-grid');
    seeMoreServicesButton = document.getElementById('see-more-services');
    if (!servicesGrid || !seeMoreServicesButton) return;

    // Render all services initially
    servicesGrid.innerHTML = pageContent.services.servicesList.map(createServiceCard).join('');
    serviceCards = document.querySelectorAll('#services .service-card'); // Select all cards

     // Remove previous listener before adding new one
     seeMoreServicesButton?.removeEventListener('click', toggleServicesVisibility);
     // Add new event listener
    seeMoreServicesButton?.addEventListener('click', toggleServicesVisibility);

    handleServicesSectionResize(); // Initial state setup
}
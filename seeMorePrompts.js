import { pageContent } from "./data.js";
import { createPromptCard } from "./cardGenerators.js";
import { isMobile } from "./utils.js";

let visiblePromptsContainer; // Reference to the first grid (shows initial prompts)
let hiddenPromptsContainer; // Reference to the second grid (shows hidden prompts)
let seeMorePromptsButton;

function togglePromptsVisibility() {
     if (!hiddenPromptsContainer || !seeMorePromptsButton) return;

    if (hiddenPromptsContainer.style.display === 'none' || hiddenPromptsContainer.style.display === '') { // Add check for initial empty style
        // Show the hidden prompts (using grid for 2x2 layout on mobile)
        hiddenPromptsContainer.style.display = 'grid'; // Use grid for mobile layout
        seeMorePromptsButton.innerHTML = pageContent.prompts.buttonTextLess + ' <i class="fas fa-chevron-up"></i>'; // Change text and icon
        const icon = seeMorePromptsButton.querySelector('i');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        // Hide the prompts
        hiddenPromptsContainer.style.display = 'none';
        seeMorePromptsButton.innerHTML = pageContent.prompts.buttonTextMore + ' <i class="fas fa-chevron-down"></i>'; // Change text and icon
         const icon = seeMorePromptsButton.querySelector('i'); // Re-select icon
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

// Function to handle Prompt section display on resize/load
export function handlePromptSectionResize() {
    if (!visiblePromptsContainer || !hiddenPromptsContainer || !seeMorePromptsButton) return;

     const nowMobile = isMobile();
    if (nowMobile) {
        // On mobile, hide hidden prompts and show button by default
        // Only change if it's currently expanded to avoid flickers
        if (hiddenPromptsContainer.style.display !== 'grid') {
            hiddenPromptsContainer.style.display = 'none';
             seeMorePromptsButton.innerHTML = pageContent.prompts.buttonTextMore + ' <i class="fas fa-chevron-down"></i>'; // Reset button text/icon
             const icon = seeMorePromptsButton.querySelector('i');
             icon.classList.remove('fa-chevron-up');
             icon.classList.add('fa-chevron-down');
        }
        seeMorePromptsButton.style.display = 'flex'; // Ensure button is visible on mobile
    } else {
        // On desktop, always display hidden prompts in grid layout and hide button
        hiddenPromptsContainer.style.display = 'grid';
        seeMorePromptsButton.style.display = 'none';
    }
}

// Function to populate the Prompts grids (visible and hidden) and initialize see more logic
export function setupPromptsSeeMore() {
    visiblePromptsContainer = document.getElementById('prompts-grid');
    hiddenPromptsContainer = document.getElementById('hidden-prompts-grid');
    seeMorePromptsButton = document.getElementById('see-more-prompts');

    if (!visiblePromptsContainer || !hiddenPromptsContainer || !seeMorePromptsButton) return;

    // Decide which prompts go where based on the mobile threshold (currently 3 visible)
    const visiblePrompts = pageContent.prompts.promptsList.slice(0, 3); // Show only the first 3 on mobile initially
    const hiddenPrompts = pageContent.prompts.promptsList.slice(3);

    visiblePromptsContainer.innerHTML = visiblePrompts.map(createPromptCard).join('');
    hiddenPromptsContainer.innerHTML = hiddenPrompts.map(createPromptCard).join('');

     // Only show the button if there are hidden prompts
     if (hiddenPrompts.length > 0) {
         seeMorePromptsButton.style.display = 'flex'; // Initially show on mobile
     } else {
         seeMorePromptsButton.style.display = 'none'; // Hide if no hidden prompts
     }


     // Remove previous listener before adding new one
     seeMorePromptsButton?.removeEventListener('click', togglePromptsVisibility);
     // Add new event listener
    seeMorePromptsButton?.addEventListener('click', togglePromptsVisibility);

    handlePromptSectionResize(); // Initial state setup
}
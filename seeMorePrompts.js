import { promptsData } from "./data.js";
import { createPromptCard } from "./cardGenerators.js";
import { isMobile } from "./utils.js";

let promptsGrid; // Reference to the main prompts grid
let seeMorePromptsButton;
let promptCards; // Collect all prompt cards

function togglePromptsVisibility() {
     if (!promptsGrid || !seeMorePromptsButton || promptCards.length === 0) return;

    if (promptsGrid.classList.contains('prompts-expanded')) {
        // Currently expanded, hide cards beyond the first 3 on mobile
        promptsGrid.classList.remove('prompts-expanded');
        seeMorePromptsButton.innerHTML = 'See More Prompts <i class="fas fa-chevron-down"></i>';
        const icon = seeMorePromptsButton.querySelector('i');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');

        if (isMobile()) {
            // Manually hide cards beyond the first 3 on mobile
            promptCards.forEach((card, index) => {
                if (index >= 3) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'flex'; // Ensure the first 3 are visible
                }
            });
        }
    } else {
        // Not expanded, show all cards
        promptsGrid.classList.add('prompts-expanded');
        seeMorePromptsButton.innerHTML = 'See Less Prompts <i class="fas fa-chevron-up"></i>';
        const icon = seeMorePromptsButton.querySelector('i');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');

        // Manually show all cards when expanding
        promptCards.forEach(card => {
            card.style.display = 'flex'; // Assuming flex display
        });
    }
}

// Function to handle Prompt section display on resize/load
export function handlePromptSectionResize() {
    if (!promptsGrid || !seeMorePromptsButton || promptCards.length === 0) return;

    const nowMobile = isMobile();
    if (nowMobile) {
        // On mobile, hide cards beyond the first 3 initially and show button
        if (!promptsGrid.classList.contains('prompts-expanded')) {
            // Only hide if not expanded on mobile resize
            promptCards.forEach((card, index) => {
                if (index >= 3) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'flex';
                }
            });
            seeMorePromptsButton.innerHTML = 'See More Prompts <i class="fas fa-chevron-down"></i>';
            const icon = seeMorePromptsButton.querySelector('i');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            // If it was expanded, ensure all cards are visible and button text/icon is 'See Less'
            promptCards.forEach(card => {
                card.style.display = 'flex'; // All cards visible when expanded
            });
            seeMorePromptsButton.innerHTML = 'See Less Prompts <i class="fas fa-chevron-up"></i>';
            const icon = seeMorePromptsButton.querySelector('i');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
        seeMorePromptsButton.style.display = 'flex'; // Ensure button is visible on mobile
    } else {
        // On desktop, always display all cards and hide button
        promptCards.forEach(card => {
            card.style.display = 'flex'; // All cards visible on desktop
        });
        seeMorePromptsButton.style.display = 'none';
        // Ensure the expanded class is removed on desktop so it doesn't interfere on mobile resize
        promptsGrid.classList.remove('prompts-expanded');
    }
}

// Function to populate the Prompts grids and initialize see more logic
export function setupPromptsSeeMore() {
    promptsGrid = document.getElementById('prompts-grid'); // Now this is the single grid
    seeMorePromptsButton = document.getElementById('see-more-prompts');

    if (!promptsGrid || !seeMorePromptsButton) return;

    // Render all prompts into the single prompts-grid
    promptsGrid.innerHTML = promptsData.map(createPromptCard).join('');
    promptCards = document.querySelectorAll('#prompts-grid .project-card'); // Select all cards

    // Only show the button if there are more than 3 prompts
    if (promptsData.length > 3) {
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
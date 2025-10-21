import { featuredProjectsData } from "./data.js";
import { createFeaturedProjectCard } from "./cardGenerators.js";
import { isMobile } from "./utils.js";

let carouselContainer;
let carouselTrack;
let carouselItems;
let prevBtn;
let nextBtn;
let indicatorsContainer;

let currentIndex = 0;
let totalItems = 0;

// Function to determine how many items should be visible
function getItemsPerView() {
    return isMobile() ? 1 : 3;
}

// Function to update the carousel state (position, indicators)
function updateCarousel() {
    if (!carouselTrack || carouselItems.length === 0) {
        // Hide carousel controls if no items or elements not found
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        if(indicatorsContainer) indicatorsContainer.style.display = 'none';
        return;
    } else {
        // Show carousel controls if items exist
         if(prevBtn) prevBtn.style.display = 'flex'; // Assuming display flex for centering
        if(nextBtn) nextBtn.style.display = 'flex';
        if(indicatorsContainer) indicatorsContainer.style.display = 'flex';
    }

    const itemsPerView = getItemsPerView();
    const totalGroups = Math.ceil(totalItems / itemsPerView);

    // Recalculate indicators based on groups
    if (indicatorsContainer) indicatorsContainer.innerHTML = ''; // Clear existing indicators
    for (let i = 0; i < totalGroups; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        // An indicator is active if its corresponding group starts with the current currentIndex
        // Calculate the start index of the current group based on currentIndex and itemsPerView
        const currentGroupIndex = Math.floor(currentIndex / itemsPerView);
        if (i === currentGroupIndex) {
             indicator.classList.add('active');
        }
        const groupStartIndex = i * itemsPerView;
        indicator.addEventListener('click', () => {
            currentIndex = groupStartIndex; // Jump to the start of the clicked group
            updateCarousel();
        });
        if (indicatorsContainer) indicatorsContainer.appendChild(indicator);
    }

    // Calculate the offset based on the current item's position
    if (carouselItems.length === 0) {
        carouselTrack.style.transform = `translateX(0)`;
        return; // Avoid errors if there are no items
    }

    const firstVisibleItem = carouselItems[currentIndex];
    const offset = -firstVisibleItem.offsetLeft;

    carouselTrack.style.transform = `translateX(${offset}px)`;
}

// Function to show the next item/group
function showNextItem() {
    const itemsPerView = getItemsPerView();
    const nextIndex = currentIndex + itemsPerView;

    if (nextIndex < totalItems) {
        currentIndex = nextIndex;
    } else {
        // Wrap around to the first item (index 0)
        currentIndex = 0;
    }
    updateCarousel();
}

// Function to show the previous item/group
function showPrevItem() {
    const itemsPerView = getItemsPerView();
    const prevIndex = currentIndex - itemsPerView;

    if (prevIndex >= 0) {
        currentIndex = prevIndex;
    } else {
        // Wrap around to the start of the last group
        // Calculate the index of the first item in the last full or partial group
        const totalGroups = Math.ceil(totalItems / itemsPerView);
        currentIndex = (totalGroups - 1) * itemsPerView;
         // Ensure we don't go past the end if the last group is partial
        if (currentIndex >= totalItems) {
             currentIndex = Math.max(0, totalItems - itemsPerView);
        }
    }
    updateCarousel();
}

// Touch/Swipe Logic for Carousel
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum swipe distance in pixels

function carouselTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    // Optionally, prevent default scrolling only if we detect horizontal movement later
    // e.preventDefault(); // Don't prevent default here, wait for move
}

function carouselTouchMove(e) {
    touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Prevent vertical scrolling if horizontal swipe is significant
    // Check the absolute difference in X vs the absolute difference in Y
     if (Math.abs(diff) > Math.abs(e.touches[0].clientY - (e.changedTouches[0]?.clientY || e.touches[0].clientY))) {
         e.preventDefault();
     }
}

function carouselTouchEnd() {
    const diff = touchStartX - touchEndX;
    const itemsPerView = getItemsPerView(); // Get current items per view for swipe jump

    if (diff > swipeThreshold) {
        // Swiped left (show next item/group)
        showNextItem(); // showNextItem already jumps by itemsPerView
    } else if (diff < -swipeThreshold) {
        // Swiped right (show previous item/group)
         showPrevItem(); // showPrevItem already jumps by itemsPerView
    }

    // Reset touch positions
    touchStartX = 0;
    touchEndX = 0;
}

// Function to populate the Featured Projects grid and initialize carousel
export function setupCarousel() {
    const container = document.getElementById('featured-projects-grid');
    if (!container) return;

    container.innerHTML = featuredProjectsData.map(createFeaturedProjectCard).join('');

    // Select elements after populating
    carouselContainer = document.querySelector('#featured-projects .carousel-container');
    carouselTrack = document.querySelector('#featured-projects .projects-grid');
    carouselItems = document.querySelectorAll('#featured-projects .carousel-item');
    prevBtn = document.querySelector('.carousel-nav.prev-btn');
    nextBtn = document.querySelector('.carousel-nav.next-btn');
    indicatorsContainer = document.querySelector('.carousel-indicators');

    totalItems = carouselItems.length;
    currentIndex = 0; // Reset index on setup

    // Remove previous listeners before adding new ones (important on resize re-init)
    prevBtn?.removeEventListener('click', showPrevItem);
    nextBtn?.removeEventListener('click', showNextItem);
    carouselContainer?.removeEventListener('touchstart', carouselTouchStart);
    carouselContainer?.removeEventListener('touchmove', carouselTouchMove);
    carouselContainer?.removeEventListener('touchend', carouselTouchEnd);

    // Add new event listeners
    prevBtn?.addEventListener('click', showPrevItem);
    nextBtn?.addEventListener('click', showNextItem);
    carouselContainer?.addEventListener('touchstart', carouselTouchStart);
    carouselContainer?.addEventListener('touchmove', carouselTouchMove);
    carouselContainer?.addEventListener('touchend', carouselTouchEnd);

    updateCarousel(); // Initial update
}

// Function to handle carousel updates on window resize
export function handleCarouselResize() {
    currentIndex = 0; // Reset index to the first item/group on resize
    updateCarousel(); // Update position and indicators based on new size
}
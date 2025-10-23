import { isMobile } from "./utils.js";

export function createCarousel(containerId, data, cardGeneratorFunc, autoScrollInterval = 3000) { 
    const carouselContainer = document.querySelector(`#${containerId}`);
    if (!carouselContainer) return null;

    const carouselTrack = carouselContainer.querySelector('.projects-grid');
    const prevBtn = carouselContainer.querySelector('.carousel-nav.prev-btn');
    const nextBtn = carouselContainer.querySelector('.carousel-nav.next-btn');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');

    const hasNav = prevBtn && nextBtn && indicatorsContainer;
    if (!carouselTrack) return null;

    // Populate carousel
    carouselTrack.innerHTML = data.map(cardGeneratorFunc).join('');
    const carouselItems = carouselTrack.querySelectorAll('.carousel-item');
    const totalItems = carouselItems.length;

    let currentIndex = 0;
    let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
    const swipeThreshold = 50;
    let autoScrollTimer;
    let isPaused = false;
    let isSwiping = false; // Flag to track if a swipe is in progress

    // --- Helpers ---
    function itemsPerView() {
        return isMobile() ? 1 : 3;
    }

    function setCardWidths() {
        const perView = itemsPerView();
        if (perView > 0) {
            const containerWidth = carouselContainer.clientWidth;
            const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
            const cardWidth = (containerWidth - gap * (perView - 1)) / perView;
            carouselItems.forEach(item => {
                item.style.minWidth = `${cardWidth}px`;
            });
        }
    }

    function updateIndicators() {
        if (!indicatorsContainer) return;
        indicatorsContainer.innerHTML = '';
        const perView = itemsPerView();
        const totalGroups = Math.ceil(totalItems / perView);
        const activeGroup = Math.floor(currentIndex / perView);

        for (let i = 0; i < totalGroups; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === activeGroup) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                currentIndex = i * perView;
                updateCarousel();
                startAutoScroll();
            });
            indicatorsContainer.appendChild(indicator);
        }
    }

    function updateCarousel() {
        setCardWidths();
        updateIndicators();
        const perView = itemsPerView();
        const maxIndex = Math.max(0, totalItems - perView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const firstItem = carouselItems[currentIndex];
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
        const offset = -(currentIndex * (itemWidth + gap));
        carouselTrack.style.transform = `translateX(${offset}px)`;
    }

    // --- Navigation (only for swipe/nav buttons) ---
    function showNextItem() {
        const perView = itemsPerView();
        const nextIndex = currentIndex + perView;
        currentIndex = nextIndex < totalItems ? nextIndex : 0;
        updateCarousel();
    }

    function showPrevItem() {
        const perView = itemsPerView();
        let prevIndex = currentIndex - perView;
        if (prevIndex >= 0) currentIndex = prevIndex;
        else {
            const totalGroups = Math.ceil(totalItems / perView);
            currentIndex = (totalGroups - 1) * perView;
            const maxIndex = Math.max(0, totalItems - perView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
        }
        updateCarousel();
    }

    // --- Auto-scroll ---
    function startAutoScroll() {
        if (autoScrollInterval > 0 && !isPaused) {
            stopAutoScroll();
            autoScrollTimer = setInterval(showNextItem, autoScrollInterval);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // --- Touch for mobile (swipe only for navigation) ---
    function carouselTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false; // Reset swipe flag on touch start
        stopAutoScroll(); // Always stop auto-scroll on touch
    }

    function carouselTouchMove(e) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // If horizontal movement is significant and greater than vertical movement, it's a swipe
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
            isSwiping = true; // Set swipe flag when swiping occurs
        }
    }

    function carouselTouchEnd() {
        const diffX = touchStartX - touchEndX;
        
        // Only navigate if it's a confirmed swipe
        if (isSwiping) {
            if (diffX > swipeThreshold) {
                showNextItem();
            } else if (diffX < -swipeThreshold) {
                showPrevItem();
            }
        }
        // If it's not a swipe, we do nothing here - no navigation on tap

        // Reset touch coordinates
        touchStartX = touchStartY = touchEndX = touchEndY = 0;
        
        // Restart auto-scroll if not paused (but only if it wasn't a swipe)
        if (!isPaused && !isSwiping) {
            startAutoScroll();
        }
    }

    // --- Click to pause/highlight (no navigation) ---
    carouselItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent any default behavior that might cause scrolling
            e.preventDefault();
            
            // Toggle pause state
            isPaused = !isPaused;
            
            if (isPaused) {
                // When paused, stop auto-scroll and highlight the clicked item
                stopAutoScroll();
                carouselItems.forEach(i => i.classList.remove('highlight'));
                item.classList.add('highlight');
            } else {
                // When unpaused, remove highlight and restart auto-scroll
                carouselItems.forEach(i => i.classList.remove('highlight'));
                startAutoScroll();
            }
            
            // Stop propagation to prevent any parent handlers from executing
            e.stopPropagation();
        });
    });

    // --- Event listeners ---
    if (hasNav) {
        prevBtn.addEventListener('click', showPrevItem);
        nextBtn.addEventListener('click', showNextItem);
    }

    carouselContainer.addEventListener('touchstart', carouselTouchStart);
    carouselContainer.addEventListener('touchmove', carouselTouchMove, { passive: false });
    carouselContainer.addEventListener('touchend', carouselTouchEnd);

    window.addEventListener('resize', () => updateCarousel());

    // --- Initial setup ---
    carouselTrack.style.transition = 'transform 0.5s ease'; // smooth sliding
    updateCarousel();
    startAutoScroll(); // Start auto-scroll only once at initialization

    return {
        handleResize: () => updateCarousel()
    };
}
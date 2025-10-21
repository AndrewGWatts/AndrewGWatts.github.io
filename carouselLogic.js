import { isMobile } from "./utils.js";

export function createCarousel(containerId, data, cardGeneratorFunc, autoScrollInterval = 0) {
    const carouselContainer = document.querySelector(`#${containerId}`);
    if (!carouselContainer) {
        console.error(`Carousel container not found: #${containerId}`);
        return null;
    }

    const carouselTrack = carouselContainer.querySelector('.projects-grid');
    const prevBtn = carouselContainer.querySelector('.carousel-nav.prev-btn');
    const nextBtn = carouselContainer.querySelector('.carousel-nav.next-btn');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');

    const hasNav = prevBtn && nextBtn && indicatorsContainer;

    if (!carouselTrack) {
        console.error(`Carousel track missing in container: #${containerId}`);
        return null;
    }

    // Populate the carousel
    carouselTrack.innerHTML = data.map(cardGeneratorFunc).join('');
    const carouselItems = carouselTrack.querySelectorAll('.carousel-item');
    const totalItems = carouselItems.length;

    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;
    let autoScrollTimer;
    let isPaused = false;

    if (totalItems === 0) {
        if (hasNav) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            indicatorsContainer.style.display = 'none';
        }
        return null;
    } else if (hasNav) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        indicatorsContainer.style.display = 'flex';
    }

    // --- Auto-scroll functions ---
    function startAutoScroll() {
        if (autoScrollInterval > 0 && !isPaused) {
            stopAutoScroll();
            autoScrollTimer = setInterval(showNextItem, autoScrollInterval);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // --- Carousel helpers ---
    function getItemsPerView() {
        return isMobile() ? 1 : 3;
    }

    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const totalGroups = Math.ceil(totalItems / itemsPerView);

        // Update indicators
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            for (let i = 0; i < totalGroups; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                const currentGroupIndex = Math.floor(currentIndex / itemsPerView);
                if (i === currentGroupIndex) indicator.classList.add('active');

                const groupStartIndex = i * itemsPerView;
                indicator.addEventListener('click', () => {
                    currentIndex = groupStartIndex;
                    updateCarousel();
                    startAutoScroll();
                });

                indicatorsContainer.appendChild(indicator);
            }
        }

        // Calculate offset
        if (carouselItems.length === 0) {
            carouselTrack.style.transform = `translateX(0)`;
            return;
        }

        if (currentIndex >= totalItems) currentIndex = 0;

        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const firstVisibleItem = carouselItems[currentIndex];
        if (firstVisibleItem) {
            const itemWidth = firstVisibleItem.offsetWidth;
            const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
            const offset = -(currentIndex * (itemWidth + gap));
            carouselTrack.style.transform = `translateX(${offset}px)`;
        }
    }

    // --- Navigation functions ---
    function showNextItem() {
        const itemsPerView = getItemsPerView();
        const nextIndex = currentIndex + itemsPerView;
        currentIndex = nextIndex < totalItems ? nextIndex : 0;
        updateCarousel();
    }

    function showPrevItem() {
        const itemsPerView = getItemsPerView();
        let prevIndex = currentIndex - itemsPerView;
        if (prevIndex >= 0) currentIndex = prevIndex;
        else {
            const totalGroups = Math.ceil(totalItems / itemsPerView);
            currentIndex = (totalGroups - 1) * itemsPerView;
            const maxIndex = Math.max(0, totalItems - itemsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
        }
        updateCarousel();
    }

    // --- Touch / swipe handlers ---
    function carouselTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        stopAutoScroll();
    }

    function carouselTouchMove(e) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Only prevent vertical scroll for significant horizontal swipe
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    }

    function carouselTouchEnd() {
        const diffX = touchStartX - touchEndX;

        if (diffX > swipeThreshold) showNextItem();
        else if (diffX < -swipeThreshold) showPrevItem();

        touchStartX = touchEndX = touchStartY = touchEndY = 0;

        if (!isPaused) startAutoScroll();
    }

    // --- Click to pause / highlight ---
    carouselItems.forEach(item => {
        item.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) stopAutoScroll();
            else startAutoScroll();

            // Highlight the clicked card
            carouselItems.forEach(i => i.classList.remove('highlight'));
            if (isPaused) item.classList.add('highlight');
        });
    });

    // --- Attach event listeners ---
    if (hasNav) {
        prevBtn.addEventListener('click', showPrevItem);
        nextBtn.addEventListener('click', showNextItem);
    }

    carouselContainer.addEventListener('touchstart', carouselTouchStart);
    carouselContainer.addEventListener('touchmove', carouselTouchMove, { passive: false });
    carouselContainer.addEventListener('touchend', carouselTouchEnd);

    // --- Initial render ---
    updateCarousel();
    startAutoScroll();

    // --- Return resize handler ---
    return {
        handleResize: () => {
            currentIndex = 0;
            updateCarousel();
            startAutoScroll();
        }
    };
}

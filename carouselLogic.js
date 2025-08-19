import { isMobile } from "./utils.js";

export function createCarousel(containerId, data, cardGeneratorFunc, autoScrollInterval = 0) {
    const carouselContainer = document.querySelector(`#${containerId}`);
    if (!carouselContainer) {
        console.error(`Carousel container not found: #${containerId}`);
        return null;
    }

    const carouselTrack = carouselContainer.querySelector('.projects-grid');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');

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
    let touchEndX = 0;
    const swipeThreshold = 50;
    let autoScrollTimer;

    if (totalItems === 0) return null;

    function startAutoScroll() {
        if (autoScrollInterval > 0) {
            stopAutoScroll();
            autoScrollTimer = setInterval(showNextItem, autoScrollInterval);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

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
                if (i === currentGroupIndex) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => {
                    currentIndex = i * itemsPerView;
                    updateCarousel();
                    startAutoScroll();
                });
                indicatorsContainer.appendChild(indicator);
            }
        }

        // Calculate offset
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const offset = -(currentIndex * (100 / itemsPerView));
        carouselTrack.style.transform = `translateX(${offset}%)`;
    }

    function showNextItem() {
        const itemsPerView = getItemsPerView();
        const nextIndex = currentIndex + itemsPerView;

        if (nextIndex < totalItems) {
            currentIndex = nextIndex;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function carouselTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        stopAutoScroll();
    }

    function carouselTouchMove(e) {
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > Math.abs(e.touches[0].clientY - (e.changedTouches[0]?.clientY || e.touches[0].clientY))) {
            e.preventDefault();
        }
    }

    function carouselTouchEnd() {
        const diff = touchStartX - touchEndX;
        const itemsPerView = getItemsPerView();

        if (diff > swipeThreshold) {
            showNextItem();
        } else if (diff < -swipeThreshold) {
            const prevIndex = currentIndex - itemsPerView;
            if (prevIndex >= 0) {
                currentIndex = prevIndex;
            } else {
                const maxIndex = Math.max(0, totalItems - itemsPerView);
                currentIndex = maxIndex;
            }
            updateCarousel();
        }

        touchStartX = 0;
        touchEndX = 0;
        startAutoScroll();
    }

    carouselContainer.addEventListener('touchstart', carouselTouchStart);
    carouselContainer.addEventListener('touchmove', carouselTouchMove);
    carouselContainer.addEventListener('touchend', carouselTouchEnd);

    updateCarousel();
    startAutoScroll();

    return {
        handleResize: () => {
            currentIndex = 0;
            updateCarousel();
            startAutoScroll();
        }
    };
}
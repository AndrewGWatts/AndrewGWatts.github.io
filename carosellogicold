import { isMobile } from "./utils.js";

export function createCarousel(containerId, data, cardGeneratorFunc, autoScrollInterval = 0) {
    const carouselContainer = document.querySelector(`#${containerId}`);
    if (!carouselContainer) {
        console.error(`Carousel container not found: #${containerId}`);
        return null; // Return null if container not found
    }

    const carouselTrack = carouselContainer.querySelector('.projects-grid');
    const prevBtn = carouselContainer.querySelector('.carousel-nav.prev-btn');
    const nextBtn = carouselContainer.querySelector('.carousel-nav.next-btn');
    const indicatorsContainer = carouselContainer.querySelector('.carousel-indicators');

    // Allow carousel to function without nav/indicators if not present in HTML
    // (though they are required by the current index.html structure)
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
    let touchEndX = 0;
    const swipeThreshold = 50;
    let autoScrollTimer;

    if (totalItems === 0) {
        if(hasNav) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            indicatorsContainer.style.display = 'none';
        }
        return null; // No items to carousel
    } else {
        if(hasNav) {
            prevBtn.style.display = 'flex'; // Assuming display flex for centering
            nextBtn.style.display = 'flex';
            indicatorsContainer.style.display = 'flex';
        }
    }

    function startAutoScroll() {
        if (autoScrollInterval > 0) {
            stopAutoScroll(); // Clear any existing timer
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

        // Recalculate indicators based on groups
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = ''; // Clear existing indicators
            for (let i = 0; i < totalGroups; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                const currentGroupIndex = Math.floor(currentIndex / itemsPerView);
                if (i === currentGroupIndex) {
                     indicator.classList.add('active');
                }
                const groupStartIndex = i * itemsPerView;
                indicator.addEventListener('click', () => {
                    currentIndex = groupStartIndex;
                    updateCarousel();
                    startAutoScroll(); // Restart auto-scroll on manual interaction
                });
                indicatorsContainer.appendChild(indicator);
            }
        }

        // Calculate the offset based on the current item's position
        if (carouselItems.length === 0) {
             carouselTrack.style.transform = `translateX(0)`;
             return; // Should be caught earlier, but safety check
         }
        // Ensure currentIndex is within bounds, especially after resize
        if (currentIndex >= totalItems) {
             currentIndex = 0; // Reset if out of bounds
        }
         // Adjust currentIndex if it lands in a partial group that's now beyond the end
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex > maxIndex && totalItems > 0) {
            currentIndex = maxIndex;
        }

        const firstVisibleItem = carouselItems[currentIndex];
        // Ensure firstVisibleItem exists before accessing offsetLeft
        if (firstVisibleItem) {
             const itemWidth = firstVisibleItem.offsetWidth;
             const gap = parseFloat(getComputedStyle(carouselTrack).gap);
             const offset = -(currentIndex * (itemWidth + gap));
             carouselTrack.style.transform = `translateX(${offset}px)`;
        } else {
             // Fallback if somehow the item is not found (shouldn't happen)
             carouselTrack.style.transform = `translateX(0)`;
        }
    }

    function showNextItem() {
        const itemsPerView = getItemsPerView();
        const nextIndex = currentIndex + itemsPerView;

        if (nextIndex < totalItems) {
            currentIndex = nextIndex;
        } else {
            currentIndex = 0; // Wrap around
        }
        updateCarousel();
    }

    function showPrevItem() {
        const itemsPerView = getItemsPerView();
        let prevIndex = currentIndex - itemsPerView;

        if (prevIndex >= 0) {
            currentIndex = prevIndex;
        } else {
             // Wrap around to the start of the last group
             const totalGroups = Math.ceil(totalItems / itemsPerView);
             currentIndex = (totalGroups - 1) * itemsPerView;
             // Ensure we don't go past the end if the last group is partial
            const maxIndex = Math.max(0, totalItems - itemsPerView);
             if (currentIndex > maxIndex && totalItems > 0) {
                 currentIndex = maxIndex;
             } else if (totalItems > 0 && currentIndex < 0) {
                 // Should not happen with the above logic, but as a fallback
                 currentIndex = 0;
             } else if (totalItems === 0) {
                 currentIndex = 0;
             }
        }
        updateCarousel();
    }

     function carouselTouchStart(e) {
         touchStartX = e.touches[0].clientX;
         stopAutoScroll(); // Stop auto-scroll on touch start
     }

     function carouselTouchMove(e) {
         touchEndX = e.touches[0].clientX;
         const diff = touchStartX - touchEndX;
          // Prevent vertical scrolling if horizontal swipe is significant
         if (Math.abs(diff) > Math.abs(e.touches[0].clientY - (e.changedTouches[0]?.clientY || e.touches[0].clientY))) {
             e.preventDefault();
         }
     }

     function carouselTouchEnd() {
         const diff = touchStartX - touchEndX;

         if (diff > swipeThreshold) {
             showNextItem();
         } else if (diff < -swipeThreshold) {
             // For swiping right, we show the previous item if implementing that way
             // Currently, the request implies clicking/swiping leads to NEXT.
             // If previous swipe is desired, uncomment and implement showPrevItem properly.
             showPrevItem(); // Changed to call showPrevItem for right swipe
         }

         touchStartX = 0;
         touchEndX = 0;
         startAutoScroll(); // Restart auto-scroll after touch ends
     }

    // Initial setup
    if (hasNav) {
        prevBtn.addEventListener('click', showPrevItem);
        nextBtn.addEventListener('click', showNextItem);
    }
    carouselContainer.addEventListener('touchstart', carouselTouchStart);
    carouselContainer.addEventListener('touchmove', carouselTouchMove);
    carouselContainer.addEventListener('touchend', carouselTouchEnd);

    updateCarousel(); // Initial render
    startAutoScroll(); // Start auto-scroll on initial load

    // Return an object with a resize handler method
    return {
        handleResize: () => {
            currentIndex = 0; // Reset index on resize
            updateCarousel();
            startAutoScroll(); // Restart auto-scroll on resize
        }
    };
}
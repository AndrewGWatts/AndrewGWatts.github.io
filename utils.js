// Function to check if the screen is mobile size based on CSS media query breakpoint
export function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}
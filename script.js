// Force the browser to clear scroll history and jump to the top on a page refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const fadeText = document.getElementById('fade-text'); // Points to your .fixed-hero container
const topbar = document.querySelector('.topbar');
const page1 = document.querySelector('.page1'); // Matches actual CSS/HTML class '.page1'
const page4 = document.querySelector('.page-4');
const scrollIndicator = document.getElementById('scroll-indicator');

// --- REUSABLE SCROLL CALCULATION FUNCTION ---
function updateScrollDynamics() {
    if (!page1 || !topbar || !fadeText) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const page1Height = page1.offsetHeight;

    /* --- 1. FIXED HERO TEXT TIMELINE (EARLIER FADE OUT) --- */
    const heroStart = page1Height * 0.1; 
    const heroEnd   = page1Height * 0.5; 
    
    let heroProgress = (scrollTop - heroStart) / (heroEnd - heroStart);
    if (heroProgress < 0) heroProgress = 0;
    if (heroProgress > 1) heroProgress = 1;

    fadeText.style.opacity = 1 - heroProgress;

    /* --- TOGGLE POINTER EVENTS --- */
    if (heroProgress >= 1) {
        fadeText.style.pointerEvents = 'none'; 
    } else {
        fadeText.style.pointerEvents = 'auto'; 
    }

    /* --- 2. TOPBAR BACKGROUND TIMELINE (LATER FADE IN) --- */
    const topbarStart = page1Height * 0.4; 
    const topbarDistance = page1Height; 
    
    let topbarProgress = (scrollTop - topbarStart) / topbarDistance;
    if (topbarProgress < 0) topbarProgress = 0;
    if (topbarProgress > 1) topbarProgress = 1;

    /* MODIFIED: Multiplied by 0.5 to cap the maximum opacity ceiling at 50% */
    topbar.style.setProperty('--bg-opacity', topbarProgress * 0.5);

    /* --- 3. SCROLL DOWN INDICATOR DISPLAY MAP LOGIC --- */
    if (page4 && scrollIndicator) {
        const page4Bounds = page4.getBoundingClientRect();
        
        if (page4Bounds.top <= window.innerHeight) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translate(-50%, 15px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translate(-50%, 0)';
        }
    }
}

// Listen for scroll events
window.addEventListener('scroll', updateScrollDynamics);

// Run calculation once immediately on file load to catch page-refresh states
updateScrollDynamics();


/* --- DYNAMIC COMPETITION SWITCH HANDLER --- */
const tabMl = document.getElementById('tab-ml');
const tabUiux = document.getElementById('tab-uiux');
const contentMl = document.getElementById('content-ml');
const contentUiux = document.getElementById('content-uiux');

if (tabMl && tabUiux) {
    tabMl.addEventListener('click', () => {
        tabUiux.classList.remove('active');
        tabMl.classList.add('active');
        contentUiux.classList.remove('active');
        contentMl.classList.add('active');
    });

    tabUiux.addEventListener('click', () => {
        tabMl.classList.remove('active');
        tabUiux.classList.add('active');
        contentMl.classList.remove('active');
        contentUiux.classList.add('active');
    });
}

/* --- INTERSECTION OBSERVER FOR SCROLL REVEALS --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // Force the topbar to animate instantly regardless of scroll position
    if (topbar) {
        topbar.classList.add('reveal');
    }

    // Select all instances of tablet mockups on your page
    const tabletMockups = document.querySelectorAll('.tablet-mock');
    
    // Force the FIRST tablet mockup to animate instantly regardless of scroll position
    if (tabletMockups.length > 0) {
        tabletMockups[0].classList.add('reveal');
    }

    // OPTIMIZED: Retained early boundary trigger for the secondary tablet layout
    const observerOptions = {
        root: null, 
        rootMargin: "0px 0px 150px 0px", 
        threshold: 0.05 
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 1. Queue up standard landing components to track scroll entrance
    const targets = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions, .topbar-logo-lettermark');
    targets.forEach(target => scrollObserver.observe(target));

    // 2. Send ONLY the second tablet mockup (index 1) onward into the scroll observer setup
    if (tabletMockups.length > 1) {
        scrollObserver.observe(tabletMockups[1]);
    }
});
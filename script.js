// Force the browser to clear scroll history and jump to the top on a page refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const fadeText = document.getElementById('fade-text'); // Points to your .fixed-hero container
const topbar = document.querySelector('.topbar');
const page1 = document.querySelector('.page1'); // Matches actual CSS/HTML class '.page1'
const page5 = document.querySelector('.page-5'); // CHANGED: Now references the new trigger section
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
    /* CHANGED: Checks bounds against page5 to hide the indicator at the very bottom */
    if (page5 && scrollIndicator) {
        const page5Bounds = page5.getBoundingClientRect();
        
        if (page5Bounds.top <= window.innerHeight) {
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


/* --- DOM CONTENT READY EVENT WRAPPER --- */
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

    /* --- 1. FIXED: DYNAMIC COMPETITION SWITCH HANDLER MOVED HERE --- */
    const tabMl = document.getElementById('tab-ml');
    const tabUiux = document.getElementById('tab-uiux');
    const contentMl = document.getElementById('content-ml');
    const contentUiux = document.getElementById('content-uiux');

    if (tabMl && tabUiux && contentMl && contentUiux) {
        // Safe Initialization: Ensure Mobile Legends is active on fresh boot
        tabMl.classList.add('active');
        contentMl.classList.add('active');
        tabUiux.classList.remove('active');
        contentUiux.classList.remove('active');

        // Click Event Listeners
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

    /* --- 2. FIXED NAVBAR SCROLL OFFSET INTERCEPTOR --- */
    document.querySelectorAll('.topbar-links a[href^="#"], .hero-actions a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const topbarHeight = document.querySelector('.topbar').offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - topbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- 3. INTERSECTION OBSERVER FOR SCROLL REVEALS --- */
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

    // Queue up standard landing components to track scroll entrance
    const targets = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions, .topbar-logo-lettermark');
    targets.forEach(target => scrollObserver.observe(target));

    /* --- YANG DIUBAH: DAFTARKAN SEMUA TABLET SISA KE OBSERVER --- */
    // Melakukan perulangan mulai dari indeks ke-1 (Tablet ke-2, ke-3, dst.) agar semuanya otomatis memicu class .reveal saat di-scroll
    for (let i = 1; i < tabletMockups.length; i++) {
        scrollObserver.observe(tabletMockups[i]);
    }
});
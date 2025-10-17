/**
 * Main script for Edgar Nii Kpakpo Addo's website.
 * Handles loading reusable components (header/footer) and initializing
 * page-specific JavaScript functionalities.
 */
document.addEventListener("DOMContentLoaded", () => {

    /**
     * Fetches and injects reusable HTML components.
     * @param {string} selector - The CSS selector for the placeholder element.
     * @param {string} url - The path to the HTML component file.
     */
    const loadComponent = async (selector, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
            const data = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = data;
            }
        } catch (error) {
            console.error(`Error loading component:`, error);
        }
    };

    /**
     * Attaches event listeners for the mobile navigation (hamburger) menu.
     */
    const initMobileNav = () => {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (!hamburger || !mobileNav) return;

        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });
    };

    /**
     * Sets the 'active' class on the navigation link corresponding to the current page.
     */
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    /**
     * Initializes the smart scroll-to-top/bottom button.
     */
    const initScrollButton = () => {
        const scrollBtn = document.getElementById('scroll-btn');
        if (!scrollBtn) return;
        const icon = scrollBtn.querySelector('i');
        const footer = document.querySelector('footer');

        window.addEventListener('scroll', () => {
            const isNearBottom = (window.scrollY + window.innerHeight) >= (document.body.scrollHeight - 150);
            scrollBtn.classList.toggle('visible', window.scrollY > 200);

            if (isNearBottom) {
                icon.classList.replace('fa-arrow-down', 'fa-arrow-up');
                scrollBtn.setAttribute('aria-label', 'Scroll to top');
            } else {
                icon.classList.replace('fa-arrow-up', 'fa-arrow-down');
                scrollBtn.setAttribute('aria-label', 'Scroll to bottom');
            }
        }, { passive: true });

        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isUp = icon.classList.contains('fa-arrow-up');
            if (isUp) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                footer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    };
    
    // --- Page-Specific Initializations ---

    const initCarousel = () => {
        const carousel = document.getElementById('hero-carousel');
        if (!carousel) return;

        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slide = i;
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const showSlide = (index) => {
            currentIndex = (index + items.length) % items.length;
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const startAutoSlide = () => {
            stopAutoSlide();
            slideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
        };

        const stopAutoSlide = () => clearInterval(slideInterval);

        carousel.addEventListener('click', (e) => {
            if (e.target.closest('.next')) showSlide(currentIndex + 1);
            else if (e.target.closest('.prev')) showSlide(currentIndex - 1);
            else if (e.target.matches('.dot')) showSlide(parseInt(e.target.dataset.slide));
            else return;
            startAutoSlide();
        });

        startAutoSlide();
    };

    const initBlogFeatures = () => {
        const blogGrid = document.querySelector('.blog-grid');
        const filterControls = document.querySelector('.filter-controls');
        const modal = document.getElementById('blogPostModal');
        if (!blogGrid || !filterControls || !modal) return;

        const modalBody = modal.querySelector('#modal-body-content');
        const closeModalBtn = modal.querySelector('.close');

        filterControls.addEventListener('click', (e) => {
            if (!e.target.matches('.filter-btn')) return;
            filterControls.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            blogGrid.querySelectorAll('.blog-post').forEach(post => {
                const isVisible = filter === 'all' || post.dataset.category === filter;
                post.style.display = isVisible ? '' : 'none';
            });
        });

        blogGrid.addEventListener('click', (e) => {
            const readMoreBtn = e.target.closest('.read-more-btn');
            if (!readMoreBtn) return;
            e.preventDefault();
            
            const post = readMoreBtn.closest('.blog-post');
            const image = post.querySelector('img').cloneNode(true);
            const title = post.querySelector('h2').cloneNode(true);
            const meta = post.querySelector('.post-meta').cloneNode(true);
            const fullContent = post.querySelector('.full-content').cloneNode(true);
            fullContent.style.display = 'block';

            modalBody.innerHTML = '';
            modalBody.append(image, title, meta, fullContent);
            modal.style.display = 'block';
        });

        const closeModalHandler = () => modal.style.display = 'none';
        closeModalBtn.addEventListener('click', closeModalHandler);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModalHandler();
        });
    };

    /**
     * Main initialization function.
     */
    const initializeSite = async () => {
        await Promise.all([
            loadComponent("#header-placeholder", "nav.html"),
            loadComponent("#footer-placeholder", "footer.html")
        ]);

        // Initialize functionalities that depend on the loaded components
        initMobileNav();
        setActiveNavLink();
        initScrollButton();

        // Run scripts for specific pages
        const page = window.location.pathname.split('/').pop();
        if (page === '' || page === 'index.html') {
            initCarousel();
        }
        if (page === 'blog.html') {
            initBlogFeatures();
        }
    };

    initializeSite();
});

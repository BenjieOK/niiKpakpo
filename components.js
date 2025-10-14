document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML components
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                } else {
                    console.error(`Element with selector '${selector}' not found.`);
                    return;
                }
                // After loading the header, re-attach the hamburger menu logic
                if (selector === '#header-placeholder') {
                    attachHamburgerLogic();
                    setActiveNavLink();
                }
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    // Load header and footer from the root directory
    loadComponent("#header-placeholder", "nav.html");
    loadComponent("#footer-placeholder", "footer.html");

    // Function to attach event listeners for the hamburger menu
    const attachHamburgerLogic = () => {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');

        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                const icon = hamburger.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    };
    
    // Function to set the active state on the current page's navigation link
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "block";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML components
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                } else {
                    return;
                }
                // After loading the header, re-attach dependent logic
                if (selector === '#header-placeholder') {
                    attachHamburgerLogic();
                    setActiveNavLink();
                }
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    // Load header and footer
    loadComponent("#header-placeholder", "nav.html");
    loadComponent("#footer-placeholder", "footer.html");

    // Function to attach event listeners for the hamburger menu
    const attachHamburgerLogic = () => {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                const icon = hamburger.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    };
    
    // Function to set the active state on the current page's navigation link
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    // --- NEW: Blog Page Specific Features ---
    function initBlogFeatures() {
        const filterControls = document.querySelector('.filter-controls');
        const readMoreButtons = document.querySelectorAll('.read-more-btn');

        // Exit if these elements aren't on the current page
        if (!filterControls || readMoreButtons.length === 0) {
            return;
        }

        // 1. Blog Post Filtering Logic
        const blogPosts = document.querySelectorAll('.blog-post');
        filterControls.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active button state
                filterControls.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                const filterValue = e.target.getAttribute('data-filter');

                blogPosts.forEach(post => {
                    const postCategory = post.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === postCategory) {
                        post.classList.remove('hidden');
                    } else {
                        post.classList.add('hidden');
                    }
                });
            }
        });

        // 2. "Read More" Modal Logic
        const modal = document.getElementById('blogPostModal');
        const modalBody = document.getElementById('modal-body-content');

        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const post = e.target.closest('.blog-post');
                
                // Clone the necessary content
                const image = post.querySelector('img').cloneNode(true);
                const title = post.querySelector('h2').cloneNode(true);
                const meta = post.querySelector('.post-meta').cloneNode(true);
                const fullContent = post.querySelector('.full-content').cloneNode(true);
                fullContent.style.display = 'block'; // Make sure the hidden content is visible in the modal

                // Clear previous modal content and append new content
                modalBody.innerHTML = '';
                modalBody.appendChild(image);
                modalBody.appendChild(title);
                modalBody.appendChild(meta);
                modalBody.appendChild(fullContent);

                openModal('blogPostModal');
            });
        });
    }

    // Run blog features after a short delay to ensure components are loaded
    setTimeout(initBlogFeatures, 100); 
});

// --- General Modal Functionality ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "block";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML components
    const loadComponent = (selector, url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                } else {
                    return;
                }
                // After loading the header, re-attach dependent logic
                if (selector === '#header-placeholder') {
                    attachHamburgerLogic();
                    setActiveNavLink();
                }
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    // Load header and footer
    loadComponent("#header-placeholder", "nav.html");
    loadComponent("#footer-placeholder", "footer.html");

    // Function to attach event listeners for the hamburger menu
    const attachHamburgerLogic = () => {
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                const icon = hamburger.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    };
    
    // Function to set the active state on the current page's navigation link
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    // --- NEW: Carousel Specific Features (for index.html) ---
    function initCarousel() {
        const carousel = document.getElementById('hero-carousel');
        if (!carousel) return; // Exit if carousel element is not on the page

        const carouselInner = carousel.querySelector('.carousel-inner');
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const nextBtn = carousel.querySelector('.carousel-control.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const dots = carousel.querySelectorAll('.dot');

        let currentIndex = 0;
        let slideInterval;

        const showSlide = (index) => {
            if (index >= carouselItems.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = carouselItems.length - 1;
            } else {
                currentIndex = index;
            }

            carouselInner.style.transform = `translateX(${-currentIndex * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const nextSlide = () => {
            showSlide(currentIndex + 1);
        };

        const startAutoSlide = () => {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };

        const stopAutoSlide = () => {
            clearInterval(slideInterval);
        };

        // Event Listeners
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(currentIndex - 1);
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                stopAutoSlide();
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                showSlide(slideIndex);
                startAutoSlide();
            });
        });

        // Initialize carousel
        showSlide(currentIndex);
        startAutoSlide();
    }

    // --- Blog Page Specific Features ---
    function initBlogFeatures() {
        const filterControls = document.querySelector('.filter-controls');
        const readMoreButtons = document.querySelectorAll('.read-more-btn');

        // Exit if these elements aren't on the current page
        if (!filterControls || readMoreButtons.length === 0) {
            return;
        }

        // 1. Blog Post Filtering Logic
        const blogPosts = document.querySelectorAll('.blog-post');
        filterControls.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active button state
                filterControls.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                const filterValue = e.target.getAttribute('data-filter');

                blogPosts.forEach(post => {
                    const postCategory = post.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === postCategory) {
                        post.classList.remove('hidden');
                    } else {
                        post.classList.add('hidden');
                    }
                });
            }
        });

        // 2. "Read More" Modal Logic
        const modal = document.getElementById('blogPostModal');
        const modalBody = document.getElementById('modal-body-content');

        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const post = e.target.closest('.blog-post');
                
                // Clone the necessary content
                const image = post.querySelector('img').cloneNode(true);
                const title = post.querySelector('h2').cloneNode(true);
                const meta = post.querySelector('.post-meta').cloneNode(true);
                const fullContent = post.querySelector('.full-content').cloneNode(true);
                fullContent.style.display = 'block'; // Make sure the hidden content is visible in the modal

                // Clear previous modal content and append new content
                modalBody.innerHTML = '';
                modalBody.appendChild(image);
                modalBody.appendChild(title);
                modalBody.appendChild(meta);
                modalBody.appendChild(fullContent);

                openModal('blogPostModal');
            });
        });
    }

    // Run page-specific features based on the current page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') {
        initCarousel();
    } else if (currentPage === 'blog.html') {
        initBlogFeatures();
    }
    // For portfolio.html, ensure tab functionality runs if present
    if (currentPage === 'portfolio.html') {
        // Assume openTab function is globally available or added here if needed
        // For now, it's inline in portfolio.html, so it runs on DOMContentLoaded already.
    }


    // Run blog features after a short delay to ensure components are loaded
    setTimeout(initBlogFeatures, 100); 
});

// --- General Modal Functionality ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "block";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
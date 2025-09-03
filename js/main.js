document.addEventListener('DOMContentLoaded', () => {
    // Mobile Detection and Force Mobile Mode
    function detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 1024;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isMobile || (isSmallScreen && isTouchDevice)) {
            document.body.classList.add('force-mobile');
            // Add CSS to force mobile mode
            const style = document.createElement('style');
            style.textContent = `
                .force-mobile .mobile-header { display: flex !important; }
                .force-mobile .theme-toggle-desktop { display: none !important; }
                .force-mobile .sidebar { transform: translateX(-100%) !important; visibility: hidden !important; }
                .force-mobile .content-area { margin-left: 0 !important; width: 100% !important; }
                .force-mobile .two-column-layout { grid-template-columns: 1fr !important; }
                .force-mobile .portfolio-column, .force-mobile .resume-column { max-width: none !important; width: 100% !important; }
                .force-mobile { padding-top: 100px !important; font-size: 18px !important; }
                .force-mobile .mobile-menu-toggle { display: flex !important; width: 48px !important; height: 48px !important; }
                .force-mobile .mobile-header .theme-toggle { width: 48px !important; height: 48px !important; padding: 12px !important; }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Run mobile detection
    detectMobile();
    
    // Re-run on window resize
    window.addEventListener('resize', detectMobile);

    // Theme Toggle Functionality
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icons
    function updateThemeIcons(theme) {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            const span = toggle.querySelector('span');
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                if (span) span.textContent = span.textContent.includes('Mode') ? 'Light Mode' : 'Light';
            } else {
                icon.className = 'fas fa-moon';
                if (span) span.textContent = span.textContent.includes('Mode') ? 'Dark Mode' : 'Dark';
            }
        });
    }
    
    // Initialize theme icons
    updateThemeIcons(savedTheme);
    
    // Global theme toggle function
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    };

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Mobile Menu Functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('overlay');
        body.appendChild(overlay);
    }

    function openMenu() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu(event) {
        event.preventDefault();
        if (sidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking nav links on mobile
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Navigation Active State
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.section');

    function setActiveLink() {
        const scrollPos = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // Portfolio Functionality
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    // Project expansion functionality
    const projectDetailsContainer = document.getElementById('project-details-container');

    function closeAllProjects() {
        document.querySelectorAll('.project-details').forEach(details => {
            details.classList.remove('active');
        });
        projectDetailsContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    portfolioCards.forEach(card => {
        const expandButton = card.querySelector('.expand-button');
        const projectId = card.getAttribute('data-project');
        const projectDetails = document.getElementById(projectId + '-details');
        const cardPreview = card.querySelector('.card-preview');

        function openProject() {
            closeAllProjects();
            projectDetailsContainer.classList.add('active');
            projectDetails.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (expandButton) {
            expandButton.addEventListener('click', openProject);
        }
        cardPreview.addEventListener('click', openProject);
    });

    // Close project details when clicking close button
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeAllProjects);
    });

    // Close project details when clicking outside
    projectDetailsContainer.addEventListener('click', (e) => {
        if (e.target === projectDetailsContainer) {
            closeAllProjects();
        }
    });

    // Handle escape key to close project details
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllProjects();
        }
    });

    // Gallery functionality
    document.querySelectorAll('.project-details').forEach(details => {
        const galleryThumbs = details.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
        const galleryMain = details.querySelector('.gallery-main');

        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all thumbnails
                galleryThumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                if (thumb.classList.contains('video-thumb')) {
                    // Handle video thumbnail click
                    const videoSrc = thumb.getAttribute('data-video');
                    galleryMain.innerHTML = `
                        <div class="video-container active">
                            <iframe src="${videoSrc}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                    `;
                } else {
                    // Handle image thumbnail click
                    galleryMain.innerHTML = `<img src="${thumb.src}" alt="${thumb.alt}">`;
                }
            });
        });
    });

    // Timeline expand/collapse functionality
    const timelineExpand = document.querySelector('.timeline-expand');
    const timeline = document.querySelector('.timeline');
    const timelinePrevious = document.querySelector('.timeline-previous');

    if (timelineExpand) {
        timelineExpand.addEventListener('click', () => {
            timeline.classList.toggle('expanded');
            
            if (timeline.classList.contains('expanded')) {
                // Get the scroll height of the hidden content
                const scrollHeight = timelinePrevious.scrollHeight;
                timelinePrevious.style.height = scrollHeight + 'px';
                timelinePrevious.style.opacity = '1';
            } else {
                timelinePrevious.style.height = '0';
                timelinePrevious.style.opacity = '0';
            }
        });
    }

    // Initialize Masonry for portfolio grid
    const grid = document.querySelector('.portfolio-grid');
    const masonry = new Masonry(grid, {
        itemSelector: '.portfolio-item',
        columnWidth: '.portfolio-item',
        gutter: 24,
        percentPosition: true
    });

    // Initialize Lightbox
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': 'Image %1 of %2'
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Gallery image switching function
function changeMainImage(thumbnail, mainImageId) {
    const mainImage = document.getElementById(mainImageId);
    const thumbnails = thumbnail.parentElement.querySelectorAll('img');
    
    // Update main image source
    mainImage.src = thumbnail.src;
    mainImage.alt = thumbnail.alt;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Enhanced gallery functions for images and videos
function showImage(thumbnail, galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = thumbnail.parentElement.querySelectorAll('img, .video-thumb');
    
    // Create or update image
    galleryMain.innerHTML = `<img src="${thumbnail.src}" alt="${thumbnail.alt}" id="${galleryMainId}-image">`;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function showVideo(galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = galleryMain.parentElement.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
    
    // Create video container
    galleryMain.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/Z2CX5q52qLk" 
                    title="Alan Wake Development Footage" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    galleryMain.parentElement.querySelector('.video-thumb').classList.add('active');
}

function showBulletstormVideo(galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = galleryMain.parentElement.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
    
    // Create video container
    galleryMain.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/zlOyCLIEio4" 
                    title="Bulletstorm Development Footage" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    galleryMain.parentElement.querySelector('.video-thumb').classList.add('active');
}

function showCrookzArtStyleVideo(galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = galleryMain.parentElement.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
    
    // Create video container
    galleryMain.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/Kk9nC8QXtew" 
                    title="Crookz Art Style Discussion" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    
    // Update active thumbnail - find the first video thumb
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    const videoThumbs = galleryMain.parentElement.querySelectorAll('.video-thumb');
    if (videoThumbs.length > 0) {
        videoThumbs[0].classList.add('active');
    }
}

function showCrookzGameplayVideo(galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = galleryMain.parentElement.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
    
    // Create video container
    galleryMain.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/Ii9Lq6V6" 
                    title="Crookz Let's Play Gameplay" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    
    // Update active thumbnail - find the second video thumb
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    const videoThumbs = galleryMain.parentElement.querySelectorAll('.video-thumb');
    if (videoThumbs.length > 1) {
        videoThumbs[1].classList.add('active');
    }
}

function showComancheTrailerVideo(galleryMainId) {
    const galleryMain = document.getElementById(galleryMainId);
    const thumbnails = galleryMain.parentElement.querySelectorAll('.gallery-thumbs img, .gallery-thumbs .video-thumb');
    
    // Create video container
    galleryMain.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/5YP_7qvGSS8" 
                    title="Comanche Release Trailer" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    galleryMain.parentElement.querySelector('.video-thumb').classList.add('active');
}

// Function to color detail section headers based on their text content
function colorDetailHeaders() {
    const headers = document.querySelectorAll('.detail-section h4');
    
    headers.forEach(header => {
        const text = header.textContent.trim();
        
        // Turquoise for Pipeline Development, Technical Implementation, and Hands-On Development
        if (text.includes('Pipeline Development') || text.includes('Technical Implementation') || text.includes('Pipeline Innovation') || text.includes('Hands-On Development')) {
            header.classList.add('turquoise-header');
        }
        // Yellow for Technical Innovation, Project Deliverables, and Project Impact
        else if (text.includes('Technical Innovation') || text.includes('Project Deliverables') || text.includes('Project Impact')) {
            header.classList.add('yellow-header');
        }
        // Pink for Team Leadership, Creative Responsibilities, and Art Direction (default, but explicit)
        else if (text.includes('Team Leadership') || text.includes('Creative Responsibilities') || text.includes('Art Direction') || text.includes('Team Leadership & Production')) {
            header.classList.add('pink-header');
        }
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    colorDetailHeaders();
});

// Also call it when project details are opened (in case content is dynamically loaded)
document.addEventListener('click', (e) => {
    if (e.target.closest('[data-project]')) {
        // Small delay to ensure content is loaded
        setTimeout(colorDetailHeaders, 100);
    }
});
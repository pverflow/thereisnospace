document.addEventListener('DOMContentLoaded', () => {
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
    const filters = document.querySelectorAll('.filter');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    // Filter functionality
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active state of filter buttons
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-filter');
            
            // Apply filtering with animation
            portfolioCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (category === 'all' || card.classList.contains(category)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

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

        expandButton.addEventListener('click', openProject);
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
        const galleryThumbs = details.querySelectorAll('.gallery-thumbs img');
        const mainImage = details.querySelector('.gallery-main img');

        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update main image
                mainImage.src = thumb.src;
                
                // Update active thumbnail
                galleryThumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
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
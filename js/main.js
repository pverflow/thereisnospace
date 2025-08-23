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
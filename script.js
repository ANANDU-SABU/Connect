document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/anandusabu76@gmail.com';
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Hero Carousel Logic
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroIndicators = document.querySelectorAll('.indicator-item');
    let currentHeroIndex = 0;
    const slideInterval = 6000; // 6 seconds to match CSS transition
    let heroAutoSlide;

    const updateHeroCarousel = (index) => {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroIndicators.forEach(ind => ind.classList.remove('active'));

        heroSlides[index].classList.add('active');
        heroIndicators[index].classList.add('active');
        currentHeroIndex = index;
        
        // Reset and trigger progress bar animation by re-adding the class
        const activeBar = heroIndicators[index].querySelector('.progress-bar');
        activeBar.style.animation = 'none';
        activeBar.offsetHeight; /* trigger reflow */
        activeBar.style.animation = null;
    };

    const startHeroAutoSlide = () => {
        heroAutoSlide = setInterval(() => {
            let nextIndex = (currentHeroIndex + 1) % heroSlides.length;
            updateHeroCarousel(nextIndex);
        }, slideInterval);
    };

    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(heroAutoSlide);
            updateHeroCarousel(index);
            startHeroAutoSlide();
        });
    });

    if (heroSlides.length > 0) {
        startHeroAutoSlide();
    }

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.slide-up');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Projects Slider
    const track = document.getElementById('projectsTrack');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const dotsContainer = document.getElementById('sliderDots');

        let currentIndex = 0;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateSlider = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(currentIndex);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentIndex = parseInt(e.target.dataset.index);
                updateSlider(currentIndex);
            });
        });
    }

    // 5. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 6. CV PDF Generation
    const downloadCV = (btnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                const element = document.getElementById('cv-template');
                element.style.display = 'block'; // Temporarily show for capture
                
                const opt = {
                    margin:       10,
                    filename:     'Anandu_Sabu_CV.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                // New Promise-based usage:
                html2pdf().set(opt).from(element).save().then(() => {
                    element.style.display = 'none'; // Hide again
                });
            });
        }
    };

    downloadCV('downloadCV');
    downloadCV('downloadCV-About');

    // 7. LinkedIn Posts in-page + fallback
    const linkedInContainer = document.getElementById('linkedinPosts');
    if (linkedInContainer) {
        const linkedInPosts = [
            { urn: 'urn:li:share:7436071215481569280', label: 'Featured LinkedIn Post' },
            { urn: 'urn:li:ugcPost:7405932138086404096', label: 'LinkedIn Update' },
            { urn: 'urn:li:ugcPost:7396577516217462784', label: 'LinkedIn Update' },
            { urn: 'urn:li:ugcPost:7396568054366760961', label: 'LinkedIn Update' },
            { urn: 'urn:li:share:7386439404548059136', label: 'LinkedIn Share' },
            { urn: 'urn:li:ugcPost:7172611729896460288', label: 'LinkedIn Post' }
        ];

        linkedInContainer.innerHTML = linkedInPosts.map((post, index) => {
            const postUrl = `https://www.linkedin.com/feed/update/${post.urn}/`;
            const embedUrl = `https://www.linkedin.com/embed/feed/update/${post.urn}?collapsed=1`;
            return `
                <article class="linkedin-card glass-card">
                    <h3>${post.label} ${index + 1}</h3>
                    <iframe
                        class="linkedin-embed"
                        src="${embedUrl}"
                        title="Embedded LinkedIn post"
                        loading="lazy"
                        referrerpolicy="strict-origin-when-cross-origin">
                    </iframe>
                    <div class="linkedin-fallback" hidden>
                        <p>Post preview cannot be loaded here. Open it on LinkedIn.</p>
                    </div>
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer">View post</a>
                </article>
            `;
        }).join('');

        const linkedInEmbeds = linkedInContainer.querySelectorAll('.linkedin-embed');
        linkedInEmbeds.forEach((embed) => {
            const card = embed.closest('.linkedin-card');
            const fallback = card ? card.querySelector('.linkedin-fallback') : null;
            if (!card || !fallback) return;

            let loaded = false;
            const showFallback = () => {
                if (loaded) return;
                fallback.hidden = false;
                embed.style.display = 'none';
            };

            embed.addEventListener('load', () => {
                loaded = true;
                fallback.hidden = true;
                embed.style.display = 'block';
            });
            embed.addEventListener('error', showFallback);
            setTimeout(showFallback, 2000);
        });
    }

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formNotice = document.getElementById('contactFormNotice');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = contactForm.querySelector('#contactName');
            const emailInput = contactForm.querySelector('#contactEmail');
            const messageInput = contactForm.querySelector('#contactMessage');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            const subject = encodeURIComponent(`Portfolio contact from ${name || 'Website Visitor'}`);
            const body = encodeURIComponent(
                `Name: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message || 'No message'}`
            );

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            if (formNotice) {
                formNotice.textContent = '';
            }

            try {
                if (CONTACT_ENDPOINT) {
                    const response = await fetch(CONTACT_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            message,
                            _subject: `Portfolio contact from ${name || 'Website Visitor'}`
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Form endpoint request failed');
                    }

                    if (formNotice) {
                        formNotice.textContent = 'Message sent successfully.';
                    }
                    contactForm.reset();
                    return;
                }

                // Safe fallback until a real endpoint is configured.
                window.location.href = `mailto:anandusabu76@gmail.com?subject=${subject}&body=${body}`;
                if (formNotice) {
                    formNotice.textContent = 'Opening your email app to send the message.';
                }
            } catch (error) {
                if (formNotice) {
                    formNotice.textContent = 'Could not send right now. Please try again.';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Email';
                }
            }
        });
    }
});

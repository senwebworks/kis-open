document.addEventListener('DOMContentLoaded', () => {
    // ---- LANGUAGE TOGGLE ----
    const langBtns = document.querySelectorAll('.lang-btn');
    const contentDe = document.querySelectorAll('.content-de');
    const contentEn = document.querySelectorAll('.content-en');

    // Default language is DE based on active class in HTML
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            langBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const selectedLang = btn.getAttribute('data-lang');

            if (selectedLang === 'de') {
                document.documentElement.lang = 'de';
                contentEn.forEach(el => el.style.display = 'none');
                contentDe.forEach(el => {
                    // Check if element is a span or part of inline text
                    if (el.tagName.toLowerCase() === 'span' && !el.classList.contains('process-num')) {
                        el.style.display = 'inline';
                    } else if (el.tagName.toLowerCase() === 'a') {
                        el.style.display = 'inline-flex';
                    } else {
                        el.style.display = 'block';
                    }
                });
            } else {
                document.documentElement.lang = 'en';
                contentDe.forEach(el => el.style.display = 'none');
                contentEn.forEach(el => {
                    if (el.tagName.toLowerCase() === 'span' && !el.classList.contains('process-num')) {
                        el.style.display = 'inline';
                    } else if (el.tagName.toLowerCase() === 'a') {
                        el.style.display = 'inline-flex';
                    } else {
                        el.style.display = 'block';
                    }
                });
            }
        });
    });

    // ---- FOOTER LEGAL SECTION TOGGLE ----
    const legalBtns = document.querySelectorAll('.legal-toggle-btn');
    const legalSections = document.querySelectorAll('.legal-section');

    legalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Toggle logic: if already active, hide it. Otherwise, show it.
            const isActive = btn.classList.contains('active');
            
            // Reset all
            legalBtns.forEach(b => b.classList.remove('active'));
            legalSections.forEach(sec => sec.classList.remove('active'));

            if (!isActive) {
                btn.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            }
        });
    });

    // ---- PORTFOLIO CAROUSEL DRAG TO SCROLL ----
    const slider = document.querySelector('.carousel-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // ---- COOKIE BANNER ----
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 5000); // 5 seconds
    }

    const hideCookieBanner = () => {
        cookieBanner.classList.remove('show');
        localStorage.setItem('cookie_consent', 'true');
    };

    if (cookieAccept) cookieAccept.addEventListener('click', hideCookieBanner);
    if (cookieDecline) cookieDecline.addEventListener('click', hideCookieBanner);

    // ---- FORM MODAL ----
    const formModal = document.getElementById('form-modal');
    const formClose = document.getElementById('form-close');
    const triggerForms = document.querySelectorAll('.trigger-form');
    const projectForm = document.getElementById('project-form');
    const formContent = document.getElementById('form-content');
    const formSuccess = document.getElementById('form-success');
    const formBackdrop = document.querySelector('.form-backdrop');

    const openModal = (e) => {
        if (e) e.preventDefault();
        formModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // prevent bg scrolling
    };

    const closeModal = () => {
        formModal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form after close animation
        setTimeout(() => {
            projectForm.reset();
            formContent.style.display = 'block';
            formSuccess.style.display = 'none';
        }, 500);
    };

    triggerForms.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (formClose) formClose.addEventListener('click', closeModal);
    if (formBackdrop) formBackdrop.addEventListener('click', closeModal);

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission

            // Change button text to indicate loading
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            const originalDe = submitBtn.querySelector('.content-de').innerHTML;
            const originalEn = submitBtn.querySelector('.content-en').innerHTML;
            
            submitBtn.querySelector('.content-de').innerHTML = 'Sende...';
            submitBtn.querySelector('.content-en').innerHTML = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            // Gather form data
            const formData = new FormData(projectForm);

            // Send via FormSubmit AJAX API
            fetch("https://formsubmit.co/ajax/info@kis-open.com", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide form content, show success
                formContent.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Reset button state for next time
                submitBtn.querySelector('.content-de').innerHTML = originalDe;
                submitBtn.querySelector('.content-en').innerHTML = originalEn;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Es gab einen Fehler. Bitte versuchen Sie es später noch einmal. / There was an error. Please try again later.');
                // Reset button on error
                submitBtn.querySelector('.content-de').innerHTML = originalDe;
                submitBtn.querySelector('.content-en').innerHTML = originalEn;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            });
        });
    }
});

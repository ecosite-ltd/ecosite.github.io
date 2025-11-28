// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Contact Form Submission via Formspree
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    // Formspree AJAX requires reCAPTCHA to be disabled
    // Using native form submission instead (more reliable)
    const useAjax = false; // Set to true only if reCAPTCHA is disabled in Formspree settings
    
    if (useAjax) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('Form submitted - starting process...');
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Debug: Log form data
            console.log('Form data being sent:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Show initial status
            formStatus.textContent = '📤 Sending your message...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            formStatus.style.backgroundColor = '#fff3cd';
            formStatus.style.color = '#856404';
            
            try {
                console.log('Sending to Formspree endpoint: https://formspree.io/f/xzzlygnb');
                
                // Submit to Formspree
                const response = await fetch('https://formspree.io/f/xzzlygnb', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Response status:', response.status);
                console.log('Response statusText:', response.statusText);
                console.log('Response ok:', response.ok);
                
                let data;
                try {
                    data = await response.json();
                    console.log('Response data:', JSON.stringify(data, null, 2));
                } catch (jsonError) {
                    console.error('Could not parse JSON response:', jsonError);
                    const text = await response.text();
                    console.log('Response text:', text);
                }
                
                if (response.ok) {
                    // Success
                    console.log('✓ Form submitted successfully!');
                    formStatus.textContent = '✓ Thank you! Your message has been sent successfully. We\'ll be in touch within 24 hours.';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                } else {
                    // Formspree returned an error
                    console.error('Formspree error response:', data);
                    
                    let errorMessage = 'There was a problem sending your message.';
                    
                    if (data && data.errors) {
                        // Show validation errors
                        const errorMessages = data.errors.map(error => error.message || error.field).join(', ');
                        errorMessage = `Validation error: ${errorMessages}`;
                        console.error('Validation errors:', errorMessages);
                    } else if (data && data.error) {
                        errorMessage = data.error;
                    }
                    
                    formStatus.textContent = `✗ ${errorMessage} Please try again or email us directly at contact@ecosite.uk`;
                    formStatus.className = 'form-status error';
                    formStatus.style.display = 'block';
                }
                
            } catch (error) {
                console.error('Form submission exception:', error);
                console.error('Error stack:', error.stack);
                formStatus.textContent = '✗ Network error: ' + error.message + '. Please check your connection and try again, or email us directly at contact@ecosite.uk';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
            
            // Hide status message after 15 seconds (only if success)
            if (formStatus.classList.contains('success')) {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 15000);
            }
        });
    }
    // If useAjax is false, form will submit normally using action/method attributes
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.mission-item, .feature, .benefit-card, .pricing-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Form validation feedback
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value) {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#2d8659';
    });
});

// Pricing card hover effects
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
    });
});

// Console message
console.log('%cNowPV by Ecosite', 'color: #2d8659; font-size: 20px; font-weight: bold;');
console.log('%cAccelerating commercial solar deployment 🌞', 'color: #4a4a4a; font-size: 14px;');

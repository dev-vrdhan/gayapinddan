/**
 * Gaya Pind Daan Website - Main Javascript
 * Handles scroll animations, sticky navigation, mobile menu, and UI enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStickyHeader();
  initBackToTop();
  initMobileMenu();
  initFAQAccordion();
  initMultiStepForm();
  initGalleryFilters();
  initGalleryLightbox();
});

/**
 * Scroll Reveal Animations using IntersectionObserver
 * Mimics Framer Motion transitions smoothly.
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -8% 0px', // triggers slightly before elements enter full view
    threshold: 0.15 // 15% of the element must be visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing to prevent repetitive triggers and improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Sticky Header Logic
 * Adds visual state when user scrolls down.
 */
function initStickyHeader() {
  const header = document.querySelector('.header-main');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Call initially to catch page refreshes at scrolled positions
  handleScroll();
}

/**
 * Back to Top Button Functionality
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const body = document.body;

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent background scrolling when menu is open
    body.classList.toggle('menu-open');
  });

  // Close menu when clicking navigation links
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      body.classList.remove('menu-open');
    });
  });
}

/**
 * FAQ Accordion Toggles
 */
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      
      // Close other active FAQs
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
        }
      });
      
      // Toggle current
      item.classList.toggle('active');
    });
  });
}

/**
 * Multi-Step Booking Form Logic
 */
function initMultiStepForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  const steps = document.querySelectorAll('.form-step');
  const dots = document.querySelectorAll('.step-dot');
  const progressBar = document.querySelector('.step-progress-bar');
  const btnNext = document.querySelectorAll('.btn-next');
  const btnPrev = document.querySelectorAll('.btn-prev');
  const bookingContainer = document.querySelector('.booking-container');
  const successCard = document.getElementById('bookingSuccessCard');
  const whatsappCTA = document.getElementById('whatsappSuccessCTA');
  
  let currentStep = 0;

  // Auto-select ritual from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const selectedRitual = urlParams.get('ritual');
  if (selectedRitual) {
    const ritualSelect = document.getElementById('ritualRequired');
    if (ritualSelect) {
      // Find matching option by value (lowercase hyphenated)
      for (let option of ritualSelect.options) {
        if (option.value.toLowerCase() === selectedRitual.toLowerCase() || 
            option.value.toLowerCase().replace(/\s+/g, '-') === selectedRitual.toLowerCase()) {
          option.selected = true;
          break;
        }
      }
    }
  }

  // Auto-select package from URL query parameter
  const selectedPackage = urlParams.get('package');
  if (selectedPackage) {
    const packageSelect = document.getElementById('packageRequired');
    if (packageSelect) {
      for (let option of packageSelect.options) {
        if (option.value === selectedPackage) {
          option.selected = true;
          break;
        }
      }
    }
  }

  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentStep);
      dot.classList.toggle('completed', index < currentStep);
    });

    // Update progress bar width
    if (progressBar && dots.length > 1) {
      const percentage = (currentStep / (dots.length - 1)) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  function validateStep(stepIndex) {
    const activeStep = steps[stepIndex];
    const inputs = activeStep.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
      // Simple validation
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('is-invalid');
        input.style.borderColor = 'var(--accent-red)';
      } else {
        input.classList.remove('is-invalid');
        input.style.borderColor = '';
        
        // Specific checks
        if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
          isValid = false;
          input.classList.add('is-invalid');
          input.style.borderColor = 'var(--accent-red)';
        }
      }
    });

    return isValid;
  }

  btnNext.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        currentStep++;
        updateSteps();
      }
    });
  });

  btnPrev.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentStep--;
      updateSteps();
    });
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    // Gather form details for WhatsApp text message prefix
    const name = document.getElementById('bookingName').value;
    const phone = document.getElementById('bookingPhone').value;
    const ritual = document.getElementById('ritualRequired').value;
    const date = document.getElementById('preferredDate').value;
    const pkg = document.getElementById('packageRequired') ? document.getElementById('packageRequired').value : '';
    
    // Construct text
    let textMsg = `Pranam Panda Ji, I have submitted a booking request:\nName: ${name}\nPhone: ${phone}\nRitual: ${ritual}\nDate: ${date}`;
    if (pkg) {
      textMsg += `\nPackage Selected: ₹${pkg}`;
    }
    textMsg += `\n\nPlease confirm my slot.`;
    
    const whatsappUrl = `https://wa.me/916207831619?text=${encodeURIComponent(textMsg)}`;
    
    if (whatsappCTA) {
      whatsappCTA.href = whatsappUrl;
    }

    // Show success view
    if (bookingContainer && successCard) {
      bookingContainer.style.display = 'none';
      successCard.style.display = 'block';
      successCard.scrollIntoView({ behavior: 'smooth' });
    }
  });

  updateSteps();
}

/**
 * Gallery Image Category Filter Toggles
 */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all btns
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
          // trigger subtle entry fade animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Custom Lightbox Popup engine
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  if (galleryItems.length === 0) return;

  // Check if lightbox elements already exist, otherwise create them
  let lightbox = document.getElementById('lightboxModal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightboxModal';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="lightbox-nav lightbox-next" aria-label="Next image">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
      </div>
      <div class="lightbox-caption">
        <div class="lightbox-caption-title"></div>
        <div class="lightbox-caption-desc"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-caption-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeIndex = -1;
  const imageList = [];

  // Populate active image list based on current visible gallery items
  function updateVisibleImageList() {
    imageList.length = 0;
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (item.style.display !== 'none' && item.getAttribute('data-lightbox')) {
        imageList.push({
          el: item,
          src: item.getAttribute('data-lightbox'),
          title: item.querySelector('.gallery-item-title')?.textContent || '',
          desc: item.getAttribute('data-desc') || ''
        });
      }
    });
  }

  function showImage(index) {
    if (index < 0 || index >= imageList.length) return;
    activeIndex = index;
    const imgData = imageList[activeIndex];
    
    lightboxImg.src = imgData.src;
    lightboxImg.alt = imgData.title;
    lightboxTitle.textContent = imgData.title;
    lightboxDesc.textContent = imgData.desc;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      updateVisibleImageList();
      const currentSrc = item.getAttribute('data-lightbox');
      const currentIndex = imageList.findIndex(img => img.src === currentSrc);
      if (currentIndex !== -1) {
        showImage(currentIndex);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let prevIndex = activeIndex - 1;
    if (prevIndex < 0) prevIndex = imageList.length - 1;
    showImage(prevIndex);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let nextIndex = activeIndex + 1;
    if (nextIndex >= imageList.length) nextIndex = 0;
    showImage(nextIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}



/**
 * Language Switcher Logic (Google Translate integration)
 */
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,bn',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {
  const langSelects = document.querySelectorAll('.lang-select');
  
  // 1. Sync custom dropdowns with active language on load using polling
  let syncAttempts = 0;
  const syncInterval = setInterval(() => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      clearInterval(syncInterval);
      if (googleSelect.value) {
        langSelects.forEach(s => s.value = googleSelect.value);
      } else {
        const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
        if (match) {
          const lang = match[1].split('/').pop();
          langSelects.forEach(s => s.value = lang);
        }
      }
    } else {
      syncAttempts++;
      if (syncAttempts >= 40) { // Give up after 10 seconds (40 * 250ms)
        clearInterval(syncInterval);
        const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
        if (match) {
          const lang = match[1].split('/').pop();
          langSelects.forEach(s => s.value = lang);
        }
      }
    }
  }, 250);

  // 2. Change event
  langSelects.forEach(select => {
    select.addEventListener('change', function() {
      const selectedLang = this.value;
      
      // Update all custom selectors on page
      langSelects.forEach(s => { if(s !== this) s.value = selectedLang; });

      // If returning to default English, we must clear cookies and reload 
      // because Google Translate widget removes 'en' from its dropdown.
      if (selectedLang === 'en') {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${location.hostname}; path=/;`;
        window.location.reload();
        return;
      }

      // Set cookie to persist for non-English languages
      document.cookie = `googtrans=/en/${selectedLang}; path=/`;
      document.cookie = `googtrans=/en/${selectedLang}; domain=${location.hostname}; path=/`;

      // Trigger Google Translate directly with polling fallback
      let changeAttempts = 0;
      const changeInterval = setInterval(() => {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
          clearInterval(changeInterval);
          googleSelect.value = selectedLang;
          // MUST use {bubbles: true} so React/Angular/Google listeners catch it
          googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
          changeAttempts++;
          if (changeAttempts >= 20) { // Reload fallback if it fails after 5 seconds (20 * 250ms)
            clearInterval(changeInterval);
            window.location.reload();
          }
        }
      }, 250);
    });
  });
});


/**
 * ============================================================================
 * PREMIUM ANIMATIONS & EFFECTS ENGINE
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initRippleEffect();
  initAnimatedCounters();
  initBackgroundParticles();
  initParallax();
});

function initScrollProgress() {
  const container = document.createElement('div');
  container.className = 'scroll-progress-container';
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  container.appendChild(bar);
  document.body.appendChild(container);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    bar.style.width = scrollPercent + '%';
  }, { passive: true });
}

function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.classList.add('btn-ripple');
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      circle.style.left = x + 'px';
      circle.style.top = y + 'px';
      
      const radius = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = radius + 'px';
      circle.style.marginLeft = -(radius / 2) + 'px';
      circle.style.marginTop = -(radius / 2) + 'px';
      
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if(counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'));
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;
        
        const counterInterval = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const currentCount = Math.round(targetValue * (1 - Math.pow(1 - progress, 3))); // Ease out cubic
          
          target.innerText = currentCount + '+';
          
          if (frame === totalFrames) {
            clearInterval(counterInterval);
            target.innerText = targetValue + '+';
          }
        }, frameRate);
        
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function initBackgroundParticles() {
  const hero = document.getElementById('hero');
  if(!hero) return;
  
  const particleCount = 15;
  for(let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    const size = Math.random() * 8 + 4; // 4px to 12px
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's'; // 10s to 25s
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    hero.appendChild(particle);
  }
}

function initParallax() {
  const parallaxSections = document.querySelectorAll('.parallax-bg');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    parallaxSections.forEach(section => {
      const speed = section.getAttribute('data-speed') || 0.4;
      section.style.backgroundPositionY = (scrollPos * speed) + 'px';
    });
  }, { passive: true });
}


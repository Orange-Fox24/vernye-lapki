document.addEventListener('DOMContentLoaded', function() {
  // 1. Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 3. Observer for sections animation
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    observer.observe(section);
  });
  
  // 4. Animate cards on load
  document.querySelectorAll('.card').forEach((card, index) => {
    card.classList.add('animate-item', `delay-${(index % 5) + 1}`);
  });
  
  // 5. Handle donation amount buttons
  document.querySelectorAll('.amount-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const amount = this.getAttribute('data-amount');
      const customAmount = this.closest('.donation-form').querySelector('.custom-amount');
      customAmount.value = amount;
    });
  });
  
  // 6. Handle form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
      
      // Simulate form submission
      setTimeout(() => {
        alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
        this.reset();
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Отправить';
        
        // Close modal if exists
        const modal = this.closest('.modal-overlay');
        if (modal) {
          modal.style.display = 'none';
        }
      }, 1500);
    });
  });
  
  // 7. Handle promotion signup buttons
  document.querySelectorAll('.signup-btn').forEach(button => {
    button.addEventListener('click', function() {
      const promoCard = this.closest('.promotion-card');
      const title = promoCard.querySelector('h3').textContent;
      
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('promoModal').style.display = 'flex';
    });
  });
  
  // 8. Close modal
  document.querySelector('.close-modal')?.addEventListener('click', function() {
    document.getElementById('promoModal').style.display = 'none';
  });
  
  // 9. Filter animals
  document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      document.querySelector('.filter-buttons .active').classList.remove('active');
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      document.querySelectorAll('.animal-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) 
          ? 'block' : 'none';
      });
      
      // Re-animate filtered cards
      document.querySelectorAll('.animal-card').forEach((card, index) => {
        if (card.style.display !== 'none') {
          card.classList.remove('animate-item');
          void card.offsetWidth; // Trigger reflow
          card.classList.add('animate-item', `delay-${(index % 5) + 1}`);
        }
      });
    });
  });
  
  // 10. Store original button texts
  document.querySelectorAll('form button[type="submit"]').forEach(btn => {
    btn.dataset.originalText = btn.textContent;
  });
  
  // 11. Enhanced Carousel with larger height
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    carousel.appendChild(dotsContainer);

    let currentIndex = 0;
    const slideCount = slides.length;
    let visibleSlides = window.innerWidth <= 768 ? 1 : 3;
    let autoSlideInterval;

    // Create dots indicators
    function createDots() {
      dotsContainer.innerHTML = '';
      const dotCount = Math.ceil(slideCount / visibleSlides);
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i * visibleSlides;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Update dots state
    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      const activeDotIndex = Math.floor(currentIndex / visibleSlides);
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDotIndex);
      });
    }

    // Normalize slide heights
    function normalizeHeights() {
      let maxHeight = 0;
      
      // Find max height
      slides.forEach(slide => {
        const slideHeight = slide.offsetHeight;
        if (slideHeight > maxHeight) maxHeight = slideHeight;
      });
      
      // Apply to track
      track.style.height = `${maxHeight}px`;
    }

    // Initialize slides
    function initSlides() {
      slides.forEach(slide => {
        slide.style.flex = `0 0 ${100 / visibleSlides}%`;
      });
      
      createDots();
      normalizeHeights();
    }

    // Update carousel position
    function updateCarousel() {
      const offset = -currentIndex * (100 / visibleSlides);
      track.style.transform = `translateX(${offset}%)`;
      
      // Update buttons state
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= slideCount - visibleSlides;
      
      updateDots();
    }

    // Start auto sliding
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        if (currentIndex >= slideCount - visibleSlides) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        updateCarousel();
      }, 5000);
    }

    // Stop auto sliding
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Next slide
    nextBtn.addEventListener('click', function() {
      stopAutoSlide();
      if (currentIndex < slideCount - visibleSlides) {
        currentIndex++;
        updateCarousel();
      }
      startAutoSlide();
    });

    // Previous slide
    prevBtn.addEventListener('click', function() {
      stopAutoSlide();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
      startAutoSlide();
    });

    // Handle window resize
    function handleResize() {
      const newVisibleSlides = window.innerWidth <= 768 ? 1 : 3;
      
      if (newVisibleSlides !== visibleSlides) {
        visibleSlides = newVisibleSlides;
        currentIndex = Math.min(currentIndex, slideCount - visibleSlides);
        initSlides();
        updateCarousel();
      }
      
      normalizeHeights();
    }

    // Initialize carousel
    initSlides();
    updateCarousel();
    startAutoSlide();
    
    // Pause auto slide on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    window.addEventListener('resize', handleResize);
    
    // Also normalize heights when images load
    document.querySelectorAll('.carousel-slide img').forEach(img => {
      img.addEventListener('load', normalizeHeights);
    });
  }
});
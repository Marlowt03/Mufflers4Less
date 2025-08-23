/*
 * JavaScript for the Mufflers For Less website.
 *
 * Currently this script powers the gallery lightbox on the
 * gallery page and handles simple interactive behaviours
 * like toggling the navigation on smaller screens. It may
 * be extended in the future to integrate the new header
 * video or handle form submissions.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Lightbox functionality for grouped gallery images
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const prevArrow = document.querySelector('.lightbox-prev');
  const nextArrow = document.querySelector('.lightbox-next');

  // Variables to hold currently active group and index
  let currentGroup = [];
  let currentIndex = 0;

  function openLightbox(groupImages, caption) {
    currentGroup = groupImages;
    currentIndex = 0;
    updateLightbox(caption);
    lightbox.style.display = 'flex';
  }

  function updateLightbox(captionOverride) {
    if (!currentGroup || currentGroup.length === 0) return;
    const src = currentGroup[currentIndex];
    lightboxImg.src = src;
    if (lightboxCaption) {
      // Use provided caption override if available, otherwise fallback to filename
      lightboxCaption.textContent = captionOverride || '';
    }
  }

  if (galleryItems && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const groupAttr = item.getAttribute('data-group-images');
        const caption = item.getAttribute('data-caption');
        if (groupAttr) {
          const images = groupAttr.split(',').map(str => str.trim());
          openLightbox(images, caption);
        }
      });
    });

    // Arrow navigation
    function showPrev() {
      if (currentGroup.length > 0) {
        currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
        updateLightbox(lightboxCaption.textContent);
      }
    }
    function showNext() {
      if (currentGroup.length > 0) {
        currentIndex = (currentIndex + 1) % currentGroup.length;
        updateLightbox(lightboxCaption.textContent);
      }
    }
    if (prevArrow) {
      prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
      });
    }
    if (nextArrow) {
      nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
      });
    }

    // Close button
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        if (lightboxCaption) lightboxCaption.textContent = '';
        currentGroup = [];
        currentIndex = 0;
      });
    }

    // Close lightbox on overlay click (outside content and arrows)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        if (lightboxCaption) lightboxCaption.textContent = '';
        currentGroup = [];
        currentIndex = 0;
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        if (lightboxCaption) lightboxCaption.textContent = '';
        currentGroup = [];
        currentIndex = 0;
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
  }

  // Reviews slider functionality: show one review at a time with prev/next buttons and auto cycling
  const reviewSlides = document.querySelectorAll('.review-slide');
  const prevButton = document.querySelector('.review-prev');
  const nextButton = document.querySelector('.review-next');
  let reviewIndex = 0;

  function showReview(index) {
    reviewSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  function nextReview() {
    reviewIndex = (reviewIndex + 1) % reviewSlides.length;
    showReview(reviewIndex);
  }
  function prevReview() {
    reviewIndex = (reviewIndex - 1 + reviewSlides.length) % reviewSlides.length;
    showReview(reviewIndex);
  }
  if (prevButton && nextButton && reviewSlides.length > 0) {
    prevButton.addEventListener('click', prevReview);
    nextButton.addEventListener('click', nextReview);
    showReview(reviewIndex);
    // Auto‑cycle every 6 seconds
    setInterval(nextReview, 6000);
  }

  // David Challenge carousel functionality
  const davidMain = document.getElementById('david-main-img');
  const davidThumbs = document.querySelectorAll('.david-carousel .thumbnails img');
  if (davidMain && davidThumbs.length > 0) {
    const davidImages = Array.from(davidThumbs).map(img => img.getAttribute('src'));
    let dIndex = 0;
    let davidInterval;
    function setDavidImage(index) {
      dIndex = index % davidImages.length;
      davidMain.src = davidImages[dIndex];
      davidThumbs.forEach((thumb, i) => {
        if (i === dIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }
    function startDavidCycle() {
      clearInterval(davidInterval);
      davidInterval = setInterval(() => {
        setDavidImage((dIndex + 1) % davidImages.length);
      }, 4000);
    }
    davidThumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => {
        setDavidImage(i);
        startDavidCycle();
      });
    });
    setDavidImage(0);
    startDavidCycle();
  }

  // Simple mailto submission for contact forms (home and contact page)
  function setupContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = encodeURIComponent(formData.get('name') || '');
      const phone = encodeURIComponent(formData.get('phone') || '');
      const email = encodeURIComponent(formData.get('email') || '');
      const message = encodeURIComponent(formData.get('message') || '');
      const body = `Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AMessage: ${message}`;
      const mailtoLink = `mailto:treyven@marlow.media?subject=Mufflers%20For%20Less%20Contact&body=${body}`;
      window.location.href = mailtoLink;
      // Optionally clear the form after generating the mail link
      form.reset();
    });
  }

  setupContactForm('home-contact-form');
  setupContactForm('contact-form');
  setupContactForm('contact-form');
});
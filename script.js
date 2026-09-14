/**
 * ==========================================================================
 * MAISON EIRENE — VANILLA JAVASCRIPT
 * Interactions, Navigation, Galerie Masonry, Lightbox & Conversion
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. GESTION DU HEADER AU SCROLL ---
  const header = document.getElementById('site-header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- 2. MENU MOBILE TIROIR (DRAWER) ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMobileMenu);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fermer le tiroir avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --- 3. DÉFILEMENT FLUIDE AVEC DÉCALAGE DU HEADER ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. NAVIGATION ACTIVE AU DÉFILEMENT (SPY) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // --- 6. FILTRAGE DE LA GALERIE MASONRY (DÉSACTIVÉ - TOUTES LES PHOTOS VISIBLES) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    const galleryItems = document.querySelectorAll('.masonry-item');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const filterValue = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || filterValue === itemCategory) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 7. LIGHTBOX PLEIN ÉCRAN INTERACTIVE ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const triggers = Array.from(document.querySelectorAll('.gallery-lightbox-trigger'));
  let currentGalleryIndex = 0;

  // Création du jeu de données des images
  const galleryData = triggers.map((trigger, idx) => ({
    src: trigger.getAttribute('href'),
    caption: trigger.getAttribute('data-caption') || '',
    index: idx
  }));

  let currentLightboxDataset = galleryData;

  const updateLightboxContent = (index) => {
    if (!currentLightboxDataset[index]) return;
    currentGalleryIndex = index;
    const data = currentLightboxDataset[index];

    lightboxImg.src = data.src;
    lightboxImg.alt = data.caption || 'Maison Eirene';
    if (lightboxCaption) lightboxCaption.textContent = '';
    if (lightboxCounter) lightboxCounter.textContent = '';
  };

  const openLightbox = (index = 0, dataset = galleryData) => {
    currentLightboxDataset = dataset;
    updateLightboxContent(index);
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    const nextIndex = (currentGalleryIndex + 1) % currentLightboxDataset.length;
    updateLightboxContent(nextIndex);
  };

  const showPrevImage = () => {
    const prevIndex = (currentGalleryIndex - 1 + currentLightboxDataset.length) % currentLightboxDataset.length;
    updateLightboxContent(prevIndex);
  };

  // Écouteurs de clics sur les images
  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index, galleryData);
    });
  });

  // --- 7b. GESTION DU DROPDOWN 4 SUITES & LIGHTBOX DÉDIÉE (OPTION A) ---
  const suitesData = {
    1: [
      {
        src: 'images/suites/suite-1-chambre-lit-double.webp',
        caption: 'Suite 1 — Chambre lumineuse avec grand lit, tête de lit baldaquin bleue et boiseries artisanales'
      },
      {
        src: 'images/suites/suite-1-chambre-vue-baie.webp',
        caption: 'Suite 1 — Perspective lumineuse vers la baie vitrée, voilages et télévision écran plat'
      },
      {
        src: 'images/suites/suite-1-salle-de-bain-turquoise.webp',
        caption: 'Suite 1 — Salle de bain privative bleu turquoise avec douche à l’italienne et vasque artisanale'
      },
      {
        src: 'images/suites/suite-1-chambre-fauteuil-bascule.webp',
        caption: 'Suite 1 — Espace détente avec fauteuil à bascule en fer forgé bleu et décoration raffinée'
      }
    ],
    2: [
      {
        src: 'images/suites/suite-2-chambre-lit-double.webp',
        caption: 'Suite 2 — Chambre traditionnelle avec grand lit double sur socle blanc, voûte et console artisanale'
      },
      {
        src: 'images/suites/suite-2-salle-de-bain-jaune.webp',
        caption: 'Suite 2 — Salle de bain privative aux tonalités chaleureuses, vasque artisanale et douche'
      },
      {
        src: 'images/suites/suite-2-chambre-fenetre-coffre.webp',
        caption: 'Suite 2 — Vue vers la fenêtre, télévision écran plat, climatisation et coffre en bois sculpté'
      }
    ],
    3: [
      {
        src: 'images/suites/suite-3-chambre-faience-lit.webp',
        caption: 'Suite 3 — Chambre avec grand lit, tête de lit en mosaïque artisanale, voûte blanche et rideaux jaunes'
      },
      {
        src: 'images/suites/suite-3-chambre-arche-bureau.webp',
        caption: 'Suite 3 — Espace chambre avec arche traditionnelle, bureau jaune et boiseries peintes'
      },
      {
        src: 'images/suites/suite-3-salle-de-bain-turquoise.webp',
        caption: 'Suite 3 — Salle de bain privative bleu turquoise, miroir en mosaïque, vasque artisanale et douche'
      }
    ],
    4: [
      {
        src: 'images/suites/suite-4-chambre-lit-baldaquin.webp',
        caption: 'Suite 4 — Lit à baldaquin en fer forgé avec voilages blancs, rideaux traditionnels et atmosphère intime'
      },
      {
        src: 'images/suites/suite-4-chambre-commode-voute.webp',
        caption: 'Suite 4 — Perspective sous voûte blanche, commode artisanale peinte et porte bleue traditionnelle'
      },
      {
        src: 'images/suites/suite-4-salle-de-bain-turquoise.webp',
        caption: 'Suite 4 — Salle de bain privative tadelakt turquoise, miroir mosaïque et vasque artisanale'
      }
    ]
  };

  // --- 7c. GESTION DU DROPDOWN 2 CHAMBRES & LIGHTBOX DÉDIÉE ---
  const chambresData = {
    1: [
      {
        src: 'images/chambres/chambre-1-vue-ensemble-margoum.webp',
        caption: 'Chambre 1 — Vue d’ensemble avec grand lit rouge, tapis margoum multicolore, poterie traditionnelle et voilages'
      },
      {
        src: 'images/chambres/chambre-1-porte-bleue-arche.webp',
        caption: 'Chambre 1 — Perspective lumineuse vers la porte bleue traditionnelle, l’arche et les voilages artisanaux'
      },
      {
        src: 'images/chambres/chambre-1-lit-double-tapis.webp',
        caption: 'Chambre 1 — Grand lit double, tête de lit en nattage artisanal, banquette traditionnelle et tapis margoum'
      }
    ],
    2: [
      {
        src: 'images/chambres/chambre-2-lit-fer-forge-applique.webp',
        caption: 'Chambre 2 — Grand lit double en fer forgé artisanal, chevets lumineux et applique orientale ajourée'
      },
      {
        src: 'images/chambres/chambre-2-chambre-rideaux-jaunes.webp',
        caption: 'Chambre 2 — Chambre sous voûte blanche, lit fer forgé et fenêtres aux rideaux jaunes chaleureux'
      },
      {
        src: 'images/chambres/chambre-2-commode-chaises-fer.webp',
        caption: 'Chambre 2 — Vue d’ensemble avec commode traditionnelle peinte et chaises en fer forgé'
      }
    ]
  };

  const btnSuitesDropdown = document.getElementById('btn-suites-dropdown');
  const btnSuitesDropdownText = document.getElementById('btn-suites-dropdown-text');
  const suitesDropdownMenu = document.getElementById('suites-dropdown-menu');

  const btnChambresDropdown = document.getElementById('btn-chambres-dropdown');
  const btnChambresDropdownText = document.getElementById('btn-chambres-dropdown-text');
  const chambresDropdownMenu = document.getElementById('chambres-dropdown-menu');

  const showToast = (message) => {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3500);
  };

  let toggleChambresDropdown = null;

  if (btnSuitesDropdown && suitesDropdownMenu) {
    const toggleDropdown = (show) => {
      const isOpen = show !== undefined ? show : !suitesDropdownMenu.classList.contains('active');
      suitesDropdownMenu.classList.toggle('active', isOpen);
      btnSuitesDropdown.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (btnSuitesDropdownText) {
        btnSuitesDropdownText.textContent = isOpen ? 'Fermer la liste des suites' : 'Découvrir nos 4 suites';
      }

      if (isOpen && toggleChambresDropdown) {
        toggleChambresDropdown(false);
      }

      if (isOpen) {
        setTimeout(() => {
          suitesDropdownMenu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    };

    btnSuitesDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    suitesDropdownMenu.querySelectorAll('.suites-dropdown-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const suiteId = item.getAttribute('data-suite');
        if (!suiteId) return;

        if (suitesData[suiteId] && suitesData[suiteId].length > 0) {
          openLightbox(0, suitesData[suiteId]);
        } else {
          showToast(`Les photographies de la Suite ${suiteId} seront disponibles très prochainement.`);
        }
      });
    });

    document.addEventListener('click', () => {
      if (suitesDropdownMenu.classList.contains('active')) {
        toggleDropdown(false);
      }
    });
  }

  if (btnChambresDropdown && chambresDropdownMenu) {
    toggleChambresDropdown = (show) => {
      const isOpen = show !== undefined ? show : !chambresDropdownMenu.classList.contains('active');
      chambresDropdownMenu.classList.toggle('active', isOpen);
      btnChambresDropdown.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (btnChambresDropdownText) {
        btnChambresDropdownText.textContent = isOpen ? 'Fermer la liste des chambres' : 'Découvrir nos 2 chambres';
      }

      if (isOpen && suitesDropdownMenu && suitesDropdownMenu.classList.contains('active')) {
        suitesDropdownMenu.classList.remove('active');
        btnSuitesDropdown.setAttribute('aria-expanded', 'false');
        if (btnSuitesDropdownText) btnSuitesDropdownText.textContent = 'Découvrir nos 4 suites';
      }

      if (isOpen) {
        setTimeout(() => {
          chambresDropdownMenu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    };

    btnChambresDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChambresDropdown();
    });

    chambresDropdownMenu.querySelectorAll('.chambres-dropdown-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const chambreId = item.getAttribute('data-chambre');
        if (!chambreId) return;

        if (chambresData[chambreId] && chambresData[chambreId].length > 0) {
          openLightbox(0, chambresData[chambreId]);
        } else {
          showToast(`Les photographies de la Chambre ${chambreId} seront disponibles très prochainement.`);
        }
      });
    });

    document.addEventListener('click', () => {
      if (chambresDropdownMenu.classList.contains('active')) {
        toggleChambresDropdown(false);
      }
    });
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Support du swipe tactile sur mobile pour la lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage(); // Balayage vers la gauche -> image suivante
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage(); // Balayage vers la droite -> image précédente
    }
  };

  // --- 8. ANIMATIONS AU DÉFILEMENT (REVEAL ON SCROLL) ---
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback si IntersectionObserver n'est pas supporté
    reveals.forEach(el => el.classList.add('is-revealed'));
  }

  // --- 9. SYNCHRONISATION AUTOMATIQUE DU CALENDRIER ULTRA-RAPIDE (PC & MOBILE) ---
  const calIframe = document.querySelector('.calendar-container iframe');
  const calendarSection = document.getElementById('disponibilites');

  if (calIframe) {
    const baseUrl = "https://calendar.google.com/calendar/embed?src=86620401495363e7910e49bc1c192d941731e293c939839159724fa099c1f2a1%40group.calendar.google.com&ctz=Africa%2FTunis&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=1&showTabs=1&showCalendars=0&showTz=0";
    let lastRefreshTime = Date.now();
    let userInteractingWithIframe = false;
    let lastInteractionTime = 0;

    const refreshCalendar = (force = false) => {
      const isActivelyBrowsing = userInteractingWithIframe && (Date.now() - lastInteractionTime < 60000);
      if (isActivelyBrowsing && !force) {
        return;
      }
      calIframe.src = baseUrl + '&_t=' + Date.now();
      lastRefreshTime = Date.now();
    };

    // Détection précise si l'utilisateur clique/interagit à l'intérieur de l'iframe (ex: navigation vers un autre mois)
    window.addEventListener('blur', () => {
      if (document.activeElement === calIframe) {
        userInteractingWithIframe = true;
        lastInteractionTime = Date.now();
      }
    });

    // 1. DÉTECTION DU DÉFILEMENT VERS LE CALENDRIER (SPÉCIAL MOBILE)
    // Dès que le visiteur fait défiler la page jusqu'au calendrier, celui-ci se synchronise immédiatement
    if ('IntersectionObserver' in window && calendarSection) {
      const calendarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const elapsed = Date.now() - lastRefreshTime;
            if (elapsed > 5000) {
              userInteractingWithIframe = false;
              refreshCalendar();
            }
          }
        });
      }, { threshold: 0.15 });
      calendarObserver.observe(calendarSection);
    }

    // 2. RECHARGE IMMÉDIATE AU RETOUR SUR LE SITE (PC & MOBILE)
    // Dès que vous quittez Google Agenda et revenez sur le site, actualisation instantanée !
    const handleReturn = () => {
      const elapsed = Date.now() - lastRefreshTime;
      if (elapsed > 500) {
        userInteractingWithIframe = false;
        refreshCalendar(true);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleReturn();
      }
    });

    window.addEventListener('focus', handleReturn);

    window.addEventListener('pageshow', () => {
      handleReturn();
    });

    // 3. RECHARGE PÉRIODIQUE ULTRA-RAPIDE (toutes les 15 secondes)
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshCalendar();
      }
    }, 15000);
  }
});



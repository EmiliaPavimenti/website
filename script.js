document.addEventListener('DOMContentLoaded', function() {
    
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const header = document.getElementById('main-header');

    // 1. Gestione Menu Hamburger
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Cambia icona
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Gestione Dropdown su mobile
    const dropdowns = document.querySelectorAll('.nav-links .dropdown > a');
    
    dropdowns.forEach(dropdownAnchor => {
        dropdownAnchor.addEventListener('click', function(e) {
            // Funziona solo se il menu mobile è visibile
            if (window.getComputedStyle(menuToggle).display !== 'none') {
                const parentLi = this.parentElement;
                
                // Previene la navigazione del link principale "Pavimentazioni"
                if(this.getAttribute('href') === 'pavimentazioni.html' || this.getAttribute('href') === '#') {
                     e.preventDefault(); 
                }
               
                parentLi.classList.toggle('active');
            }
        });
    });

    // 3. Navbar Sticky
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // 4. Gestione link pagina contatti con oggetto (bonus)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const oggetto = urlParams.get('oggetto');
        if (oggetto) {
            const subjectInput = document.getElementById('subject');
            if (subjectInput) {
                subjectInput.value = oggetto;
            }
        }
    } catch (error) {
        // Ignora
    }
    
    // 5. Effetto Fade-in allo scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // --- INIZIO BLOCCO LIGHTBOX (Versione con navigazione) ---

    const gallerySections = document.querySelectorAll('.service-gallery');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryImages = []; // Array per le immagini della galleria corrente
    let currentImageIndex = 0;     // Indice dell'immagine visualizzata

    if (gallerySections.length > 0 && lightboxOverlay) {

        gallerySections.forEach(gallery => {
            const images = gallery.querySelectorAll('img');
            
            images.forEach((img, index) => {
                img.addEventListener('click', function() {
                    // 1. Popola l'array solo con le immagini di QUESTA galleria
                    currentGalleryImages = Array.from(images);
                    // 2. Imposta l'indice dell'immagine cliccata
                    currentImageIndex = index;
                    // 3. Mostra l'immagine
                    showImage(currentImageIndex);
                });
            });
        });

        // Funzione per mostrare l'immagine e aggiornare i bottoni
        function showImage(index) {
            if (index < 0 || index >= currentGalleryImages.length) {
                return; // Esce se l'indice non è valido
            }
            // Aggiorna l'immagine e l'indice
            currentImageIndex = index;
            lightboxImage.setAttribute('src', currentGalleryImages[index].getAttribute('src'));
            
            // Mostra la lightbox
            lightboxOverlay.style.display = 'flex';

            // Aggiorna i bottoni di navigazione
            updateNavButtons();
        }

        // Funzione per mostrare/nascondere le frecce
        function updateNavButtons() {
            // Nascondi 'Prev' se è la prima immagine
            if (currentImageIndex === 0) {
                lightboxPrev.classList.add('hidden');
            } else {
                lightboxPrev.classList.remove('hidden');
            }

            // Nascondi 'Next' se è l'ultima immagine
            if (currentImageIndex === currentGalleryImages.length - 1) {
                lightboxNext.classList.add('hidden');
            } else {
                lightboxNext.classList.remove('hidden');
            }
        }

        // Event listener per le frecce
        lightboxPrev.addEventListener('click', () => {
            showImage(currentImageIndex - 1);
        });

        lightboxNext.addEventListener('click', () => {
            showImage(currentImageIndex + 1);
        });

        // Funzione per chiudere la lightbox
        function closeLightbox() {
            lightboxOverlay.style.display = 'none';
            lightboxImage.setAttribute('src', ''); 
            currentGalleryImages = []; // Svuota l'array
        }

        // Chiudi cliccando sulla 'X'
        lightboxClose.addEventListener('click', closeLightbox);

        // Chiudi cliccando sullo sfondo (overlay)
        lightboxOverlay.addEventListener('click', function(e) {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }
    // --- FINE BLOCCO LIGHTBOX --- 
});
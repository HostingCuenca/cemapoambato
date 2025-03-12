// src/components/home/HeroSlider.js o src/scripts/HeroSlider.js

export function initHeroSlider() {
    // Variables para controlar slides
    const heroSlides = document.querySelectorAll('.hero-slide');
    const backgroundSlides = document.querySelectorAll('.slide');
    const heroDots = document.querySelectorAll('.hero-dot');

    if (!heroSlides.length || !backgroundSlides.length || !heroDots.length) {
        console.warn('Hero slider elements not found');
        return;
    }

    let currentSlideIndex = 0;
    let slideInterval;
    let isTransitioning = false;
    let isHovered = false;

    // Iniciar contador de estadísticas cuando están visibles
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    try {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    statsObserver.disconnect();
                }
            });
        }, observerOptions);

        const statsContainer = document.querySelector('.stats-grid');
        if (statsContainer) {
            statsObserver.observe(statsContainer);
        }
    } catch (e) {
        console.warn('IntersectionObserver not supported, falling back', e);
        // Fallback si IntersectionObserver no está disponible
        startCounters();
    }

    // Función para animar contadores
    function startCounters() {
        const counters = document.querySelectorAll('.count-up');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // duración en ms
            const step = target / (duration / 30); // 30ms por paso
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(interval);
                } else {
                    counter.textContent = Math.floor(current);
                }
            };

            const interval = setInterval(updateCounter, 30);
        });
    }

    // Función para mostrar un slide específico
    function showSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Ocultar todos los slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
        });

        backgroundSlides.forEach(slide => {
            slide.classList.remove('active');
        });

        heroDots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Mostrar el slide actual
        currentSlideIndex = index;
        heroSlides[index].classList.add('active');
        backgroundSlides[index].classList.add('active');
        heroDots[index].classList.add('active');

        // Permitir nueva transición después de un tiempo
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        if (isHovered) return;
        const newIndex = (currentSlideIndex + 1) % heroSlides.length;
        showSlide(newIndex);
    }

    // Establecer eventos para los dots
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            clearInterval(slideInterval);
            showSlide(index);
            startSlideInterval();
        });
    });

    // Detectar si el usuario está interactuando con el slider
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
        heroContent.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        heroContent.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    }

    // Iniciar intervalo de cambio de slides
    function startSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 8000); // Cambiar cada 8 segundos
    }

    // Control táctil para dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;

    const heroSection = document.querySelector('section');

    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        if (isTransitioning) return;

        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe a la izquierda - siguiente slide
            clearInterval(slideInterval);
            const newIndex = (currentSlideIndex + 1) % heroSlides.length;
            showSlide(newIndex);
            startSlideInterval();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe a la derecha - slide anterior
            clearInterval(slideInterval);
            const newIndex = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length;
            showSlide(newIndex);
            startSlideInterval();
        }
    }

    // Iniciar carrusel
    startSlideInterval();

    // Reiniciar el slider si la ventana cambia de tamaño
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            showSlide(currentSlideIndex);
        }, 250);
    });
}
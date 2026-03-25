// ENHANCED REVENUE REACH - FULLY FIXED VERSION
console.log('🚀 Script loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired!');

    // --- Blue Constellation Network (Original) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        console.log('✅ Canvas found, initializing particles...');
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Particle class for constellation effect
        class Particle {
            constructor() {
                // Random starting position
                this.x = Math.random() * width;
                this.y = Math.random() * height;

                // Ambient drift velocity (slow, constant motion)
                this.baseVx = (Math.random() - 0.5) * 0.3;
                this.baseVy = (Math.random() - 0.5) * 0.3;

                // Current velocity (includes repulse forces)
                this.vx = this.baseVx;
                this.vy = this.baseVy;

                // Visual properties - PURE BLUE
                this.size = Math.random() * 1.2 + 0.8;
                this.opacity = Math.random() * 0.4 + 0.3;
                this.color = `rgba(92, 36, 255, ${this.opacity})`;
            }

            update(mouseX, mouseY) {
                // Reset velocity to base ambient drift
                this.vx = this.baseVx;
                this.vy = this.baseVy;

                // Repulse from cursor with stronger force
                if (mouseX !== null && mouseY !== null) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const repulseRadius = 150;

                    if (dist < repulseRadius && dist > 0) {
                        // Exponential force for more dramatic repulse
                        const force = Math.pow((repulseRadius - dist) / repulseRadius, 2) * 8;
                        this.vx += (dx / dist) * force;
                        this.vy += (dy / dist) * force;
                    }
                }

                // Apply velocity
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen edges for continuous flow
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) this.y = height + 10;
                if (this.y > height + 10) this.y = -10;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles with dynamic density
        function initParticles() {
            particles = [];
            // Higher density: roughly 1 particle per 4000px (approx 500 on 1080p)
            const particleCount = Math.floor((width * height) / 4000);

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
            console.log(`✨ Initialized ${particles.length} particles`);
        }

        // Resize handler
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight; // Match viewport for fixed background
            console.log(`📐 Canvas resized to ${width}x${height}`);
            initParticles();
        }

        // Animation loop
        function animateHero() {
            ctx.clearRect(0, 0, width, height);

            // Update all particles
            particles.forEach(p => {
                p.update(mouse.x, mouse.y);
            });

            // Draw dynamic connections that break and reform
            particles.forEach((p, i) => {
                particles.forEach((p2, j) => {
                    if (i >= j) return; // Avoid duplicates

                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxConnectionDist = 150; // Increased reach

                    // Draw line only if within connection distance
                    if (dist < maxConnectionDist) {
                        // Fade opacity based on distance - much brighter now
                        const opacity = (1 - dist / maxConnectionDist) * 0.45;
                        ctx.strokeStyle = `rgba(92, 36, 255, ${opacity})`;
                        ctx.lineWidth = 1.0;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            // Draw particles on top of connections
            particles.forEach(p => {
                p.draw();
            });

            requestAnimationFrame(animateHero);
        }

        // Mouse tracking with scroll position
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY; // Canvas is fixed, so use viewport coordinates
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Start everything
        window.addEventListener('resize', resize);
        resize();
        animateHero();
        console.log('🎬 Blue constellation animation started!');
    } else {
        console.log('⚠️ No canvas found on this page');
    }

    // --- Reveal Effects & Counters ---
    function animateCounter(el) {
        if (el.dataset.animated) return;
        el.dataset.animated = "true";
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();

        console.log(`🔢 Animating counter to ${target}`);

        function step(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            el.innerText = Math.floor(ease * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.innerText = target;
                console.log(`✅ Counter animation complete: ${target}`);
            }
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal-text, .number');
    console.log(`👀 Found ${revealElements.length} elements to observe`);
    revealElements.forEach(el => observer.observe(el));

    // --- 3D Tilt Effect ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    console.log(`🎴 Found ${tiltCards.length} tilt cards`);

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.background = `rgba(255, 255, 255, 0.08)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            card.style.background = `rgba(255, 255, 255, 0.03)`;
        });
    });

    // --- Momentum Calculator ---
    const slider = document.getElementById('budget-slider');
    if (slider) {
        console.log('💰 Budget slider found!');
        const display = document.getElementById('budget-value');
        const result = document.getElementById('reach-projection');
        const chartCanvas = document.getElementById('growth-chart');

        if (chartCanvas && display && result) {
            const chartCtx = chartCanvas.getContext('2d');
            chartCanvas.width = 400;
            chartCanvas.height = 200;

            function drawChart(budget) {
                chartCtx.clearRect(0, 0, 400, 200);

                // Grid lines
                chartCtx.strokeStyle = 'rgba(255,255,255,0.1)';
                chartCtx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    chartCtx.beginPath();
                    chartCtx.moveTo(0, i * 50);
                    chartCtx.lineTo(400, i * 50);
                    chartCtx.stroke();
                }

                // Growth curve
                chartCtx.strokeStyle = '#5c24ff';
                chartCtx.lineWidth = 3;
                chartCtx.beginPath();
                chartCtx.moveTo(0, 200);
                const factor = budget / 10000;
                for (let x = 0; x <= 400; x += 10) {
                    let norm = x / 400;
                    let y = 200 - (Math.pow(norm, 2) * 200 * (0.5 + factor * 0.5));
                    chartCtx.lineTo(x, y);
                }
                chartCtx.stroke();
                chartCtx.lineTo(400, 200);
                chartCtx.fillStyle = 'rgba(92, 36, 255, 0.2)';
                chartCtx.fill();
            }

            function updateCalculator() {
                const val = +slider.value;
                display.innerText = val.toLocaleString();
                const reach = Math.floor(val * 22.5);
                result.innerText = reach.toLocaleString();
                drawChart(val);
                console.log(`📊 Calculator updated: $${val} → ${reach} reach`);
            }

            slider.addEventListener('input', updateCalculator);
            updateCalculator();
            console.log('✅ Calculator initialized!');
        }
    } else {
        console.log('⚠️ No budget slider on this page');
    }

    // --- Portfolio Carousel (Unified) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length > 0) {
        console.log(`🎠 Found ${carouselItems.length} carousel items`);
        let currentIndex = 0;
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        function updateCarousel() {
            carouselItems.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'hidden');
                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === (currentIndex - 1 + carouselItems.length) % carouselItems.length) {
                    item.classList.add('prev');
                } else if (index === (currentIndex + 1) % carouselItems.length) {
                    item.classList.add('next');
                } else {
                    item.classList.add('hidden');
                }
            });
            console.log(`🎠 Carousel updated to index ${currentIndex}`);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
                updateCarousel();
            });
            console.log('⬅️ Previous button connected');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % carouselItems.length;
                updateCarousel();
            });
            console.log('➡️ Next button connected');
        }

        // Auto rotate every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel();
        }, 5000);

        updateCarousel();
        console.log('✅ Carousel initialized with auto-rotate!');
    } else {
        console.log('⚠️ No carousel items found on this page');
    }

    console.log('🎉 All initialization complete!');

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        // Close on link click (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuBtn.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
        console.log('📱 Mobile menu initialized');
    }
});

// --- FAQ Accordion (global scope for onclick) ---
function toggleFaq(id) {
    const item = document.getElementById(id);
    if (!item) return;
    const isOpen = item.classList.contains('open');

    // Close all open items first
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
    });

    // If it wasn't open, open it now
    if (!isOpen) {
        item.classList.add('open');
    }
    console.log(`📋 FAQ toggled: ${id} → ${!isOpen ? 'open' : 'closed'}`);
}

// --- Pricing Feature Accordion (global scope for onclick) ---
function toggleFeature(btn) {
    const detail = btn.nextElementSibling;
    if (!detail) return;
    const isOpen = detail.classList.contains('open');

    // Toggle this item
    detail.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
}

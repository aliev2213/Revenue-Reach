
document.addEventListener('DOMContentLoaded', () => {

    // --- Fluid Neural Network with Ambient Drift + Repulse Physics ---
    const canvas = document.getElementById('hero-canvas');
    // Only run if canvas exists (it might not on some pages if deleted, but we handle that)
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resize);
        resize();

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

                // Visual properties
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

        // Initialize particles spread evenly across screen
        function initParticles() {
            particles = [];
            const particleCount = 100; // Increased from 56

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

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
                    const maxConnectionDist = 120;

                    // Draw line only if within connection distance
                    if (dist < maxConnectionDist) {
                        // Fade opacity based on distance
                        const opacity = (1 - dist / maxConnectionDist) * 0.12;
                        ctx.strokeStyle = `rgba(92, 36, 255, ${opacity})`;
                        ctx.lineWidth = 0.7;
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
        animateHero();
    }

    // --- Reveal Effects & Counters ---
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

    document.querySelectorAll('.reveal-text, .number').forEach(el => observer.observe(el));

    function animateCounter(el) {
        if (el.dataset.animated) return; // Prevent rerun
        el.dataset.animated = "true";
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();
        function step(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            el.innerText = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.innerText = target;
        }
        requestAnimationFrame(step);
    }

    // --- 3D Tilt Effect ---
    document.querySelectorAll('.tilt-card').forEach(card => {
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

    // --- Momentum Calculator (Index Page) ---
    const slider = document.getElementById('budget-slider');
    if (slider) {
        const display = document.getElementById('budget-value');
        const result = document.getElementById('reach-projection');
        const chartCanvas = document.getElementById('growth-chart');

        if (chartCanvas && display && result) {
            const chartCtx = chartCanvas.getContext('2d');
            chartCanvas.width = 400;
            chartCanvas.height = 200;

            function drawChart(budget) {
                chartCtx.clearRect(0, 0, 400, 200);
                chartCtx.strokeStyle = 'rgba(255,255,255,0.1)';
                chartCtx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    chartCtx.beginPath();
                    chartCtx.moveTo(0, i * 50);
                    chartCtx.lineTo(400, i * 50);
                    chartCtx.stroke();
                }
                chartCtx.strokeStyle = '#5c24ff';
                chartCtx.lineWidth = 3;
                chartCtx.beginPath();
                chartCtx.moveTo(0, 200);
                const factor = budget / 50000;
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
                const reach = Math.floor(val * 50);
                result.innerText = reach.toLocaleString();
                drawChart(val);
            }

            slider.addEventListener('input', updateCalculator);
            updateCalculator();
        }
    }

    // --- Portfolio Carousel (Portfolio Page) ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length > 0) {
        let currentIndex = 0;
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        function updateCarousel() {
            carouselItems.forEach((item, index) => {
                // Remove all state classes first
                item.classList.remove('active', 'prev', 'next', 'hidden');

                // Determine state
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
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % carouselItems.length;
                updateCarousel();
            });
        }

        // Auto rotate
        setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            updateCarousel();
        }, 5000);

        // Init
        updateCarousel();
    }
});

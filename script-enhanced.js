
document.addEventListener('DOMContentLoaded', () => {

    // --- Google Antigravity-Style Cursor-Interactive Dash Field ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.documentElement.scrollHeight; // Cover full page
            initParticles();
        }
        window.addEventListener('resize', resize);
        resize();

        // Gradient color mapping based on x position
        function getColorForPosition(x, y) {
            const norm = x / width;

            // Create a gradient from blue -> purple -> pink -> orange
            if (norm < 0.25) {
                // Blue to Purple
                const t = norm / 0.25;
                const r = Math.floor(92 + (147 - 92) * t);
                const g = Math.floor(36 + (51 - 36) * t);
                const b = Math.floor(255 * (1 - t * 0.2));
                return { r, g, b };
            } else if (norm < 0.5) {
                // Purple to Pink
                const t = (norm - 0.25) / 0.25;
                const r = Math.floor(147 + (255 - 147) * t);
                const g = Math.floor(51 + (61 - 51) * t);
                const b = Math.floor(204 + (127 - 204) * t);
                return { r, g, b };
            } else if (norm < 0.75) {
                // Pink to Orange/Red
                const t = (norm - 0.5) / 0.25;
                const r = 255;
                const g = Math.floor(61 + (94 - 61) * t);
                const b = Math.floor(127 * (1 - t));
                return { r, g, b };
            } else {
                // Orange to Yellow
                const t = (norm - 0.75) / 0.25;
                const r = 255;
                const g = Math.floor(94 + (165 - 94) * t);
                const b = Math.floor(0 + (0) * t);
                return { r, g, b };
            }
        }

        class Dash {
            constructor(x, y) {
                // Fixed position on grid
                this.x = x;
                this.y = y;

                // Dash properties
                this.length = 8 + Math.random() * 4; // Dash length
                this.width = 1.5; // Dash thickness
                this.rotation = Math.random() * Math.PI * 2; // Initial rotation

                // Color based on position
                const color = getColorForPosition(x, y);
                this.baseOpacity = 0.4 + Math.random() * 0.3;
                this.color = color;
            }

            update(mouseX, mouseY) {
                // Calculate angle to point towards mouse
                if (mouseX !== null && mouseY !== null) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const targetAngle = Math.atan2(dy, dx);

                    // Smoothly interpolate rotation for fluid motion
                    const angleDiff = targetAngle - this.rotation;
                    const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                    this.rotation += normalizedDiff * 0.15; // Smooth rotation speed
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Calculate distance-based opacity boost
                ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.baseOpacity})`;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(-this.length / 2, 0);
                ctx.lineTo(this.length / 2, 0);
                ctx.stroke();

                ctx.restore();
            }
        }

        // Initialize particles in a grid pattern
        function initParticles() {
            particles = [];
            const spacing = 25; // Distance between dashes
            const cols = Math.ceil(width / spacing);
            const rows = Math.ceil(height / spacing);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing + (Math.random() - 0.5) * 5; // Small random offset
                    const y = j * spacing + (Math.random() - 0.5) * 5;
                    particles.push(new Dash(x, y));
                }
            }
        }

        let mouse = { x: null, y: null };
        let scrollY = 0;

        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY + scrollY; // Account for scroll position
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            // Update mouse Y with new scroll position
            if (mouse.y !== null) {
                mouse.y = event.clientY + scrollY;
            }
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animateHero() {
            // Clear with background color
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, width, height);

            // Update all dashes
            particles.forEach(p => {
                p.update(mouse.x, mouse.y);
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
});

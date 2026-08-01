document.getElementById('btn-iniciar').addEventListener('click', function() {
   
    const musica = document.getElementById('musica-fondo');
    if (musica) {
        musica.load();
        musica.volume = 0.6;
        musica.play().then(() => {
            console.log("musica reproduciendose");  
        }).catch(error => {
            console.log("navegador bloquea musica:", error);
        });
    }

    this.classList.add('hidden');
    
    const garden = document.getElementById('garden');
    garden.classList.remove('hidden');
    
    initFlowerCanvas();
});

function initFlowerCanvas() {
    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

   
    const colorPalettes = [
        { petals: ['#ff1744', '#d50000', '#9b0000'], center: '#4a0000' }, // Rojo vibrante
        { petals: ['#e60026', '#b71c1c', '#7f0000'], center: '#360000' }, // Rojo oscuro 
        { petals: ['#ff4d6d', '#c9184a', '#800f2f'], center: '#430113' }, // Carmín profundo
        { petals: ['#d90429', '#ef233c', '#6b0114'], center: '#2b0004' }  // Rojo fuego
    ];

    class Flower {
        constructor(x, y, radius, petalsCount, colorScheme, delay) {
            this.x = x;
            this.y = y;
            this.maxRadius = radius;
            this.currentRadius = 0;
            this.petalsCount = petalsCount;
            this.colors = colorScheme;
            this.delay = delay;
            this.growthProgress = 0;
            this.rotation = Math.random() * Math.PI * 2;
        }

        update(progress) {
            if (progress > this.delay) {
                this.growthProgress = Math.min(1, (progress - this.delay) * 1.8);
                this.currentRadius = this.maxRadius * easeOutBack(this.growthProgress);
            }
        }

        draw(ctx) {
            if (this.currentRadius <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            ctx.shadowColor = 'rgba(0, 0, 0, 0.55)'; 
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 5;

            // Capa exterior
            this.drawPetalLayer(ctx, this.currentRadius, this.petalsCount, this.colors.petals[0], 0);

            // Capa intermedia
            if (this.currentRadius > 12) {
                this.drawPetalLayer(ctx, this.currentRadius * 0.73, this.petalsCount, this.colors.petals[1], Math.PI / this.petalsCount);
            }

            // Capa interna 
            if (this.currentRadius > 22 && this.colors.petals[2]) {
                this.drawPetalLayer(ctx, this.currentRadius * 0.45, this.petalsCount, this.colors.petals[2], 0);
            }

            // Centro de la rosa 
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 3;

            ctx.beginPath();
            ctx.arc(0, 4, Math.max(2, this.currentRadius * 0.20), 0, Math.PI * 2);
            ctx.fillStyle = this.colors.center;
            ctx.fill();

            
            ctx.beginPath();
            ctx.arc(0, 4, Math.max(1, this.currentRadius * 0.08), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.35;
            ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.restore();
        }

        drawPetalLayer(ctx, radius, count, color, angleOffset) {
            const angleStep = (Math.PI * 2) / count;

            for (let i = 0; i < count; i++) {
                const angle = i * angleStep + angleOffset;
                ctx.save();
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(
                    -radius * 0.45, -radius * 0.5,
                    -radius * 0.5, -radius,
                    0, -radius
                );
                ctx.bezierCurveTo(
                    radius * 0.5, -radius,
                    radius * 0.45, -radius * 0.5,
                    0, 0
                );

                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            }
        }
    }

    function easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    let flowers = [];

    function generateBouquet() {
        flowers = [];
        const totalFlowers = 200; 

        for (let i = 0; i < totalFlowers; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            const size = Math.random() * 35 + 25; 
            const petals = Math.floor(Math.random() * 3) + 6; 
            const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
            const delay = Math.random() * 0.8; 

            flowers.push(new Flower(x, y, size, petals, palette, delay));
        }

        flowers.sort((a, b) => a.maxRadius - b.maxRadius);
    }
    generateBouquet();

    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 14000;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        flowers.forEach(flower => {
            flower.update(elapsed);
            flower.draw(ctx);
        });

        if (elapsed < 1.4) {
            requestAnimationFrame(animate);
        } else {
            const message = document.getElementById('message');
            message.classList.remove('hidden');
            setTimeout(() => {
                message.classList.add('show-message');
            }, 100);
        }
    }

    requestAnimationFrame(animate);
}
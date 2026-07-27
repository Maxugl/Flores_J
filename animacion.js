document.getElementById('btn-iniciar').addEventListener('click', function() {
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

    // Paleta cromática variada similar a la imagen (Rosas, amarillos, magentas, naranjas, blancos, lavanda)
    const colorPalettes = [
        { petals: ['#ff1744', '#d50000', '#9b0000'], center: '#4a0000' }, // Rojo Rosa clásico
        { petals: ['#ffd000', '#ffea00', '#d4a000'], center: '#3b2200' }, // Amarillo cálido
        { petals: ['#ff4d8d', '#ff1a6c', '#b30047'], center: '#360015' }, // Magenta / Fucsia
        { petals: ['#ff85a1', '#fbb1bd', '#f7cad0'], center: '#4a1525' }, // Rosa pastel
        { petals: ['#ff7b00', '#ff9e00', '#cc5200'], center: '#331400' }, // Naranja vibrante
        { petals: ['#ffffff', '#f4edf8', '#d0c2e0'], center: '#a37c53' }, // Blanco / Crema
        { petals: ['#e0aaff', '#c77dff', '#7b2cbf'], center: '#240046' }  // Lavanda / Violeta
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
                // Función de aceleración suave (bounce suave al abrir)
                this.currentRadius = this.maxRadius * easeOutBack(this.growthProgress);
            }
        }

        draw(ctx) {
            if (this.currentRadius <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Sombra estilo recorte 3D de papel
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 5;

            // Capa exterior de pétalos
            this.drawPetalLayer(ctx, this.currentRadius, this.petalsCount, this.colors.petals[0], 0);

            // Capa intermedia
            if (this.currentRadius > 12) {
                this.drawPetalLayer(ctx, this.currentRadius * 0.7, this.petalsCount, this.colors.petals[1], Math.PI / this.petalsCount);
            }

            // Capa interna de pétalos
            if (this.currentRadius > 22 && this.colors.petals[2]) {
                this.drawPetalLayer(ctx, this.currentRadius * 0.42, this.petalsCount, this.colors.petals[2], 0);
            }

            // Centro de la flor
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 2;

            ctx.beginPath();
            ctx.arc(0, 0, Math.max(2, this.currentRadius * 0.22), 0, Math.PI * 2);
            ctx.fillStyle = this.colors.center;
            ctx.fill();

            // Puntos de luz en el centro
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(1, this.currentRadius * 0.1), 0, Math.PI * 2);
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
                // Curvas Bezier para formar los pétalos orgánicos
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
    

    // --- CÓDIGO NUEVO PARA COBRIR TODA LA PANTALLA ---
    function generateBouquet() {
    flowers = [];
    const totalFlowers = 400; // Subimos la cantidad de flores

    for (let i = 0; i < totalFlowers; i++) {
        // Distribuimos las flores por TODA la pantalla dejando un pequeño margen
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Tamaños variados para dar sensación de fondo completo
        const size = Math.random() * 35 + 25; 
        const petals = Math.floor(Math.random() * 3) + 5; 
        const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        
        // Retraso de animación distribuido al azar
        const delay = Math.random() * 0.8; 

        flowers.push(new Flower(x, y, size, petals, palette, delay));
    }

    // Ordenar por tamaño para que las flores pequeñas queden sobre o bajo las grandes correctamente
    flowers.sort((a, b) => a.maxRadius - b.maxRadius);
}
    generateBouquet();

    let startTime = null;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 2200;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        flowers.forEach(flower => {
            flower.update(elapsed);
            flower.draw(ctx);
        });

        if (elapsed < 1.4) {
            requestAnimationFrame(animate);
        } else {
            // Mostrar la tarjeta del mensaje al terminar la floración
            const message = document.getElementById('message');
            message.classList.remove('hidden');
            setTimeout(() => {
                message.classList.add('show-message');
            }, 100);
        }
    }

    requestAnimationFrame(animate);
}
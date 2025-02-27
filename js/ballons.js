function createBalloons() {
    const balloonsContainer = document.createElement('div');
    balloonsContainer.className = 'balloons';
    document.body.appendChild(balloonsContainer);

    // Criar 15 balões
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Posição inicial aleatória
        balloon.style.left = `${Math.random() * 100}%`;
        
        // Atraso aleatório na animação
        balloon.style.animationDelay = `${Math.random() * 15}s`;
        
        // Tamanho aleatório
        const size = 30 + Math.random() * 20;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.3}px`;
        
        balloonsContainer.appendChild(balloon);
    }
} 
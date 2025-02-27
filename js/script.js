document.addEventListener("DOMContentLoaded", () => {
    // Variáveis do slider
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slide");
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? "block" : "none";
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Iniciar o slider
    showSlide(currentSlide);

    // Configurar os botões
    document.getElementById("nextBtn").addEventListener("click", () => {
        clearInterval(slideInterval);
        nextSlide();
        startSlideInterval();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        clearInterval(slideInterval);
        prevSlide();
        startSlideInterval();
    });

    // Função para iniciar o intervalo do slider
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Iniciar o intervalo
    startSlideInterval();

    // Carregar aniversariantes
    carregarAniversariantes();
});

async function carregarAniversariantes() {
    try {
        // Usar diretamente a variável e função do arquivo aniversariantes.js
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth() + 1;
        
        // Usar a função getAniversariantesDoMes definida em aniversariantes.js
        const aniversariantesDoMes = getAniversariantesDoMes(mesAtual);
        
        // Limitar a 5 aniversariantes
        const aniversariantesLimitados = aniversariantesDoMes.slice(0, 5);
        
        const container = document.getElementById("lista-aniversariantes");
        if (aniversariantesLimitados.length > 0) {
            container.innerHTML = aniversariantesLimitados.map(aniv => `
                <div class="aniversariante-card">
                    <img src="${aniv.foto}" alt="Avatar" class="aniversariante-avatar">
                    <div class="aniversariante-info">
                        <h3>${aniv.nome}</h3>
                        <div class="aniversariante-data">${aniv.data} - ${aniv.departamento}</div>
                    </div>
                </div>
            `).join("");
        } else {
            container.innerHTML = '<p>Nenhum aniversariante este mês</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar aniversariantes:', error);
        document.getElementById("lista-aniversariantes").innerHTML = 
            '<p>Erro ao carregar aniversariantes</p>';
    }
}





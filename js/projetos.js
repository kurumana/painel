document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProjeto');
    const listaProjetos = document.getElementById('listaProjetos');
    const modal = document.getElementById('projetoModal');
    
    const ITENS_POR_PAGINA = 6;
    let paginaAtual = 1;
    let projetosFiltrados = [];
    
    // Carregar projetos salvos
    carregarProjetos();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projetoId = document.getElementById('projetoId').value;
        const projeto = {
            id: projetoId || Date.now(),
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            responsavel: document.getElementById('responsavel').value,
            dataInicio: document.getElementById('dataInicio').value,
            dataFim: document.getElementById('dataFim').value,
            status: document.getElementById('status').value,
            progresso: document.getElementById('progresso').value
        };
        
        salvarProjeto(projeto);
        fecharModal();
        form.reset();
    });
    
    function atualizarFiltroResponsaveis() {
        const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
        const responsaveis = [...new Set(projetos.map(p => p.responsavel))];
        const select = document.getElementById('filtroResponsavel');
        
        select.innerHTML = '<option value="">Todos os Responsáveis</option>';
        responsaveis.forEach(responsavel => {
            select.innerHTML += `<option value="${responsavel}">${responsavel}</option>`;
        });
    }
    
    function filtrarProjetos() {
        const responsavel = document.getElementById('filtroResponsavel').value;
        const status = document.getElementById('filtroStatus').value;
        let projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
        
        projetosFiltrados = projetos.filter(projeto => {
            const matchResponsavel = !responsavel || projeto.responsavel === responsavel;
            const matchStatus = !status || projeto.status === status;
            return matchResponsavel && matchStatus;
        });
        
        paginaAtual = 1;
        atualizarExibicao();
    }
    
    function atualizarExibicao() {
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        const projetosPagina = projetosFiltrados.slice(inicio, fim);
        
        listaProjetos.innerHTML = '';
        projetosPagina.forEach(projeto => {
            const card = criarProjetoCard(projeto);
            listaProjetos.appendChild(card);
        });
        
        atualizarPaginacao();
    }
    
    function atualizarPaginacao() {
        const totalPaginas = Math.ceil(projetosFiltrados.length / ITENS_POR_PAGINA);
        const paginacao = document.getElementById('paginacao');
        paginacao.innerHTML = '';
        
        for (let i = 1; i <= totalPaginas; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.toggle('active', i === paginaAtual);
            button.onclick = () => {
                paginaAtual = i;
                atualizarExibicao();
            };
            paginacao.appendChild(button);
        }
    }
    
    function carregarProjetos() {
        const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
        projetosFiltrados = projetos;
        atualizarFiltroResponsaveis();
        atualizarExibicao();
    }
    
    function salvarProjeto(novoProjeto) {
        let projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
        
        if (novoProjeto.id) {
            const index = projetos.findIndex(p => p.id == novoProjeto.id);
            if (index !== -1) {
                projetos[index] = novoProjeto;
            } else {
                projetos.push(novoProjeto);
            }
        } else {
            projetos.push(novoProjeto);
        }
        
        localStorage.setItem('projetos', JSON.stringify(projetos));
        carregarProjetos();
    }
    
    function calcularTempoDecorrido(dataInicio) {
        const inicio = new Date(dataInicio);
        const hoje = new Date();
        const diff = Math.abs(hoje - inicio);
        
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const meses = Math.floor(dias / 30);
        const anos = Math.floor(meses / 12);
        
        if (anos > 0) {
            return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses % 12} ${meses % 12 === 1 ? 'mês' : 'meses'}`;
        } else if (meses > 0) {
            return `${meses} ${meses === 1 ? 'mês' : 'meses'} e ${dias % 30} ${dias % 30 === 1 ? 'dia' : 'dias'}`;
        } else {
            return `${dias} ${dias === 1 ? 'dia' : 'dias'}`;
        }
    }
    
    function criarProjetoCard(projeto) {
        const card = document.createElement('div');
        card.className = 'projeto-card';
        
        const dataInicio = new Date(projeto.dataInicio).toLocaleDateString();
        const dataFim = new Date(projeto.dataFim).toLocaleDateString();
        const tempoDecorrido = calcularTempoDecorrido(projeto.dataInicio);
        
        card.innerHTML = `
            <div class="projeto-acoes">
                <button onclick="editarProjeto(${projeto.id})" class="btn-editar">✏️</button>
                <button onclick="excluirProjeto(${projeto.id})" class="btn-excluir">🗑️</button>
            </div>
            <div class="projeto-header">
                <div class="projeto-titulo">${projeto.nome}</div>
                <div class="projeto-status status-${projeto.status}">${formatarStatus(projeto.status)}</div>
            </div>
            <div class="projeto-info">
                <p>${projeto.descricao}</p>
                <p><strong>Responsável:</strong> ${projeto.responsavel}</p>
                <div class="projeto-datas">
                    <span><strong>Início:</strong> ${dataInicio}</span>
                    <span><strong>Fim:</strong> ${dataFim}</span>
                </div>
                <div class="projeto-tempo">
                    <span><strong>Tempo decorrido:</strong> ${tempoDecorrido}</span>
                </div>
            </div>
            <div class="progresso-container">
                <div class="progresso-barra">
                    <div class="progresso-valor" style="width: ${projeto.progresso}%"></div>
                </div>
                <div style="text-align: right; margin-top: 5px;">${projeto.progresso}%</div>
            </div>
        `;
        
        return card;
    }

    // Atualizar os cards a cada minuto para manter o tempo decorrido atualizado
    setInterval(() => {
        carregarProjetos();
    }, 60000);
});

// Funções globais para manipulação do modal
function abrirModal() {
    document.getElementById('projetoId').value = '';
    document.getElementById('modalTitulo').textContent = 'Novo Projeto';
    document.getElementById('formProjeto').reset();
    document.getElementById('projetoModal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('projetoModal').style.display = 'none';
}

function editarProjeto(id) {
    const projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
    const projeto = projetos.find(p => p.id == id);
    
    if (projeto) {
        document.getElementById('projetoId').value = projeto.id;
        document.getElementById('nome').value = projeto.nome;
        document.getElementById('descricao').value = projeto.descricao;
        document.getElementById('responsavel').value = projeto.responsavel;
        document.getElementById('dataInicio').value = projeto.dataInicio;
        document.getElementById('dataFim').value = projeto.dataFim;
        document.getElementById('status').value = projeto.status;
        document.getElementById('progresso').value = projeto.progresso;
        
        document.getElementById('modalTitulo').textContent = 'Editar Projeto';
        document.getElementById('projetoModal').style.display = 'block';
    }
}

function excluirProjeto(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        let projetos = JSON.parse(localStorage.getItem('projetos') || '[]');
        projetos = projetos.filter(p => p.id != id);
        localStorage.setItem('projetos', JSON.stringify(projetos));
        carregarProjetos();
    }
}

function formatarStatus(status) {
    const formatos = {
        'nao-iniciado': 'Não Iniciado',
        'em-andamento': 'Em Andamento',
        'interrompido': 'Interrompido',
        'finalizado': 'Finalizado'
    };
    return formatos[status] || status;
} 
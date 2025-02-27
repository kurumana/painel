document.addEventListener('DOMContentLoaded', function () {
    const navHtml = `
        <nav style="position: fixed; top: 0; left: 0; z-index: 9999;">
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-btn">Aprendizagem</a>
                    <div class="dropdown-content">
                        <a href="https://accamargo.avantti.app/">Avantti</a>
                        <a href="http://10.11.38.56/altaperformance_v2/Default.aspx">Alta Performace</a>
                        <a href="https://www.escolavirtual.gov.br/">Esola Virtual Gov.br</a>
                        <a href="https://educacaocorporativaaccamargo.lgcloud.com.br/User">Educação Continuada - AC</a>
                    </div>
                </li>
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-btn">Planilhas</a>
                    <div class="dropdown-content">
                        <a href="https://accamargocancercenter-my.sharepoint.com/:x:/r/personal/tiago_borges_accamargo_org_br/_layouts/15/doc2.aspx?sourcedoc=%7B713610F9-F1F3-40AD-B46E-B287C5935260%7D&file=Cadastros%20de%20OPMES%20-%20Precifica%25u00e7%25u00e3o.xlsx&wdOrigin=OFFICECOM-WEB.MAIN.SEARCH&action=default&mobileredirect=true&isSPOFile=1">Precificação OPME</a>
                        <a href="https://accamargocancercenter-my.sharepoint.com/:x:/r/personal/wesley_silva_accamargo_org_br/_layouts/15/Doc.aspx?sourcedoc=%7BB065BF65-FD3A-4F71-BD54-8D861C1F0BE1%7D&file=Tabelas%20proprias.xlsx&wdOrigin=TEAMS-WEB.p2p_ns.rwc&action=default&mobileredirect=true">Precificação Medicamentos</a>
                        <a href="https://accamargocancercenter-my.sharepoint.com/:g:/personal/antonio_martins_accamargo_org_br/EY93YILrJmtBmgYtsw6Zh2gBbV3WCiNqjcmIefnQmyAPrA?e=4olFOj&wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1704368795868&web=1">Tabela Bradesco</a>
                    </div>
                </li>
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-btn">Versões Tasy</a>
                    <div class="dropdown-content">
                        <a href="https://tasy.accamargo.org.br/#/">Produção</a>
                        <a href="https://tasyteste.accamargo.org.br/#/">Teste</a>
                        <a href="https://tasyrep.accamargo.org.br/#/">Rep</a>
                        <a href="https://tasyqa.accamargo.org.br/#/">QA</a>
                        <a href="https://10.11.36.29/#/login">Para Impressão Relatórios</a>	
                    </div>
                </li>
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-btn">Power BI</a>
                    <div class="dropdown-content">
                        <a href="https://app.powerbi.com/links/pFBQ2JI6k7?ctid=37f3153b-8f03-4b12-a348-ea1124bd1903&pbi_source=linkShare">Tabela Medicamento</a>
                    </div>
                </li>
                <li><a href="relatorios.html">Relatórios</a></li>
                <li><a href="aniversariantes.html">Aniversariantes<span class="badge">Novo</span></a></li>
                <li class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-btn">Paginas Especiais</a>
                    <div class="dropdown-content">  
                        <a href="Pesquisa Maiusculas.html">Pesquisar Texto Maiúsculo</a>
                        <a href="pdmat.html">Padrão Descritivo Material Hosp/OPME</a>
                        <a href="https://dados.anvisa.gov.br/dados">Dados ANVISA</a>
                        <a href="search.html">Pesquisa Avançada</a>
                        <a href="add-page.html">Adicionar Arquivos</a>
                    </div>
                </li>
            </ul>
        </nav>
    `;
    
    // Inserindo a navegação na página e ajustando o espaço para o conteúdo
    document.body.insertAdjacentHTML('afterbegin', navHtml);
    document.body.style.marginTop = '50px';
});
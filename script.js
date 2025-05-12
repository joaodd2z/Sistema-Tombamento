// Sistema de Tombamento Patrimonial - Script Principal

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const formConversaoPdf = document.getElementById('formConversaoPdf');
    const pdfFile = document.getElementById('pdfFile');
    const btnConverterPdf = document.getElementById('btnConverterPdf');
    const pdfConversionStatus = document.getElementById('pdfConversionStatus');
    const pdfDownloadLink = document.getElementById('pdfDownloadLink');
    const previewContainer = document.getElementById('previewContainer');
    const arquivoSelecionado = document.getElementById('arquivoSelecionado');

    // Configuração do dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'fixed bottom-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-colors';
    darkModeToggle.innerHTML = `
        <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
    `;
    document.body.appendChild(darkModeToggle);

    // Inicializa o dark mode
    if (localStorage.getItem('darkMode') === 'true' || (!localStorage.getItem('darkMode') && prefersDarkMode.matches)) {
        document.documentElement.classList.add('dark');
    }    // Dark mode toggle handler
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark);
        updateDarkModeIcon(isDark);
    });

    function updateDarkModeIcon(isDark) {
        darkModeToggle.innerHTML = isDark ? `
            <svg class="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
        ` : `
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
        `;
    }

    // Inicializa o ícone do dark mode
    updateDarkModeIcon(document.documentElement.classList.contains('dark'));

    // Atualiza as cores iniciais
    updateDarkModeStyles();

    // Configuração do drag and drop
    const dropZone = formConversaoPdf.querySelector('label[for="pdfFile"]').parentElement;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        const isDark = document.documentElement.classList.contains('dark');
        dropZone.classList.add('border-blue-500');
        dropZone.classList.add(isDark ? 'bg-blue-900/20' : 'bg-blue-50');
    }

    function unhighlight(e) {
        const isDark = document.documentElement.classList.contains('dark');
        dropZone.classList.remove('border-blue-500');
        dropZone.classList.remove(isDark ? 'bg-blue-900/20' : 'bg-blue-50');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                pdfFile.files = files;
                atualizarNomeArquivo(file);
            } else {
                mostrarErro('Por favor, selecione apenas arquivos PDF.');
            }
        }
    }

    // Evento de seleção de arquivo
    pdfFile.addEventListener('change', function() {
        if (this.files.length > 0) {
            atualizarNomeArquivo(this.files[0]);
        }
    });

    function mostrarStatus(mensagem, tipo = 'info') {
        arquivoSelecionado.textContent = mensagem;
        const isDark = document.documentElement.classList.contains('dark');
        
        switch (tipo) {
            case 'success':
                arquivoSelecionado.className = `mt-3 text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`;
                break;
            case 'error':
                arquivoSelecionado.className = `mt-3 text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`;
                break;
            default:
                arquivoSelecionado.className = `mt-3 text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`;
        }
    }

    function atualizarNomeArquivo(file) {
        mostrarStatus(`Arquivo selecionado: ${file.name}`, 'info');
        previewContainer.classList.add('hidden');
        pdfDownloadLink.classList.add('hidden');
    }

    function mostrarErro(mensagem) {
        mostrarStatus(mensagem, 'error');
    }

    // Coleta os dados do formulário
    function coletarDadosFormulario() {
        const itens = {};
        
        // Coleta todos os itens do formulário
        const itensDivs = itensContainer.querySelectorAll('div');
        itensDivs.forEach(div => {
            const inputs = div.querySelectorAll('input');
            const nomeItem = inputs[0].value.trim();
            const quantidadeItem = parseInt(inputs[1].value);
            
            if (nomeItem && !isNaN(quantidadeItem) && quantidadeItem > 0) {
                itens[nomeItem] = quantidadeItem;
            }
        });

        return {
            num_salas: parseInt(numSalas.value),
            num_inicial: parseInt(numInicial.value),
            itens: itens
        };
    }

    // Gera a tabela de previsualização
    function gerarTabelaPreview(dados) {
        let html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sala</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Número</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Descrição</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
        `;

        dados.forEach((item, index) => {
            const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            html += `
                <tr class="${rowClass}">
                    <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">${item.Sala}</td>
                    <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">${item.Item}</td>
                    <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-center">${item.Número}</td>
                    <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">${item.Descrição}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        return html;
    }

    // Evento para adicionar um novo item
    btnAdicionarItem.addEventListener('click', function() {
        adicionarItemAoFormulario();
    });

    // Evento para previsualizar o tombamento
    btnPrevisualizar.addEventListener('click', function() {
        const dados = coletarDadosFormulario();
        
        // Mostra indicador de carregamento
        previewContainer.innerHTML = '<p class="text-center py-4">Carregando previsualização...</p>';
        
        // Faz a requisição para o backend
        fetch('/gerar_preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            // Gera a tabela de previsualização
            previewContainer.innerHTML = gerarTabelaPreview(data.dados);
            
            // Esconde o link de download
            downloadLink.classList.add('hidden');
        })
        .catch(error => {
            console.error('Erro ao gerar previsualização:', error);
            previewContainer.innerHTML = `<p class="text-red-500 text-center py-4">Erro ao gerar previsualização: ${error.message}</p>`;
        });
    });

    // Evento para exportar para Excel
    btnExportar.addEventListener('click', function() {
        const dados = coletarDadosFormulario();
        
        // Mostra indicador de carregamento
        previewContainer.innerHTML = '<p class="text-center py-4">Gerando arquivo Excel...</p>';
        
        // Faz a requisição para o backend
        fetch('/exportar_excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            // Gera a tabela de previsualização
            previewContainer.innerHTML = `
                <p class="text-green-500 text-center py-4">Arquivo Excel gerado com sucesso!</p>
                <p class="text-center">Total de itens: ${dados.num_salas * Object.values(dados.itens).reduce((a, b) => a + b, 0)}</p>
            `;
            
            // Atualiza o link de download
            const linkElement = downloadLink.querySelector('a');
            linkElement.href = data.caminho;
            linkElement.textContent = `Baixar ${data.arquivo}`;
            downloadLink.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Erro ao exportar para Excel:', error);
            previewContainer.innerHTML = `<p class="text-red-500 text-center py-4">Erro ao exportar para Excel: ${error.message}</p>`;
        });
    });

    // Inicializa o formulário
    inicializarItens();    // Função para gerenciar a conversão de PDF para Excel
    function gerenciarConversaoPdf() {
        if (btnConverterPdf) {
            btnConverterPdf.addEventListener('click', realizarConversao);
        }
    }

    async function realizarConversao() {
        if (!pdfFile.files.length) {
            mostrarErro('Por favor, selecione um arquivo PDF para converter.');
            return;
        }
        
        const arquivo = pdfFile.files[0];
        if (!arquivo.type.includes('pdf')) {
            mostrarErro('Por favor, selecione um arquivo PDF válido.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('pdfFile', arquivo);
            
            btnConverterPdf.disabled = true;
            pdfConversionStatus.classList.remove('hidden');
            previewContainer.classList.remove('hidden');
            pdfDownloadLink.classList.add('hidden');
            
            previewContainer.innerHTML = `
                <div class="flex items-center justify-center space-x-3 py-6">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 dark:border-blue-400"></div>
                    <span class="text-blue-900 dark:text-blue-100 font-medium">Processando arquivo PDF...</span>
                </div>
                <p class="text-center text-sm text-gray-600 dark:text-gray-400">Aguarde enquanto extraímos e formatamos o conteúdo</p>
            `;
            
            const response = await fetch('/converter_pdf', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao processar o arquivo');
            }

            previewContainer.innerHTML = `
                <div class="text-center space-y-4 py-6">
                    <div class="flex items-center justify-center">
                        <svg class="w-12 h-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-lg font-medium text-green-600 dark:text-green-400">Conversão concluída com sucesso!</p>
                        ${data.num_itens ? `<p class="text-gray-600 dark:text-gray-400 mt-2">Total de itens processados: ${data.num_itens}</p>` : ''}
                        <p class="text-gray-600 dark:text-gray-400 mt-1">O arquivo foi limpo e formatado no padrão FABRAS</p>
                    </div>
                </div>
            `;
            
            pdfDownloadLink.classList.remove('hidden');
            const downloadButton = pdfDownloadLink.querySelector('a');
            downloadButton.href = data.caminho;
            pdfFile.value = '';
            arquivoSelecionado.textContent = '';
            
        } catch (error) {
            console.error('Erro na conversão:', error);
            previewContainer.innerHTML = `
                <div class="text-center space-y-4 py-6">
                    <div class="flex items-center justify-center">
                        <svg class="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-lg font-medium text-red-600 dark:text-red-400">Erro na conversão</p>
                        <p class="text-gray-600 dark:text-gray-400 mt-2">${error.message}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Por favor, verifique se o arquivo está no formato correto e tente novamente.</p>
                    </div>
                </div>
            `;
        } finally {
            btnConverterPdf.disabled = false;
            pdfConversionStatus.classList.add('hidden');
        }
    }
    
    // Inicializa a funcionalidade de conversão de PDF
    gerenciarConversaoPdf();
});
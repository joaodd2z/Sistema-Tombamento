# Cérebro de Biblioteca - Sistema de Tombamento Patrimonial

Este projeto automatiza o processo de tombamento patrimonial para a Fabras, permitindo gerar documentos de tombamento com numeração sequencial e exportá-los para Excel, mantendo a formatação original.

## Funcionalidades

- Configuração do número de salas e itens por sala
- Numeração sequencial automática dos itens
- Previsualização do tombamento antes da exportação
- Exportação para Excel com formatação profissional
- Interface web intuitiva e responsiva

## Estrutura do Projeto

```
cerebro_biblioteca/
├── app.py                 # Servidor Flask (backend)
├── templates/
│   └── index.html         # Interface web principal
├── static/
│   ├── css/
│   │   └── styles.css     # Estilos personalizados
│   └── js/
│       └── script.js      # Lógica do frontend
└── output/                # Pasta para arquivos Excel gerados
```

## Requisitos

- Python 3.6 ou superior
- Flask
- Pandas
- OpenPyXL

## Instalação

1. Certifique-se de ter o Python instalado em seu computador
2. Instale as dependências necessárias:

```bash
pip install flask pandas openpyxl
```

3. Clone ou baixe este repositório para sua máquina

## Como Usar

1. Navegue até a pasta do projeto e execute o servidor Flask:

```bash
python app.py
```

2. Abra seu navegador e acesse `http://localhost:5000`

3. Na interface web:
   - Configure o número de salas desejado
   - Defina a numeração inicial para o tombamento
   - Personalize os itens por sala (adicione, remova ou modifique)
   - Clique em "Previsualizar" para ver como ficará o tombamento
   - Clique em "Exportar para Excel" para gerar o arquivo final

4. O arquivo Excel gerado estará disponível para download e também será salvo na pasta `output/`

## Modelo de Tombamento

O sistema utiliza um modelo base que inclui:
- 50 Carteiras
- 1 Mesa do Professor
- 1 Cadeira do Professor
- 2 Ventiladores
- 1 Quadro Branco
- 1 Projetor
- 1 Computador
- 1 Armário
- 1 Lixeira
- 1 Ar Condicionado
- 2 Cortinas
- 4 Luminárias

Este modelo pode ser personalizado conforme necessário através da interface.

## Personalização

Você pode personalizar as cores e estilos editando o arquivo `static/css/styles.css`. As cores institucionais atuais são:

- Azul escuro: #1E3A8A
- Branco: #FFFFFF
- Cinza claro: #E5E7EB

## Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.

---

Desenvolvido por Jasão - Sistema de Tombamento Patrimonial
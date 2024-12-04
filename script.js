function calcular() {
    // Obter os valores dos inputs
    const diametros = document.getElementById("diametro").value.split(",").map(Number);
    const declividadeInicial = parseFloat(document.getElementById("declividadeInicial").value);
    const declividadeFinal = parseFloat(document.getElementById("declividadeFinal").value);
    const rugosidade = parseFloat(document.getElementById("rugosidade").value);

    // Criar array de declividades
    const declividades = [];
    for (let i = declividadeInicial; i <= declividadeFinal; i += (declividadeFinal - declividadeInicial) / 19) {
        declividades.push(i);
    }

    // Calcular vazoes
    const vazoes = calcularVazoes(diametros, declividades, rugosidade);

    // Gerar o gráfico com Chart.js
    gerarGrafico(diametros, declividades, vazoes);
}

function calcularVazoes(diametros, declividades, rugosidade) {
    const vazoes = [];
    for (let i = 0; i < diametros.length; i++) {
        const D = diametros[i] / 1000; // Converter diâmetro para metros
        const vazoesDiametro = [];
        for (let j = 0; j < declividades.length; j++) {
            const Il = declividades[j];
            const A = (Math.PI * D ** 2) / 4;  // Área da seção molhada
            const R_h = D / 4;  // Raio hidráulico
            const V = (1 / rugosidade) * R_h ** (2 / 3) * Il ** (1 / 2);  // Velocidade do escoamento
            const Q = V * A;  // Vazão
            vazoesDiametro.push(Q);
        }
        vazoes.push(vazoesDiametro);
    }
    return vazoes;
}

function gerarGrafico(diametros, declividades, vazoes) {
    const canvas = document.getElementById('grafico');
    const ctx = canvas.getContext('2d');

    const datasets = [];
    for (let i = 0; i < diametros.length; i++) {
        datasets.push({
            label: `D = ${diametros[i]} mm`,
            data: vazoes[i],
            fill: false,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
            tension: 0.1
        });
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: declividades.map(d => d.toFixed(3)),
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Declividade (m/m)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Vazão (m³/s)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
    exibirTabela(diametros, declividades, vazoes);
}

function exibirTabela(diametros, declividades, vazoes) {
    const tabela = document.querySelector('#tabela-resultados table');
    tabela.innerHTML = ''; // Limpar a tabela

    // Criar cabeçalho da tabela
    const headerRow = tabela.insertRow();
    headerRow.insertCell().textContent = 'Diâmetro (mm)';
    headerRow.insertCell().textContent = 'Declividade (m/m)';
    headerRow.insertCell().textContent = 'Vazão (m³/s)';

    // Preencher a tabela com os dados
    for (let i = 0; i < diametros.length; i++) {
        for (let j = 0; j < declividades.length; j++) {
            const row = tabela.insertRow();
            row.insertCell().textContent = diametros[i];
            row.insertCell().textContent = declividades[j].toFixed(3);
            row.insertCell().textContent = vazoes[i][j].toFixed(3);
        }
    }

    // Adicionar botão para exportar para Excel
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar para Excel';
    exportBtn.id = 'export-btn';
    exportBtn.addEventListener('click', () => exportarParaExcel(diametros, declividades, vazoes));
    document.getElementById('tabela-resultados').appendChild(exportBtn);
}

function exportarParaExcel(diametros, declividades, vazoes) {
    // Criar um novo workbook e worksheet usando a biblioteca SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
        ['Diâmetro (mm)', 'Declividade (m/m)', 'Vazão (m³/s)'] // Cabeçalho
    ]);

    // Adicionar os dados à worksheet
    let row = 1;
    for (let i = 0; i < diametros.length; i++) {
        for (let j = 0; j < declividades.length; j++) {
            XLSX.utils.sheet_add_aoa(ws, [[diametros[i], declividades[j].toFixed(3), vazoes[i][j].toFixed(3)]], { origin: `A${row}` });
            row++;
        }
    }

    // Adicionar a worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');

    // Salvar o arquivo Excel
    XLSX.writeFile(wb, 'resultados_simulacao.xlsx');
}
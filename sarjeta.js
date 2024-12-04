function calcular() {
    // Obter os valores dos inputs
    const n = parseFloat(document.getElementById("rugosidade").value);
    const Ir = parseFloat(document.getElementById("inclinacao").value);
    const Il = parseFloat(document.getElementById("declividade").value);
    const hInicial = parseFloat(document.getElementById("laminaInicial").value);
    const hFinal = parseFloat(document.getElementById("laminaFinal").value);
  
    // Calcular valores de h
    const h_values = [];
    for (let i = hInicial; i <= hFinal; i += 0.01) {
      h_values.push(i);
    }
  
    // Calcular as variáveis (similar ao código Python)
    const results = [];
    for (const h of h_values) {
      const b = h / Ir;
      const A = (h * b) / 2;
      const P = h + Math.sqrt(h**2 + b**2);
      const Rh = A / P;
      const V = (1 / n) * Rh**(2/3) * Il**(1/2);
      const Q = (V * A);
      const Q2 = Q * 2; // Q2 é simplesmente Q * 2
  
      results.push({
        "Declividade (Il)": Il,
        "Lâmina (h)": h,
        "Base (b)": b,
        "Área (A)": A,
        "Perímetro (P)": P,
        "Raio Hidráulico (Rh)": Rh,
        "Velocidade (V)": V,
        "Vazão (Q)": Q,
        "Vazão 2 (Q2)": Q2
      });
    }
  
    // Gerar o gráfico
    gerarGrafico(h_values, results);
  
    // Exibir a tabela
    exibirTabela(results);
  }
  
  function gerarGrafico(h_values, results) {
    const canvas = document.getElementById('grafico');
    const ctx = canvas.getContext('2d');
  
    const Q_values = results.map(result => result["Vazão (Q)"]);
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: h_values.map(h => h.toFixed(2)),
        datasets: [{
          label: 'Vazão (Q)',
          data: Q_values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          pointRadius: 0 // Remover os pontos
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Lâmina d\'água (h) [m]'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Vazão (Q) [m³/s]'
            }
          }
        }
      }
    });
  }
  
  function exibirTabela(results) {
    const tabela = document.querySelector('#tabela-resultados table');
    tabela.innerHTML = ''; // Limpar a tabela
  
    // Criar cabeçalho da tabela
    const headerRow = tabela.insertRow();
    const keys = Object.keys(results[0]);
    keys.forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });
  
    // Preencher a tabela com os dados
    results.forEach(result => {
      const row = tabela.insertRow();
      keys.forEach(key => {
        const cell = row.insertCell();
        cell.textContent = result[key].toFixed(3);
      });
    });
  
    // Adicionar botão para exportar para Excel
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', () => exportarParaExcel(results));
  }
  
  function exportarParaExcel(results) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(results);
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
    XLSX.writeFile(wb, 'resultados_sarjeta.xlsx');
  }
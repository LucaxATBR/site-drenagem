function calcular() {
    // Obter os valores dos inputs
    const D = parseFloat(document.getElementById("diametro").value);
    const Il = parseFloat(document.getElementById("declividade").value);
    const n = parseFloat(document.getElementById("rugosidade").value);
  
    // Calcular valores de Y (começando em D/2 e variando até D)
    const y = [];
    for (let i = D / 2; i <= D; i += 0.01) {
      y.push(i);
    }
  
    // Calcular as variáveis (similar ao código Python)
    const razao_y_D = y.map(val => val / D);
    const um_menos_2y_D = y.map(val => 1 - (2 * val / D));
    const theta = um_menos_2y_D.map(val => 2 * Math.acos(val));
    const T = theta.map(val => D * Math.sin(val / 2));
    const Pm = theta.map(val => val * D / 2);
    const S = theta.map(val => (D**2 / 8) * (val - Math.sin(val)));
    const Rh = S.map((val, index) => val / Pm[index]);
    const V = Rh.map(val => (1 / n) * val**(2 / 3) * Il**(1 / 2));
    const Q = S.map((val, index) => val * V[index]);
    const Q_plena = (1 / n) * (D / 4)**(2 / 3) * Il**(1 / 2) * (Math.PI * D**2) / 4;
    const razao_Q_Qplena = Q.map(val => val / Q_plena);
  
    // Gerar o gráfico
    gerarGrafico(y, razao_Q_Qplena);
  
    // Exibir a tabela
    exibirTabela(y, razao_y_D, um_menos_2y_D, theta, T, Pm, S, Rh, V, Q, razao_Q_Qplena);
  }
  
  function gerarGrafico(y, razao_Q_Qplena) {
    const canvas = document.getElementById('grafico');
    const ctx = canvas.getContext('2d');
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: y.map(v => v.toFixed(2)),
        datasets: [{
          label: 'Q/Qplena',
          data: razao_Q_Qplena,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Altura da lâmina d\'água (m)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Q/Qplena'
            }
          }
        },
        elements: {
          point:{
              radius: 0
          }
        }
      }
    });
  }
  
  function exibirTabela(y, razao_y_D, um_menos_2y_D, theta, T, Pm, S, Rh, V, Q, razao_Q_Qplena) {
    const tabela = document.querySelector('#tabela-resultados table');
    tabela.innerHTML = ''; // Limpar a tabela
  
    // Criar cabeçalho da tabela
    const headerRow = tabela.insertRow();
    headerRow.insertCell().textContent = 'Y(m)';
    headerRow.insertCell().textContent = 'Y/D';
    headerRow.insertCell().textContent = '1-(2y/D)';
    headerRow.insertCell().textContent = 'θ (rad)';
    headerRow.insertCell().textContent = 'T (m)';
    headerRow.insertCell().textContent = 'Pm(m)';
    headerRow.insertCell().textContent = 'S(m2)';
    headerRow.insertCell().textContent = 'Rh(m)';
    headerRow.insertCell().textContent = 'V [m*s-1]';
    headerRow.insertCell().textContent = 'Q[m3*s-1]';
    headerRow.insertCell().textContent = 'Q/Qplena';
  
    // Preencher a tabela com os dados
    for (let i = 0; i < y.length; i++) {
      const row = tabela.insertRow();
      row.insertCell().textContent = y[i].toFixed(2);
      row.insertCell().textContent = razao_y_D[i].toFixed(3);
      row.insertCell().textContent = um_menos_2y_D[i].toFixed(3);
      row.insertCell().textContent = theta[i].toFixed(3);
      row.insertCell().textContent = T[i].toFixed(3);
      row.insertCell().textContent = Pm[i].toFixed(3);
      row.insertCell().textContent = S[i].toFixed(3);
      row.insertCell().textContent = Rh[i].toFixed(3);
      row.insertCell().textContent = V[i].toFixed(3);
      row.insertCell().textContent = Q[i].toFixed(3);
      row.insertCell().textContent = razao_Q_Qplena[i].toFixed(3);
    }
  
    // Adicionar botão para exportar para Excel
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', () => exportarParaExcel(y, razao_y_D, um_menos_2y_D, theta, T, Pm, S, Rh, V, Q, razao_Q_Qplena));
  }
  
  function exportarParaExcel(y, razao_y_D, um_menos_2y_D, theta, T, Pm, S, Rh, V, Q, razao_Q_Qplena) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Y(m)', 'Y/D', '1-(2y/D)', 'θ (rad)', 'T (m)', 'Pm(m)', 'S(m2)', 'Rh(m)', 'V [m*s-1]', 'Q[m3*s-1]', 'Q/Qplena']
    ]);
  
    for (let i = 0; i < y.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, [[
        y[i].toFixed(2),
        razao_y_D[i].toFixed(3),
        um_menos_2y_D[i].toFixed(3),
        theta[i].toFixed(3),
        T[i].toFixed(3),
        Pm[i].toFixed(3),
        S[i].toFixed(3),
        Rh[i].toFixed(3),
        V[i].toFixed(3),
        Q[i].toFixed(3),
        razao_Q_Qplena[i].toFixed(3)
      ]], { origin: -1 });
    }
  
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
    XLSX.writeFile(wb, 'dados_hidraulicos.xlsx');
  }
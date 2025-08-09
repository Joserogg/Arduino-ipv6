// Configuración común para las gráficas
const layoutBase = {
  xaxis: {
    title: 'Fecha y hora',
    showgrid: true,
    gridcolor: '#eaeaea',
    tickfont: { family: 'Quicksand', color: '#555' },
    titlefont: { size: 14, color: '#888' }
  },
  yaxis: {
    showgrid: true,
    gridcolor: '#eaeaea',
    tickfont: { family: 'Quicksand', color: '#555' },
    titlefont: { size: 14, color: '#888' }
  },
  font: {
    family: 'Quicksand, sans-serif',
    size: 13,
    color: '#444'
  },
  plot_bgcolor: '#fff',
  paper_bgcolor: '#fff',
  margin: { t: 10, l: 50, r: 30, b: 50 },
  hovermode: 'x unified',
  responsive: true,
  autosize: true
};

// Configuración de Plotly para ocultar controles
const configPlotly = {
  displayModeBar: false,
  responsive: true,
  useResizeHandler: true
};

// Calcular rango dinámico para Y
function calcularRangoY(valores) {
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const padding = (max - min) * 0.1 || 1;
  return {
    yMin: Math.min(min - padding, 0),
    yMax: max + padding
  };
}

// Inicializar gráficas
function inicializarGraficas(datos) {
  const tiempos = datos.map(d => d.fecha);
  const temperaturas = datos.map(d => parseFloat(d.temperatura));
  const humedades = datos.map(d => parseFloat(d.humedad));

  const rangoTemp = calcularRangoY(temperaturas);
  const rangoHum = calcularRangoY(humedades);

  Plotly.newPlot('graficaTemperatura', [{
    x: tiempos,
    y: temperaturas,
    fill: 'tozeroy',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'rgba(78, 115, 223, 1)', width: 3 },
    marker: { color: 'rgba(78, 115, 223, 1)', size: 6 },
    fillcolor: 'rgba(78, 115, 223, 0.2)'
  }], {
    ...layoutBase,
    yaxis: { ...layoutBase.yaxis, title: '°C', range: [rangoTemp.yMin, rangoTemp.yMax] }
  }, configPlotly);

  Plotly.newPlot('graficaHumedad', [{
    x: tiempos,
    y: humedades,
    fill: 'tozeroy',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'rgba(28, 200, 138, 1)', width: 3 },
    marker: { color: 'rgba(28, 200, 138, 1)', size: 6 },
    fillcolor: 'rgba(28, 200, 138, 0.2)'
  }], {
    ...layoutBase,
    yaxis: { ...layoutBase.yaxis, title: '%', range: [rangoHum.yMin, rangoHum.yMax] }
  }, configPlotly);
}

// Actualizar gráficas cada 5 segundos
function actualizarGraficas(datos) {
  const tiempos = datos.map(d => d.fecha);
  const temperaturas = datos.map(d => parseFloat(d.temperatura));
  const humedades = datos.map(d => parseFloat(d.humedad));

  const rangoTemp = calcularRangoY(temperaturas);
  const rangoHum = calcularRangoY(humedades);

  Plotly.react('graficaTemperatura', [{
    x: tiempos,
    y: temperaturas,
    fill: 'tozeroy',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'rgba(78,115,223,1)', width: 3 },
    marker: { size: 6, color: 'rgba(78,115,223,1)' },
    fillcolor: 'rgba(78,115,223,0.2)'
  }], {
    ...layoutBase,
    yaxis: { ...layoutBase.yaxis, title: '°C', range: [rangoTemp.yMin, rangoTemp.yMax] }
  }, configPlotly);

  Plotly.react('graficaHumedad', [{
    x: tiempos,
    y: humedades,
    fill: 'tozeroy',
    type: 'scatter',
    mode: 'lines+markers',
    line: { shape: 'spline', color: 'rgba(28,200,138,1)', width: 3 },
    marker: { size: 6, color: 'rgba(28,200,138,1)' },
    fillcolor: 'rgba(28,200,138,0.2)'
  }], {
    ...layoutBase,
    yaxis: { ...layoutBase.yaxis, title: '%', range: [rangoHum.yMin, rangoHum.yMax] }
  }, configPlotly);

  mostrarValoresActuales(temperaturas.at(-1), humedades.at(-1));
}

// Mostrar valores actuales + alertas
function mostrarValoresActuales(temperatura, humedad) {
  document.getElementById('valorTemperatura').textContent = `${temperatura.toFixed(1)} °C`;
  document.getElementById('valorHumedad').textContent = `${humedad.toFixed(1)} %`;

  const alertas = [];

  if (temperatura >= 30) {
    alertas.push(`<div class="alerta alerta-roja">Alerta: Temperatura elevada (${temperatura.toFixed(1)} °C)</div>`);
  }
  if (temperatura <= 12) {
    alertas.push(`<div class="alerta alerta-azul">Temperatura muy baja (${temperatura.toFixed(1)} °C)</div>`);
  }
  if (humedad < 45) {
    alertas.push(`<div class="alerta alerta-naranja">Humedad muy baja (${humedad.toFixed(1)} %)</div>`);
  }
  if (humedad > 80) {
    alertas.push(`<div class="alerta alerta-celeste">Humedad muy alta (${humedad.toFixed(1)} %)</div>`);
  }

  document.getElementById('alertas').innerHTML = alertas.join('');
}

// Iniciar la app
fetch('backend/ver_datos.php')
  .then(res => res.json())
  .then(datos => {
    inicializarGraficas(datos);
    setInterval(() => {
      fetch('backend/ver_datos.php')
        .then(res => res.json())
        .then(actualizarGraficas)
        .catch(err => console.error('Error al actualizar datos:', err));
    }, 5000);
  })
  .catch(err => console.error('Error al cargar datos iniciales:', err));

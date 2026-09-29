export class ChartRenderer {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    this.ctx = canvas.getContext('2d');
    this.chart = null;
  }

  render(labels, cardiacData, spo2Data) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = cardiacData;
      this.chart.data.datasets[1].data = spo2Data;
      this.chart.update('none');
      return;
    }

    // Plugin para pintar las franjas de zonas de fondo en el gráfico
    const zoneBackgroundPlugin = {
      id: 'zoneBackgrounds',
      beforeDraw: (chart) => {
        const { ctx, chartArea: { left, right }, scales: { yCardiac } } = chart;
        if (!yCardiac) return;

        const zones = [
          { from: 0, to: 90, color: 'rgba(59, 130, 246, 0.08)' },      // Reposo
          { from: 90, to: 108, color: 'rgba(16, 185, 129, 0.12)' },    // Z1 Calentamiento
          { from: 108, to: 126, color: 'rgba(234, 179, 8, 0.12)' },    // Z2 Aeróbica Ligera
          { from: 126, to: 144, color: 'rgba(249, 115, 22, 0.12)' },   // Z3 Aeróbica / Umbral
          { from: 144, to: 200, color: 'rgba(239, 68, 68, 0.15)' }     // Z4 / Z5 Máximo
        ];

        zones.forEach(zone => {
          const top = yCardiac.getPixelForValue(zone.to);
          const bottom = yCardiac.getPixelForValue(zone.from);
          ctx.save();
          ctx.fillStyle = zone.color;
          ctx.fillRect(left, Math.min(top, bottom), right - left, Math.abs(bottom - top));
          ctx.restore();
        });
      }
    };

    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ritmo Cardíaco (BPM)',
            data: cardiacData,
            borderColor: '#ef4444',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            tension: 0.35,
            yAxisID: 'yCardiac'
          },
          {
            label: 'SpO2 (%)',
            data: spo2Data,
            borderColor: '#06b6d4',
            borderDash: [4, 4],
            borderWidth: 1.5,
            tension: 0.2,
            yAxisID: 'ySpO2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          yCardiac: {
            min: 50,
            max: 160,
            title: { display: true, text: 'BPM', color: '#ef4444' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          ySpO2: {
            position: 'right',
            min: 85,
            max: 100,
            title: { display: true, text: 'SpO2 %', color: '#06b6d4' },
            grid: { drawOnChartArea: false },
            ticks: { color: '#94a3b8' }
          }
        }
      },
      plugins: [zoneBackgroundPlugin]
    });
  }
}
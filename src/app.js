import { CONFIG } from './config.js';
import { FirebaseService } from './services/firebaseService.js';
import { ChartRenderer } from './ui/chartRenderer.js';

class BioPulseApp {
  constructor() {
    this.chartRenderer = new ChartRenderer('telemetriaChart');
    this.cachedHistorial = [];
    this.initElements();
  }

  initElements() {
    this.elPaciente = document.getElementById('val-paciente');
    this.elRitmo = document.getElementById('val-ritmo');
    this.elSpo2 = document.getElementById('val-spo2');
    this.elZona = document.getElementById('val-zona');
    this.elTimestamp = document.getElementById('val-timestamp');
    this.elAlertBox = document.getElementById('alert-box');

    this.elSpo2Avg = document.getElementById('val-spo2-avg');
    this.elSpo2Min = document.getElementById('val-spo2-min');
    this.elDuracion = document.getElementById('val-duracion');

    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => this.exportarCSV());
    }
  }

  async syncDashboard() {
    try {
      const [actual, historial] = await Promise.all([
        FirebaseService.fetchActual(),
        FirebaseService.fetchHistorial()
      ]);

      if (actual) this.updateCurrentView(actual);
      if (historial.length > 0) {
        this.cachedHistorial = historial;
        this.updateHistoricalView(historial);
        this.computeStats(historial);
      }
    } catch (err) {
      this.showAlert('Error al conectar con la base de datos de Firebase');
    }
  }

  updateCurrentView(data) {
    this.elPaciente.textContent = `${data.Paciente} (${data.Edad} años) — ${data.Deporte}`;
    this.elRitmo.textContent = `${data.RitmoCardiaco} BPM`;
    this.elSpo2.textContent = `${data.SpO2} %`;
    this.elZona.textContent = data.ZonaConfigurada;
    this.elTimestamp.textContent = `Último envío: ${data.Timestamp}`;

    const fcm = 220 - data.Edad;
    if (data.SpO2 < CONFIG.ALERT_THRESHOLDS.MIN_SPO2) {
      this.showAlert(`⚠️ ALERTA: SpO2 baja (${data.SpO2}%). Hipoxia detectada.`);
    } else if (data.RitmoCardiaco > fcm * CONFIG.ALERT_THRESHOLDS.MAX_HEART_RATE_BUFFER) {
      this.showAlert(`⚠️ ALERTA: Taquicardia / Zona Crítica (${data.RitmoCardiaco} BPM).`);
    } else {
      this.clearAlert();
    }
  }

  computeStats(historial) {
    const spo2Values = historial.map(h => h.SpO2);
    const avgSpo2 = Math.round(spo2Values.reduce((a, b) => a + b, 0) / spo2Values.length);
    const minSpo2 = Math.min(...spo2Values);

    this.elSpo2Avg.textContent = `${avgSpo2}%`;
    this.elSpo2Min.textContent = `${minSpo2}%`;
    this.elDuracion.textContent = `${historial.length * 2} s`; // 1 muestra cada ~2 segundos
  }

  updateHistoricalView(historial) {
    const labels = historial.map(item => item.Timestamp.split(' ')[1] || item.Timestamp);
    const cardiacPoints = historial.map(item => item.RitmoCardiaco);
    const spo2Points = historial.map(item => item.SpO2);

    this.chartRenderer.render(labels, cardiacPoints, spo2Points);
  }

  exportarCSV() {
    if (!this.cachedHistorial.length) return;
    const encabezados = "Timestamp,Paciente,Edad,Deporte,RitmoCardiaco,SpO2,ZonaConfigurada\n";
    const filas = this.cachedHistorial.map(r => 
      `"${r.Timestamp}","${r.Paciente}",${r.Edad},"${r.Deporte}",${r.RitmoCardiaco},${r.SpO2},"${r.ZonaConfigurada}"`
    ).join("\n");

    const blob = new Blob([encabezados + filas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `telemetria_${Date.now()}.csv`;
    link.click();
  }

  showAlert(message) {
    this.elAlertBox.textContent = message;
    this.elAlertBox.classList.remove('hidden');
  }

  clearAlert() {
    this.elAlertBox.classList.add('hidden');
  }

  start() {
    this.syncDashboard();
    setInterval(() => this.syncDashboard(), CONFIG.POLLING_INTERVAL_MS);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new BioPulseApp();
  app.start();
});
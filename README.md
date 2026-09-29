# BioPulse-Vital 🫀⚡

Sistema de monitoreo biométrico y telemetría en tiempo real diseñado para procesar métricas de esfuerzo deportivo consumidas desde una base de datos NoSQL distribuida en **Google Firebase Realtime Database**.

---

## 📌 Escenario del Proyecto

El sistema aborda la supervisión médica y deportiva de atletas en pruebas de fondo (*Running*). Mediante la captura de signos vitales transmitidos periódicamente, el dashboard permite:
1. **Monitoreo instantáneo:** Muestra el ritmo cardíaco (BPM), la saturación de oxígeno arterial ($SpO_2$) y la fase o zona de entrenamiento (Calentamiento, Aeróbico, Enfriamiento o Reposo).
2. **Historial de esfuerzo:** Grafica la evolución temporal de las variables biométricas en dos ejes independientes.
3. **Mecanismo de alertas clínicas:** Detecta automáticamente eventos de desaturación ($SpO_2 < 95\%$) o frecuencia cardíaca crítica basándose en la edad del paciente.

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 semántico, CSS3 moderno (Custom Properties / Flexbox / Grid), JavaScript ES6 Modules (arquitectura desacoplada sin dependencias pesadas).
- **Visualización de Datos:** Chart.js (Dual Y-Axis).
- **Base de Datos NoSQL:** Firebase Realtime Database.
- **Protocolo de Integración:** REST API (`GET /telemetria/{actual,historial}.json`).

---

## 📐 Diagrama de Flujo

[ Sensor / Emulador IoT ]
│
▼
[ Firebase Realtime Database (NoSQL) ]
│ (REST Polling / HTTP GET)
▼
[ FirebaseService (JS ES6) ]
│
▼
[ BioPulseApp Controller ] ──────▶ [ ChartRenderer (Chart.js) ]
│
├─▶ Métricas Instantáneas (BPM, SpO2, Zona)
└─▶ Motor de Alertas Clínicas

---

## 🚀 Puesta en Marcha Local

Dado que el código utiliza módulos nativos de JavaScript (`import`/`export`), debe ejecutarse a través de un servidor HTTP local:

1. **Con extensión de VS Code:**
   - Instala la extensión **Live Server**.
   - Haz clic derecho sobre `index.html` y presiona **Open with Live Server**.

2. **Con Python:**
   ```bash
   python -m http.server 8000

   Abre en el navegador: http://localhost:8000
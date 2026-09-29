export const CONFIG = {
  FIREBASE_URL: 'https://fir-signos-vitales-default-rtdb.firebaseio.com/telemetria',
  POLLING_INTERVAL_MS: 3000,
  ALERT_THRESHOLDS: {
    MIN_SPO2: 95,
    MAX_HEART_RATE_BUFFER: 0.90 // Alerta si supera el 90% de la FCM teórica (220 - edad)
  }
};
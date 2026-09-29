import { CONFIG } from '../config.js';

export class FirebaseService {
  static async fetchActual() {
    try {
      const response = await fetch(`${CONFIG.FIREBASE_URL}/actual.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al consultar telemetría actual:', error);
      throw error;
    }
  }

  static async fetchHistorial() {
    try {
      const response = await fetch(`${CONFIG.FIREBASE_URL}/historial.json`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data ? Object.values(data) : [];
    } catch (error) {
      console.error('Error al consultar historial:', error);
      throw error;
    }
  }
}
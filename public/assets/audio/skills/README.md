# Audio dla sekcji Umiejętności (Skills)

## Sugerowane pliki audio:

### 1. Przegląd umiejętności
**Nazwa pliku:** `skills-overview.mp3`
**Opis:** Ogólne wprowadzenie do Twoich kompetencji technicznych
**Długość:** 60-90 sekund

### 2. Automatyzacja przemysłowa
**Nazwa pliku:** `automation-expertise.mp3`
**Opis:** Szczegółowy opis doświadczenia z PLC, robotyką, SCADA
**Długość:** 90-120 sekund

### 3. Programowanie i IoT
**Nazwa pliku:** `programming-iot.mp3`
**Opis:** Opis umiejętności programistycznych: React, Python, IoT
**Długość:** 60-90 sekund

### 4. Zarządzanie projektami
**Nazwa pliku:** `project-management.mp3`
**Opis:** Doświadczenie w zarządzaniu projektami i zespołami
**Długość:** 60-90 sekund

## Przykład integracji:

Dodaj ścieżkę do pliku w `content/content.json`:

```json
"skills": {
  "title": "Kompetencje Techniczne",
  "audio": "/assets/audio/skills/skills-overview.mp3",
  "categories": [
    {
      "id": "automation",
      "name": "Automatyzacja Przemysłowa",
      "audio": "/assets/audio/skills/automation-expertise.mp3",
      ...
    }
  ]
}
```

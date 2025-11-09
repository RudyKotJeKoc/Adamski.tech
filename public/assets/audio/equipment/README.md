# Audio dla sekcji Wyposażenie (Equipment)

## Sugerowane pliki audio:

### 1. Przegląd wyposażenia
**Nazwa pliku:** `equipment-overview.mp3`
**Opis:** Ogólne wprowadzenie do Twojego wyposażenia technicznego
**Długość:** 60-90 sekund

### 2. Opisy kategorii sprzętu:

**Nazwa pliku:** `automation-hardware.mp3`
- Opis sprzętu automatyzacji (PLC, HMI, czujniki)
- Długość: 60-90 sekund

**Nazwa pliku:** `workshop-tools.mp3`
- Opis narzędzi warsztatowych
- Długość: 60-90 sekund

**Nazwa pliku:** `3d-printing.mp3`
- Opis sprzętu do druku 3D
- Długość: 60-90 sekund

**Nazwa pliku:** `measurement-tools.mp3`
- Opis narzędzi pomiarowych
- Długość: 60-90 sekund

## Przykład integracji:

```json
"equipment_inventory": {
  "title": "Wyposażenie Techniczne",
  "audio": "/assets/audio/equipment/equipment-overview.mp3",
  "categories": [
    {
      "name": "Sprzęt Automatyzacji",
      "audio": "/assets/audio/equipment/automation-hardware.mp3",
      "items": [...]
    }
  ]
}
```

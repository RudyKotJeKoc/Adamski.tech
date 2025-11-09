# Audio dla sekcji Timeline kariery (Career)

## Sugerowane pliki audio:

### Format nazwy:
`career-[rok-start]-[rok-koniec].mp3` lub `career-[firma].mp3`

### Przykłady:

1. **career-overview.mp3**
   - Przegląd całej ścieżki kariery
   - Kluczowe etapy i osiągnięcia
   - Długość: 90-120 sekund

2. **career-2013-2015.mp3**
   - Opis stanowiska i obowiązków
   - Kluczowe projekty i osiągnięcia
   - Długość: 60-90 sekund

3. **career-2015-2020.mp3**
   - Rozwój kompetencji
   - Awanse i nowe odpowiedzialności
   - Długość: 60-90 sekund

4. **career-2020-present.mp3**
   - Obecna rola i projekty
   - Kierunki rozwoju
   - Długość: 60-90 sekund

## Przykład integracji:

```json
"career_timeline": {
  "title": "Timeline kariery",
  "audio": "/assets/audio/career/career-overview.mp3",
  "milestones": [
    {
      "id": "2020-present",
      "period": "2020 – obecnie",
      "role": "Senior Multi-Disciplinary Specialist",
      "audio": "/assets/audio/career/career-2020-present.mp3",
      ...
    }
  ]
}
```

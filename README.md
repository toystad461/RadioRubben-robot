# RadioRubben-robot

**RR Robot** er Radio Rubbens digitale redaksjonsmotor.

Målet er å samle data fra identifiserbare kilder, normalisere dem til redaksjonelle hendelser og bruke dem videre i Fotballroboten, nyhetsdesk, radiomanus, RadioRubben.no, studio.radiorubben.no og sosiale medier.

## Første milepæl – v0.1

Fotball er første modul.

Flyten vi bygger er:

```text
Kilde
  ↓
Normalisering
  ↓
RR Event
  ↓
Verifisering
  ↓
Redaksjonell behandling
  ↓
Utkast / Studio / Publisering
```

En ferdig kamp skal ikke bare utløse en tekstgenerator. Kampdata skal først registreres som strukturerte fakta med kilde, tidspunkt og status.

## Prinsipper

1. **Data først, AI etterpå.**
2. **Kilden skal kunne spores.**
3. **Fakta og redaksjonell tekst holdes adskilt.**
4. **Automatisering skal kunne styres i nivåer fra manuelt utkast til eventuell automatisk publisering.**
5. **Nye kilder skal kunne legges til som moduler uten å bygge systemet på nytt.**

## Struktur

```text
src/
├── core/
│   ├── events.ts
│   └── logger.ts
├── sources/
│   └── football/
│       ├── events.ts
│       └── types.ts
└── index.ts
```

Neste områder vil bygges inn rundt samme eventmodell:

- Fotball
- lokale nyheter / RSS
- trafikk
- vær
- arrangementer
- radiomanus og nyhetsoversikter
- WordPress
- studio.radiorubben.no
- sosiale medier

## Lokal utvikling

Krever Node.js 20 eller nyere.

```bash
npm install
npm run typecheck
npm run dev
```

Kopier `.env.example` til `.env` når integrasjoner begynner å kreve konfigurasjon. Hemmeligheter skal aldri lagres i Git.

## Status

**RR Robot v0.1 – grunnstruktur etablert.**

Neste konkrete oppgave er å koble eksisterende Fotballrobot-logikk til denne strukturen og få første reelle kamp inn som en `football.match.*`-hendelse.

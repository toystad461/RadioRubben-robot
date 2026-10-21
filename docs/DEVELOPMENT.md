# RR Robot – startpunkt for utvikling

Kontrollgrunnlag 21.10.2026: main `8feae8aa35d604a817dd50a3ece091d6b3da8d4e`.
Arbeidsområde: System & Kvalitet / Manus & Stikk / Teknisk Produksjon.

## Faktisk omfang

TypeScript-grunnstruktur med hendelser, Bømlo-RSS-import/eksport og teknisk
artikkelkontroll. `src/index.ts` skriver start-/milepælsmeldinger og oppretter
ingen varig worker eller scheduler. `npm start` er ikke en produksjonsrobot.
`src/editorial/quality-gate.ts` returnerer alltid `publishable: false`.
Det er tilsiktet: ingen autentisert redaktørgodkjenning/publisering finnes her.

Studio-repoets PHP-kode har den eksisterende nyhetsdesken. Web-repoet har
WordPress/Fotballrobot i flere grener. Velg komponent ut fra faktisk kjørende
kode; ikke bygg en konkurrerende publiseringsmotor fordi dette repoet heter Robot.
Åpen PR #1 (`f22ac878`) gjelder første kampimport. Ingen check-runs ble funnet
på denne headen ved audit; det er ikke bevis for at koden er testet mot dagens main.

## Reproduserbar kontroll

CI bruker Node 24 og låst `package-lock.json`. Kjør fra repoets rot på Windows,
Mac eller en isolert Linux-utviklingsmaskin med Node/npm installert:

```sh
npm ci
npm run typecheck
npm test
```

Audit kjørte avhengighetsinstallasjon uten installasjonsskript, typekontroll,
bygg og alle seks tester med syntetiske data: bestått. Dette omfatter ikke
ekte modellkvalitet, levende RSS, WordPress-transport eller VPS-drift.
`ingest:bomlo` og `export:bomlo` er jobber, ikke en erstatning for en varig
kø/scheduler. Test med fixture før ekte kilder og lagring tas i bruk.

## Neste tekniske milepæl

Avstem #1 mot main og eksisterende Fotballrobot. Definer én faktisk integrasjon
med stabil hendelses-ID, kildeversjon, idempotent behandling, tidsavbrudd,
begrensede nye forsøk og synlig feilkø. Vis en syntetisk hendelse gjennom hele
løpet før aktivering mot produksjonskilder. Bevar nyhetsgodkjenningen i Studio.

## Bruk av verktøy

Chat/Work avklarer journalistisk mål og kildegrunnlag. GitHub-oppgaven beskriver
resultat og tester. Codex leser AGENTS.md og faktisk kode. PR-en er overleveringen:
repo, base/head, ferdigkriterium, testresultat, målmiljø og neste steg.
Ikke anta at andre samtaler eller prosjektinstruksjoner følger automatisk med.

Ruleset 24734546 beskytter main med PR, avklarte tråder og jobben `test`.
Grønn CI og merge er separate fra faktisk utrulling. Bevar tidligere gitt
autorisasjon for samme leveranse; dokumentér nye avvik før omfanget utvides.

# AI-policy – implementeringsstatus for Robot

## Denne PR-en

Base: Robot #3, `feat/editorial-quality-gate`,
`5b599db7efb86204798b0487db3f291175438f5e`. Eksisterende PR #3 og #1 er urørt.
Dette er en liten stablet PR; målgrenen er #3, ikke main.

Implementert:
- Felles `AI-POLICY.md` v1.0 og `AGENTS.md` med henvisning.
- `reviewArticle` returnerer aldri publiseringstillatelse. `publishable` er alltid
  `false`; `readyForEditorialApproval` angir bare om tekniske kontroller besto.
  Dette er en bevisst kontraktsendring fra #3. Ingen produksjonskonsument er påvist.
- Metadata: policyversjon, regelversjon og SHA-256 av kontrollert tekst og fakta.
  Hashene identifiserer inngangen; de beviser ikke at friteksten eller kilden er sann.
- Eksisterende CI kjører TypeScript-kontroll og alle Node-tester. Nye negative
  kontroller hindrer at bestått språkvask blir menneskelig sluttgodkjenning.

Validering: lokal TypeScript-kompilering og alle 6 Node-tester besto.
Ingen WordPress-bro eller autentisert menneskelig godkjenningsflyt er bygget her.
Bruk den eksisterende redaksjonelle flyten i Studio/Web ved senere integrasjon.

## Kartlagt før endring – 2026-10-08

Egne kloner og grenen `policy/ai-v1` brukes fordi prosjektmappen ikke er et Git-repo
(managed-worktree svarte «Not a git repository»). Andre grener og lokale endringer
ble ikke skrevet til. Åpne PR-er og alle fjernreferanser ble lest fra GitHub.

| Repo | main ved kartlegging | Åpne PR-er | Relevant arbeid |
| --- | --- | --- | --- |
| Robot | `e9fcdab676c58fbf4bd017e1a1beace64011e197` | 2 | #1 import; #3 språk-/kvalitetskontroll |
| Studio | `1aff7adeb2b90c9576265c70f06bab141a1519a0` | 11 | #51 læring → #55 AI-journalist; #53 direkte regler overlapper; #52 produksjonsavstemming; #47/#48 app/CRM; #21 Render-test |
| Web | `9006e82e1ebc91e2a128cf2d3e263470e16db8e0` | 30 | #63 historisk 0.10.4 → #30 0.10.5; #67 avstemming → #68–71 nettside/quiz; #72 blokktema; #29–49 historisk fotballkjede |

Studio bruker PHP på Uniweb. Siste dokumenterte deploykjøring
[37739713565](https://github.com/toystad461/radiorubben-studio/actions/runs/37739713565)
ble lest på nytt: success, main `1aff7ad`, 2026-10-08 06:50 UTC.
PR #55 dokumenterer kontroll av 491 faktiske filer kl. 14:36 UTC og ni bevarte
kilde/runtime-forskjeller. Denne oppgaven har ikke gjentatt hele serverhashkontrollen.
`studio-release.yml` kan deploye fra main. Render-PR-en er ikke produksjonsbevis.

WordPress ble lest via autentisert GET `/wp/v2/plugins`: Fotballrobot **0.10.5**
er aktiv. Spillerwidget er 1.3.0 og Site Functions 1.0.0-rc.4. Dette bekrefter
versjoner/aktiv status, ikke byteidentitet av alle filer. Derfor brukes Web #30
som fotballbase, ikke #67s eldre 0.10.4-kandidat. TypeScript-Robot er ikke påvist
som aktiv produksjonsjournalist; Studio har sin egen RSS-flyt.

GitHub rulesets-lesing ga **403 med krav om GitHub Pro eller offentlig repo** i
alle tre repoene. CI-tester er implementert, men nye obligatoriske merge-sperrer
er ikke konfigurert eller påstått. Ingen eksisterende innstillinger er endret.

## Dokumentert krav, ikke ferdig implementert

- Komplett mediekontrakt for syntetisk tale og AI-bilder, med filhash, korrekt
  merking i hver kanal, godkjenning av ferdig medium og negative publiseringstester.
  Policyfeltet alene dekker ikke dette. Studio har parallelt, ukommittert lydarbeid;
  det er ikke tatt inn eller redigert i denne leveransen.
- Full produksjonsavstemming, ende-til-ende-test mot autentisering/WordPress,
  reelle modellsvar og redaksjonelt review av kvalitet. Mockede modellsvar måler
  sperrer, ikke modellens sannhetsgehalt.
- Publikumsversjonen på «Om oss». Denne PR-en publiserer ingen nettsidetekst.
- Påkrevde GitHub-kontroller må avklares med tilgjengelig abonnement og regler.

## Utrullingsgrense

Ingen merge, deploy, workflow-dispatch, artikkelpublisering, læringsaktivering
eller endring av produksjonsdata. En separat godkjent utrulling må avstemme ferske
serverhasher, eksakt filsett, avhengigheter, backup og tilbakeføring. Ikke last opp
en hel gren. Historiske release-manifester skal ikke omskrives til den nye koden.

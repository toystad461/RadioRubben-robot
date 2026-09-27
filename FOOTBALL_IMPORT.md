# Første kampimport – RR Robot v0.1

`npm run import:football -- examples/bremnes-viggo-8985491.json` skriver én `football.match.finished`-hendelse og et faktabasert redaksjonelt utkast som JSON til stdout. Bruk egen fil med samme felter for neste kamp. Redirect til en lokal fil om du ønsker å ta vare på resultatet.

Eksempelet er Bremnes–Viggo 25. september 2026, FIKS-ID 8985491. Resultat 2–2, kampstart, lag, stadion, turnering og «Kampen er slutt» ble kontrollert mot [kampens NFF-side](https://www.fotball.no/fotballdata/kamp/?fiksId=8985491) 27. september. `observedAt` angir når sluttstatus ble observert, ikke tidspunktet for sluttsignalet.

Importen krever eksplisitt `finished`, FIKS-ID som samsvarer med kanonisk kilde-URL, gyldige tidspunkt og heltallsresultat. Den utleder aldri sluttstatus fra resultat alene. Stabil event-ID lar en senere lagring gjøre importen idempotent. Utkastet blir `review`, og `verificationStatus` forblir `unverified` inntil redaksjonell kontroll er utført. Ingen WordPress- eller Studio-publisering skjer.

NFF opplyser på siden at automatiserte roboter ikke er tillatt. Denne versjonen henter derfor ikke nettsiden automatisk. Den tar imot et kontrollert snapshot; videre automatisk innhenting krever en godkjent datatilgang. Den eksisterende Fotballrobotens serverkode er ikke i dette repositoryet og er ikke flyttet hit ennå.

Kjør `npm test` og `npm run typecheck` ved endringer. Neste steg er en vedvarende hendelseslagring, kildeavtale/importgrensesnitt og Studio-visning av utkast til vurdering.

## Eksport til Studio

`npm run export:studio -- /privat/robot-inbox.json examples/bremnes-viggo-8985491.json` lager en versjonert JSON-innboks for Studio. Flere snapshot-filer kan oppgis; samme hendelses-ID eksporteres bare én gang. Eksporten skriver først en midlertidig fil og flytter den på plass når den er komplett. Filen må overføres til Studio sin private `config/robot-inbox.json` når Studio er klart; dette skjer ikke automatisk. Se `docs/robot-inbox.md` i Studio-repoet.

Testtilgangen til fotballdata.no er ventet og gyldig ut oktober 2026. En kildeadapter bygges når dokumentasjon, tilgangsvilkår og et eksempel på faktisk API-respons foreligger. Ingen token skal inn i snapshot eller Git.

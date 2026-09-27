# Radio Rubbens redaksjonelle kvalitetskontroll

Reglene ligger i `src/editorial/editorial-rules.ts` og har egen versjon. Endringer i språkstandarden skal endre versjonsnummeret og testene.

Før WordPress-publisering skal en integrasjon kjøre:

1. Hent kampdata fra identifiserbar kilde og verifiser at kampen er slutt.
2. Lag artikkelutkast med `editorialPrompt()` som fast instruks.
3. Utfør uavhengig faktakontroll av resultat, dato, lag, navn og inn/ut-retning.
4. Kjør `reviewArticle(draft, verifiedFacts, languageReviewer)`.
5. Publiser bare når `publishable === true`. Ved funn eller feil i språkvasken: lagre utkast for manuell gjennomgang og logg funn samt `rulesVersion`.

`reviewArticle` er et grensesnitt, ikke en WordPress-kobling. Den aktive Fotballrobot-pluginen v0.9.0 har ikke kildekode i dette repoet. Før regelen kan gjelde nettstedet må pluginens genererings- og publiseringsfunksjoner kobles til denne kontrollen, eller kontrollen flyttes inn i pluginens eget kodelager. Ingen produksjonsflyt er endret av denne versjonen.

Kontrollen kan fange manglende verifiserte fakta og kjente språkfeil. Den kan ikke bevise at friteksten ellers er faktuelt riktig. Tvil og motstrid skal behandles redaksjonelt før publisering.

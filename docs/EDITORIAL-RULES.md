# Radio Rubbens redaksjonelle kvalitetskontroll

Reglene ligger i `src/editorial/editorial-rules.ts` og har egen versjon. Endringer i språkstandarden skal endre versjonsnummeret og testene.

Før WordPress-publisering skal en integrasjon kjøre:

1. Hent kampdata fra identifiserbar kilde og verifiser at kampen er slutt.
2. Lag artikkelutkast med `editorialPrompt()` som fast instruks.
3. Utfør uavhengig faktakontroll av resultat, dato, lag, navn og inn/ut-retning.
4. Kjør `reviewArticle(draft, verifiedFacts, languageReviewer)`.
5. `readyForEditorialApproval` betyr bare bestått teknisk kontroll. `publishable` er alltid `false`: dette repoet har ingen autentisert menneskelig sluttgodkjenning. Overlever til eksisterende redaksjonell godkjenningsflyt, og bevar policy-/regelversjon samt tekst-/faktahash. Ved funn eller kontrollfeil beholdes utkastet sperret.

`reviewArticle` er et grensesnitt, ikke en WordPress-kobling. Fotballrobotens produksjonskode ligger i `toystad461/radiorubben-web`; v0.9.0-referansen fra den opprinnelige PR-en er historisk. Før regelen kan gjelde nettstedet må pluginens genererings- og publiseringsfunksjoner kobles til denne kontrollen, eller kontrollen flyttes inn i pluginens eget kodelager. Ingen produksjonsflyt er endret av denne versjonen.

Kontrollen kan fange manglende verifiserte fakta og kjente språkfeil. Den kan ikke bevise at friteksten ellers er faktuelt riktig. Tvil og motstrid skal behandles redaksjonelt før publisering.

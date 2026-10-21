# Radio Rubben – arbeidsregler

Start i docs/DEVELOPMENT.md. Dette TypeScript-repoet er en grunnstruktur med
RSS- og kvalitetsmoduler, ikke påvist aktiv produksjonsjournalist. Studio har
egen PHP-nyhetsflyt og Web har Fotballrobot. Gjenbruk eksisterende kildekontrakter;
ikke flytt produksjonsansvar hit uten eksplisitt integrasjon og driftsbevis.

Kartlegg ferske grener, PR-er og produksjonsgrunnlag før endringer. Arbeid i en
egen avgrenset gren; bevar ukommittert arbeid, historikk og private data.
Bruk eksisterende arkitektur og tester. Historiske releasefiler er bevis og
skal ikke omskrives for å passe nye kodeendringer.

Kjør npm ci, npm run typecheck og npm test fra repoets rot. CI bruker Node 24.
Bruk syntetiske data og injiserte transport-/modellsvar. Dokumentasjonsarbeid
trenger ikke betalte modellkall eller nye tester som bare gjentar teksten.
Én konkret oppgave per PR. Oppgi base/head, tester, målmiljø og uavklarte forhold.
Fortsett selvstendig innenfor gitt autorisasjon; ikke be om samme bekreftelse igjen.

## Radio Rubbens AI-policy
Les og følg [AI-erklæring v1.0](docs/AI-POLICY.md) før endringer i generering,
kildekontroll, godkjenning, publisering, lyd, bilder eller læring. Bevar strengere
eksisterende regler. Se [implementeringsstatus](docs/AI-POLICY-IMPLEMENTATION.md)
for faktiske sperrer og gjenstående arbeid; ikke forveksle planlagt med aktivt.
Nye eller endrede redaksjonelle flyter skal ha målrettede negative tester for
manglende menneskelig godkjenning og endrede kilder/innhold/metadata.
Syntetisk tale og AI-bilder krever egen merking og sporbarhet etter policyen.
Rettelser kan gi versjonerte, separat godkjente læringsforslag, aldri automatisk
faktagrunnlag eller svakere kontroll. Ikke deploy, publiser eller merge til en
automatisk deploygren uten eksplisitt godkjenning. Bevar annet pågående arbeid.

## Nyere produktavklaring for TTS
Thomas avklarte 19.10.2026 at TTS-produksjon og kølegging skal kunne automatiseres
uten obligatorisk menneskelig godkjenning av hvert innslag. Dette nyere målet
har forrang fremfor historisk v1.0-policy som permanent produktkrav. Det aktiverer
ingen automatikk og endrer ikke dagens kode, policyversjonsfelt eller lagrede
godkjenninger. Nyhetspublisering beholder egen redaksjonell godkjenning.
Ny playout skal kunne fungere uten radio.co. OneDrive er dokument-/mediearkiv;
GitHub er kode og teknisk versjonshistorikk. Bruk kun verifiserte arkivlenker.

## Code Review Rules
- Ikke la teknisk kvalitetskontroll gi publiseringstillatelse. Dette repoet har
  ingen autentisert redaktør-/publiseringsgrense; publishable skal forbli false
  inntil en eksplisitt gjennomgått integrasjon håndhever den grensen.
- Bevar stabile kilde-ID-er, tidsstempel og innholdshasher ved import og retry.
  Gjenkjøringer må ikke produsere doble hendelser eller overskrive manuelle rettelser.
- Merk modelltester og strengkontroller som teknisk kontroll; de beviser ikke fakta.

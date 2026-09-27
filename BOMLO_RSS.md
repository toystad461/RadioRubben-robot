# Bømlo kommune – RSS i RR Robot

Kilde: [Aktuelt og kunngjeringar](https://www.bomlo.kommune.no/aktuelt-og-kunngjeringar/), som lenker til [RSS-strømmen](https://www.bomlo.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=26&Spraak=Nynorsk). Testet 27. september 2026: fem saker med tittel, kort beskrivelse, original-URL, GUID og publiseringstid.

```bash
npm install
npm run ingest:bomlo -- data/bomlo-news.json
npm run export:bomlo -- data/bomlo-news.json privat/robot-news.json
```

Lag katalogene `data/` og `privat/` først. Begge JSON-filene er lokale, skal holdes utenfor Git og har ingen direkte publisering. Overfør eksportfilen til `studio-private/config/robot-news.json` når Studio-appen er klar. Studio viser innholdet som kildekort til redaksjonell vurdering. Kommandoen er manuell; en eventuell tidsstyring bør først settes opp etter at driftsmåte og ønsket frekvens er bestemt.

Importen leser bare den faste RSS-URL-en, avviser omdirigeringer og store eller ugyldige XML-svar. Den følger ikke artikkellenkene. GUID gir stabil hendelses-ID, slik at gjentatte kjøringer ikke lager dubletter. Originalens korte beskrivelse lagres som kildeopplysning, ikke som en egen Radio Rubben-artikkel. Åpne originalen før bruk i sending eller ny tekst.

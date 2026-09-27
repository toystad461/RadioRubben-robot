/** Versioned Radio Rubben editorial standard. Bump this when rules change. */
export const EDITORIAL_RULES_VERSION = "1.0.0";

export const EDITORIAL_RULES = [
  "Skriv korrekt, naturlig norsk bokmål med tydelig tegnsetting.",
  "Sett komma etter innledende ledd som «Som det framgår av …» før hovedsetningen.",
  "Ved spillerbytter: skriv «[spiller inn] kom inn for [spiller ut]». Unngå «erstattet» når retningen kan misforstås.",
  "Behold navn, lag, dato, kampstatus, mål, resultat og rekkefølgen i hendelser nøyaktig som i verifiserte kildedata.",
  "Fjern gjentakelser, påstander uten kildestøtte og typiske AI-vendinger. Skriv konkret og nøkternt.",
  "Ikke legg til sitater, årsaksforklaringer eller andre fakta som ikke finnes i de verifiserte dataene."
] as const;

export function editorialPrompt(): string {
  return `Radio Rubbens redaksjonelle språkregler (versjon ${EDITORIAL_RULES_VERSION}):\n${EDITORIAL_RULES.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}`;
}

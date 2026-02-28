# Mock Exam Question Quality Standard

This document defines the quality benchmark for all mock exam questions across every module. Established after rewriting 265 KNM questions to match the real DUO exam format (Feb 2026).

---

## The Problem with Old Questions

Old questions were low-quality and did not reflect the real DUO exam:

| Old (bad) | New (good) |
|-----------|------------|
| `"Wat is 112?"` | `"De buurman van Bas valt op straat. Welk nummer belt hij?"` |
| 4 options | 3 options (A, B, C) |
| Correct answer almost always index 1 | Varied distribution: ~33% each for 0, 1, 2 |
| Tests rote recall of definitions | Tests practical knowledge in context |
| Abstract framing | Named character + real-life scenario |

---

## The Quality Standard

Every question must have all 5 of these:

### 1. A named Dutch character
Use common Dutch names. Vary gender and cultural background across the exam:
- Dutch: Lars, Sanne, Daan, Roos, Joris, Kim, Tom, Erik
- Multicultural (realistic for the target audience): Fatima, Yusuf, Nadia, Reza, Kofi, Mia, Aiko, Sofia, Hassan

### 2. A 2–4 sentence scenario
- Describe a specific, believable situation
- Include enough context so the correct answer is clear from the situation (not from general knowledge alone)
- Keep it concise — no padding

### 3. A clear practical question
Good question endings:
- `Wat moet [naam] doen?`
- `Waar kan [naam] terecht?`
- `Wat is de reden dat...?`
- `Welk recht heeft [naam]?`
- `Is dit toegestaan?`

Avoid: `Wat is X?`, `Definieer X`, `Welke letter staat voor X?`

### 4. Exactly 3 options
- One clearly correct answer
- Two plausible wrong answers (not obviously silly)
- Wrong answers should be common misconceptions, not absurd distractors

### 5. Explanation in both Dutch and English
- `explanation`: Dutch, 1–2 sentences, states the rule/fact clearly
- `explanationEn`: English translation of the same

---

## Correct Answer Distribution

After writing all questions, shuffle options programmatically so correctIndex is varied:

```python
import json, random

random.seed(42)  # use a fixed seed for reproducibility

with open('exam.json') as f:
    data = json.load(f)

for q in data['questions']:
    correct_text = q['options'][q['correctIndex']]
    random.shuffle(q['options'])
    q['correctIndex'] = q['options'].index(correct_text)

with open('exam.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

Target distribution: ~30–40% for each of index 0, 1, 2. Never >60% for any single index.

---

## Topic Coverage by Module & Level

### KNM (Kennis van de Nederlandse Maatschappij)

| Level | Topics to cover |
|-------|----------------|
| A1 | Emergency services (112), huisarts, OV-chipkaart, zorgverzekering, paspoort aanvragen, ziek melden, afval sorteren, Koningsdag, vlag, staatshoofd, leerplicht, vrijheid van meningsuiting, euro, pinpas, AOW |
| A2 | Minimumloon, vakantiedagen, vast vs tijdelijk contract, UWV, CAO, zzp'er, discriminatieverbod, eigen risico, BRP inschrijving, sociale huurwoning, Belastingdienst, huurtoeslag, zorgtoeslag, kinderbijslag, Tweede Kamer, Grondwet, poldermodel, Deltawerken, leerplicht/kwalificatieplicht, VMBO/HBO/WO, gelijkheid man/vrouw |
| B1 | Employment law (proeftijd, opzegtermijn, ketenregeling, transitievergoeding, ontslag op staande voet), CAO details, vakbond, bedrijfsarts, WW/WIA/bijstand, AOW opbouw, pensioenfonds, naturalisatie, IND, verblijfsvergunning types, asiel procedure, gezinshereniging, Huurcommissie, woningwaarderingsstelsel, huurbescherming, VvE, OR (ondernemingsraad), inburgeringsplicht |

### Lezen (Reading)

KNM-style questions are embedded in the passage context. The question should test comprehension of the passage, not standalone knowledge. Format rules still apply: named character, scenario, 3 options.

### Luisteren (Listening)

Questions test what was said in the audio. Format: named speaker + what they said/asked, 3 options on what the correct response or fact is.

### Schrijven / Spreken

These use rubric-based self-assessment, not MCQ. Not applicable to this standard.

---

## Validation Checklist

Before committing any new or rewritten exam JSON:

```python
import json, sys
from collections import Counter

with open('exam.json') as f:
    data = json.load(f)

errors = []
for q in data['questions']:
    if len(q['options']) != 3:
        errors.append(f"{q['id']}: has {len(q['options'])} options")
    if q['correctIndex'] not in [0, 1, 2]:
        errors.append(f"{q['id']}: correctIndex={q['correctIndex']} out of range")
    if q['correctIndex'] >= len(q['options']):
        errors.append(f"{q['id']}: correctIndex out of bounds")

counts = Counter(q['correctIndex'] for q in data['questions'])
total = len(data['questions'])
for idx, count in counts.items():
    pct = count / total
    if pct > 0.6:
        errors.append(f"correctIndex={idx} appears {pct:.0%} of the time — too skewed")

if errors:
    for e in errors: print("ERROR:", e)
    sys.exit(1)
else:
    print("All checks passed.")
```

Also run `npx tsc --noEmit` to verify no TypeScript errors.

---

## Example Transformation

**Before (bad):**
```json
{
  "text": "Wat is 112?",
  "options": [
    "Het telefoonnummer van de dokter",
    "Het alarmnummer voor noodgevallen",
    "Het nummer van de gemeente",
    "Het nummer van de politie alleen"
  ],
  "correctIndex": 1
}
```

**After (good):**
```json
{
  "text": "De buurman van Bas valt plotseling op straat en reageert niet. Bas wil snel hulp bellen. Welk nummer belt hij?",
  "options": [
    "112",
    "0800-0244",
    "088-0040066"
  ],
  "correctIndex": 0,
  "explanation": "112 is het alarmnummer voor alle noodgevallen: politie, brandweer en ambulance.",
  "explanationEn": "112 is the emergency number for all emergencies: police, fire department, and ambulance."
}
```

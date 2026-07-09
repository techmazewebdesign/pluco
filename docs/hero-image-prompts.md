# Hero Key Visual — AI Image/Video Generation Prompts

## Current status

**Pending generation — blocked on Higgsfield MCP daily grace-period limit.**
Target file: `public/images/spain-digital-nomad-hero.jpg`.

The hero (`src/components/spain/SpainHero.tsx`) has a dedicated right-side image panel
built to work with or without this file:
- A permanent navy/gold/cream gradient placeholder (with a faint dashed gold route line)
  renders as the base layer.
- A `next/image` sits on top pointed at `/images/spain-digital-nomad-hero.jpg`. If the
  file is missing it 404s, `onError` keeps it hidden, and the gradient placeholder shows
  through — no build/runtime error either way.
- The moment the real file is dropped into `public/images/`, it fades in automatically via
  `onLoad`. No code change needed.

When Higgsfield is available again, generate the still image below with the
`cinematic_studio_2_5` model (see "Model notes" below for why), save the result as
`public/images/spain-digital-nomad-hero.jpg`, and reload the page — that's the only step
required.

**Superseded direction:** an earlier "private legal advisory desk" concept (leather
folder, gold Europe map, dark wood desk — `public/images/spain-hero-key-visual.jpg`) was
generated and briefly wired in, then replaced by the relocation-journey concept below per
direct instruction. That file is still on disk but is no longer referenced by the hero —
safe to delete or repurpose elsewhere.

**Hard constraints for any generated asset (do not violate):**
- No people, no faces, no hands, no visible body parts.
- No readable text, no fake visa text, no fake passport details, no fake government
  documents, no logos, no fake guarantees of any kind.
- No flags as the main subject, no legal books, no courtroom, no judge gavel, no dark
  generic law office, no oversized letter "P", no spinning seal, no stock-photo business
  people, no artificial-looking icons.
- Palette must stay within navy (#071C3C / #051530), gold (#C9A35A), cream (#F8F6F2).

## Still image — Higgsfield / Seedance prompt (current concept: remote-work relocation)

```
High-end editorial cinematic photograph, no text anywhere in the image, no readable
typography, no logos, no signage. An elegant Mediterranean apartment interior in Spain,
early golden morning light streaming through open balcony doors. On the right side of the
frame, a refined wooden desk near the balcony holds an open laptop (screen blank, no
visible text or UI), a small minimal blank leather document folder with no markings, and a
ceramic coffee cup with soft steam. A small travel suitcase sits partly visible near the
desk. Subtle abstract gold linework on the wall or floor suggests a stylised Spain map or
relocation route, purely decorative, no labels, no place names. Through the open balcony
doors, soft blurred Spanish city rooftops and generic Mediterranean architecture are
visible (not a recognizable landmark), warm morning haze. Navy and warm gold color palette
with soft cream highlights, Mediterranean warmth, calm and optimistic mood. No people, no
faces, no hands, no visible body parts, no fake documents, no passports, no visa
paperwork, no flags, no books, no gavel, no courtroom, no dark generic law office, no
oversized letter P, no seal, no icons. Shallow depth of field, layered depth, natural
cinematic lighting, ultra-realistic, high detail, polished luxury consultancy aesthetic.
Clean, uncluttered negative space on the left third of the frame reserved for a text
overlay added later in post-production. Aspect ratio 16:9.
```

### Model notes

- Prefer `cinematic_studio_2_5` or `nano_banana_2`. The `soul_location` model repeatedly
  baked literal caption text into the frame (e.g. "Private Law", garbled labels) across
  three attempts despite explicit "no text" instructions — avoid it for this use case.
- `cinematic_studio_2_5` produced a clean, on-brief result on the first try for the prior
  desk concept; no reason to expect different behavior for this prompt.
- The current hero image panel is a tall-ish container (`aspect-[4/5]` on desktop). The
  prompt above asks for a wide 16:9 composition with left negative space (for a possible
  future full-bleed use); `object-position: right center` is already set in the component
  so a 16:9 source crops sensibly into the taller panel, favoring the laptop/balcony side.
  If the generated image reads awkwardly cropped, regenerate at a taller aspect ratio
  (e.g. `4:5`) directly instead of relying on crop.

## Motion / cinemagraph — Seedance / Higgsfield video prompt (optional, not required)

```
Slow, high-end cinemagraph, 6 seconds, seamless loop. Same Mediterranean apartment/balcony
relocation scene as the still. Camera performs a very slow push-in (2-3% scale over 6s). A
soft morning light shift moves once across the frame in the first 1.5 seconds (the only
faster motion in the shot), then everything settles into barely-perceptible ambient
movement: gentle curtain sway near the balcony, soft steam drifting from the coffee cup,
faint parallax between the desk in the foreground and the blurred rooftops outside. No
fast cuts, no spinning objects, no dramatic camera moves after the initial light shift.
Overall pace should read as "calm, hopeful, unhurried." No people, no faces, no hands, no
readable text, no logos. Aspect ratio 16:9, loopable.
```

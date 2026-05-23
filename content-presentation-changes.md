# Content & Presentation Changes — harshsobti.com

These changes reduce redundancy and tighten the site. The same biographical facts
(tabla, karate, books, MUNs, research) currently appear 4–6 times each across
sections. Goal: every fact appears **once**, in the place where it's strongest.

Scope: content, copy, section structure, and section-level layout only.
This is independent of the code refactoring work — see the separate file for that.

---

## Cuts (delete these)

1. **Delete the horizontal scroller** below the five stat tiles in the Quick Glance
   section (the "♩ TABLA · ✦ BOOKS · ◆ ORIGAMI · ◎ KARATE · ∴ RESEARCH" row with the
   "HOVER TO EXPLORE" hint). The five stat tiles above it already cover this.

2. **Delete the mini-timelines inside Quick Glance** (Publication Arc, 13-Year Arc,
   Belt progression, MUN Role Progression, Research Timeline). The Compound section
   covers all of them in one stronger visual. Keep each tile's headline number and
   one-line description; remove only the embedded timeline.

3. **Delete the thesis sentence from About and Creativity.** Keep it only as the
   pull-quote in The Compound section. It currently appears 3–4 times
   ("none of these threads are actually separate…", "Three practices, one shared
   grammar", "making, performing, and proving aren't kept in separate rooms").

4. **Delete the "Aspirations" subsection from About.** It will be merged with
   "Future Path" in Academics (see Consolidations).

5. **Remove the "Request CV →" button from the header.** Keep only the
   "Download CV (PDF)" link in Contact. The Contact nav item already routes there.

6. **Strip forward-looking goals from the Quick Glance tiles** ("Visharad II next",
   "Black belt next", "Book III in progress — ~8,000 words"). These belong at the
   open-circle endpoints of the Compound timeline.

7. **Remove "11 MUNs" from Quick Glance.** The Extra-Curriculars MUN card already
   has this fact with more context.

---

## Consolidations (merge these)

8. **Merge "Aspirations" (About) + "Future Path" (Academics) into one subsection.**
   Place the merged version at the end of Academics, just before Contact. Preserve
   every concrete fact (intended majors, research interests, third book by twenty,
   peer-reviewed publication, black belt) but state each once.

9. **Trim the four Origami "Foundational Principles" to one paragraph.** Research
   paper #1 in Academics already covers the same intellectual ground in depth. Name
   the four areas (Yoshizawa–Randlett, tessellations, curved creases, modular
   construction) in prose; drop the "PRINCIPLE 01/02/03/04" cards.

10. **Pick one home for forward-looking goals.** All "next / target / in progress"
    language should live in one place — recommended: the Compound's open circles.

---

## Restructure (move these)

11. **Promote "The Compound" from 03.5 to a top-level section.** Renumber so it sits
    as its own section (e.g., 04), and push Academics → 05, Contact → 06. The "03.5"
    label is a tell that the architecture doesn't fit; fix it properly.

12. **(Softer suggestion) Consider moving the Compound earlier in the flow.** It's the
    strongest visualization and the central thesis. Burying it mid-page weakens it.
    Treat this as a follow-up experiment after the first pass.

---

## Presentation fixes

13. **Reduce typographic hierarchy from 3–4 levels to 2.** Today many sections stack:
    numbered label (01 — ABOUT) + eyebrow (NARRATIVE) + inner-eyebrow (INTRODUCTION) +
    serif headline. Keep the numbered section label and the serif headline; remove the
    inner eyebrow labels (NARRATIVE, INTRODUCTION, ASPIRATIONS, EXTRA-CURRICULARS,
    CURRICULUM, RESEARCH, FUTURE PATH, GET IN TOUCH).

14. **Reserve the italic-keyword headline pattern for 2–3 headlines only** — Hero,
    Compound, Contact. Make all other section headlines plain serif. Used everywhere,
    the device loses its punch.

15. **Replace the "REPLACE_ME.JPG" portrait** in the hero with a real photo, or a clean
    "HS" monogram SVG matching the existing 4:5 aspect ratio. Do not ship a visible
    placeholder.

16. **Tighten vertical spacing between sections by ~30%.** Large empty stretches between
    sections exaggerate the site's length. Adjust the spacing token/variable rather than
    editing each section; leave inner-section spacing alone.

17. **Surface content hidden behind "drag to explore" / "hover to explore."** Admissions
    officers skim; anything requiring interaction is effectively invisible. Make the
    Compound's master timeline static and fully visible on load, keeping its visual style.

---

## Target structure

1. **Hero** — name, one line, portrait. Drop the activities list (the tiles cover it).
2. **At a Glance** — the five stat tiles only.
3. **About** — narrative + four character traits (Patient / Disciplined / Curious /
   Articulate). No Aspirations subsection.
4. **Books** — as is; this section is already clean.
5. **Creativity** — origami images + tabla + karate, with principles trimmed to one
   paragraph.
6. **The Compound** — promoted to a top-level section; holds the thesis pull-quote.
7. **Academics** — curriculum + research papers, with merged Future Path at the end.
8. **Extra-Curriculars** — debate, MUN, leadership cards.
9. **Contact** — direct info + merged "where I'm going" copy + CV download.

This cuts roughly 30% of the content without losing a single fact.

🔴 The big one: the matching model contradicts the app's own promise

The header says "Alege ce ai în frigider" — choose what's in your fridge. But the matcher requires every selected ingredient to appear in a recipe. So extras disqualify recipes. I just verified it:

* Fridge = spinach, feta, tomato, onion, chickpeas, pine nuts → 100% Spinach cu Feta și Năut ✅
* Same fridge + cucumber → zero results. ❌

Having more in your fridge gives you fewer options. That's backwards for a "what can I make" tool. The current model is really "build a salad using exactly these," not "what's makeable from my fridge."

This is the thing I'd fix first. The honest tension: if you flip it to pure fridge-mode, selecting just "spinach" floods you with every spinach recipe at low %. My recommended middle ground: rank by how much of each recipe you have; extras never disqualify; surface 100%-makeable recipes at the top, "lipsește 1-2" below. That's both the fix and the "almost there" feature in one.

🟢 Genuinely useful, fits the app's spirit

* Pantry staples — onion is in ~25 of 32 recipes; lemon/oil/garlic are in every dressing. Re-tapping onion every session is friction. A small "am mereu astea" set (onion, oil, lemon, salt) assumed-on would cut selection in half.
* Persist last selection (localStorage). ABOUT calls it unnecessary, but for a PWA you reopen daily, remembering your fridge is a clear win and ~10 lines.
* Mobile results visibility. The ingredient panel is tall; after selecting, results render below the fold and you must scroll past all chips to see them. A sticky "5 salate ↓" bar or a collapsible panel would help a lot on phone.
* A couple of quick filters / "surprise me." "Doar gata de făcut," "cu proteină," "fără brânză" — and a randomizer for when you can't decide (fits ABOUT's "don't overwhelm me, take a position" principle).

🟡 Data gaps (if you want breadth)

* Missing common ingredients that recipes or RECIPES.md gesture at: chili/ardei iute (in dressing text but not selectable), porumb, măsline verzi (only Kalamata), dried cranberries (the natural partner for the new seed salads), radish/green onion/celery.
* Recipe detail on tap — quantities + 3-4 steps. It's the one genuinely cooking-relevant omission. The tips are great but you can't actually cook from a card.

⚪ Correctness / polish (cheap)

* a11y: chips are <button>s but have no aria-pressed; the match circle has no text alternative. Small, worth it.
* A committed validation script for the data invariants (no missing ids, no dead chips, no both-members-of-a-sub-group) — I've been running that check ad hoc; it should live in the repo so a bad recipe edit fails loudly.
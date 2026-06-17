# Sălățică 🥗

A tiny single-file salad finder, built for me. Pick what's in the fridge → it tells me what salad to make.

The recipes aren't generic — they're the combinations I actually like (mediterranean / italian / greek / românesc), built from stuff you can grab at the supermarket. The culinary rules baked in (creamy + salty + crunchy + acidic, don't overcrowd, lemon-vs-vinegar, etc.) come from a long conversation about what works. See [ABOUT.md](ABOUT.md) for the full design doc and [RECIPES.md](RECIPES.md) for the recipes. Both written in Romanian 🇷🇴.

It's a PWA, so it installs to the phone and works offline.

## How to run

It's a self-contained `index.html` — no build, no dependencies. Just open it with your favorite browser.

Alternatively, in order to get the service worker / PWA install working you need to serve it over http (not `file://`):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

That's it. Drop the folder on any static host (GitHub Pages, Netlify, …) and it's live.

# Urvashi & Apoorv — Wedding Invitation

A mobile-friendly React wedding invitation with a sealed-envelope welcome, countdown, music, rose-petal animation, event itinerary, Google Maps, WhatsApp group invitation and link preview.

The project contains one focused rose-envelope design organised as seven editable pages. It is statically exported and hosted free with GitHub Pages.

## Personalise

Edit `app/wedding.config.ts`. The text is grouped as **Page 1** through **Page 7**, followed by image, colour and music settings.

Put an optional couple photo in `public/photos/` and music in `public/music/`, then update their paths in the configuration.

The same configuration controls the envelope animation timing, paper/photo landing style, Google Map, WhatsApp group invite and whether music starts when the invitation is opened.

## Preview

```bash
npm install
npm run dev
```

## GitHub Pages

The included GitHub Actions workflow builds and publishes the site whenever `main` is pushed. In the repository settings, choose **GitHub Actions** as the Pages source.

Live site: <https://urvashi-apoorv.github.io/wedding-invitation/>

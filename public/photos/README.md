# Optional landing photo

The current landing page uses the paper design. To use a couple photograph instead:

1. Add the image to this folder, for example `couple.jpg`.
2. Set `presentation.heroMode` to `"photo"` in `app/wedding.config.ts`.
3. Set `photos.hero` to the image path:

```ts
photos: {
  hero: "photos/couple.jpg",
},
```

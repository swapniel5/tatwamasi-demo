# Tatwamasi Studio website

## Update text and contact details

- Change the studio name, Instagram URL, city, phone, WhatsApp number, email, address, trust-strip copy and project media in `data/media.js`. A non-empty address displays the Google Maps directions link.
- Replace `[PHONE]`, `[WHATSAPP]`, `[EMAIL]` and `[CITY]` only with confirmed details. WhatsApp needs the country code followed by the number, with no `+`, spaces or punctuation.
- Replace the neutral entries in `trust` with studio-approved proof points; publish numbers only when verified.
- Update the title, general page copy, FAQ and JSON-LD details in `index.html` when the studio confirms the wording and business information.

## Swap the placeholder photo

Put approved, optimized photos in `assets/img/`. Change `hero.img` and its descriptive `hero.alt` in `data/media.js` to the correct relative path and a concise description of the actual image. The same hero image is used for social sharing; replace the Open Graph and Twitter image paths in `index.html` with an approved 1200×630 image. Update `caseStudy.img` if a separate featured photo is supplied.

## Add a project or video

- Add a project object to `projects` in `data/media.js`, with a unique title, actual photo path, descriptive `alt`, and category `living`, `bedroom`, `kitchen` or `commercial`.
- Add public Instagram post or Reel permalinks to `instagramPosts` in `data/media.js` to show them in the scrolling embeds. Each post must be public and have its own unique link. The motion pauses on hover/focus and is disabled for visitors who prefer reduced motion.
- Alternatively, add approved MP4 files under `assets/video/` and an image poster under `assets/img/`; add a `reels` object with `title`, `src` and `poster`.
- Keep paths relative to this folder. Optimize images (preferably under 400 KB) and videos (under 8 MB).

## Publish

Open `index.html` directly to preview or upload this folder to a static host. Replace `SITE_URL` in `robots.txt` and `sitemap.xml` with the actual published origin before deployment. Add the confirmed logo and a PNG Apple touch icon when those brand assets are supplied.

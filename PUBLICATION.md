# Temporary Publication Settings

Media, Projects & Events and the home slideshow are temporarily unpublished.
Their original HTML, CSS, scripts and media data remain in the repository.

- Elements marked `hidden data-temporarily-offline="media"`, `"events"` or
  `"slideshow"` are deliberately hidden. Remove both attributes to restore them.
- `media.html` and `events.html` redirect to Home using a zero-delay meta refresh,
  and their bodies are hidden. To reopen a page, remove its meta refresh,
  `noindex, nofollow` metadata, and the two attributes on its body.
- The temporary 302 rule in `.htaccess` provides the same behavior on Apache.
  GitHub Pages uses the redirects within the HTML files instead.
- The generated Projects & Events note in `assets/js/main.js` is also hidden.
  Remove its two publication assignments when that service is reopened.
- The media loader skips hidden content. Restoring the HTML makes it run again.
- After changing HTML or CSS, update the corresponding stylesheet version in
  the affected HTML pages to avoid a stale browser cache.

Latest Update uses the uploaded video's own aspect ratio. Its maximum height
is controlled by `.latest-video-frame video` in `assets/css/home.css`.

The large Teaching in practice photo is `assets/images/lessons-teaching-01.jpg`.
The Lessons images still to supply in `assets/images/` are:

- `lessons-hero.jpg`
- `lessons-rehearsal.jpg`
- `lessons-teaching-02.jpg`
- `lessons-teaching-03.jpg`

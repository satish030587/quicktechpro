# Admin Blog Editor – Manual Verification Checklist

Run through these checks after Phase 3 changes before pushing to higher environments.

1. **Create flow**
   - Open `/admin/content/blog/new` and confirm the author field pre-populates with the signed-in admin.
   - Fill in title, excerpt, body, cover image, categories, tags, and verify auto slugging works when the slug field is empty.
   - Save as draft and ensure the post appears in the blog list as `Draft`.

2. **Status transitions**
   - From edit view, send a draft for review, publish immediately, and confirm `StatusBadge` reflects each change and the success toast fires.
   - Schedule a post for the future (`Schedule publish`) and confirm the scheduled date persists after reload and appears in the manager as `Scheduled`.
   - Clear a scheduled time and resave as draft; ensure no publish date badge shows.

3. **Scheduling edge cases**
   - Attempt to schedule without a date/time and confirm validation prevents saving.
   - Try scheduling in the past and ensure an error toast appears.

4. **Author & metadata**
   - Edit an existing post and verify the “Assigned author” display matches the post’s author (or current admin if missing).
   - Update fields and confirm the quick preview and reading time update live.

5. **Deletion**
   - Use “Move to trash” on an existing post, confirm the warning dialog appears, and the post no longer shows in the default list (only when including soft-deleted).

6. **Regression sweep**
   - Toggle “Include soft deleted” and ensure scheduled/published rows still paginate correctly.
   - Verify testimonial moderation (approve/reject) continues to function after the refactor.

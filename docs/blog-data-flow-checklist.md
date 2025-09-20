# Blog Data Flow Verification Checklist

Use this quick pass after Phase 4 to confirm public and admin APIs stay in sync.

1. **Admin payloads**
   - In the editor, publish a post with category, tags, featured flag, scheduled date, and confirm the network request includes `categoryId`, `tags`, `status`, and `publishedAt`.
   - Update the same post and verify the PATCH payload mirrors the new fields and preserves the author id.

2. **Blog manager totals**
   - Load `/admin/content` with filters applied and confirm the list summarises totals/pagination using the API meta data (no yellow warning unless totals missing).
   - Toggle `Include soft deleted` and ensure deleted entries highlight in red and total counts adjust accordingly.

3. **Public listing**
   - Visit `/blog` and ensure only published, non-deleted posts appear; drafts and scheduled posts must be absent.
   - Check the hero cards reflect featured posts first, then most recent published posts.
   - Inspect the category/tag chips to make sure they match what is stored on each post.

4. **Public detail view**
   - Open a published post slug and confirm the page renders; try a draft/scheduled slug and verify it 404s.
   - Validate the share URLs, author display, reading time, and related posts all align with admin data.

5. **Soft-delete enforcement**
   - Move a post to trash in the admin and reload `/blog` and the post slug; both should hide the trashed post within the revalidation window.

Document the run (date + initials) so we know the data pipeline is healthy.

# Admin Blog Manager - Manual Verification Checklist

Run this quick loop after pulling Phase 2 to confirm the new blog management surface behaves as expected.

1. **Default load**
   - Visit `/admin/content` as an authenticated admin.
   - Confirm the Blog tab is active and the table loads pending/published posts without errors.
   - Note the row count and pagination summary for comparison after filter changes.

2. **Filtering & search**
   - Change the status filter to each value (Draft, Pending, Scheduled, Published, Archived) and ensure results update, resetting pagination to page 1.
   - Type a keyword in the search box, submit, and confirm the results narrow accordingly; use `Clear` then `Reset filters` to return to the default view.
   - Toggle `Include soft deleted` to verify archived/deleted rows surface with the red indicator.

3. **Row actions**
   - Use `View` to open an edit screen for one post and confirm it loads in the editor.
   - From the table, publish a draft post and verify the status badge updates to `Published` after the refresh.
   - Archive a post, confirm it disappears from the default view, then enable `Include soft deleted` and use `Restore` to bring it back as a draft.

4. **Pagination**
   - Force a second page (lower `take` in the API or seed data) and confirm the pager advances/retreats while keeping filters in place.

5. **Regression glance for testimonials**
   - Switch to the Testimonials tab, ensure pending items still appear, approve one, and verify the toast plus list refresh.

Document the test run (date + initials + dataset used) before closing the checklist.
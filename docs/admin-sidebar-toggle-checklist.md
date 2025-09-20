# Admin Sidebar Toggle - Manual Verification Checklist

Use this quick pass after layout changes to make sure the Admin portal navigation still behaves as expected.

1. **Desktop width (>=1024px)**
   - Load any `/admin/*` route.
   - Confirm the sidebar is visible without animation.
   - Click several nav links and ensure the sidebar remains visible and the active state updates.

2. **Tablet/mobile width (<=768px)**
   - Refresh the page and verify the toggle button appears in the header.
   - Open the sidebar; check that body scrolling is disabled and focus moves to the close button.
   - Press `Esc` to close the sidebar.
   - Tap the scrim/overlay to close the sidebar.
   - Navigate via a menu link and confirm the sidebar closes after the route change.

3. **Accessibility spot checks**
   - Inspect the toggle button to confirm `aria-expanded` updates between `true`/`false`.
   - Confirm the nav container has a stable `id` (`admin-sidebar`) referenced by controls.
   - Use keyboard only: `Tab` to the toggle button, press `Enter` to open, `Shift+Tab` moves to close button, `Enter` closes.

Document the run (date + initials) at the top of this file before moving to subsequent phases.
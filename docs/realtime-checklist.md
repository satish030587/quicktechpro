# Realtime Checks & Test Plan

This guide documents how to validate the realtime ticket + notification experience after the recent socket hardening work.

## 1. Connection/Auth
- Sign in as an admin in one tab and as a customer in another.
- Open the browser devtools `Network → WS` panel and confirm the `socket.io` connection request carries the `auth` payload with a bearer token.
- In the API logs you should see `Socket connected` entries **only** after a valid JWT handshake. Joining an admin room from a customer session should produce a socket `error` event (and no room join).

## 2. Ticket Lifecycle Smoke
1. As the customer, open *Portal → Tickets* (leave the page idle).
2. As the admin, open *Admin → Tickets* and *Admin → Ticket Board*.
3. Create a ticket from the customer view – the admin list, board, and notification bell should update instantly with the blue highlight pulse.
4. Assign the ticket to a technician or change its status from the admin view – the customer card should update in place without a refresh.
5. Delete the ticket from the admin list – the card disappears everywhere (and the portals receive a notification).

## 3. Heartbeat / Fallback
- Disconnect your network for ~20 seconds. The bell indicator turns yellow with the “Realtime is delayed” message.
- Reconnect and wait for the heartbeat. The indicator returns to green without reloading the page.
- While degraded, new notifications are still pulled in thanks to the automatic refresh trigger.

## 4. Ticket Detail Rooms
- Open *Admin → Tickets → any ticket* and keep the tab open.
- From another admin session (or the customer owner) add a message. The message list appends in realtime.
- Try forcing a customer without access to join a random ticket by emitting `join-ticket` from devtools – the gateway logs and the client receive an authorization error.

## 5. Regression quick-check
- Submit/resolve a ticket to ensure historical pages (Invoices, Appointments, etc.) render without JS errors.
- Verify you can still log out/in; the socket disconnects on logout and reconnects with a fresh token on login.

> Tip: whenever realtime looks suspicious, run `window._refreshNotifications?.()` from the console – the helper still triggers a manual sync.

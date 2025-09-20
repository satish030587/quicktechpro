# QuickTechPro Portal – Essential Pages Outline

QuickTechPro Portal – Essential Pages Outline
This document outlines all essential pages for the QuickTechPro  web portal and mobile app, based on the
business plan for a computer repair and web app development support platform. Each page is listed with its
purpose, key functionalities, and access rules (whether it’s for customers, admins, or both). The focus is on
core functional implementation – building these pages and features first (before fine-tuning design/CSS) –
and a clear separation is made between Web and Mobile pages.
Web Portal Pages
Public-Facing Pages (No Login Required)
Home Page
Purpose:  Landing page to introduce QuickTechPro services (remote IT support, onsite support in
Bangalore, web app development, etc.), how the process works, and to showcase trust-building
elements like testimonials or featured blog posts .
Key Functionalities:  Primarily informational content (text, images) outlining services and value
proposition. May include call-to-action buttons (e.g. “Raise a Ticket”  or “Contact Us” ) leading users to
sign up or get support. Could highlight a summary of services and recent blog entries for
engagement .
Access:  Public (accessible to all visitors; no login required).
Services Page
Purpose:  Provides detailed descriptions of each service offering. This includes categories like Remote
Support , Onsite Support , and Web Development  projects . If applicable, may also include pricing
guidelines or plans.
Key Functionalities:  Mostly static content organized by service category – each section explains
what the service covers (e.g. scope of remote assistance, onsite service area, process, etc. ).
Might use tabs or sections for each service type. Could include links or a “Raise a Ticket”  button for
that particular service to initiate a request.
Access:  Public (no login needed to read about services).
Blog Listing Page
Purpose:  Public blog homepage showing all published blog posts (guides, tech tips, news, etc.) to
engage users with content and community . This helps demonstrate expertise and keeps users
engaged.
Key Functionalities:  Displays a list of blog posts with titles, short excerpts, authors, and publish
dates. Users can click on a post to read the full article. Supports filtering or categorization by tags
(e.g. Repair Tips , How-Tos ) for easy navigation . Logged-in users should see a “Write a Post”•
•
1
•
1
•
•
•
2
•
2
•
•
•
3
•
45
1

button or similar call-to-action to contribute an article  (leading to the submission form, see Blog
Post Submission  page below).
Access:  Public for viewing posts (any visitor can read blog articles). Commenting or writing posts
requires login (the page should prompt login/signup if an unauthenticated user tries to comment or
submit a post) .
Blog Post Detail Page
Purpose:  Displays the full content of a single blog post, along with its comments and interactive
elements.
Key Functionalities:  Shows the post title, author name, publish date, content (including images),
and tags/categories . At the end of the post, a comments section allows logged-in users to add
comments or questions about the article . Each comment is typically shown with the commenter’s
name and timestamp. Basic actions include posting a new comment (with a form for logged-in
users) and possibly “liking” or sharing the post on social media. If an unauthenticated user attempts
to comment, they are redirected to login/signup .
Access:  Viewing is public (anyone can read posts).  Commenting  requires customer login (admins
could  also  comment  if  needed,  but  primarily  it’s  a  user  engagement  feature).  Admins  have
moderation capabilities on this page – e.g., they can remove inappropriate comments (comments
may either appear immediately or go into a moderation queue for admin approval) .
About Us Page
Purpose:  Provides background about the business (company or proprietor), including qualifications,
experience, mission, and what sets the service apart . This page builds trust with potential
customers.
Key Functionalities:  Static informational content – may include text about the company’s history,
team, and values, plus possibly photos or credentials. No dynamic functionality required aside from
simple content management.
Access:  Public.
Contact Us Page
Purpose:  Allows visitors to find contact information and reach out for general inquiries or support
outside the ticketing system.
Key Functionalities:  Displays contact details such as phone number , support email, physical office
address (Bangalore) and operating hours . Often includes a simple contact form where users can
submit a message or inquiry (name, email, message fields). The form submission would send an
email or create a record for the admin to follow up.
Access:  Public (no login needed to use the contact form or view contact info).
Authentication Pages (User Access)
Login Page6
•
7
•
•
•
5
5
7
•
5
•
•
8
•
•
•
•
•
9
•
•
2

Purpose:  Enables existing users (customers or admins) to authenticate and access the portal’s
secured features.
Key Functionalities:  Presents a login form for entering credentials (email/username and password).
On submission, credentials are verified and the user is granted access based on role. May include
“Remember Me” option and links to “Forgot Password”  for password recovery. After successful
login, customers are redirected to their Dashboard/My Tickets, and admins to the Admin Dashboard.
If a user without an account tries to log in, they should be directed to register .
Access:  Public (any user can arrive here; after login, they are directed to pages appropriate to their
role).  Both  customers  and  admins  use  this  same  login  interface  (role-based  handling  after
authentication).
Registration Page (Sign Up)
Purpose:  Allows new customers to create an account on the platform.
Key Functionalities:  A form to collect user details required for account creation – for a customer this
typically includes name, email, phone, password, etc. (possibly with verification steps like email
verification). Upon successful sign-up, the new user can log in and start creating tickets or using the
portal. Optionally might include selecting user type if needed (though in this portal, most sign-ups
are customers by default; admin accounts are likely created internally).
Access:  Public (available to anyone who wants to create an account). Admin accounts are not created
via this page (admins are managed by the system owner), so this is primarily for customer sign-up.
Password Reset Page (if implemented as a separate flow)
Purpose:  Helps users regain access if they forget their password.
Key Functionalities:  Typically initiated via a “Forgot Password?” link from the Login page. The user
enters their registered email, and the system sends a reset link or OTP. This page would allow the
user to enter a new password (after validating the reset token).
Access:  Public (accessible to anyone who needs to reset their password, but requires a valid account
email to proceed).
Customer Portal Pages (Authenticated Customer Access)
Customer Dashboard / My Tickets Page
Purpose:  Serves as the landing page for a logged-in customer , giving a summary of their activities
and quick access to core functions . It typically doubles as a “My Tickets” overview.
Key Functionalities:  Greets the user by name and provides an overview of their support tickets and
other actionable items . Key elements include:
Ticket Summary:  A list or summary of the user’s open tickets (with basic details like ticket
title, status, last update) and possibly a count of closed/resolved tickets . Each ticket listed
should link to the detailed view.
Quick Actions:  Prominent button to “Raise New Ticket”  for easy access . This might allow
choosing the type of ticket (remote, onsite, web dev) if multiple types are available.
Quotes & Invoices Alert:  Notifications or highlights if the user has any pending quotations
awaiting approval or invoices pending payment . For example, it might show “You have 1
quote awaiting approval” with a link to view it . •
•
•
•
•
•
•
•
•
•
•
•
•
1011
•
12
◦
11
◦ 13
◦
14
14
3

Blog Highlights:  Possibly shows recent blog posts or a prompt to contribute (for engaged
users) – e.g., “Latest Tech Tips” or a button “Write a Blog Post”  if the user is allowed to submit
content .
Profile Snapshot:  A small section with user’s profile info and link to Account Settings  for
quick access .
Access: Customer only.  (This page requires login and is tailored to individual customers; it is not
accessible or relevant to admins. Admins have their own dashboard.)
New Ticket Page
Purpose:  Allows a customer to submit a support request  or ticket for assistance. This is a key
interactive page where customers describe their problem or project need.
Key Functionalities:  A form to create a ticket with fields that adapt to the selected ticket type
. Key elements:
Ticket Type Selection:  The user chooses the category: Remote Support , Onsite Support , or Web
App Development  request . The form may dynamically adjust based on this choice (e.g.,
asking for address if Onsite, or project details if Web Dev).
Issue Details Form:  Collects necessary info: a brief description of the issue or project,
additional details or requirements, urgency/priority level, etc. (The form is kept as simple as
possible to encourage submission .)
File Attachments:  Option to attach files (screenshots of errors, photos of hardware issues,
documents) to help in troubleshooting . This includes client-side validation for file types/
sizes.
Location Validation (for Onsite):  If Onsite Support  is selected, the page may require entering
an address or PIN code and will validate that the location is within the service area (e.g.,
Bangalore) before allowing submission . If outside service area, it might show an
informative message or alternative options.
Payment Integration (for Remote Support):  If Remote Support  is chosen, the portal may
require upfront payment before the ticket is officially created . In that case, after filling the
form, the user is directed to a payment step (integrated via Razorpay or similar), and upon
successful payment the ticket is logged as Open .
Submission & Confirmation:  On submitting the form (and payment if applicable), the ticket
is created and the user is usually redirected to the Ticket Detail page or shown a confirmation
that includes the ticket ID and next steps. Possibly an email notification is also sent to the
user .
Access: Customer only.  (Must be logged in to create tickets. If not logged in, the Support/Tickets
menu or “Raise Ticket”  button will prompt the user to log in or sign up before accessing this page
.)
My Tickets Page (Ticket List)
Purpose:  Allows a customer to view a list of all tickets they have submitted, with their current status
and basic info. (If the Dashboard  already serves this role, a separate list page may be optional. Often
“My Tickets” is either the dashboard or a dedicated page accessible via navigation.)
Key Functionalities:  Displays the customer’s tickets in a table or list format. For each ticket: show ID,
title/issue summary, type (remote/onsite/dev), status (New, In Progress, Awaiting Payment, Resolved,◦
15
◦
16
•
•
•
• 17
18
◦
1718
◦
19
◦
20
◦
21
◦
22
22
◦
•
23
•
•
•
4

etc.), and last updated time . The user can filter or search their tickets by status or date
(useful as the list grows). Clicking on a ticket opens the Ticket Detail  page. This page helps
customers quickly find updates on any issue they have reported.
Access: Customer  only.  (Each  user  can  see  only  their  own  tickets;  role-based  security  on  the
backend ensures they cannot access others’ tickets .)
Ticket Detail Page
Purpose:  Shows the full details and activity thread of a specific support ticket. This is where the
customer and admin/technician communicate and track progress on resolving the issue.
Key Functionalities:
Ticket Information:  Displays all details of the ticket: ticket ID, subject/title, description of the
issue, ticket type, the date opened, current status, assigned technician (if applicable), and any
associated metadata (priority level, etc.).
Communication Thread:  A chronological log of updates and messages on the ticket . This
functions like a conversation: the admin/technician can post updates or requests for more
info, and the customer can reply with additional details or comments . Each entry is
labeled with who posted it (customer or admin) and timestamp. This keeps all support
communication in one place.
File Attachments & Images:  Any files the user attached on creation (or in subsequent
messages) are visible or downloadable. The customer or admin might also upload additional
screenshots or documents in the thread if needed.
Status and Actions:  The current status (e.g., New, In Progress , Awaiting Customer Info , Awaiting
Payment , Resolved , Closed , etc.) is prominently shown . The customer might see certain
prompts based on status (for example, if status is Awaiting Payment  for an onsite job, a “Pay
Now”  button might appear – linking to an invoice/payment page). If the issue is resolved, the
page may allow the customer to provide feedback or mark their acceptance of resolution.
Approve Quote (if applicable):  If this ticket is a Web Development request or similar that
required a quotation, and the admin has sent a quote, the quote details or PDF might be
accessible from this page . The user could find an “Approve Quote”  or “Request
Changes”  button here once a quotation is attached to the ticket . Approving might trigger
further steps (ticket status changes to Accepted/In Development).
Close Ticket / Feedback:  After resolution, the user might be given an option to confirm
closure or to rate the service (this could also be done via a separate flow or on the dashboard)
.
Access: Customer (owner of the ticket)  and Admin/Technicians.  (Both parties can view the ticket
detail. Customers see and respond to their own tickets, admins can see all tickets. Proper access
control ensures others cannot access it. Admin-specific controls like internal notes are visible only to
admins.)
Quotation Details Page
Purpose:  Allows a customer to review a quotation provided by the admin for a service (usually
relevant for Web App Development requests or complex jobs). It presents the pricing and terms of
the proposed work so the customer can approve or discuss it. 24 24
•
25
•
•
•
◦
◦ 26
27
◦
◦
24
◦
28
29
◦
30
•
•
•
5

Key Functionalities:  Displays the content of a quote sent by admin: a breakdown of services/items,
costs, taxes, total price, any terms or expiration date for the quote . Likely presented in a clear
format or PDF view. The page provides actions for the customer:
Approve Quote:  If the customer agrees, they can click “Approve”  (confirming they accept the
quote). This might transition the ticket into a project or work phase. The system records the
approval .
Request Modification/Comment:  If the customer has questions or needs changes, they
might add a comment on the ticket or a special field here to request adjustments
(alternatively, they simply do this via the ticket’s comment thread).
Once approved or rejected, the quote’s status updates and the admin is notified .
Access: Customer (ticket owner)  and  Admin.  (Only the relevant customer can view their quote.
Admins generate and attach the quote, and can view status updates like accepted or declined.)
Invoice / Payment Page
Purpose:  Enables customers to view an invoice for services rendered and complete payments online.
After a support job is completed (especially for onsite services or web projects), an invoice is
generated which the customer needs to pay or download for records.
Key Functionalities:  Shows invoice details: invoice number , date, list of services or hours billed,
costs, taxes, total amount due . If the invoice is unpaid, the page will provide a “Pay Now”  button
(integrated with a payment gateway like Razorpay) to pay securely . It might also show payment
status (Paid/Unpaid) and due date. For paid invoices, it confirms payment and provides a receipt or
downloadable PDF of the invoice. Users can typically download or print the invoice for their records
.
If payment is processed through the portal, after clicking Pay the user is taken through the
secure checkout flow (could be a popup or redirect via Razorpay). The page then handles the
callback to update payment status (and perhaps marks the associated ticket as paid or
completed) .
If the service was paid offline (cash or card on site), the invoice page would reflect that
(possibly marked as Paid by admin) and just allow the user to download the receipt .
Access: Customer  (ticket  owner)  and  Admin.  (Customers  see  their  own  invoices  and  make
payments; admins can view all invoices and record payments via the admin interface. This specific
page is primarily for the customer’s use, but an admin might access it in impersonation or for
troubleshooting.)
Quotes & Invoices Overview Page (Optional combined page)
Purpose:  Provides customers a single place to review all their quotations and invoices, both pending
and past. This page is essentially a financial overview for the user . (This can be part of the user’s
Dashboard or a separate section.)
Key Functionalities:  Lists any Open Quotations  (with status awaiting approval or recently
approved/rejected) and Invoices  (with status paid or due) relevant to the user . For each entry,
key info like quote/invoice ID, related ticket or project name, date, and status is shown. Each item
would link to the detailed Quote or Invoice page described above. The page helps ensure the user
can easily find and manage all pending approvals and payments in one place. •
31
◦
31
◦
◦ 32
•
•
•
•
33
34
35
◦
34
◦
34
•
•
•
•
36
6

Access: Customer only.  (Each user sees only their own quotes and invoices. Admins have separate
management sections for these.)
Blog Post Submission Page
Purpose:  Allows a logged-in customer to write and submit a blog article to be reviewed by admin for
publication. This is a user-contributed content feature intended to build a community and
knowledge base.
Key Functionalities:  A form with a rich text editor for composing a blog post . The user can enter
a title, content (with basic formatting tools), and optionally select categories or tags for the post.
They should be able to upload images to include in the article content  (with appropriate file
handling on the server). There may also be a “Save Draft”  option if the user wants to save progress
and continue later , though initial implementation could be submit-only.
Upon submitting, the post is not published immediately; it is saved with a Pending Review
status . The user might get a confirmation that their article was submitted for approval. If
they have a “My Blog Posts” section (not required but possible), they could see the status of
their submissions (e.g., Pending , Approved/Published , or Rejected ) .
Access: Customer (logged-in users) . Only authenticated users can write and submit posts. (Admins
do not use this page; they have their own interface for managing blog content. If an admin wants to
publish a post, they would likely use the admin panel or bypass approval.)
Account Settings / Profile Page
Purpose:  Allows the user to view and update their personal information and account settings.
Key Functionalities:  Shows the user’s profile details on file – e.g., name, email, phone number , etc. –
and provides forms to update certain fields. It typically includes:
Profile Info Update:  Edit fields for name, contact information, or address.
Password Change:  Option to change the account password (requires entering current
password and new password).
Possibly settings like notification preferences (e.g., opt in/out of certain email or push
notifications).
If required by policy, may have an option to delete/deactivate the account.
This page ensures users can keep their information current.
Access: Customer (logged-in)  and Admin (logged-in)  – each user manages their own account. Both
roles should have access to a profile/settings page, though the admin’s one might be simpler (since
additional admin configuration is handled in separate pages). The navigation usually provides a link
(often under a user menu) to this page .
Admin Portal Pages (Authenticated Admin Access)
Admin Dashboard
Purpose:  The landing page for an admin after login, providing a comprehensive overview of system
status and quick links to manage ongoing activities. It acts as the “mission control” for the support
portal . •
•
•
• 37
38
◦
39
40
•
•
•
•
◦
◦
◦
◦
◦
•
41
•
•
42
7

Key Functionalities:  Presents key metrics and shortcuts relevant to the admin:
Ticket Statistics:  Summary counts of tickets by status (e.g., number of open tickets, tickets
awaiting payment, closed tickets this week) and possibly by type (how many remote/onsite/
dev tickets are open) . These can be shown as dashboard cards or charts.
Notifications/Alerts:  Highlights anything needing immediate attention, such as new tickets
submitted, tickets overdue (open too long), or tickets awaiting customer info. For example, it
might show a badge or list of New tickets  that came in since the admin last checked.
Quotes/Invoices Alerts:  A section for financial alerts, e.g., “2 quotes awaiting customer
approval” or “1 invoice pending payment” for the admin to follow up .
Shortcuts:  Quick action buttons linking to common tasks: e.g., “View All Open Tickets” , “Create
New Ticket”  (for logging a call-in request on behalf of a customer), “Pending Blog Posts for
Review” , etc. . These shortcuts speed up navigation to critical sections.
Possibly a quick view of recent customer feedback or announcements. Overall, the
dashboard’s goal is to give the admin at-a-glance insight and one-click access to manage
items requiring attention.
Access: Admin only.  (Only authenticated admins/agents see this page. It aggregates data across all
customers, which is not visible to regular users.)
Ticket Management Page  (All Tickets List)
Purpose:  The main interface for admins to view and manage support tickets. It provides a full list of
all tickets in the system (across all users and statuses) with tools to filter , sort, and find specific
tickets.
Key Functionalities:
Ticket List:  A table or list of tickets with columns for key info: Ticket ID, customer name, issue
summary, ticket type (remote/onsite/dev), status, priority, date created, last updated, etc. .
The admin can see every ticket here, unlike customers who only see their own.
Filtering/Sorting:  Controls to filter tickets by status (Open, In Progress, Closed, etc.), type,
assigned technician, or date range . For example, an admin can quickly filter to see only
New tickets that need triage, or only Onsite  tickets, etc. . Search functionality allows
locating a ticket by ID or keyword (like customer name or issue title).
Quick Actions:  The list might support inline actions for convenience. For instance, an admin
could select a ticket and mark it as closed or assign it to themselves without leaving the page
(though full details would usually be handled in the Ticket Detail page). New tickets might be
highlighted or have an icon indicating unread.
Pagination or Batch Actions:  If there are many tickets, pagination is used. Batch actions (like
selecting multiple tickets to close or assign) are optional for efficiency.
Clicking on any ticket opens the Admin Ticket Detail  page for that ticket.
Access: Admin only.  (This is a protected page for support staff/administrators. Customers cannot
access the ticket list or see any tickets other than their own.)
Admin Ticket Detail Page
Purpose:  Allows the admin (or support agent) to view all details of a specific ticket and perform
administrative actions to resolve it. This is the admin counterpart to the customer’s Ticket Detail
page, with additional controls. •
◦
43
◦
◦
3614
◦
4445
◦
•
•
•
•
◦
46
◦
24
47
◦
◦
◦
•
•
•
8

Key Functionalities:
Full Ticket Details:  All information provided by the customer is shown (issue description,
attachments, customer info, etc.), along with internal fields like priority level and assignment.
Conversation Thread:  The same thread of communications visible to the customer , but the
admin interface may additionally allow internal notes  that are only visible to other admins/
techs (for internal collaboration on the issue) . Admin can post updates to the customer
here (which the customer will see on their side), as well as record private notes.
Status Updates:  Controls to update the ticket status (e.g., from New to In Progress , or
Resolved ). The admin can also reopen a closed ticket if needed.
Assignment:  If there are multiple support agents, the admin can assign the ticket to a
specific technician or team member . The interface might have an assignee dropdown or
similar (for a small operation, this may not be needed initially, but it’s ready for future
growth).
Verify/Log Payment:  For tickets requiring payment (like remote support or completed onsite
jobs), the admin can verify if payment was received. If an online payment was done, this may
be automatic; if offline, the admin might mark the invoice as paid here .
Quotation Management:  If the ticket is a web development request, the admin can create or
attach a quotation from this page. For example, a button “Generate Quote”  might open a
form or modal to fill in quote details, which then gets sent to the user . Once a quote
is sent, its status is visible here (e.g., “Quote sent on 10 Sep, awaiting customer approval”). If
the customer approves, the admin sees that update and can proceed to next steps (like
scheduling or converting to project).
Resolution and Closure:  When the issue is resolved, the admin adds a resolution note and
marks the ticket as Resolved/Closed . The admin interface might prompt to add a summary
of the fix, which can be sent to the user as part of closure . The admin can also trigger
a request for feedback (which the user sees on their side).
Access: Admin only.  (Admins and authorized support agents use this page. It is typically accessed
from the All Tickets list or notifications. It’s not for customers, although it mirrors the customer’s
view with added controls.)
Quotations Management Page
Purpose:  Provides a dedicated interface for admins to manage all quotations that have been issued
for customer requests (especially web development project requests or special service quotes). This
helps track quotes through their life cycle (pending, accepted, rejected).
Key Functionalities:
Quotes List:  A list of all quotations with details like Quote ID, related Ticket/Project name,
customer , amount, status (Pending Approval, Accepted, Rejected), and date issued . This
list can be filtered by status or date.
View/Edit Quote:  The admin can select a quote to view its details (line items, pricing) and see
the history (e.g., sent date, whether the customer has viewed it). If a quote is still pending, the
admin might have options to edit or withdraw it. For accepted quotes, the admin may
proceed to the next steps (such as creating a corresponding project ticket or scheduling
work).
Create New Quote:  Although quotes are often initiated from a ticket detail (for a specific
request), the admin could have the ability to draft a new quote from this page as well. This
would involve choosing a customer or linking to a ticket, then entering the quote details•
◦
◦
48
◦
◦
◦
34
◦
4932
◦
5030
•
•
•
•
◦
51
◦
◦
9

(description of work, itemized costs, taxes). The system could provide templates or saved line
items to speed up this process . Once saved, the quote can be sent to the customer (which
likely triggers an email and makes it visible on the customer’s portal).
Status Updates:  If a customer approves or declines a quote, that status is updated here
(possibly via automation or manual update). The admin can filter to see all quotes awaiting
response, etc. Accepted quotes might prompt admin actions like generating an invoice or
marking work as started.
Access: Admin only.  (All quotes are managed by admin users. Customers see their individual quotes
via the customer pages, but do not access this overview.)
Invoices & Payments Management Page
Purpose:  A central page for admins to track all invoices issued to customers and manage payment
status. It ensures no bills are overlooked and finances are in order .
Key Functionalities:
Invoice List:  A table listing all invoices with columns like Invoice ID/Number , customer name,
related ticket or service, amount, status (Paid, Unpaid/Overdue), issue date, and due date .
This list can be filtered to show unpaid invoices, or sorted by due date to see which payments
are upcoming or late.
View/Send Invoice:  Clicking an invoice shows its details (the same info a customer sees:
items, totals, etc.). The admin can resend the invoice or payment link to the customer if
needed (e.g., if the customer missed the email).
Mark as Paid:  For cases where payment is received outside the system (cash, bank transfer ,
point-of-sale), the admin can mark the invoice as paid within the system . This will update
the status and possibly trigger a receipt to the customer .
Generate Invoice:  Admins can create new invoices, either manually or automatically after
certain ticket closures. For example, if an onsite job is done and not prepaid, the admin would
generate an invoice from this page or from the ticket. The interface would allow input of line
items, costs, taxes, etc. (some of this may be pre-filled if coming from a ticket’s data) .
Reports (optional initial):  There might be basic reporting functions, such as totaling revenue
in a given period or exporting invoice data. This can be minimal at first, since the focus is core
functionality; a simple total or count of paid vs unpaid could appear on the page or
dashboard.
Access: Admin only.  (Full financial data visible to admins. Customers only see their own invoices via
the portal’s customer pages.)
Blog Management Page
Purpose:  Allows the admin to oversee all blog content – both user-contributed posts awaiting
approval and the posts that are live. The admin can review submissions, publish or reject posts, and
moderate published content.
Key Functionalities:
Pending Posts Queue:  A list of all blog posts submitted by users that are in Pending Review
status . For each submission, the admin can click to read the full content. The page
should show the title, author (user who submitted), and submission date at a glance. 52
◦
•
•
•
•
◦
53
◦
◦
34
◦
33
◦
•
•
•
•
◦
5455
10

Review & Approval:  When viewing a pending post, the admin can read it and decide to
Approve  (publish it) or Reject . There should be an action for each: approving will make the
post live on the Blog Listing page (perhaps after adding an “Approved by admin” flag and
possibly touching up the content) . Rejecting will keep it unpublished; ideally the admin
can add a note or reason for rejection that could be communicated back to the author (for
example, “Rejected – content not relevant” or “needs more detail”) .
All Posts List:  A management view of all published blog posts . The admin can see every
blog entry (including those written by themselves or by users) with options to Edit or
Unpublish/Delete  if needed. This helps maintain the content quality – e.g., admin might fix
formatting or remove an outdated post.
Post Editor:  Admins can create a new blog post directly from this interface as well . This is
useful for posting company updates or their own articles. The editor would be similar to the
user submission form but bypasses the approval step (since admin’s own posts can go live
immediately). Admins can also edit user-submitted content (e.g., to correct typos or improve
clarity) before approving .
Categories/Tags Management:  The admin can manage blog categories and tags from here
(add/edit/delete) . This ensures that all posts are categorized consistently and helps
with content organization on the blog.
Access: Admin only.  (Regular users have no access to the admin interface; they submit posts via the
public site. Admins moderate and manage all content here.)
Comment Moderation Page (or Section)
Purpose:  Enables the admin to review user comments on blog posts and remove any that are
inappropriate or spammy. While simple comment moderation might be done inline on each Blog
Post page, a dedicated page helps to see all recent comments in one place.
Key Functionalities:
Comments List:  A chronological list of recent comments across all blog posts, showing
comment text (snippet), commenter name, post title, date, and perhaps a flag if a comment
was reported by users.
Moderation Actions:  For each comment, the admin can Delete/Remove  it (if it violates
guidelines) . If implementing advanced moderation, there could be options to Mark as
Spam , or Ban User  (if someone repeatedly posts spam, this could tie into user management).
Filters:  Ability to filter comments by status (e.g., show only those flagged by other users or an
automated spam filter), or by post. If a queue system is used (comments require approval
before appearing), then this page would also show Pending Comments  for approval. However ,
initially it might be that comments are auto-approved but can be removed post-hoc.
Notification:  The admin might see a notification on this page or on the dashboard if there
are comments awaiting review (depending on whether pre-approval is required or not).
Access: Admin only.  (Only admins/moderators can view and moderate all comments. Customers
can only manage their own comments in the sense of editing or deleting shortly after posting, if that
feature is provided, but they cannot remove others’ comments.)
User Management Page◦
56
57
◦ 58
◦ 59
60
◦
6162
•
•
•
•
◦
◦
63
◦
◦
•
•
11

Purpose:  Allows the admin to view and manage all user accounts (customers, and possibly other
admins/agents). It’s essential for administrative control over the user base, especially if misuse or
support with accounts is needed.
Key Functionalities:
User List:  A table of all registered users with info such as name, email, registration date,
status (active/banned), and perhaps role (customer or admin) .
User Search/Filter:  Search users by name or email. Filter by role or status (e.g., show all
deactivated accounts).
View User Profile:  Clicking a user might bring up details about that user – including their
contact info and a summary of their activity (e.g., number of tickets submitted, number of
blog posts contributed) . The admin could see the user’s ticket history or blog submissions
for context when handling support.
Manage Account Status:  Options to deactivate or ban a user account . For example, if a
user is posting spam or abusing the system, the admin can disable their login. Conversely, an
admin could re-enable a locked account or reset a user’s password if they request assistance
(the latter might also be done through password reset flow, but admin override can be
handy).
Role Management:  If the system may have multiple admin/agents in the future, the admin
page could allow promoting a user to an admin/agent role or demoting them . This is
usually restricted to the primary owner account.
Access: Admin only.  (Customers never see this; it contains sensitive account info for all users.)
Admin Settings Page
Purpose:  A collection of configuration settings for the application, enabling the admin to customize
various aspects of the system (services, locations, integrations, etc.) without digging into code. This
is a broad section and can be built out over time. Early on, only essential settings might be present.
Key Functionalities:  Organized into subsections or tabs for different categories of settings :
Service Settings:  Define or edit the types of support offered (e.g., the list of ticket categories
like Remote, Onsite, Web Dev) and any default parameters like base prices or estimated
durations for each service .
Location Settings:  Manage serviceable locations/areas. For example, update the list of
allowed PIN codes or cities for onsite support .
Payment Settings:  Configure payment gateway keys (Razorpay API keys), tax rates, currency
preferences . This ensures invoices and payments are handled correctly.
Notification Settings:  Templates and toggles for system emails or in-app notifications (e.g.,
edit the email template for ticket updates, enable/disable certain email alerts) .
Security Settings:  Options like enabling two-factor authentication for admin login, password
policy, managing user roles/permissions if needed .
Content/Appearance:  Basic CMS features like updating the site’s logo, banner text, footer
info, Terms of Service, Privacy Policy links, etc. .
Announcements:  (Optional) Interface to post a site-wide announcement or notification (e.g.,
planned downtime, holiday closure) that could appear on user dashboards .
These settings allow the portal to be maintained and adjusted without code changes. Early
implementation can be minimal (some settings might even be just in a config file initially, but
listing them here guides future development). •
•
◦
64
◦
◦
64
◦ 64
◦
65
•
•
•
• 66
◦
67
◦
68
◦
69
◦
70
◦
71
◦
72
◦
73
◦
12

Access: Admin only.  (This page is restricted to the owner or super-admin role, as it controls global
configuration of the system.)
Mobile App Pages (Core Customer Flows)
(The QuickTechPro mobile app is focused on core customer interactions: logging in, creating/viewing tickets,
receiving quotes/invoices, and engaging with the blog. It’s essentially a streamlined client to the same backend,
offering on-the-go access to important features . The mobile UI will be simplified for small screens, and some
admin functions or less critical pages are omitted.)
Login Screen
Purpose:  Allows the user to authenticate in the mobile app to access their account.
Key Functionalities:  A simple login form (email/username and password) optimized for mobile. It
may include persistent login (token storage so the user doesn’t have to log in every time). After
successful login, the user is taken to the main Tickets view or Dashboard in the app. A link to the
Registration  screen is provided for new users, and a Forgot Password  option can launch a reset
process. (Social login buttons could be added if needed later , but not essential for initial release.)
Access: Customer users  (Admins typically wouldn’t use the mobile app in this initial scope, as admin
functions are not included; they would use the web portal).
Registration Screen
Purpose:  Enables new users to sign up for a QuickTechPro account directly from the app.
Key Functionalities:  A form to enter details like name, email, phone, and password (similar to the
web registration). Likely simpler UI with mobile-friendly form fields. After successful sign-up, the
user account is created and the app might log them in or prompt them to log in. Email verification
might be handled outside the app or via a link if required, but initial implementation could skip
immediate verification to streamline onboarding (depending on security needs).
Access: Public  (app  users)  –  Anyone  installing  the  app  can  create  an  account.  Primarily  for
customers; if an admin attempted to sign up here it would just create a normal user account (admin
accounts are expected to be created via backend if needed).
Ticket Creation Screen
Purpose:  Allows a customer to raise a new support ticket through the mobile app, just like the web
“New Ticket” page, but with a touch-friendly interface.
Key Functionalities:  A guided form for submitting an issue:
Users can choose the type of ticket (likely via a dropdown or segmented buttons for Remote ,
Onsite , Web Dev ). The form then shows the relevant fields (e.g., address input for onsite,
project details for web dev).
Input fields for issue description, etc., with mobile controls (text inputs, maybe voice-to-text
or photo attachments from camera roll).
Attach Photos/Files:  Ability to attach an image or file from the phone (or take a photo on the
spot of a hardware issue). This is important for troubleshooting. •
74
•
•
•
•
•
•
•
•
•
•
•
◦
◦
◦
13

If a Remote Support  ticket requires upfront payment, the app should integrate the Razorpay
mobile SDK or open a webview to complete payment . After payment, the ticket
submission is finalized and the user sees confirmation.
Location access (for onsite): The app could optionally use GPS or allow pinning an address on
a map to help provide location for onsite requests (or simply manual entry of address).
On submission, similar to web, show confirmation and navigate the user to the Ticket Detail
screen to see their newly created ticket’s info and status.
Access: Customer  (logged-in  via  app).  If  not  logged  in,  the  app  will  redirect  to  Login  before
showing this screen.
Ticket List Screen
Purpose:  Displays all tickets the logged-in customer has submitted, so they can quickly check
statuses and select a ticket to view details.
Key Functionalities:  A scrollable list of the user’s tickets. Each list item shows a summary: e.g., Issue
Title, maybe a short snippet of the latest update or status, and an icon or label for status (color-
coded, like green for resolved, red for new, etc.), plus possibly the ticket type icon. It may group
tickets by Open vs Closed, or have a filter toggle (e.g., a tab for “Open Tickets” and “Closed Tickets”
for simplicity on mobile).
The list should refresh (pull-to-refresh gesture) to update statuses. New or updated tickets
might be highlighted or sorted to top by last update.
Tapping on a ticket opens the Ticket Detail screen. If a particular ticket requires attention
(e.g., awaiting user response), it could be indicated here (like a badge or different highlight).
This screen ensures the user can navigate among multiple issues they have reported. It’s
essentially the mobile counterpart to the web “My Tickets” page.
Access: Customer (logged-in).  Only the user’s own tickets are shown.
Ticket Detail Screen
Purpose:  Shows the details of a specific ticket on the mobile device, allowing the customer to see
updates and respond to the admin, effectively continuing the support conversation on the go.
Key Functionalities:
Issue Details:  At the top, show the ticket’s key info – status (with maybe a colored label),
ticket ID, date opened, and the original issue description. If a technician has been assigned,
display that as well.
Message Thread:  The core of this screen is the chat-like thread of messages between the
admin and the customer . Each message/update is a bubble or container indicating who
sent it (e.g., “Tech Support” vs. “You”), the timestamp, and the message text. Images or file
attachments appear inline or as downloadable thumbnails.
Reply Input:  At the bottom, if the ticket is still open (not closed), the customer can type a
reply or add additional information. This input box allows text and possibly attaching a new
photo/file. Sending will post the message to the thread for the admin to see on their side.
Status Actions:  If the admin has performed actions that require user confirmation, the app
should reflect that. For example: if a quote was sent and is awaiting approval, the detail
screen can show a “View Quote”  button or section. If an invoice is pending, a “Pay Now”◦
74
◦
◦
•
•
•
•
◦
◦
◦
•
•
•
•
◦
◦
27
◦
◦
14

button might be visible (which navigates to the Invoice Payment screen or invokes the
payment flow).
Refresh & Notifications:  The app might use push notifications to alert the user of new
messages on the ticket . Opening the notification would bring them to this screen.
Additionally, a manual refresh or auto-refresh could be implemented to fetch the latest
thread data.
Closure and Rating:  If the ticket is marked resolved by admin, the app could prompt the user
here to rate the service or confirm closure. This could be a small form or a link to a feedback
screen.
Access: Customer (logged-in)  – owns the ticket. (Admins could have a similar view on mobile if the
app supported it, but in the current scope, admin actions are expected via web. The mobile app is
user-centric.)
Quotation View Screen
Purpose:  Allows the user to view a quotation document in the mobile app and take action (approve
or decline) on it.
Key Functionalities:  Displays the full quote details in a mobile-friendly format (could be a rendered
PDF viewer or a native screen showing line items and totals). The user can scroll to read all terms.
Actions include:
Approve Quote:  Possibly a big button to “Accept Quote” which, when tapped, confirms the
acceptance. The app might ask for a confirmation (to avoid accidental taps) and then mark
the quote as accepted. The associated ticket would update (e.g., status to Approved/Waiting
for scheduling ).
Decline/Request Changes:  Alternatively, the user might choose to reject or discuss the
quote. There could be a “Request Changes”  button, or the user can simply go back to the ticket
thread and send a message with their questions. (The UI could encourage the latter by
showing a prompt like “Have questions? Go to the ticket conversation to discuss with our
team.”)
If the quote is accepted, maybe show a confirmation message and instructions if any next
steps are needed (like “We will contact you to proceed” or it transitions to a project).
After acceptance or rejection, this screen might update to read-only mode (or simply indicate
the decision has been recorded).
Access: Customer (logged-in)  – only for the user who received the quote. (Admins send the quote
and would see the result in the admin portal; they don’t use this mobile screen.)
Invoice Payment Screen
Purpose:  Enables the user to view an invoice and complete payment from the mobile app.
Key Functionalities:  Similar to the web Invoice page, it shows the invoice details (items, amount
due, due date). On mobile, likely a simplified summary with a link or button to view the full invoice
details (maybe open a PDF if needed). The main action is “Pay Now”  for unpaid invoices.
Tapping Pay Now  will integrate with the mobile payment flow (perhaps opening Razorpay’s
SDK or a secure webview for payment ). The user can pay via their preferred method (card,
UPI, etc.). After payment, the app should receive a callback or confirmation to update the
status. ◦
75
◦
•
•
•
•
◦
◦
◦
◦
•
•
•
•
◦
74
15

If payment is successful, show a confirmation message and possibly allow the user to
download the receipt or view the paid invoice. If payment fails or is canceled, handle that
gracefully (prompt to retry or contact support).
If the invoice was already paid (or marked paid by admin), the screen will simply show it as
paid and possibly allow viewing the receipt.
The screen might be accessed via a notification (“Invoice #123 due”) or through the Ticket
Detail (if a ticket status moved to Awaiting Payment , the user would tap a link there).
Access: Customer  (logged-in)  –  only  the  intended  payer  (customer)  can  access  their  invoice.
(Admins handle invoices via the web admin interface.)
Blog Posts Screen
Purpose:  Allows the user to read blog articles within the mobile app, effectively a mobile view of the
blog listing and detail combined. This keeps users engaged and informed even on mobile, without
needing to visit the website separately.
Key Functionalities:
Blog List:  The screen might start with a list of recent blog posts (title, perhaps a thumbnail
image, and a short excerpt) in a scrollable feed. The user can tap on an article to read it. The
list can be basic, or include categories filter or search at the top to find specific topics (search
might be a later enhancement).
Blog Detail:  When an article is opened, the app shows the full content: title, author , date,
content text and images formatted for mobile reading . Users can scroll through the
content easily.
Commenting:  At the bottom of the article, if the user is logged in (they are, since this is
within the app), they should see existing comments and a field to add a comment .
Posting a comment in-app should update the article’s comment section and notify the admin
(for moderation if needed). The app should validate input and possibly limit comment length.
Interactions:  Other interactions like “liking” a post or sharing might be included (sharing
could leverage mobile’s native share sheet to social apps). These are nice-to-have; core is the
ability to read and comment.
The blog content on mobile likely doesn’t allow writing a full blog post by the user in the
initial version (since that is a less common use on mobile and for MVP it was not highlighted).
The focus is on consuming content and commenting.
Access: Public for reading , Customer for commenting.  (Even if not logged in, the app could allow
reading blog posts, but since the app itself requires login to use in general, effectively all app users
are logged in customers. Comments require login, which is already the case for app users. So
practically, anyone using the app can read posts; commenting is available to those logged in – i.e., all
app users by definition.)
(Note: The mobile app currently targets customer usage. Admin functionalities (ticket management, etc.) are not
part of the core mobile scope, but the admin could use a mobile browser and the responsive web admin portal if
needed .  In  the  future,  a  dedicated  admin  app  or  expanded  mobile  features  could  be  introduced  for
technicians on the go, but initially the focus is on customer-facing features.)
Developer Implementation Priority:  The above pages should be implemented focusing on functionality
first.  Start  with  the  essential  flows:  user  authentication,  ticket  submission  and  tracking,  admin  ticket◦
◦
◦
•
•
•
•
◦
◦
5
◦
5
◦
◦
•
76
16

handling, and the quote/invoice cycle, as well as the blog contribution and moderation system. Ensure role-
based access control is enforced on all pages (customers cannot reach admin pages and vice versa) .
Once these pages and their CRUD operations are working correctly, further enhancements (UI refinement,
input  validations,  security  hardening,  notifications,  etc.)  can  be  added.  This  outline  can  be  used  as  a
checklist for development progress, ensuring that each page’s features are implemented and tested before
moving to aesthetic improvements.
Comprehensive Plan for a Computer Repair &
Web Development Support Portal.pdf
file://file-B4TDbUoju48Npax6H2fWxR77 25
1 2 3 4 5 6 7 8 910 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60
61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77
17
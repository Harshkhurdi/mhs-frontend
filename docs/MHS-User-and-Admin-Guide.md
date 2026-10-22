# MHS Website User and Admin Guide

Medelec Healthcare Solutions

Website: [medelec.vercel.app](https://medelec.vercel.app/)

Version 1.2 | 21 October 2026 | For the business owner, service engineers, staff and website maintainer

This manual explains how visitors request equipment or service, how staff find and follow up enquiries, and how the owner manages Firebase and Vercel. It describes the current application, including its limits. It does not add features or change database permissions.

Source baseline: the current frontend, including `firebase/firestore.rules` for the deployed gallery and portrait permissions. Firebase project: `mhs-project-7235e`. Gallery and inquiry Trash rules were published on 22 October 2026. Website staff access still uses the existing Firebase Authentication accounts.

## 1 Quick start for checking enquiries

**Use this route whenever a customer says they submitted an enquiry.**

1. Open [Staff sign in](https://medelec.vercel.app/admin/login).
2. Enter the staff email address and password provisioned for the Firebase project. A Google or Vercel password is not automatically a website staff password.
3. In the dashboard, select **Customer inquiries**. The default section is **Equipment catalogue**, so switch tabs first.
4. Click **Refresh**. Records are loaded when the section opens or you refresh; the inbox is not a live notification feed.
5. Review the newest records first. Match the organisation, contact person, email, phone, message and selected equipment quantities. Dates are displayed in Indian Standard Time.
6. Click the customer's email address to open your mail app, or their phone number to start a call on a supported device. Contact them yourself; opening a link does not send a reply.
7. Record the follow-up in your existing enquiry register or CRM. The current dashboard has no assignment, reply editor, status update or mark-as-read action.
8. Select **Sign out** when finished on a shared computer.

**Where does the enquiry go?** A successful website submission creates a document in the Firestore collection named `inquiries`. It appears in the staff inbox after loading or refreshing that section. It does not automatically arrive in `info@medelec.in` or send an email, SMS or WhatsApp alert through the code supplied with this app.

If the inbox does not show it, use section 8 to check the same Firebase project directly. Do not ask the customer to submit repeated copies before checking: a slow connection can leave the outcome uncertain even if a record was saved.

## 2 Important addresses and account types

| Purpose | Address or identifier |
| --- | --- |
| Public website | [medelec.vercel.app](https://medelec.vercel.app/) |
| Browse equipment | [Medical solutions](https://medelec.vercel.app/solutions) |
| Equipment enquiry | [Contact form](https://medelec.vercel.app/contact#inquiry) |
| Service enquiry | [Service request form](https://medelec.vercel.app/contact?type=service#inquiry) |
| Staff login | [Staff sign in](https://medelec.vercel.app/admin/login) |
| Staff dashboard | [Admin workspace](https://medelec.vercel.app/admin) |
| Firebase console | [Open the MHS Firebase project](https://console.firebase.google.com/project/mhs-project-7235e/overview) |
| Vercel project | [MHS deployment dashboard](https://vercel.com/harsh-1c69/mhs) |
| Frontend source | [Harshkhurdi/mhs-frontend](https://github.com/Harshkhurdi/mhs-frontend) |
| Database rules source | [Frontend Firestore rules](https://github.com/Harshkhurdi/mhs-frontend/blob/main/firebase/firestore.rules) |

The old `mhs-frontend.vercel.app` address redirects to `medelec.vercel.app`. The Vercel project is named `mhs`; the GitHub repository still has `mhs-frontend` in its name. These names do not have to match.

There are three separate kinds of access:

- **Website staff account:** a Firebase Authentication email/password user, used at `/admin/login`.
- **Firebase project access:** a Google account granted permission to the Firebase/Google Cloud project. This is needed to inspect database records, manage Authentication users or change configuration in the console.
- **Vercel/GitHub access:** accounts allowed to manage hosting or source code. Website staff credentials do not grant either of these permissions.

No passwords, private keys or service account credentials belong in this manual or the public repository.

## 3 How visitors use the website

Visitors do not need an account to browse equipment, build a quote list or submit the contact form.

1. Start at the homepage. The eight manufacturer buttons change the featured equipment image. A manufacturer name below the hero opens its filtered catalogue. The top **Speak to our team** link opens an email to **info@medelec.in**.
2. Select **Find your equipment** or **Medical solutions** to open the catalogue.
3. Enter a model, brand or application in **Search equipment**. Search is case-insensitive; multiple words narrow the results together.
4. Choose a manufacturer and a clinical category. On a phone, use **Filters** to show the category controls. Filters combine with the search term.
5. Use **Featured first**, **Name A-Z** or **By manufacturer** to change the sort order. Use **Next** and **Previous** to move through pages of up to 18 results.
6. Remove an individual filter chip, clear the search, or select **Clear all** when no results match.
7. Open **Details** or click the product image/name to see the product information. **Official product page** and **Literature** open external manufacturer resources when available.
8. Add the required equipment to the quote list, then continue to an enquiry.

The address bar contains the catalogue filters. Staff can copy the full filtered URL and send it to a customer. For example, [Samsung equipment](https://medelec.vercel.app/solutions?brand=samsung) opens that manufacturer range.

The reference library currently contains 313 equipment models, accessories and product families: Hamilton Medical 16, KARL STORZ 140, Spacelabs Healthcare 13, Kiran Medical 51, Samsung Healthcare 30, LINET 50, Helmier 9, Nihon Kohden 4. Nihon Kohden is limited to defibrillators and AEDs. Helmier entries describe its published supply range; some devices retain their original Graseby/CADD/HOTLINE product brands. A family may cover several variants. This is a manufacturer reference range, not a real-time stock list. All entries link to official product information; 198 entries also have PDF literature, representing 170 distinct documents. Confirm regional availability and configurations before quoting.

## 4 Building and managing a quote list

**Add to quote** saves a product selection in the visitor's browser and opens the quote panel. This does not place an order or reserve stock.

1. Add equipment from a product card or its details dialog.
2. In the quote panel, use the minus/plus controls or the quantity box. Supported quantities are whole numbers from 1 to 999.
3. Select **Remove** beside a product to remove that line. **Clear quote list** removes the whole selection from that browser.
4. Close the panel using its close button or Escape. Reopen it with the quote-list icon in the header.
5. Select **Continue to inquiry**. The contact form shows the selected products and quantities for review.
6. Confirm the quantities before sending the enquiry.

The header count represents total units, not necessarily the number of different models. If two products have quantities 2 and 3, the count is 5.

The quote list normally survives reloads and browser restarts through local browser storage. It is not a signed-in customer account and does not automatically follow someone to another device, browser or domain. Clearing browser data removes it; private browsing or blocked storage may limit persistence. The move from the old domain to `medelec.vercel.app` does not migrate an old domain's saved browser selections.

Adding an item already present through the underlying add action can increase its quantity. A card that says **In your quote list** opens the existing list instead. Review the list rather than repeatedly clicking to increase quantities.

## 5 Sending an equipment or service enquiry

For equipment, use the contact page or continue from a quote list. For a service request, use **Send a service inquiry** on the service page or the service-form link in section 2.

The following fields are required:

- **Full name**: the person staff should contact.
- **Hospital / organisation**: the customer's institution or business.
- **Work email**: a valid email address.
- **Phone number**: a usable telephone number, with the country code where appropriate.
- **Department / requirement**: for example ICU, radiology or equipment maintenance.

**How can we help?** is optional. Use it for equipment configuration, quantities, delivery requirements, project timing or a description of the service issue. For service requests, include the manufacturer, model, serial number if available, facility location and a contact person. Do not include patient information or medical records.

Select **Send inquiry** once and wait. The confirmation heading is **Your inquiry is with us.** This means the application received a successful database-write response. The quote selection and saved form draft are cleared after success. It does not mean a staff member has reviewed the request or that a quotation has been issued.

If an error appears, the page retains the form details and quote list. Check the connection and try again from the same page. The **Open an email with these details** fallback creates a draft addressed to `info@medelec.in`; the visitor must send it from their email application. That email is separate from Firestore and is not automatically added to the staff inbox.

The form draft is saved in session storage as fields change. It can survive a reload in the same browser tab/session, but it is not a server-side saved enquiry. Do not rely on it after the tab/session ends. A timeout can mean the write result is unknown: check the staff inbox before creating another submission from a fresh page.

## 6 What happens after Send inquiry

| Stage | What the current app does | What staff or the customer must do |
| --- | --- | --- |
| Customer completes form | Validates required fields, email format through the browser, and phone format | Review contact details and quantities |
| Customer submits | Writes one document under `inquiries` in Firestore | Wait for success or an error |
| Database confirms success | Shows the confirmation panel and clears the current selection/draft | Staff still need to open the inbox |
| Staff open Customer inquiries | Loads records and sorts them newest first | Press Refresh for later arrivals |
| Staff review a record | Shows contact details, message, type, date and items | Call/email, confirm requirements and issue a quotation manually |
| Customer uses email fallback | Opens an email draft only | Customer sends it; staff check their actual email inbox |

There is no scheduled inbox polling or realtime listener in the supplied frontend. The frontend repository contains the current Firestore rules; it is not an email service or a NestJS server. No email trigger, delivery receipt, SMS notification or WhatsApp integration is defined in the inspected repositories. Any independently configured external automation would need to be checked separately in its own service.

A suggested business routine is to assign one person to check the dashboard at agreed times during office hours and keep an enquiry register with the customer, received time, assigned engineer, next action and follow-up date. This is an operating recommendation, not an existing app feature.

## 7 Reading and following up enquiries in the dashboard

After signing in, select **Customer inquiries**, then **Refresh**. Each card contains:

- **SERVICE REQUEST** when `type` is `service`; other or older records are displayed as **EQUIPMENT INQUIRY**.
- The organisation name, falling back to the contact name if necessary.
- The contact name and department/requirement.
- Clickable email and phone details.
- The message, when one was entered.
- Selected equipment names and quantities, when the enquiry included a quote list.
- The submitted date and time, displayed in IST. Missing or invalid dates can appear as **Date unavailable**.

**Delete inquiry** moves an irrelevant enquiry out of the inbox into **Trash**. Tick **Trash** beside Refresh to view removed enquiries, then select **Restore inquiry** to return one to the inbox. This retains the original message and contact details; it does not permanently erase the document. Failed updates show an error and keep the card visible. The database records `is_deleted` and `deleted_at` for this purpose.

The dashboard reads all enquiry documents allowed by the current database rules and sorts them in the browser by `created_at`. There is no enquiry search, date filter, export button, assigned engineer control, editable status, attachment viewer or in-app email composer in this version.

To follow up, contact the customer through your usual business process. Confirm local availability, the exact configuration and service requirements before issuing a quotation. Track the result outside the application unless the owner chooses to maintain an additional field in Firebase as described in section 10.

Opening an enquiry does not mark it read. Refreshing does not delete it. Older enquiries remain in the database. The `status` field is saved as `new`, but the current dashboard neither displays nor updates that field. Do not infer that an older `new` record has never been handled.

For a large inbox, loading all records may become slow. Filtering, pagination and status controls would be a future application enhancement; they are not configured through a hidden setting.

## 8 Opening and inspecting the Firebase database

Use the website dashboard for routine work. Use the Firebase console when you need to verify whether a record exists, inspect its exact fields, or manage configuration.

1. Open the Firebase project link in section 2 and sign in with the Google account that has project access.
2. Check that the selected project ID is **mhs-project-7235e**. A similarly named project is not sufficient.
3. Open **Firestore Database**. Firebase may group this under **Databases & Storage**; the console's navigation labels can change.
4. Open the **Data** tab and select the default Firestore database. The frontend calls `getFirestore(app)` without naming another database.
5. Select the collection **inquiries** to inspect incoming forms, or **products** to inspect MHS-managed product records.
6. Select a document ID to see the fields. Document IDs are identifiers; they are not necessarily customer names or enquiry dates.
7. For an enquiry, match `hospital`, `name`, `email`, `phone`, `message` and `created_at` with the customer's report. Expand `items` to inspect product names and quantities.
8. If needed, use the console's available query controls to locate a specific field value. The dashboard's enquiry list already sorts records newest first.

If the expected collection is absent, first confirm the project and database. Collections may not exist until their first document is created. Do not create a new database or copy data into another project merely because an inbox looks empty.

A normal website staff account does not automatically grant Firebase console access. Ask the project owner to grant the appropriate Google Cloud/Firebase project permissions when legitimate console access is required. Do not share a project owner's Google password.

## 9 Enquiry database fields and an example

Collection name: **inquiries**. Each successful submission is a document with the following fields.

| Field | Firestore type written by the app | Meaning |
| --- | --- | --- |
| `name` | string | Contact person's name |
| `hospital` | string | Hospital or organisation |
| `department` | string | Department or requirement |
| `email` | string | Customer email address |
| `phone` | string | Telephone number; preserve leading plus signs and zeros |
| `message` | string | Optional enquiry text; can be empty |
| `items` | array of maps | Selected equipment; can be an empty array |
| `type` | string | `equipment` or `service` |
| `status` | string | Initially `new`; currently not editable through the dashboard |
| `created_at` | number | Unix time in milliseconds from the submitting browser |

Every map inside `items` contains `id` as a string, `name` as a string and `quantity` as an integer from 1 to 999. The item ID can be a manufacturer reference ID or a database listing ID. Do not assume every selected item has a matching document in `products`.

Illustrative field values, not a real customer record:

```json
{
  "name": "Example contact",
  "hospital": "Example Hospital",
  "department": "ICU",
  "email": "contact@example.org",
  "phone": "+91 9000000000",
  "message": "Please quote the selected ventilator configuration.",
  "items": [
    { "id": "hamilton-c6", "name": "HAMILTON-C6", "quantity": 2 }
  ],
  "type": "equipment",
  "status": "new",
  "created_at": 1792512000000
}
```

The example timestamp only demonstrates the numeric format. New dates use `Date.now()`, so they depend on the submitting device's clock. The dashboard also understands older Firestore Timestamp values and parseable date strings. Do not replace a valid date with an unparseable label such as `today`.

## 10 Editing database records and tracking follow-up

Console edits affect the live database. Before an intended edit, record the document ID, original field names, types and values so you can restore them if necessary. There is no general undo or restore button in the website.

For an authorised owner making a small correction:

1. Open the correct document in Firestore's **Data** tab.
2. Locate the field and use the console's edit control.
3. Preserve its type. For example, keep `phone` as a string, `is_published` as a boolean, and `created_at` as a valid date representation.
4. Change only the intended value and save it.
5. Reload or refresh the relevant website section to verify the result.

For manual enquiry tracking, the owner may use a private external register, which avoids changing application data. Alternatively, an authorised console user can maintain `status` values such as `contacted`, `quoted` or `closed`, and optional fields such as `follow_up_note`. These are suggested owner conventions, not built-in workflow states. The current dashboard ignores such additional fields and does not show a changed status.

Under the repository rules, website clients can create enquiries and authenticated users can read them, but enquiry updates and deletes are not allowed. Console administration uses project permissions; website staff login alone does not grant console editing rights. Do not broaden the public rules merely to add a mark-as-handled workflow.

Deleting an enquiry is not the normal follow-up action. It removes the record and may leave you without a recoverable copy. Back up required information and follow your company's retention decisions before any deletion. Do not publish customer enquiry data in GitHub, public files, shared screenshots or this manual.

## 11 Adding and editing equipment through Admin

The **Equipment catalogue** tab manages documents in the `products` collection. It does not edit the separate 313-entry manufacturer reference file.

1. Sign in and open **Equipment catalogue**.
2. Select **Add product**, or **Edit** beside an existing row.
3. Enter **Product name** and **Description**. Both are required and cannot consist only of spaces.
4. Select one of the available manufacturers and a clinical specialty.
5. Optionally paste a complete public **Product image URL** and **Brochure URL**. Use `https://` addresses where possible; the form also accepts `http://`. A filename, local desktop path or private file-sharing link is not a usable public image URL.
6. Set **Published in the public catalogue** as required. New products start with this checkbox selected by default.
7. Select **Save product** and wait for **Product saved.**
8. Open or reload the public catalogue, remove filters that could hide it, and search for the model name.

The form automatically generates a slug from the name and a millisecond creation time for a new record. Editing uses a merge write and preserves fields not present in the form. If saving fails, the entered form values remain in the open form; retry after checking the connection and permissions.

There is no file upload control in this dashboard. Host new media at an approved public location, then paste its URL. You can use a public asset already deployed with this website by supplying its complete URL, for example `https://medelec.vercel.app/images/products/hamilton-c6.webp`.

The form has no field for an official product website URL. To give a new custom listing its own product-page link, the maintainer must add a `sourceUrl` string in Firestore through authorised console access, or maintain it in the manufacturer reference file. Existing `sourceUrl` values are preserved when the form saves other fields.

## 12 Publishing archiving and the two catalogue sources

**Publish** and **Archive** change the database record's boolean `is_published`. Archive is reversible and keeps the product in the staff table. The website does not provide a permanent-delete product button.

| Source | Where it is maintained | What an archive action does |
| --- | --- | --- |
| MHS database listing | Admin form or Firestore `products` | Stops that database listing from being publicly queried |
| Manufacturer reference entry | `src/data/manufacturerCatalogue.json` in GitHub | No effect on the separate reference entry |
| Matching database and reference entries | Both places | Removes the database overlay; the reference entry can remain visible |

This distinction explains why a product may still appear after staff archive it. The public page always starts with the local manufacturer reference file, then enriches matching entries with published database data. An archive action is not a global hide switch for a model.

Matching uses the manufacturer plus a normalised model name. For example, a published Hamilton-C6 ICU Ventilator listing can enrich the HAMILTON-C6 reference entry. When the match is unambiguous, the public card keeps the verified reference image, official product link, reference category label and existing reference literature link. Database name, description and other supplied fields can enrich it. The reference ID stays stable for quote selections.

Therefore, changing the image or brochure URL of a matched database product may not change the public media: the reference media is preferred. Edit the reference file to change that media, and deploy the code change. Avoid creating multiple database records for the same model; multiple matches are not a supported variant-management system.

A custom database product with no matching reference entry is appended when published. To remove a manufacturer reference entry entirely from public browsing, ask the maintainer to update the reference JSON, review homepage references to its ID, and deploy the change.

## 13 Product database fields and valid values

Collection name: **products**. Use the Admin form for ordinary edits; this field dictionary is for inspection and controlled console maintenance.

| Field | Type | How it is used |
| --- | --- | --- |
| `name` | string | Display name; required by the form |
| `slug` | string | Generated from the name; not a standalone product route |
| `brand` | string | One of the four manufacturer IDs below |
| `specialty` | string | One of the seven category IDs below |
| `description` | string | Description shown in product details; required by the form |
| `image_url` | string or null | Public image URL for a database listing |
| `pdf_url` | string or null | Public literature URL for a database listing |
| `is_published` | boolean | Use true or false, not quoted text |
| `created_at` | number | Milliseconds; set when creating through Admin |
| `sourceUrl` | optional string | Official product website link; not exposed in the Admin form |

**Manufacturer IDs:** `hamilton`, `samsung`, `linet`, `spacelabs`.

**Clinical specialty IDs:** `critical-care`, `radiology`, `ward-infrastructure`, `patient-monitoring`, `cardiology`, `pressure-care`, `accessories`.

Use exact lowercase IDs, not display labels such as `Samsung Healthcare`. A wrong ID can prevent expected filtering or manufacturer labelling. The dashboard shows only these four manufacturers in its dropdown; adding a fifth manufacturer requires a code update.

The public catalogue queries only records where `is_published` is boolean true. A string containing `true` does not satisfy that query. Blank optional image or brochure fields are stored as null by the form. Invalid or missing images show an unavailable-photo message rather than an invented product illustration.

A console-created record should follow the same field names and types. Do not rename collections to `enquiries` or `Products`: the code expects exactly `inquiries` and `products`.

## 14 Maintaining the manufacturer reference library

This section is for the website maintainer. Reference catalogue edits are source-code changes and need a GitHub commit and Vercel deployment.

1. Edit `src/data/manufacturerCatalogue.json` and locate the product by its stable `id`.
2. Keep names, manufacturer and category accurate. Use the ID values listed in section 13 for `brand` and `specialty`.
3. Supply an official product `sourceUrl`. Add `pdfUrl` only when a real official document is available.
4. For a new image, add an appropriately sized compressed file under `public/images/products/` and set `image` to its path starting `/images/products/`. Preserve `imageUrl` as the original manufacturer image URL for provenance.
5. Update `verifiedAt`, the catalogue metadata and `docs/manufacturer-sources.md` as appropriate.
6. If removing or renaming an entry ID, inspect `src/pages/Home.jsx` and `src/lib/catalogue.js`, where selected and featured IDs are listed.
7. Run the repository checks, review the public pages and deploy.

Common reference fields are `id`, `name`, `brand`, `specialty`, `categoryLabel`, `applications`, `description`, `image`, `imageUrl`, `sourceUrl`, optional `pdfUrl`, and `verifiedAt`. Keep IDs unique. Do not reuse an existing ID for a different model.

Manufacturer images and documents remain the property of their respective owners. Keep direct official links and source records. Local product assets are served by Vercel; this workflow does not require uploading them to Firebase Storage.

The reference catalogue appears even if a published-product read fails or times out after approximately eight seconds. This protects browsing, but it also means that a working catalogue does not prove database writes, staff permissions or custom product reads are working. Verify those flows separately.

## 15 Staff access and password administration

Website staff use Firebase Authentication with email and password. There is no public registration page, password-reset button, user-management screen or engineer-specific permission screen in the current website.

For an authorised project administrator provisioning staff:

1. Open the MHS Firebase project and go to **Authentication**.
2. Confirm the **Email/Password** sign-in provider is enabled. Do not enable additional providers merely to resolve a failed login.
3. Open **Users** and use **Add user** for the intended staff email and password, following your company's account policy.
4. Give the account details to that person through your approved private channel.
5. Have them sign in at `https://medelec.vercel.app/admin/login` and confirm they can load the intended dashboard sections.

For a forgotten password, an authorised administrator can use the Firebase Authentication user action to send a password-reset email. The staff member completes the reset privately. The login screen itself does not send reset emails. For a person leaving the business, the owner should review and disable their Firebase Authentication account and separately review any Google project, Vercel or GitHub access they have.

**Permission model to understand:** the repository Firestore rules check `request.auth != null` for privileged catalogue access and enquiry reads. They do not check a staff role, engineer assignment or an approved UID allowlist. Hiding a signup page does not itself enforce a backend staff allowlist. Treat this Authentication project as privileged, and have the maintainer review access rules before adding customer accounts or non-staff login flows. The deployed rules may differ and must be inspected in the console.

Bahudar, Prikshit and Ashish are labelled **Senior Service Engineer**; Surender and Virender are labelled **Service Engineer**. Those website profile labels do not create accounts or grant database privileges.

## 16 Data permissions and routine safeguards

The following describes the rules checked into `mhs-backend/firestore.rules`, not a live export of the deployed rules.

| Actor or action | Products | Inquiries |
| --- | --- | --- |
| Signed-out visitor reading | Published records only | Not permitted |
| Signed-out visitor creating | Not permitted | Permitted by the repository rule |
| Authenticated Firebase user reading | All records | All records |
| Authenticated Firebase user writing | Create, update and delete permitted by the repository rule | Update and delete not permitted |
| Website dashboard controls | Add, edit, publish, archive | Read and Refresh only |

The backend rules do not distinguish named staff roles. They also do not define enquiry field validation or rate limiting. This manual does not change them. If you need stronger staff restrictions, spam protection, validation or a follow-up workflow, implement and test those changes deliberately rather than opening the database to all readers or writers.

For normal operations, restrict privileged accounts, sign out on shared computers and keep customer enquiries private. The database stores contact details and requested equipment, so customer exports should be shared only with the people handling the request. Avoid collecting patient records through the enquiry form.

The Firebase web configuration is used by the browser and is not an admin credential. Actual protection depends on the configured services, rules and account permissions. Do not put Firebase service-account private keys, staff passwords or mail credentials in frontend code or any `VITE_` variable, because Vite exposes these variables in the client build.

Check the **Rules** tab against the current `firebase/firestore.rules` policy before assuming access behavior. A frontend deployment or Vercel rollback does not publish or restore Firestore rules.

## 17 Backups and recovering from mistakes

There are separate things to preserve: source code and local manufacturer assets in GitHub; customer/product records in Firestore; staff identities in Authentication; and hosting/environment configuration in Vercel. A backup of one is not a backup of all four.

For a small, important record correction, capture the original field values and document ID in a private location before editing. For regular database backups, the owner should decide the schedule, retention and recovery procedure. The website has no database backup, CSV export or restore button.

Google's managed Firestore export/import service requires billing on the Blaze plan and suitable project permissions and storage configuration. It is not automatically enabled because the website is deployed. Review the official export/import documentation in section 22 before choosing that option. A screenshot or a manually copied customer row is not a complete database backup.

For product mistakes, prefer **Archive** over deletion when the goal is to stop showing a custom database listing. If you edit the wrong field, restore its previous value and verify the app after refreshing. For deleted customer data, recovery depends on backups or recovery features that were already configured; the app cannot reconstruct missing records.

A Vercel rollback restores a deployed version of the website. It does not rewind Firestore documents, restore deleted enquiries, undo Authentication account changes or recover email messages. A GitHub revert similarly changes source files, not database contents.

Never save a Firestore customer-data export inside this public GitHub repository. Keep backup access restricted and test recovery using approved non-production data before relying on the process.

## 18 Running the website locally

This section is for the maintainer. The current app uses React, Vite and Firebase. There is no separate application server to start for these website flows. The current database policy is `firebase/firestore.rules` in this frontend repository; the older `mhs-backend` repository is not an executable application server.

Use Node 24, as specified by `package.json` and `.nvmrc`. From the frontend repository:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Before starting, fill `.env.local` with the existing Firebase web-app settings from **Project settings > General > Your apps**. Required variable names are `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` and `VITE_FIREBASE_APP_ID`. The example also includes `VITE_FIREBASE_STORAGE_BUCKET` and `VITE_FIREBASE_MESSAGING_SENDER_ID`. Use the correct existing project rather than creating another one.

Do not commit `.env.local`. Do not copy a service-account JSON key into these fields. Without the required configuration, the static reference catalogue can still appear, while sign-in and database-dependent actions fail or are unavailable.

Quality and production-preview commands:

```sh
npm test
npm run lint
npm run build
npm run preview
```

Local development is not automatically connected to a separate test database. If you supply production Firebase settings, database actions can affect production. Use an approved test project or an isolated testing adapter for write tests. The existing automated tests exercise quote data handling, URLs, timeouts and catalogue integrity; they do not prove a particular production staff account can sign in.

## 19 Deployment and website content updates

The GitHub repository is connected to the Vercel project **mhs**. The production branch is **main**. The build command is `npm run build`, and the output directory is `dist`. The domain is `medelec.vercel.app`, with the previous frontend address configured to redirect to it.

For a source-code change:

1. Update the appropriate source file and review the diff.
2. Run the checks in section 18.
3. Commit and push the change to `main` through the normal repository workflow.
4. Open the Vercel project and inspect the latest deployment. Wait for **Ready** before treating the update as live.
5. Open the public address and verify the changed page, links and relevant enquiry/admin flow.

| Change | Where to make it | New frontend deployment needed |
| --- | --- | --- |
| Custom database product or enquiry correction | Admin or authorised Firestore console access | No; reload/Refresh to read it |
| Manufacturer reference product, image or literature | Reference JSON, assets and source ledger | Yes |
| Employee profile or role wording | `src/data/team.js` and relevant page copy | Yes |
| Company phone, email, address or hours | Relevant public components/pages | Yes |
| Firebase web environment variables | Vercel project environment settings | Yes; redeploy to use updated build values |
| Firebase accounts or database rules | Firebase Authentication or Rules | No frontend deployment; test their effect |
| Production domain or redirect | Vercel Domains | Hosting configuration change; verify the result |

The Firebase configuration is compiled into the Vite build. Changing a Vercel environment variable does not change an already built deployment. For login/domain errors after an address change, inspect Firebase Authentication configuration and any API-key origin restrictions before changing unrelated settings. Do not replace the Firebase auth domain with the website domain without understanding the existing Firebase setup.

## 20 Troubleshooting enquiries and sign in

| Problem | Check first | Next action |
| --- | --- | --- |
| Customer says they submitted but inbox is empty | Correct staff account, Customer inquiries tab, then Refresh | Check the same project's `inquiries` collection in Firebase; match contact and organisation |
| No automatic email arrived | This version does not automatically send one | Check Admin, not only the email inbox; check email separately if the customer used fallback |
| Customer saw a timeout | A write may have succeeded before the timeout | Check for an existing record before asking for a fresh submission |
| Customer opened email fallback but staff received nothing | Opening a draft is not sending it | Ask whether they sent it from their email app and used the intended address |
| Inbox says unable to load | Connection, staff session and deployed rules | Retry/Refresh; owner checks project configuration and read permission |
| Sign-in says email or password is incorrect | Firebase staff credentials, not Vercel/Google credentials | Owner checks Authentication user/provider and uses the appropriate reset process |
| Too many login attempts | Temporary sign-in throttling | Wait before retrying; avoid repeated guessing |
| Staff can log in but cannot read or save | Login and database authorization are separate | Owner checks deployed Firestore rules and which Firebase project the build uses |
| An enquiry still has status new after contact | The app never updates status | Use the private follow-up register; the current UI does not track completion |

If a timed-out first write already created a document, a retry using the same document ID can be rejected as an update under the repository's create-only public enquiry rule. That is another reason to check whether the original arrived rather than widening the rules or submitting repeatedly from fresh pages.

The current build shows general connection errors rather than exposing database details to visitors. The maintainer may need to inspect browser developer-console errors to distinguish a permission problem from missing configuration or a network failure. Do not send customer data or private credentials with a support request.

## 21 Troubleshooting catalogue and hosting issues

| Problem | Likely explanation | Practical action |
| --- | --- | --- |
| Archived product is still visible | It has a separate manufacturer reference entry | Check both catalogue sources; update reference code if the model must disappear entirely |
| Admin image/brochure change is not visible | Matching reference media is preferred | Update the reference entry rather than repeatedly changing the database image |
| New product is missing | Wrong project, unpublished flag, active filters or stale page | Check boolean `is_published`, exact IDs, clear filters and reload |
| Manufacturer/custom listings fail but core catalogue works | Local reference data masks a failed Firestore read | Verify database access separately; the reference page alone is not a database health check |
| Equipment photo is unavailable | Broken, blocked, private or removed image URL | Use an approved public direct image URL; check reference asset paths for code-managed images |
| Product website link is absent on a custom listing | Admin does not collect `sourceUrl` | Owner/maintainer adds the official `sourceUrl` field or updates the reference file |
| No literature link is shown | That entry has no usable brochure URL | Use the official product page; add a verified document URL if available |
| New manufacturer is not in the dropdown | Manufacturers are defined in code | Maintainer updates the manufacturer definitions, relevant UI and catalogue data |
| New source change is not live | Deployment failed or the changed branch is not production | Inspect Vercel deployment status and the connected production branch |
| A direct route returns an error | Hosting routing/rewrite configuration changed | Check `vercel.json`, deploy and verify `/solutions` and `/admin/login` directly |

For an escalation, record the affected address, action, time in IST, visible error, relevant product/document ID and whether it happens while signed in or signed out. Keep customer message content and credentials out of public issue reports.

## 22 Acceptance checks and source references

Use this checklist after a significant app, configuration or permission change. Use approved test data and tell the owner before writing test records to production.

1. Open `medelec.vercel.app` and confirm the logo, images and navigation load.
2. Open the old address and confirm it redirects to the new domain.
3. Search for a known model; combine and clear manufacturer/category filters; open a product page and any literature link.
4. Add equipment to the quote list, change a quantity, close and reopen it, then reload to check the saved selection.
5. Complete one approved equipment enquiry. Confirm the success panel, then confirm the same organisation, message and quantities in Admin and Firestore.
6. Repeat a service enquiry through the service-form link and confirm it is labelled SERVICE REQUEST.
7. Check a failed-save scenario using a controlled test setup; verify form values remain and email fallback is clearly a draft.
8. With an authorised test staff account, create, edit, archive and republish a custom database product; check the public result and the reference-source distinction.
9. Sign out and confirm `/admin` requires login. Recheck access after any rule or Authentication changes.

**Verification boundary:** this manual is based on inspected source and the previously verified live website/domain. Earlier app checks included an isolated adapter for enquiry and staff write workflows. Gallery and portrait rules were published through the existing project owner session. Public gallery reads and authenticated/anonymous portrait rules were checked. Upload workflows were tested with isolated local data; a successful real website staff sign-in and authenticated production upload remain unverified because no staff credentials were supplied. No test album or portrait was written to production.

Application sources: `src/pages/Contact.jsx`, `src/pages/AdminDashboard.jsx`, `src/pages/AdminLogin.jsx`, `src/context/AuthContext.jsx`, `src/components/RFQContext.jsx`, `src/components/QuoteDrawer.jsx`, `src/pages/MedicalSolutions.jsx`, `src/lib/catalogue.js`, `src/lib/quote.js`, `src/config/firebaseClient.js`, `src/config/firebaseDatabase.js`, `src/data/manufacturerCatalogue.json`, `.env.example`, `package.json` and `vercel.json` in the frontend repository; `firebase/firestore.rules` in the frontend repository. These establish the application-specific behavior in this guide.

Official platform references, consulted on 20 October 2026:

- [Manage Firestore using the Firebase console](https://firebase.google.com/docs/firestore/using-console): inspecting and editing database data.
- [Manage Firebase Authentication users](https://firebase.google.com/docs/auth/web/manage-users): creating/managing users and password recovery.
- [Add users in the Firebase console](https://support.google.com/firebase/answer/6400802?hl=en).
- [Reset users' passwords](https://support.google.com/firebase/answer/9133462?hl=en).
- [Firestore supported data types](https://firebase.google.com/docs/firestore/manage-data/data-types).
- [Security Rules and Firebase Authentication](https://firebase.google.com/docs/rules/rules-and-auth): authentication-based access checks.
- [Firestore export and import](https://firebase.google.com/docs/firestore/manage-data/export-import): managed database backup/export requirements.
- [Vercel environment variables](https://vercel.com/docs/environment-variables): environment values and deployments.

Keep this guide with the repository and update it when the enquiry workflow, access rules, catalogue sources or production address changes.


## 23 Photos, conferences and events

Visitors select **Photos & events** in the navigation, filter by the categories currently represented in the gallery, and open an album. The viewer supports next/previous buttons, thumbnails, arrow keys and Escape to close. Photographs are loaded when an album opens.

To add an event:

1. Sign in at `/admin/login`, then select **Photos & events**.
2. Click **Add album**. Enter the title, category, location and a description. The event date is optional; enter it only when confirmed.
3. Select **Upload photographs**. Choose up to ten JPG, PNG or WebP files, each below 20 MB. Export iPhone HEIC pictures as JPG first.
4. Review each photo caption. Use a clear description of what is shown. Captions also help visitors who use screen readers.
5. Use the up arrow on a photograph to make it the cover. Remove any unwanted photos before saving.
6. Keep **Publish on the website** checked when the album is ready; uncheck it to save a draft. Click **Save album**.
7. Visit `/events` in another tab and open the album to review the result. Reload an already-open public page after saving.

The three selected stories show the Punjab CM’s equipment visit, the HAMILTON-C6 installation at PGI Chandigarh, and a HAMILTON-C6 clinical training session. Four selected owner-supplied photographs replace the old sample gallery. Dates were not supplied and are left blank. The selected stories have built-in starting content in `src/data/events.js`; staff can use **Edit album** to change titles, captions or photos, then save to Firestore. Saved versions override the starting content. **Archive** hides an album, **Publish** restores it, and archived starting stories do not return. Old demo records are omitted from the gallery. The CM visit remains first, installation second and training third; additional albums follow by date.

If a save fails or times out, the editor retains its fields and photographs. Refresh the album list to check whether it arrived, then retry the same editor if necessary. The album ID stays the same on retry. Do not repeatedly start fresh albums.

### Where gallery data is stored

| Path | Contents | Public visibility |
| --- | --- | --- |
| `events/{albumId}` | Album metadata and a small cover image | Published albums only |
| `events/{albumId}/photos/{photoId}` | Optimized image, thumbnail, caption and position | Published photos in published albums only |
| `teamProfiles/{engineerId}` | Public engineer portrait and update time | Public portraits |

Staff can read drafts and save albums/portraits. Visitors cannot write these collections. Albums and photos are archived, not permanently deleted through the app. Inquiry updates are limited to the two Trash fields for authenticated staff; other inquiry fields and permanent deletion are not enabled through the app. The authoritative policy is `firebase/firestore.rules`; `firebase.json` points to it. A Vercel/GitHub deployment does not publish database rules automatically. The project owner must publish changed rules separately in Firebase or with an authenticated Firebase CLI.

The four selected launch photographs are optimized WebP files served with the website. Staff changes and uploaded photographs use the existing no-cost Firestore plan with bounded, optimized image documents, avoiding a separate Storage upgrade. A photograph is reduced to at most 1600 × 1200 pixels and about 350 KB; cover thumbnails to 480 × 320 and 40 KB. Base64 encoding increases stored size. The design is intended for a small curated event gallery, not an unlimited full-resolution photo archive. Keep original photographs in your normal business backup. Firestore quotas still apply.

## 24 Service engineer photographs

1. Sign in and select **Team photographs**.
2. Find the named engineer and select **Choose portrait**.
3. Check the preview, then click **Save portrait**.
4. Reload **About us** and inspect the small portrait beside the engineer’s name. Use a clear head-and-shoulders photo with room around the face; the site displays it in a vertical frame.
5. To revert, select **Use placeholder**. The engineer’s name, role and service description stay in place.

Portraits are optimized to fit within 640 × 800 pixels and about 160 KB. Only the five existing engineer IDs are accepted by the portrait rules. If a save fails, the selected preview is retained so it can be retried. The engineers’ actual portraits still need to be uploaded; placeholders do not represent real employees. The supplied MHS logo is used in the header, footer and browser icon.

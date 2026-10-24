# Gallery delivery and photo viewer

The new viewer preserves full photographs with contain sizing, a separate story panel, captions, thumbnails, named controls, keyboard arrows/Escape and single-finger swipes. Close restores focus to the original gallery trigger, including after adjacent-album navigation. Image failures can be retried without resetting the selected photograph.

Seven original legacy photographs now have genuine 480px-bounded WebP thumbnails. All original static URLs remain available. Production builds additionally emit content-hashed `/media/<16hex>-<filename>` aliases and cache those aliases immutably; replacing an image produces a new URL. Gallery saves normalize bundled aliases back to `/images/events/...`, so saved records do not retain a retired deployment hash. No long immutable cache is applied to replaceable original paths.

## Split uploaded assets: active for new uploads

The reviewed Firestore rules were deployed to `mhs-project-7235e` on 24 October 2026. `VITE_GALLERY_SPLIT_ASSETS_ENABLED` now defaults to enabled for new uploads; explicitly set it to `false` for the documented write-format rollback. The redesigned viewer supports both formats. A read-only production inspection found zero remote event/album/photo documents, so no existing uploaded originals require migration. All current 21 albums and 58 photographs remain bundled static assets.

When enabled, saving an uploaded photo atomically writes lightweight `events/{album}/photos/{photo}` metadata (`src` is its thumbnail, `asset_id` equals photo ID) and full image bytes to `events/{album}/photoAssets/{photo}` (`src`, `is_published`, `updated_at`). Public asset reads require the album, photo metadata and asset to be published. The viewer reads the selected original plus at most one adjacent original. Editors deliberately load all originals.

Existing inline full-image photo documents remain readable and are not migrated automatically. Before migrating an existing album, export its event, photo and asset documents, keep the export private, and retain an inventory of record IDs/counts. Re-saving after enabling the flag upgrades only that album. Compare captions/order/full-image appearance and visibility before proceeding. Existing bundled static albums do not require conversion.

For rollback, disable the write flag but retain the new compatible reader/rules while any split records exist. Rolling back to an old reader would display the metadata thumbnail instead of its original. Restore backed-up inline photo documents before rolling back that reader. No production album data was modified during implementation.

This stage reduces full-image downloads per album opening. Full originals remain separate Firestore documents, not independently HTTP-cacheable object-storage URLs. Moving existing photographs to object storage is a separate backed-up provider migration and has not been executed.

## Archive and withdrawal

Archive hides the gallery listing. It cannot revoke an already public static image URL, browser/download copy or external cache. Actual withdrawal requires removing the source file and redeploying, checking all references and requesting cache/search removal where appropriate. Do not describe archive as erasure.

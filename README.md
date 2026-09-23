# One Book, One Idea

A personal reading log. One book, one durable idea.
Publishes like WordPress: hit **Write** on the site, type the entry,
hit **Publish** — it goes live right away.

## How publishing works

The site is a single static page. The **Write** button opens an editor in the
page itself. On publish, the page writes the new entry straight into its own
`index.html` on GitHub through the GitHub API, so the entry is live as soon as
GitHub Pages rebuilds (about a minute).

One-time setup: publishing needs a fine-grained GitHub personal access token
with **Contents: Read and write** on this repository only. The site asks for it
the first time you publish and stores it only in your browser's local storage —
it is never sent anywhere except GitHub.

## Files

- `index.html` — the entire site, self-contained: the log, the editor, and the
  publishing logic.
- `README.md` — this file.

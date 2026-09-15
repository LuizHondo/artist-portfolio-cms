## Purpose

Presents Raul Barbosa's portfolio to visitors — the home gallery, individual
artwork pages, an about page, and a links page — sourced live from the
backend so published artworks appear without a frontend redeploy.

## ADDED Requirements

### Requirement: Home gallery reflects artwork priority
The home page SHALL display artworks fetched from the backend, grouped by
`featuredPriority`: priority 1 artworks in the featured tier, priority 2 in
a secondary tier, priority 3 in an archive tier. Artworks with
`featuredPriority` 0 SHALL NOT appear on the home page.

#### Scenario: Artworks render in priority tiers
- **WHEN** the home page loads and the backend has artworks at priority 1, 2, and 3
- **THEN** each artwork appears in the tier matching its `featuredPriority`, and no priority-0 artwork appears anywhere on the page

#### Scenario: A priority tier has no artworks
- **WHEN** no artwork has a given `featuredPriority` (e.g. no priority-2 artworks exist)
- **THEN** that tier's section is omitted rather than rendered empty

### Requirement: Home gallery is filterable by medium
Visitors SHALL be able to filter the displayed artworks by medium (derived
from each artwork's `medium` field) without leaving the page.

#### Scenario: Selecting a medium filter
- **WHEN** a visitor selects a medium filter that matches a subset of artworks
- **THEN** only artworks whose medium matches remain visible across all tiers

#### Scenario: Filter matches nothing
- **WHEN** a visitor selects a medium filter that matches no artwork
- **THEN** the page shows an empty state instead of stale or incorrect results

### Requirement: Artwork detail page shows one artwork by slug
Navigating to an artwork's detail page SHALL fetch and display that single
artwork (by its `slug`) with its title, summary, medium, year, cover image,
and metadata.

#### Scenario: Valid slug
- **WHEN** a visitor opens the detail page for an existing artwork's slug
- **THEN** that artwork's title, summary, medium, year, and cover image are shown

#### Scenario: Unknown slug
- **WHEN** a visitor opens a detail page for a slug that does not exist in the backend
- **THEN** the page shows a not-found state rather than an error page or stale content

### Requirement: Artwork entries render in order and by size
An artwork's process entries SHALL render in `displayOrder` and SHALL be
laid out according to each entry's `size` value, mapped to the page's
image-size tiers (`small`→small, `medium`→half, `large`→full).

#### Scenario: Entries render in displayOrder
- **WHEN** an artwork has multiple entries with different `displayOrder` values
- **THEN** they appear on the page in ascending `displayOrder`, not creation order

#### Scenario: Entry size drives layout width
- **WHEN** an entry has `size: "large"`
- **THEN** it renders at the page's full-width tier; a `"medium"` entry renders at the half-width tier and a `"small"` entry at the small tier

### Requirement: About page presents artist bio and skills
The about page SHALL display the artist's bio, skills/disciplines, and
contact links.

#### Scenario: About page loads
- **WHEN** a visitor opens the about page
- **THEN** the bio text, the list of skills, and the enabled social/contact links are all visible

### Requirement: Links page lists contact and social channels
A standalone links page SHALL list the artist's enabled social channels and
contact email as clickable entries, independent of the main site navigation.

#### Scenario: Links page loads
- **WHEN** a visitor opens the links page
- **THEN** every enabled social channel and the contact email are shown as clickable links, and each link's destination matches its configured URL

### Requirement: Shared navigation links all public pages
Every public page SHALL expose navigation to Home, Artworks (the home
page's gallery section), About, and (from the footer) Links, so a visitor
can reach any public page from any other.

#### Scenario: Navigating from any public page
- **WHEN** a visitor is on any public page (home, artwork detail, about, or links)
- **THEN** they can reach Home, About, and the artwork gallery via the shared nav or footer without using the browser back button

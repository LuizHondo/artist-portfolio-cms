## Purpose

Gives the site owner an authenticated console to manage artworks and their
process entries against the backend, so the public site's content can be
kept current without touching code or the database directly.

## ADDED Requirements

### Requirement: Admin routes require authentication
Every admin route except the login page SHALL be inaccessible to an
unauthenticated visitor, and SHALL redirect them to the login page instead
of rendering admin content or data.

#### Scenario: Unauthenticated visitor requests an admin page
- **WHEN** a visitor without a valid session token requests `/admin`, `/admin/artworks`, or an artwork edit page
- **THEN** they are redirected to the admin login page and no artwork data is fetched or displayed

#### Scenario: Authenticated admin requests an admin page
- **WHEN** an admin with a valid session token requests an admin page
- **THEN** the page renders normally

### Requirement: Admin can log in and out
An admin SHALL be able to authenticate with email and password against the
backend, and SHALL be able to log out, ending their session.

#### Scenario: Successful login
- **WHEN** an admin submits correct email and password on the login page
- **THEN** they are authenticated and redirected into the admin area

#### Scenario: Failed login
- **WHEN** an admin submits an incorrect email or password
- **THEN** login fails, an error is shown, and no admin route becomes accessible

#### Scenario: Logout
- **WHEN** an authenticated admin logs out
- **THEN** their session ends and subsequent admin route requests redirect to login

### Requirement: Dashboard summarizes artwork state
The admin dashboard SHALL show the total artwork count, the featured
artwork count, and a list of the most recently created artworks with a
link to create a new artwork.

#### Scenario: Dashboard with existing artworks
- **WHEN** an admin opens the dashboard and artworks exist
- **THEN** the total count, featured count, and a recent-artworks list are all shown, reflecting live backend data

#### Scenario: Dashboard with no artworks
- **WHEN** an admin opens the dashboard and no artworks exist yet
- **THEN** the dashboard shows an empty state instead of an empty or broken table

### Requirement: Admin can list, edit, and delete artworks
The admin artworks page SHALL list every artwork with its title, medium,
year, featured priority, and entry count, and SHALL let the admin open an
edit form or delete an artwork from that list.

#### Scenario: Listing artworks
- **WHEN** an admin opens the artworks list
- **THEN** every artwork from the backend appears with its title, medium, year, featured priority, and entry count

#### Scenario: Deleting an artwork
- **WHEN** an admin confirms deletion of an artwork
- **THEN** the artwork is removed from the backend and disappears from the list without a full page reload

### Requirement: Admin can create and edit an artwork with its entries
The admin form SHALL let the admin create a new artwork or edit an
existing one, including its title, slug, summary, cover image, medium,
year, and featured priority, and SHALL let the admin add, edit, and remove
that artwork's process entries (title, image, description, size, display
order) in the same form.

#### Scenario: Creating an artwork with entries
- **WHEN** an admin fills in a new artwork's fields, stages one or more entries with a size selected for each, and saves
- **THEN** the artwork and all staged entries are persisted to the backend and appear when the form is reopened for editing

#### Scenario: Editing an existing artwork's entries
- **WHEN** an admin opens an existing artwork, changes one entry's size, removes another entry, and saves
- **THEN** the changed entry reflects its new size, the removed entry no longer exists, and other entries are unaffected on reload

#### Scenario: Entry size is required
- **WHEN** an admin attempts to add a new entry without selecting a size
- **THEN** the form blocks adding that entry until a size is chosen

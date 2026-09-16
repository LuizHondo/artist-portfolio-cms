## Purpose

Defines how an artwork's process entries are created, updated, and deleted,
including each entry's required column count and its ordered set of images.

## ADDED Requirements

### Requirement: Entry column count classification
Each `ArtworkEntry` SHALL have a `columns` field whose value is an integer
between 1 and 5 inclusive.

#### Scenario: Reject invalid columns value
- **WHEN** an admin submits an entry with `columns` set to a value that is
  not an integer between 1 and 5 inclusive
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create or update the entry

### Requirement: Columns required on entry creation
The system SHALL require an explicit `columns` value when creating a new
artwork entry. It SHALL NOT apply an implicit default when `columns` is
omitted.

#### Scenario: Missing columns on create
- **WHEN** an admin submits a new entry without a `columns` field
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create the entry

### Requirement: Entry image count matches columns
An entry's number of images SHALL always equal its `columns` value. Each
image SHALL have its own `url`, `title`, and `description`, and SHALL
occupy a distinct position from 1 to `columns`.

#### Scenario: Reject image count mismatch
- **WHEN** an admin submits an entry whose number of images does not equal
  its `columns` value
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create or update the entry

#### Scenario: Reject entry with no images
- **WHEN** an admin submits an entry with zero images
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create or update the entry

#### Scenario: Reject incomplete image
- **WHEN** an admin submits an entry where any image is missing `url`,
  `title`, or `description`
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create or update the entry

### Requirement: Columns and images are updatable after creation
An admin SHALL be able to change an existing entry's `columns` value and
its images independently of the entry's other fields, after the entry has
already been created. Changing `columns` to a smaller value SHALL discard
the images at the positions beyond the new `columns` value.

#### Scenario: Update columns on existing entry
- **WHEN** an admin submits an update for an existing entry with a new
  `columns` value and a matching number of images
- **THEN** the system SHALL persist the new `columns` value and the
  submitted images, and SHALL leave the entry's other fields unchanged

#### Scenario: Reduce columns discards excess images
- **WHEN** an admin updates an existing entry from a higher `columns` value
  to a lower one
- **THEN** the system SHALL retain only the images at positions from 1 up
  to the new `columns` value and SHALL remove the images at any higher
  position

### Requirement: Admin can persist entry and image changes
The admin interface SHALL persist entry creation, edits, and removal,
including each entry's images, to the backend. Entries and images added,
edited, or removed by an admin SHALL be reflected in storage after the
admin saves, regardless of whether the parent artwork is being created or
already exists.

#### Scenario: New entries saved when creating an artwork
- **WHEN** an admin adds one or more entries while creating a new artwork
  and saves
- **THEN** the system SHALL create the artwork and SHALL create each added
  entry against it, each with its specified `columns` and images

#### Scenario: Edited entry saved on an existing artwork
- **WHEN** an admin changes a field (including `columns` or an image) on an
  entry that already belongs to an existing artwork and saves
- **THEN** the system SHALL persist the change to that entry and its images

#### Scenario: Removed entry deleted on an existing artwork
- **WHEN** an admin removes an existing entry from an artwork and saves
- **THEN** the system SHALL delete that entry and all of its images from
  storage

### Requirement: Existing entries remain valid after migration
An `ArtworkEntry` created before this change SHALL be readable and
displayable after migration, with `columns` set to 1 and its prior single
image preserved as the entry's one image.

#### Scenario: Pre-existing entry displays after migration
- **WHEN** an artwork entry that was created under the previous
  single-image model is read after migration
- **THEN** the system SHALL report `columns` equal to 1 and SHALL return
  exactly one image containing the entry's prior `imageUrl`, `title`, and
  `description`

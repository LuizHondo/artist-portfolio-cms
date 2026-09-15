## Purpose

Defines how an artwork's process entries are created, updated, and deleted,
including each entry's required display-size classification.

## ADDED Requirements

### Requirement: Entry size classification
Each `ArtworkEntry` SHALL have a `size` field whose value is exactly one of
`small`, `medium`, or `large`.

#### Scenario: Reject invalid size value
- **WHEN** an admin submits an entry with `size` set to any value other than
  `small`, `medium`, or `large`
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create or update the entry

### Requirement: Size required on entry creation
The system SHALL require an explicit `size` value when creating a new
artwork entry. It SHALL NOT apply an implicit default when `size` is omitted.

#### Scenario: Missing size on create
- **WHEN** an admin submits a new entry without a `size` field
- **THEN** the system SHALL reject the request with a validation error and
  SHALL NOT create the entry

### Requirement: Size is updatable after creation
An admin SHALL be able to change an existing entry's `size` independently of
its other fields, after the entry has already been created.

#### Scenario: Update size on existing entry
- **WHEN** an admin submits an update for an existing entry with a new
  `size` value and no other field changes
- **THEN** the system SHALL persist the new `size` value and SHALL leave the
  entry's other fields unchanged

### Requirement: Admin can persist entry changes
The admin interface SHALL persist entry creation, edits, and removal to the
backend. Entries added, edited, or removed by an admin SHALL be reflected in
storage after the admin saves, regardless of whether the parent artwork is
being created or already exists.

#### Scenario: New entries saved when creating an artwork
- **WHEN** an admin adds one or more entries while creating a new artwork and
  saves
- **THEN** the system SHALL create the artwork and SHALL create each added
  entry against it, each with its specified `size`

#### Scenario: Edited entry saved on an existing artwork
- **WHEN** an admin changes a field (including `size`) on an entry that
  already belongs to an existing artwork and saves
- **THEN** the system SHALL persist the change to that entry

#### Scenario: Removed entry deleted on an existing artwork
- **WHEN** an admin removes an existing entry from an artwork and saves
- **THEN** the system SHALL delete that entry from storage

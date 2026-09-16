## Purpose

Defines the site-wide lockscreen/idle-relock behavior: an entry gate shown on the home route, and an idle-triggered screensaver that reappears on any route after inactivity, independent of which page is being viewed.

## ADDED Requirements

### Requirement: Entry gate on the home route
The system SHALL show a full-viewport lockscreen overlay when the home route (`/`) is loaded directly, and SHALL NOT show it when `/artworks` or an artwork detail route is loaded directly.

#### Scenario: Visiting the home route
- **WHEN** a visitor loads `/`
- **THEN** the lockscreen overlay is shown, covering the page

#### Scenario: Deep-linking to the gallery
- **WHEN** a visitor loads `/artworks` directly (not via the home route)
- **THEN** the lockscreen overlay is not shown and the gallery is visible immediately

#### Scenario: Deep-linking to an artwork detail page
- **WHEN** a visitor loads `/artwork/[slug]` directly
- **THEN** the lockscreen overlay is not shown and the artwork detail page is visible immediately

### Requirement: Entering the portfolio navigates to the gallery
The system SHALL dismiss the lockscreen and navigate to `/artworks` when the visitor activates "Enter Portfolio Site" from the entry gate.

#### Scenario: Clicking Enter Portfolio Site
- **WHEN** a visitor on the home route's lockscreen clicks "Enter Portfolio Site"
- **THEN** the lockscreen is dismissed and the browser navigates to `/artworks`

### Requirement: Idle timeout re-shows the lockscreen on any route
The system SHALL re-show the lockscreen overlay after 5 minutes of no user interaction (mouse movement, click, keypress, scroll, or touch), regardless of which route is currently active, once the visitor has unlocked at least once.

#### Scenario: Idle on the gallery page
- **WHEN** a visitor has unlocked and remains on `/artworks` with no interaction for 5 minutes
- **THEN** the lockscreen overlay reappears over the gallery page

#### Scenario: Idle on an artwork detail page
- **WHEN** a visitor has unlocked and remains on `/artwork/[slug]` with no interaction for 5 minutes
- **THEN** the lockscreen overlay reappears over the artwork detail page

#### Scenario: Interaction resets the idle timer
- **WHEN** a visitor interacts with the page (mouse movement, click, keypress, scroll, or touch) before 5 minutes of inactivity elapse
- **THEN** the idle timer resets and the lockscreen does not reappear

### Requirement: Dismissing an idle-triggered lockscreen stays in place
The system SHALL dismiss an idle-triggered lockscreen without navigating away from the route the visitor was already on.

#### Scenario: Dismissing the screensaver on an artwork detail page
- **WHEN** the idle-triggered lockscreen is showing over `/artwork/[slug]` and the visitor interacts with it to dismiss it
- **THEN** the lockscreen is dismissed and the visitor remains on `/artwork/[slug]` at their prior scroll position

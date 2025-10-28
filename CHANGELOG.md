# Changelog
All notable changes to this project will be documented here.

## Build

- add git-cliff config and CI workflow (96808e9)

- add MIT License (b7bf9c2)

- remove unused components (045e960)

- stop tracking local SQLite db; ignore *.db (e006044)

- wire /pos, /pos/sale, /pos/stock, /pos/customer to page wrappers (no UX change) (a71d9f7)

- delete unused auth feature (not wired into app) (2eb16df)

- delete placeholder types for stock and customer (1e0c76d)



## Chore

- Remove unused css code in features (28f16c7)

- Move shared css files to features that own it (11039d4)

- Unify card headers (1b8d34b)

- Unify Shopping Cart header (f2ee070)

- Modularise shared forms css files (9ca40ab)

- Re-factor shared theme variables (e823208)

- Remove unused types.ts file (453b512)

- Unify imports (aa461c7)

- unify homepage cards with dark/light mode css files (d0dfcae)

- Fix cliff file (f53658f)

- Fix sidebar not rendering on ADD PRODUCTS card (f857c7c)



## Docs

- update README with one-command setup and add run-dev scripts (0260ac2)

- Updated README to explain how to correctly run backend & frontend on Windows (933f167)

- add auto-generated Routes table + generator; updates frontend README (0a4bce6)

- Updated layout of routing table in README (86672f0)

- add license section; chore(frontend): polish routes generator output (75ff7a9)

- update CHANGELOG.md [skip ci] (ef5949a)

- update CHANGELOG.md [skip ci] (a4bd6d7)

- update CHANGELOG.md [skip ci] (49d3998)

- update CHANGELOG.md [skip ci] (31fb1c1)

- update CHANGELOG.md [skip ci] (02078b0)

- update CHANGELOG.md [skip ci] (ccab4b9)



## Enhance

- improve layout of schedule delivery component (8527a15)



## Feat

- Wizard UI added to guide sales process (61c5189)

- add functionality to navigate through task wizard by clicking on steps on the wizard taskbar (72ce8cd)

- Enhance layout of cart items (9307848)

- Extend layout of Payment cards (a57e08f)

- Update light mode colour palette to 'periwinkle' (326ff52)

- Light mode header and footer have white background (9a52724)

- Enhance Sale Wizard Delivery Schedule Step with Glassmorphic UI Design (50fc73f)

- Simplify UI for Delivery Schedule in Sale Wizard (96423e9)



## Feature

- Resize and clean up Create Sale page (a5bde34)



## Features

- Added basic UI layout for 'create sale' page (9396354)

- free-typed pricing inputs with validation + placeholders (94eb931)

- redesign Customer Details form layout in Sale flow (b1cb2a1)

- improve validation UX with always-enabled continue buttons (c7dc339)

- redesign cart interface and enhance product validation UX (aa7b631)

- enhance cart UX with product images, inline price editing, discount controls, and improved layout (01cfaa4)

- scaffold FastAPI backend with config, SQLAlchemy session, and /api/v1/health (d21e8f3)

- add wrappers for CreateSale, SearchCustomers, CheckStock (590b027)

- add navigation blocking for unsaved sale data (7112410)

- redesign page with professional SVG icons and modular CSS (fca94b4)

- implement sticky ActionBar with smart navigation and design improvements (39f4ee7)

- implement ActionBar with context-aware labels and wizard positioning (41aaf5e)

- add navigation prompt hook for unsaved data protection (1a4d4b6)

- tokenize header + fix brand color (a6a8aec)

- enhance light theme with improved depth and visual hierarchy (ccff6ba)

- enhance light theme with improved depth and visual hierarchy (5c52864)

- comprehensive light mode contrast and readability improvements (a74852c)

- add comprehensive CI/CD pipeline with CSS analysis tools (edeb90c)

- enhance wizard and form color hierarchy for light mode (3fe64c1)

- enhance shopping cart layout with premium design improvements (cd16f44)

- redesign Additional Services card with icon grid layout (f4fe66f)

- optimize additional services cards with frosted glass design (540cc73)

- align summary tiles with service grid and refine styling (fe0d038)

- implement minimal clean design for delivery instructions card (393647e)



## Fix

- prevent premature error message in sale wizard (0adfec1)



## Fixes

- align postcode field with city and state in Delivery Address cointainer (20c30ac)

- reset data on refresh and prevent persistence across sessions (b7e0377)

- resolve broken imports and clean up routes (ac25cf0)

- resolve updateField type mismatch in wizard component chain (b2ad1e9)

- resolve currency display bug and consolidate CSS architecture (eaf694e)

- resolve all compilation errors across wizard components (48b9524)

- replace any type with proper SaleTotals interface in WizardSteps (e7f3264)

- clip product card hover strip to border radius (733bea7)

- Fixed height layout with scrollable overflow for cart and products (5e3b34e)

- remove cart item quantity tooltips causing rendering artifacts (7ca4bcf)



## Layout

- improve layout of schedule delivery card (9a67cc8)

- Enhance layout of Delivery Details wizard step (b90e2f2)

- Improve layout of payment step in delivery task wizard. (f65af5d)



## Refactors

- move generic UI styles to shared and slim sale.css to page-specific rules (f864890)

- split sale.css into modular components (f693fa6)

- modularise app; centralise theme tokens; new router/providers (883dfd3)

- consolidate CSS modules and remove duplicates: (ef76e25)

- modularize large components and extract shared utilities (324ce00)

- simplify main and align routes with frontend (d3c7919)

- simplify cart price display with 3-row grid layout (983ffd1)

- migrate to feature-first layout (47d3470)

- reorganise feature modules; move product picker into sales and standardise structure (3fc8490)

- restructure CreateSaleWizard and related features (185cb34)

- restructure CreateSaleWizard and related features (16dbe8f)

- break down 755-line DeliveryStep into modular ScheduleDelivery components (92b0e8d)

- break down wizard steps into thin wrappers with modular components (170be1f)

- modularize 632-line wizard.css and relocate styles by component ownership (a74f4cd)

- optimize codebase - modularize CSS, relocate hooks, remove unused code (6e88d8a)

- consolidate shared styles and UI components architecture (f2332dc)

- extract animations from cart index.css to maintain barrel pattern (879bca7)

- introduce Card primitive and replace ad-hoc form-card wrappers (6c70b34)

- consolidate utilities and remove legacy tokens (2eb9b8a)

- eliminate utilities directory, move form responsive styles (f37453a)

- rename global.css to main.css for clarity (301ccbc)

- complete utils reorganization with component ownership (dc4e990)

- extract form business logic into custom hooks (51954f5)

- extract wizard business logic to feature-owned hooks (579117b)

- extract business logic from CreateSaleWizard components to hooks (7f3d4b0)

- modularize wizard-core.css into focused modules (09d1917)

- extract ProductPicker business logic and optimize imports (f5dcfb4)

- extract ProductSelection business logic and simplify structure (c40a26b)

- extract ScheduleDelivery business logic and optimize organization: (3ca4ab6)

- modularize ScheduleDelivery CSS into focused modules (4e27af5)

- extract business logic from Cart components to custom hooks (0758900)

- add CreateCustomer barrel exports and clean up imports (91ad067)

- eliminate shared/ui directory and fix component ownership (296149e)

- eliminate layout duplication with reusable layout components (caa31ac)

- fix deep import patterns and adopt 2024 TypeScript best practices (e85328f)

- optimize CreateSaleWizard architecture and remove unused styles (caad524)

- clean up OrderCheckout styles and remove unused selectors (81fe303)

- optimize ProductPicker architecture and fix broken imports (8fc7737)

- merge ProductSelection into ProductPicker for better cohesion (cdd11b3)

- optimize CSS architecture - reduce 37→16 files (57% reduction) (1477258)

- ultimate CSS optimization - 37→7 files + dead code elimination (d7ed71b)

- optimize CSS architecture - eliminate sale/styles redundancy and consolidate responsive styles (7a4dbd5)

- consolidate component and styles into self-contained directory (11f54ad)

- consolidate and optimize Forms component architecture (331bb4f)

- break up ui.css into component-owned styles (028cc66)

- standardize component architecture with consistent directory structure (8be1f64)

- comprehensive code quality improvements and feature standardization (203dc26)

- standardize React Router architecture with typed paths and entity-based pages (0328f6f)

- unify paths and router with consistent entity-based naming (492b059)

- deduplicate card container primitives across components (77d95ba)

- organize components and standardize theme tokens (a8a1de1)

- consolidate form theme variables and optimize light mode contrast (33e3ee6)

- consolidate and modernize configuration files (241db5c)

- centralize color tokens for ProductPicker, Cart, ScheduleDelivery, and OrderCheckout (99a14a0)

- enhance product cards and wizard step labels (38be121)

- remove redundant error lists from wizard forms (57316b5)

- modernize feature and component naming conventions (76daa15)

- organize codebase with domain-driven architecture (ce225f4)

- redesign cart item layout and improve visual hierarchy (e983e77)



## Restructure

- Move components to consolidate src repo in frontend (f7a5ab5)



## enhance

- improve visual hierarchy and interaction states (8f494c9)

- better date/time slot selection in schedule delivery (de7ed89)




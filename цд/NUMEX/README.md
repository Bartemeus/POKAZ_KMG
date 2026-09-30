# NUMEX interactive video reconstruction

Open `../NUMEX.html`. The application runs offline from files or a static web server, with no package installation or external requests. The existing presentation opens this same page for its technical/economic assessment screen.

The original NUMEX clip supplies the vector map and development-system view. The detailed recording supplied on 2026-09-27 supplies all nine project sections. The recording was decoded sequentially because it uses variable frame timing; seeking by time returned inconsistent frames.

The recording and native `project.json` / `project2.json` files supplied on 2026-09-28 add two complete recorded calculation results. The compact bundled data includes the parameters, planned well coordinates and result curves needed by the preview; it does not include the original model grids or private source paths.

## Included screens and controls

- Calculation: simulator settings, scaling flags, dynamic exports, contour/well options and the visible optimization settings.
- Reservoir description: geometry, rock properties and displayed fluid charts.
- Initialization: region controls, fluid properties, SWOF/SGOF curves and PVT tables.
- Development: the existing editable system tree, templates, contour details and map.
- Completion: well constraints, completion properties and map.
- Gathering network: visible network properties and the empty viewer shown in the recording.
- Economics: visible prices, costs and twelve reference charts.
- Serial calculations: parameter selection, editable variant rows, scenario JSON import/export, recorded summary values, metric selection and sorting.
- Results: selection between the two supplied variants, their actual production and economic curves, planned-well results, curve visibility controls and time units.

Forms retain values, expansion and scroll position when changing sections. Save / Ctrl+S exports all page values, scenarios, result selections and templates together, including the selected project and compact data from an imported project. Open restores them after validation. Older development-only JSON files remain supported. Saving downloads a preview-state file and does not overwrite either original native project file. Reset restores the recorded defaults and the first bundled project.

Use the project selector or the Results variant list to switch between the supplied runs. `project.json` contains six planned vertical wells; `project2.json` contains two planned horizontal wells, shown as brown trajectories. The selection updates the map, development/completion values and results together. File / Open also accepts the supplied native NUMEX JSON format and extracts its supported parameters and stored results after validation.

The map stays as vector geometry and retains its view across pages. Use the wheel to zoom, drag to pan, or choose the magnifier and draw a rectangle. Tiny clicks zoom around the pointer; Shift reverses zoom. Very narrow accidental rectangles are ignored. Back/Forward navigate view history; Home or double-click restores the overview. Grid, approximate distance measurement and SVG export remain available. Map updates are grouped once per animation frame and axis labels are reused.

## Files needed at runtime

Keep `../NUMEX.html`, `../NUMEX.css`, `../NUMEX.js`, plus these files in this folder:

- `workspace.js`, `workspace.css`
- `pages.js`, `pages.css`
- `charts.js`, `charts.css`
- `project-data.js`, `projects.js`
- `map.js`, `map.svg`, `font-license.txt`

`map.js` embeds SVG markup so local file opening works. `map.svg` also supports direct map opening. The map embeds a DejaVu Sans font subset, whose license is retained in `font-license.txt`.

`project-data.js` embeds the two compact recorded runs and validates native project imports. `projects.js` connects project selection, parameter values, map trajectories and stored calculation results. The original large JSON files are not required at runtime.

`map.png`, the videos, this README, and `tools/build_numex_map.py` are source/reference assets rather than runtime dependencies. The optional builder recreates the vector assets. Scratch frame extractions and browser checks stay in the ignored scratch folder and do not need publishing.

## Scope of the reconstruction

The source recordings show navigation, map rectangle zoom/history, row selection, scrolling and switching between calculated variants. The supplied native project files provide actual time series for variants 1 and 2. Their production plots use incremental production results, matching the recorded view; the pressure curve uses the field average. The initialization charts, economic input charts and additional scenario summaries remain references transcribed from the earlier recording.

The Calculation and Economics Calculation buttons display the selected project's stored results. They do not run the NUMEX simulation engine. Editing model parameters or proposed scenario inputs does not recompute production, well placement or economic forecasts. The result curves retain the supplied calculation values.

Unsupported external-file operations, optimization and 3D actions stay disabled without warning popups. Russian text is retained for the recorded interface; new filenames, implementation identifiers and comments use English. The existing presentation Escape/back integration is preserved.

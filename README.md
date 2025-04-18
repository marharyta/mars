# Mars Dashboard

## Live Demo

🚀 The project is live on [Mars Dashboard](https://mars-xi.vercel.app/) via Fly.io and Vercel.

## Features

- ✅ Built with **React, TypeScript, and Ant Design** for an interactive UI.
- ✅ Supports external libraries for performance and scalability.
- ✅ Follows best practices for maintainability.
- ✅ The UI should work on both normal-sized and small screens
- ✅ Includes a **report for _LARVIS_ improvements**
- ✅ Uses the `README.md` to describe the parts left out due to time and what to do next

## Front End setup approach

- Project setup includes Backend service, that runs locally via Docker.
- Using Vite to create bundle modules, ESM as first class citizen approch.
- No SSR, the dashboard does not requite to be indexed or pre-rendered.
- Enrich Styled with Tailwind setup.
- Jotai for atomic way to handle application global state (close to ClojureScript atom concept)
- Vitest for fast unit and e2e tests
- react-query for data fetching (simple and effective API, de facto industry standard)

## To run project locally

1. Start local server by going to `/server` folder and start Docker container.
2. Clone repository, run `npm install`, `npm run dev`

## Basic functionality

### Login

The service implements basic login functionality with id and password, provided in the default configuration. Login/logout functionality has been tested with e2e tests.

### Dashboard

Dashboard shows a histogram with Ore data, however it does not take into account enriched data.

## API Suggestions

The **Ore Detector** is an entry-level functional block in Space Engineers. When attached to a ship and supplied with power, it displays up to 5 ore locations as Signals on the player's HUD when they are within detection range. Ore Detectors display labeled signals to mark ores in range.

Additionally, the signal color indicates faction reputation relative to the onlooker:

- Green - antenna/beacon owned by you or your faction
- Blue - your own custom GPS markers
- White - antenna/beacon owned by neutral faction
- Red - antenna/beacon owned by hostile faction
- Yellow - ores in range of an Ore Detector

For the purpose of the API, we will assume all the data is of type ores in range of an Ore Detector.

Based on this information, the current API response does not provide full range of information.

```json
[
  {
    "timestamp": number,  // Acquisition Unix timestamp
    "sites":     number   // Number of detected ore sites
  }
]
```

I suggest we add the following structure as API response:

```json
[
  {
    "timestamp": number,     // Acquisition Unix timestamp
    "ore_sites":  number, // Number of detected ore sites
    "detectorRange": number; // Range of the ore detector
    "location": {            // field for the detector's position when the ores were detected
      "x": number,
      "y": number,
      "z": number
    };
    "detectedOres": {
      "type": "Magnesium" || "Aluminium" || "Titanium" || "Iron" || "Chromium"; // Types of ores based on the most likely resources found on mars
      "amount": number,        //  Represents the estimated quantity of ore detected
      "distance": number,       //  Represents the distance from the ore detector to the ore deposit, measured in meters
      "signalColor": "yellow"  // For the purpose of the API, we will assume all the data is of type ores
    }[];
  }
]
```

```typescript
export type OreType =
  | "Magnesium"
  | "Aluminium"
  | "Titanium"
  | "Iron"
  | "Chromium";

export interface OreExtended extends Ore {
  ore_sites: number;
  timestamp: number;
  detectorRange: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  detectedOres: {
    type: OreType;
    amount: number;
    distance: number;
    signalColor: "yellow";
  }[];
}
```

Example:

```json
{
  "type": "Iron",
  "amount": 1200.5,
  "distance": 75.0
}
```

Possibly, Include a UUID or hash ID for each ore site.

Currently, the amount of entries returned seems to always be 300, a potential improvement would be to wrap the list in react-virtualized or similar type of a list. To address that from the API standpoint, provide pagination for large data sets, include pagination parameters:

- limit (max results per page)
- offset or cursor (for navigation)

### Allow Filtering Parameters

Let users filter data by: `start_date` and `end_date` (date range)
Add support for query parameters:

- `?from=2025-03-30T00:00:00Z&to=2025-03-31T00:00:00Z`
- `?boundingBox=x1,y1,z1,x2,y2,z2`
- `?oreType=Iron`

### Query Parameters (Optional Enhancements):

| Parameter              | Type              | Description                                        |
| ---------------------- | ----------------- | -------------------------------------------------- |
| `start_date` or `from` | string (ISO 8601) | Start of date range (e.g., `2025-03-01T00:00:00Z`) |
| `end_date` or `to`     | string (ISO 8601) | End of date range (e.g., `2025-03-31T23:59:59Z`)   |
| `min_sites`            | number            | Filter results with at least this many ore sites   |
| `limit`                | number            | Max results per request (default: 50)              |
| `cursor` or `offset`   | string            | Cursor for pagination                              |
| `boundingBox`          | number            | Geospatial coordinates for ore position            |
| `oreType`              | OreType           | type of ore detected                               |

One possible idea would be to use Standardized Date Formats for timestamp would be more readable.

### TODO: Next steps

This code still requires quite a bit of work and improvements.
Some of them are denotes in comments in code.

1. Improve Login & Password Security:
   - Enforce strong passwords (min length, special characters).
   - Implement mandatory password reset on first login (he default password is weak).
   - Add Error Logging & Monitoring: Integrate Sentry or BugSnag for error tracking. Catch and map login error types to display better user logic.
   - More e2e and unit tests needed: test cookie expiration handling, test Jotai atoms, test login errors in e2e.
2. UI & Frontend Improvements:
   - Refactor CSS variables matched between Ant Design and Tailwind
   - Remove magic px values from code, make it all 8px base though (0.5rem for most browsers with base fontsize 16px)
   - Some UI react components are duplicated, we would need to refactor and not duplicate them.
3. Other:
   - functional style: use rambda and lodash to enhance code style, especially for data transformer styles
   - Improve visual of loader
   - Add virtualisation for the list: https://www.patterns.dev/vanilla/virtual-lists/
   - configure proper VITE to VERCEL env variable transfer
   - Add ore characteristics to tooltip on the histogram
4. Idea:
   - Using WebGL, create a small 3d Model of mars and create a mesh sith ore concentration within the past 24h for better data visualisation

Useful links:

- https://marsclock.com/
- https://github.com/dlaflotte/OreFinderPlus

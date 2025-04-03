# Dashboard for Mars

# Demo

The project has been deployed on fly.io and Vercel and you can find the live version here: https://mars-xi.vercel.app/

## Checklist

- [x] A frontend project using `React`, `TypeScript` and `AntDesign` presenting an UI for the above service
- [x] Using any supporting libraries of your choice
- [x] It should follow the best practices in general
- [x] Be creative and provide a useful UI
- [x] The UI should work on both normal-sized and small screens
- [x] Write a report for _LARVIS_ improvements
- [ ] use the `README.md` to clearly describe the parts you left out due to time but think should be there or you would do next

Project setup includes Backend service, that runs locally via Docker.

## Front End setup approach

- _A frontend project using React, TypeScript and AntDesign as required in the assignment_
- Using Vite to create bundle modules, ESM as first class citizen approch
- No SSR, as the dashboard does not requite to be indexed or pre-compiled.
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

### TODO:

- password reset logic: the default password is weak and we need to create a secure password, we would need to implement mandatory password reset after first login with strong password requirements
- More e2e and unit tests needed: to ensure the correct state management, test Jotai atoms. I would test cookie expiration, login errors, Jotai state resets
- type system improvements

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
    "ore_sites":     number, // Number of detected ore sites
    "detectorRange": number; // Range of the ore detector
    "location": {            // field for the detector's position when the ores were detected
      "x": number;
      "y": number;
      "z": number;
    };
    "detectedOres": {
      "type": "Magnesium" | "Aluminium" | "Titanium" | "Iron"| "Chromium"; // Types of ores based on the most likely resources found on mars
      "amount": number;         //  Represents the estimated quantity of ore detected
      "distance": number;       //  Represents the distance from the ore detector to the ore deposit, measured in meters
      "signalColor": "yellow";  // For the purpose of the API, we will assume all the data is of type ores
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

Useful links:

- https://marsclock.com/
- https://github.com/dlaflotte/OreFinderPlus

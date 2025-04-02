import { atomWithStorage } from "jotai/utils";

export const zone = atomWithStorage<string>(
  "zone",
  Intl.DateTimeFormat().resolvedOptions().timeZone
);

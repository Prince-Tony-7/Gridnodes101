import { demosData } from "@/data/demosData";
import type { DemoVideo } from "@/lib/types";

/** Repository layer for demo videos, mirroring `workflows.ts`, so the source can later move to a CMS. */
export async function getAllDemos(): Promise<DemoVideo[]> {
  return demosData;
}

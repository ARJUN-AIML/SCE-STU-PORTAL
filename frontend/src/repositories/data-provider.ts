import { demoData } from "./demo-data"

export type ScenarioType = "default" | "freshers" | "placements" | "events" | "faculty" | "admin"

class DataProvider {
  private isDevFallbackEnabled = false;
  private currentScenario: ScenarioType = "default";

  constructor() {
    const savedScenario = localStorage.getItem("sih_scenario")
    if (savedScenario) {
      this.currentScenario = savedScenario as ScenarioType;
    }
  }

  setScenario(scenario: ScenarioType) {
    this.currentScenario = scenario;
    localStorage.setItem("sih_scenario", scenario)
  }

  getScenario() { return this.currentScenario }

  // Backend data is always preferred. Fallback is available only for local development.
  async fetch<T>(resourceName: string, liveCall: () => Promise<unknown>, normalizer?: (data: unknown) => T): Promise<T[]> {
    let rawData: any = null;

    try {
      rawData = await liveCall()
    } catch (error) {
      if (this.isDevFallbackEnabled) {
        console.info(`[Data Provider] Using development fallback for ${resourceName}.`)
        const scenarioData = demoData[this.currentScenario] || demoData["default"]
        rawData = scenarioData[resourceName] || demoData["default"][resourceName] || []
      } else {
        void error
        throw error
      }
    }

    // Ensure rawData is an array
    if (!Array.isArray(rawData)) {
       rawData = rawData ? [rawData] : []
    }

    // Apply strict normalization if a normalizer is provided
    if (normalizer) {
       return rawData.map((item: any) => normalizer(item))
    }

    return rawData as T[]
  }
}

export const dataProvider = new DataProvider()

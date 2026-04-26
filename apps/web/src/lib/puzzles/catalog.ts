import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { type PuzzleState } from "@/lib/puzzle/state"

export type PuzzleDefinition = {
  id: string
  titleKey: string
  createInitialState: () => PuzzleState
}

export const puzzles: readonly PuzzleDefinition[] = [
  {
    id: "demo-1",
    titleKey: "demo1.title",
    createInitialState: createDemoPuzzleState
  }
]

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return puzzles.find((p) => p.id === id)
}

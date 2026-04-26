import { createDemoPuzzleState } from "@/lib/puzzle/demo"
import { type PuzzleState } from "@/lib/puzzle/state"
import {
  createDemo10PuzzleState,
  createDemo11PuzzleState,
  createDemo2PuzzleState,
  createDemo3PuzzleState,
  createDemo4PuzzleState,
  createDemo5PuzzleState,
  createDemo6PuzzleState,
  createDemo7PuzzleState,
  createDemo8PuzzleState,
  createDemo9PuzzleState
} from "@/lib/puzzles/pack-1"

export type PuzzleDefinition = {
  id: string
  titleKey: string
  createInitialState: () => PuzzleState
}

export const puzzles: readonly PuzzleDefinition[] = [
  {
    id: "starter-six",
    titleKey: "starter-six.title",
    createInitialState: createDemoPuzzleState
  },
  {
    id: "diagonal-six",
    titleKey: "diagonal-six.title",
    createInitialState: createDemo2PuzzleState
  },
  {
    id: "cascade-six",
    titleKey: "cascade-six.title",
    createInitialState: createDemo3PuzzleState
  },
  {
    id: "cross-six",
    titleKey: "cross-six.title",
    createInitialState: createDemo4PuzzleState
  },
  {
    id: "stack-eight",
    titleKey: "stack-eight.title",
    createInitialState: createDemo5PuzzleState
  },
  {
    id: "stagger-eight",
    titleKey: "stagger-eight.title",
    createInitialState: createDemo6PuzzleState
  },
  {
    id: "split-eight",
    titleKey: "split-eight.title",
    createInitialState: createDemo7PuzzleState
  },
  {
    id: "drift-ten",
    titleKey: "drift-ten.title",
    createInitialState: createDemo8PuzzleState
  },
  {
    id: "orbit-ten",
    titleKey: "orbit-ten.title",
    createInitialState: createDemo9PuzzleState
  },
  {
    id: "dense-twelve-a",
    titleKey: "dense-twelve-a.title",
    createInitialState: createDemo10PuzzleState
  },
  {
    id: "dense-twelve-b",
    titleKey: "dense-twelve-b.title",
    createInitialState: createDemo11PuzzleState
  }
]

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return puzzles.find((p) => p.id === id)
}

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
    id: "demo-1",
    titleKey: "demo1.title",
    createInitialState: createDemoPuzzleState
  },
  {
    id: "demo-2",
    titleKey: "demo2.title",
    createInitialState: createDemo2PuzzleState
  },
  {
    id: "demo-3",
    titleKey: "demo3.title",
    createInitialState: createDemo3PuzzleState
  },
  {
    id: "demo-4",
    titleKey: "demo4.title",
    createInitialState: createDemo4PuzzleState
  },
  {
    id: "demo-5",
    titleKey: "demo5.title",
    createInitialState: createDemo5PuzzleState
  },
  {
    id: "demo-6",
    titleKey: "demo6.title",
    createInitialState: createDemo6PuzzleState
  },
  {
    id: "demo-7",
    titleKey: "demo7.title",
    createInitialState: createDemo7PuzzleState
  },
  {
    id: "demo-8",
    titleKey: "demo8.title",
    createInitialState: createDemo8PuzzleState
  },
  {
    id: "demo-9",
    titleKey: "demo9.title",
    createInitialState: createDemo9PuzzleState
  },
  {
    id: "demo-10",
    titleKey: "demo10.title",
    createInitialState: createDemo10PuzzleState
  },
  {
    id: "demo-11",
    titleKey: "demo11.title",
    createInitialState: createDemo11PuzzleState
  }
]

export function getPuzzleById(id: string): PuzzleDefinition | undefined {
  return puzzles.find((p) => p.id === id)
}

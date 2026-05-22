import { test, expect, Page } from '@playwright/test'

import { pause } from "./utils/pause"
import { clickButtonByText, getPuzzleItems, dragItemToIndex, isPuzzleSolved } from "./utils/interactions"

test('homepage has title', async ({ page }) => {
  test.setTimeout(300_000) // this sets the timeout to 300 seconds (5 minutes)

  // This sets the size of the window
  await page.setViewportSize({ width: 1400, height: 1000 })

  // Go to the site
  await page.goto('http://localhost:3000/puzzle/planets')

  // Clicking this button checks the order.
  await clickButtonByText(page, "Check Order")

  await puzzleSolver(page)

  // Does the page display the solved text?
  // If your solver works, this test should pass!
  const solved = await isPuzzleSolved(page)
  expect(solved).toBe(true)

  await pause(2000)
})

async function puzzleSolver(page: Page) {
  const correctOrder = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ]

  const currentOrder = (await getPuzzleItems(page)).map(item => item.label)

  for (let targetIndex = 0; targetIndex < correctOrder.length; targetIndex++) {
    const currentIndex = currentOrder.indexOf(correctOrder[targetIndex])

    if (currentIndex === -1) {
      throw new Error(`Could not find ${correctOrder[targetIndex]} in the puzzle`)
    }

    if (currentIndex === targetIndex) continue

    await dragItemToIndex(page, currentIndex, targetIndex)

    const [item] = currentOrder.splice(currentIndex, 1)
    currentOrder.splice(targetIndex, 0, item)
  }

  await clickButtonByText(page, "Check Order")
}

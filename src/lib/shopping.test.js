import { describe, expect, it } from 'vitest'
import { buildShoppingList } from './shopping.js'

const quiche = { id: 1, title: 'Quiche lorraine', ingredients: ['3 œufs', '200 g de lardons', 'Sel, poivre'] }
const gratin = { id: 2, title: 'Gratin dauphinois', ingredients: ['1 kg de pommes de terre', 'sel, Poivre ', '3 oeufs'] }

describe('buildShoppingList', () => {
  it('lists each ingredient once, with the recipes it is for', () => {
    const list = buildShoppingList([{ recipe: quiche }, { recipe: gratin }])

    expect(list.map((item) => item.text)).toEqual(['3 œufs', '200 g de lardons', 'Sel, poivre', '1 kg de pommes de terre', '3 oeufs'])
    expect(list.find((item) => item.text === 'Sel, poivre').recipes).toEqual(['Quiche lorraine', 'Gratin dauphinois'])
  })

  it('counts a recipe planned twice only once', () => {
    const list = buildShoppingList([{ recipe: quiche }, { recipe: quiche }])

    expect(list).toHaveLength(3)
    expect(list[0].recipes).toEqual(['Quiche lorraine'])
  })

  it('is empty when nothing is planned', () => {
    expect(buildShoppingList([])).toEqual([])
  })
})

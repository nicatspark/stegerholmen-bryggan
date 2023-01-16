import type { GoogleSheet } from '../../helpers/normalizeData'

// https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/edit?usp=sharing
const fetchSheetUrl =
  'https://docs.google.com/spreadsheets/d/16yvhnB75FaIQeGL6Su2317ub2EbF-XondlGCzqTg06I/gviz/tq?'

const regex = /[^\{]+(.+)[^\{]+/

export const getUsers = (
  query: string,
  sheet: string
): Promise<void | GoogleSheet> =>
  fetch(`${fetchSheetUrl}&tq=${query}&sheet=${sheet}`)
    .then((res) => res.text())
    .then((res) => {
      const stripGarbage = res.match(regex)
      if (!stripGarbage)
        throw new Error('Could not convert spreadsheet to JSON')
      return JSON.parse(stripGarbage[1].slice(0, -1))
    })

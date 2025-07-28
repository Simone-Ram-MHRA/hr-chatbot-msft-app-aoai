import { cloneDeep } from 'lodash'

import { AskResponse, Citation } from '../../api'

export type ParsedAnswer = {
  citations: Citation[]
  markdownFormatText: string
  generated_chart: string | null
} | null

export const enumerateCitations = (citations: Citation[]) => {
  const filepathMap = new Map()
  for (const citation of citations) {
    const { filepath } = citation
    if (!filepathMap.has(filepath)) {
      filepathMap.set(filepath, 1)
    }
    citation.part_index = filepathMap.get(filepath)
  }
  citations.filter((value, index, self) => {
    return self.findIndex(t => t.filepath === value.filepath && t.part_index === value.part_index) === index
  })
  return citations
}

export function parseAnswer(answer: AskResponse): ParsedAnswer {
  if (typeof answer.answer !== 'string') return null
  let answerText = answer.answer
  let docReference = ''
  const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g)
  const lengthDocN = '[doc'.length

  let filteredCitations = [] as Citation[]
  let citationReindex = 0
  const citationMap: { [key: string]: number } = {}

  citationLinks?.forEach(link => {
    // Replacing the links/citations with number
    const citationIndex = link.slice(lengthDocN, link.length - 1)
    const citation = cloneDeep(answer.citations[Number(citationIndex) - 1]) as Citation
    if (citation && citation.filepath && !citationMap[citation.filepath]) {
      docReference += `[doc${citationIndex}] `
      citationMap[citation.filepath] = ++citationReindex
      citation.id = citationIndex // original doc index to de-dupe
      citation.reindex_id = citationReindex.toString() // reindex from 1 for display
      filteredCitations.push(citation)
    }
    if (citation.filepath) {
      const regex = new RegExp(`\\[${link.slice(1, -1)}\\]`, 'g')
      answerText = answerText.replace(regex, ` ^${citationMap[citation.filepath]}^ `)
    }
  })

  // Remove duplicate citation numbers in the same sentence/line
  answerText = answerText.replace(/(\^\d+\^)(\s+\1)+/g, '$1')

  // Ensure citations in the text are in numerical order and remove duplicates
  answerText = answerText
    .split('\n')
    .map(line => {
      return line.replace(/(\^\d+\^\s*)+/g, match => {
        const uniqueCitations = [...new Set(match.trim().split(/\s+/))]
        return uniqueCitations.join(' ') + ' '
      })
    })
    .join('\n')
  // Sort citations by reindex_id to ensure numerical order
  filteredCitations.sort((a, b) => parseInt(a.reindex_id || '0') - parseInt(b.reindex_id || '0'))
  filteredCitations = enumerateCitations(filteredCitations)

  answerText += `\n display-none_${docReference}_display-none`
  return {
    citations: filteredCitations,
    markdownFormatText: answerText,
    generated_chart: answer.generated_chart
  }
}

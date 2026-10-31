// One entry per "#" heading in the requirements file.
export const SECTIONS = [
  {
    id: 'network',
    number: '01',
    tab: 'Network',
    title: 'Rating-defined network',
    summary: 'Every rating is a signed edge, so the ratings themselves draw the social graph.',
  },
  {
    id: 'random-votes',
    number: '02',
    tab: 'Random votes',
    title: 'Mandatory random votes',
    summary: 'Votes the system assigns fill the thinnest data first, and serve as ground truth.',
  },
  {
    id: 'negative-flag',
    number: '03',
    tab: 'Always negative',
    title: '“Always negative” flag',
    summary: 'A residual-based z-score separates consistently harsh raters from unlucky ones.',
  },
  {
    id: 'vote-cap',
    number: '04',
    tab: 'Vote cap',
    title: 'Vote cap',
    summary: 'A cap that scales with cohort size and window length, without re-tuning.',
  },
  {
    id: 'score',
    number: '05',
    tab: 'Score',
    title: 'Score out of 3, averaged across criteria',
    summary: 'Three criteria, one average, and nothing displayed until the score means something.',
  },
]

export const sectionById = (id) => SECTIONS.find((section) => section.id === id)

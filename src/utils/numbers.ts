export const numberWithCommas = (n: number): string => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getStringPercentage = (n: number): string => {
  return `(${n.toFixed(2)}%)`
}
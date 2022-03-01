
function getConcentration(value: number): string {
  if (value > 12.4) return 'high';
  if (value > 5.45) return 'normal';
  return 'low';
}

export default getConcentration;
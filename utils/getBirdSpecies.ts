import classLabels from "../assets/bird-classes";

export default function getBirdSpecies(predictionFloat32: Float32Array): any {
  const maxValue = Math.max(...predictionFloat32);

  const maxIndex = Array.from(predictionFloat32).indexOf(maxValue);

  return {
    species: classLabels[maxIndex],
    confidence: maxValue,
    predictionArrayIndex: maxIndex,
  };
}

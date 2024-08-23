import getBirdSpecies from "./getBirdSpecies";
import classLabels from "../assets/bird-classes";

jest.mock("../assets/bird-classes");

describe("getBirdSpecies", () => {
  test("return bird class based on highest index from prediction array", () => {
    const mockPrediction = new Float32Array([0.04, 0.0005, 0.9045, 0.01]);

    const actual = getBirdSpecies(mockPrediction);
    const mockClass = jest.mocked(actual);
    expect(actual).toBe("ANDEAN GOOSE");
  });
});

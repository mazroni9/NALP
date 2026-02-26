// Simple geometry utilities used in Studio - unit tests

function polygonArea(points: [number, number][]): number {
  if (!points || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    sum += points[i][0] * points[j][1] - points[j][0] * points[i][1];
  }
  return Math.abs(sum) / 2;
}

function polygonPerimeter(points: [number, number][]): number {
  if (!points || points.length < 2) return 0;
  let p = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    p += Math.hypot(points[j][0] - points[i][0], points[j][1] - points[i][1]);
  }
  return p;
}

describe("polygonArea", () => {
  it("returns 0 for less than 3 points", () => {
    expect(polygonArea([])).toBe(0);
    expect(polygonArea([[0, 0]])).toBe(0);
    expect(polygonArea([[0, 0], [1, 0]])).toBe(0);
  });

  it("calculates rectangle area correctly", () => {
    const rect = [[0, 0], [200, 0], [200, 165], [0, 165]] as [number, number][];
    expect(polygonArea(rect)).toBe(33000);
  });
});

describe("polygonPerimeter", () => {
  it("returns 0 for less than 2 points", () => {
    expect(polygonPerimeter([])).toBe(0);
    expect(polygonPerimeter([[0, 0]])).toBe(0);
  });

  it("calculates rectangle perimeter correctly", () => {
    const rect = [[0, 0], [200, 0], [200, 165], [0, 165]] as [number, number][];
    expect(polygonPerimeter(rect)).toBe(730);
  });
});

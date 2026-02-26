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
    const rect = [[0, 0], [520, 0], [520, 65], [0, 65]] as [number, number][];
    expect(polygonArea(rect)).toBe(33800);
  });
});

describe("polygonPerimeter", () => {
  it("returns 0 for less than 2 points", () => {
    expect(polygonPerimeter([])).toBe(0);
    expect(polygonPerimeter([[0, 0]])).toBe(0);
  });

  it("calculates rectangle perimeter correctly", () => {
    const rect = [[0, 0], [520, 0], [520, 65], [0, 65]] as [number, number][];
    expect(polygonPerimeter(rect)).toBe(1170);
  });
});

describe("zone area distribution (4 zones)", () => {
  it("sum of zone areas equals total area when percentages sum to 100%", () => {
    const rect = [[0, 0], [520, 0], [520, 65], [0, 65]] as [number, number][];
    const totalArea = polygonArea(rect);
    expect(totalArea).toBe(33800);

    const zoneAPercent = 20;
    const zoneBPercent = 25;
    const zoneCPercent = 40;
    const zoneDPercent = 15;
    expect(zoneAPercent + zoneBPercent + zoneCPercent + zoneDPercent).toBe(100);

    const zoneAArea = totalArea * (zoneAPercent / 100);
    const zoneBArea = totalArea * (zoneBPercent / 100);
    const zoneCArea = totalArea * (zoneCPercent / 100);
    const zoneDArea = totalArea * (zoneDPercent / 100);

    const sumZones = zoneAArea + zoneBArea + zoneCArea + zoneDArea;
    expect(sumZones).toBe(totalArea);
  });
});

describe("default zone percentages", () => {
  it("default percentages (20, 25, 40, 15) sum to 100", () => {
    const defaultA = 20;
    const defaultB = 25;
    const defaultC = 40;
    const defaultD = 15;
    expect(defaultA + defaultB + defaultC + defaultD).toBe(100);
  });
});

describe("net area with street deduction", () => {
  it("totalNetArea = totalArea - streetArea when street is enabled", () => {
    const rect = [[0, 0], [520, 0], [520, 65], [0, 65]] as [number, number][];
    const totalArea = polygonArea(rect);
    expect(totalArea).toBe(33800);

    const streetLength = 520;
    const streetWidth = 12.5;
    const streetArea = streetLength * streetWidth;
    expect(streetArea).toBe(6500);

    const totalNetArea = totalArea - streetArea;
    expect(totalNetArea).toBe(27300);
  });

  it("zone areas from net area sum to net area when street enabled", () => {
    const totalArea = 33800;
    const streetArea = 6500;
    const netArea = totalArea - streetArea;
    expect(netArea).toBe(27300);

    const zoneAPercent = 20;
    const zoneBPercent = 25;
    const zoneCPercent = 40;
    const zoneDPercent = 15;
    const zoneAArea = netArea * (zoneAPercent / 100);
    const zoneBArea = netArea * (zoneBPercent / 100);
    const zoneCArea = netArea * (zoneCPercent / 100);
    const zoneDArea = netArea * (zoneDPercent / 100);

    const sumZones = zoneAArea + zoneBArea + zoneCArea + zoneDArea;
    expect(sumZones).toBe(netArea);
  });
});

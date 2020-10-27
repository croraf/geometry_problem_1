import { Point, Side, Vector } from "./types";

const calculateDistance = (point1: Point, point2: Point): number => {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
};

const calculateVectorLength = (vector: Vector): number => {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
};

const calculateScalarProduct = (vector1: Vector, vector2: Vector): number => {
  return (vector1.x * vector2.x + vector1.y * vector2.y) / (calculateVectorLength(vector1) * calculateVectorLength(vector2))
};

const checkIfThePointIsToTheLeftOfTheSide = (targetPoint: Point, side: Side): boolean => {
  console.log('-Checking if the point is to the left of the side-');
  // y = kx + b
  const k = (side[1].y - side[0].y) / (side[1].x - side[0].x);
  const b = side[0].y - side[0].x * k;
  console.log('equation coefficients:', k, b);

  if (side[1].x < side[0].x
    && targetPoint.y <= k * targetPoint.x + b) {
    // If the closest side is heading left and the point is below the line it is inside
    console.log('special case 1');
    return true;
  } else if (side[1].x > side[0].x
    && targetPoint.y >= k * targetPoint.x + b) {
    // If the closest side is heading right and the point is above the line it is inside
    console.log('special case 2');
    return true;
  } else if (side[1].x === side[0].x) {
    // If the closest side is vertical
    if (side[1].y < side[0].y && targetPoint.x > side[0].x) {
      // If the closest side is heading directly bottom and the point is right of the line it is inside
      console.log('special case 3');
      return true;
    }
    if (side[1].y > side[0].y && targetPoint.x < side[0].x) {
      // If the closest side is heading directly top and the point is left of the line it is inside
      console.log('special case 4');
      return true;
    }
  }

  return false;
};


/**
 * Assumptions:
 * Polygon is convex.
 * Polygon is oriented positively. That means when traveling on it, its interior is always to the left.
 * Polygon has no duplicate vertices.
 * 
 * @param {*} polygon 
 * @param {*} targetPoint 
 */
const getClosestPointInsidePolygon = (polygon: Point[], targetPoint: Point): Point => {

  let minDistance: number|undefined;
  let finalClosestPoint: Point|undefined;
  let closestSide: Side|undefined;

  for (let i = 0; i < polygon.length; i++) {
    const side: Side = [
      polygon[i],
      polygon[(i + 1) % polygon.length],
    ];

    const sideAsVector = {
      base: polygon[i],
      vector: { x: side[1].x - side[0].x, y: side[1].y - side[0].y }
    };
    const sideLenght = calculateDistance(side[0], side[1]);

    const targetPointAsVectorFromSideBase = {
      base: polygon[i],
      vector: { x: targetPoint.x - side[0].x, y: targetPoint.y - side[0].y }
    };

    const scalarProjection =
      calculateVectorLength(targetPointAsVectorFromSideBase.vector)
      * calculateScalarProduct(sideAsVector.vector, targetPointAsVectorFromSideBase.vector);

    console.log('sideAsVector:', sideAsVector);
    console.log('sideLenght:', sideLenght);
    console.log('targetPointAsVectorFromSideBase:', targetPointAsVectorFromSideBase);
    console.log('scalarProjection:', scalarProjection);


    let closestPoint;
    let distance;

    if (scalarProjection > sideLenght) {
      // orthogonal projection is not within the side
      // closest point is the second side's point
      closestPoint = side[1];
      distance = calculateDistance(side[1], targetPoint);
      console.log('closest point: second point');
    } else if (scalarProjection < 0) {
      // orthogonal projection is not within the side
      // closest point is the first side's point
      closestPoint = side[0];
      distance = calculateDistance(side[0], targetPoint);
      console.log('closest point: first point');
    } else {
      //orthogonal projection is within the side,
      // it is the closest point
      const orthogonalProjectionPoint = {
        x: sideAsVector.base.x + sideAsVector.vector.x * scalarProjection / sideLenght,
        y: sideAsVector.base.y + sideAsVector.vector.y * scalarProjection / sideLenght,
      };
      closestPoint = orthogonalProjectionPoint;
      distance = calculateDistance(orthogonalProjectionPoint, targetPoint);
      console.log('closest point: orthogonal projection point');
    }

    console.log('distance:', distance);
    console.log('closestPoint:', closestPoint);
    console.log('--------------------',);

    if (minDistance === undefined || distance < minDistance) {
      // take the minimal of the figures for all sides
      minDistance = distance;
      finalClosestPoint = closestPoint;
      closestSide = side;
    }
  }

  console.log();
  console.log('minDistance:', minDistance);
  console.log('finalClosestPoint:', finalClosestPoint);
  console.log('closestSide:', closestSide);
  console.log();

  if (closestSide === undefined || finalClosestPoint === undefined) {
    throw new Error('Calculation of closest side and/or closest point on the polygon produced an error.');
  }

  // Check if point is inside or outside of the polygon.
  if (checkIfThePointIsToTheLeftOfTheSide(targetPoint, closestSide)) {
    return targetPoint;
  } else {
    return finalClosestPoint;
  }
}

const polygon: Point[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }];
const targetPoint: Point = { x: 150, y: 20 };
const result = getClosestPointInsidePolygon(polygon, targetPoint);

console.log('\n\nRESULT:', result);
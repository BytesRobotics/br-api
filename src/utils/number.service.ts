export default class NumberService {
  static getSequentialRange(from: any, count: number): Array<number> {
    return Array.from(Array(count), (x, i) => i + from);
  }

  static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static randomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}


// module.exports = {
//   getSequentialRange,
//   random,
//   randomInt,
// };

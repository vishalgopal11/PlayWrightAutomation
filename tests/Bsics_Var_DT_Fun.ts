// TypeScript basics demo

// --- Variables with types ---
let message: string | number = 'Hello';
message = 2;
console.log(message);

let message1: string = 'Hello';
message1 = 'bye';
console.log(message1);

let age: number = 20;
console.log(age);

let isActive: boolean = false;

// --- Arrays ---
let numbers: number[] = [1, 2, 3];
let numberArry: number[] = [1, 2, 3];

// --- Any type ---
let data: any = 'this could be anything';
data = 42;

// --- Functions ---
function add(a: number, b: number): number {
  return a + b;
}
add(3, 4);

// --- Objects ---
const person: { name: string; age: number; favoriteColor?: string } = { name: 'Alice', age: 25 };
person.favoriteColor = 'blue';

let user: { name: string; age: number; location?: string } = { name: 'Bob', age: 34 };
user.location = 'hyderabad';

// --- Classes ---
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

"use strict";
const nav = document.querySelector(".nav");

const section1 = document.querySelector("#section-1");
const header = document.querySelector(".header");
const handleHover = function (e) {
  if (e.target.classList.contains("nav_link")) {
    const link = e.target;
    const siblings = link.closest("nav").querySelectorAll(".nav_link");
    const logo = link.closest("nav").querySelector("img");
    siblings.forEach((element) => {
      if (element !== link) element.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
nav.addEventListener("click", function (e) {
  if (e.target.classList.contains("nav_link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    const coords = document.querySelector(id);
    // window.scrollTo({
    //   left: coords.left + window.pageXOffset,
    //   top: coords.top + window.pageYOffset,
    //   behavior: "smooth",
    // });
    coords.scrollIntoView({ behavior: "smooth" });
  }
});

document.querySelectorAll(".articles").forEach((a) =>
  a.addEventListener("mousedown", (e) => {
    e.preventDefault();
    return false;
  })
);

const navShow = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const navObserve = new IntersectionObserver(navShow, {
  root: null,
  treshold: 0,
});
navObserve.observe(header);

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (this.scrollY >= initialCoords.top) {
//     nav.classList.add("sticky");
//   } else nav.classList.remove("sticky");
// });

const secShow = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  // observer.unobserve(entry);
};

const secObserver = new IntersectionObserver(secShow, {
  root: null,
  threshold: 0,
  rootMargin: "-90px",
});

const sections = document.querySelectorAll(".section");
sections.forEach((sec) => secObserver.observe(sec));

/*
 * Complete the 'miniMaxSum' function below.
 *
 * The function accepts INTEGER_ARRAY arr as parameter.
 */

function miniMaxSum(arr) {
  // Write your code here
  let min = Math.min(...arr);
  let max = Math.max(...arr);
  let minSum = arr.reduce((acc, mov) => acc + mov, 0) - max;
  let maxSum = arr.reduce((acc, mov) => acc + mov, 0) - min;
  console.log(`${minSum}  ${maxSum}`);
}

// const arr = [1, 2, 3, 4, 5];

// miniMaxSum(arr);
// const s = "12:40:22AM";
// const timeStat = s.slice(-2);
// let time = s.slice(0, 8);
// let hour = s.slice(0, 2);
// if (timeStat === "PM") {
//   if (hour !== "12") hour = Number(hour) + 12;
//   else hour = "00";
// }
// time = hour + time.slice(2);
// console.log(time);

// const strings = ["ab", "ab", "abc"];
// const queries = ["ab", "abc", "bc"];
// let sums = [];
// queries.forEach((val, ind) => {
//   sums[ind] = 0;
//   for (let i = 0; i < strings.length; i++) {
//     if (queries[ind] === strings[i]) sums[ind]++;
//   }
// });
// console.log(sums);

// const a = [1];

// a.forEach((val) => {
//   let counter = 0;
//   for (let i = 0; i < a.length; i++) {
//     if (val === a[i]) counter++;
//   }
//   if (counter === 1) console.log(val);
// });
const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [9, 8, 9],
];
let sum1 = [],
  sum2 = [],
  l = arr.length;
for (let i = 0; i < l; i++) {
  sum1.push(arr[i][i]);
  sum2.push(arr[i][l - 1 - i]);
}
console.log(sum1, " ", sum2);

const values =
  "63 25 73 1 98 73 56 84 86 57 16 83 8 25 81 56 9 53 98 67 99 12 83 89 80 91 39 86 76 85 74 39 25 90 59 10 94 32 44 3 89 30 27 79 46 96 27 32 18 21 92 69 81 40 40 34 68 78 24 87 42 69 23 41 78 22 6 90 99 89 50 30 20 1 43 3 70 95 33 46 44 9 69 48 33 60 65 16 82 67 61 32 21 79 75 75 13 87 70 33";
const arrr = [
  ...values
    .split(" ")
    .map((el) => Number(el))
    .sort((a, b) => a - b),
];
console.log(arrr);
let countArr = new Array(101).join("0").split("").map(parseFloat),
  prev;
for (let i = 0; i < arrr.length; i++) ++countArr[arrr[i]];

console.log(countArr);

const str1 = "We promptly judged antique ivory buckles for the next prize";
const strM = new Set(str1.replace(/ /g, "").toLowerCase());
console.log(strM);
if (strM.size === 26) console.log("pangram");
else console.log("not pangram");

const A = [2, 1, 3];
const B = [7, 8, 9];
const k = 10;
let condition;
for (let i = 0; i < A.length; i++) {
  if (A[i] + B[i] >= k)
    if (i < 3 && A[i] > 0) condition = "YES";
    else if (i < 3 && A[i] < 1) {
      condition = "NO";
      break;
    } else condition = "YES";
  else {
    condition = "NO";
    break;
  }
}
console.log(condition);

const s = "10101";
const t = "00101";

// [...s].forEach((val, ind) =>
//   Number(val) && Number(t[ind]) ? console.log(0) : console.log(1)
// );

console.log((s ^ t).toString());

const arrt = [0, 1, 2, 4, 6, 5, 3];
const middle = Math.floor(arrt.length / 2);
arrt.sort((a, b) => a - b);
console.log(arrt);
arrt.length % 2 !== 0 ? arrt[middle] : (arrt[middle - 1] + arrt[middle]) / 2;

const matrix = [
  [112, 42, 83, 119],
  [56, 125, 56, 49],
  [15, 78, 101, 43],
  [62, 98, 114, 108],
];
let tot = 0,
  n = matrix.length / 2;
for (let x = 0; x < n; x++)
  for (let y = 0; y < n; y++) {
    tot += Math.max(
      matrix[x][y],
      matrix[x][2 * n - y - 1],
      matrix[2 * n - x - 1][y],
      matrix[2 * n - x - 1][2 * n - y - 1]
    );
  }
console.log(`Total is ${tot}`);

let chunk = [];
for (let i = 0; i < matrix.length; i++) {
  chunk.push(matrix[i][2]);
}
console.log(chunk.sort((a, b) => (a > b ? -1 : 1)));
for (let i = 0; i < matrix.length; i++) {
  matrix[i][2] = chunk[i];
}
//for (let i = 0; i < chunk.length; i++) tot += chunk[0][i];
matrix[0].sort((a, b) => (a > b ? -1 : 1));
for (let i = 0; i < 2; i++) {
  tot += matrix[i][0] + matrix[i][1];
}

console.log(matrix);
console.log(tot);
console.log(Math.trunc(6 / 2));

const sockCol = "6 5 2 3 5 2 2 1 1 5 1 3 3 3 5";
let pairsArr = [];
pairsArr = sockCol.split(" ").sort((a, b) => (a > b ? 1 : -1));
const elementCount = {};
for (var element of pairsArr) {
  if (elementCount[element]) {
    elementCount[element] += 1;
  } else {
    elementCount[element] = 1;
  }
}
let tt = 0;
console.log(elementCount);
Object.values(elementCount)
  .filter((val) => val > 1)
  .forEach((val) => {
    tt += Math.trunc(val / 2);
  });
console.log(tt);

console.log(1 % 2);

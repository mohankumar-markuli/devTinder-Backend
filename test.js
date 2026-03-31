function countNegatives(arr) {
  // implement your solution here
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) count++;
  }
  return count;
}

console.log(countNegatives([-1,0,2,-4]));
var promise1 = new Promise(function(resolve, reject) {
	let a, b, c;
	
	a = 11;
	b = 3 * a;
	c = b + 9;
  //return ("yolo");
  resolve(c); // en gros le return
});

promise1.then( (v1) => {
  console.log("v1:", v1);
  // expected output: "Success!"
});


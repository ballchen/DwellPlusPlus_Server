function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

let a = Shuffle([200, 150, 130, 110, 90])
console.log(a)


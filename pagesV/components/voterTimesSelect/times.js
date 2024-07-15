export const typeData = [{
	"ProID": 1,
	"name": "每天",
	"ProSort": 1
}, {
	"ProID": 2,
	"name": "总共",
	"ProSort": 2
}];

export const timesData = [];

for (let i = 1; i <= 50; i++) {
  timesData.push({
    "name": i.toString() + '次',
    "ProID": 1
  });
}

for (let i = 1; i <= 50; i++) {
  timesData.push({
    "name": i.toString() + '次',
    "ProID": 2
  });
}
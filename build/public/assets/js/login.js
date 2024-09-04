const d = new Date();
d.setTime(d.getTime() - (5*24*60*60*1000));

const cookies = document.cookie;

console.log(cookies);
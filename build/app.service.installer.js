var Service = require('node-windows').Service;

// Create service for lucendi
const lucendi = new Service({
  name:'Lucendi',
  description: 'Lucendi systems web server.',
  script: 'C:\\Users\\chara\\Documents\\lucendi\\app.js'
});

// Create service for updater
const update = new Service({
  name:'Lucendi_update',
  description: 'Lucendi systems automated updation.',
  script: 'C:\\Users\\chara\\Documents\\lucendi\\auto_update.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
lucendi.on('install',function(){
  lucendi.start();
});

lucendi.install();

update.on('install',function(){
  update.start();
});

update.install();
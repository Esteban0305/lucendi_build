const {exec} = require('child_process');

function restartService() {
  console.log('Restarting service');
  exec("net stop lucendi_update.exe && net start lucendi_update.exe", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(stdout);
  });
}

exec("git pull", (error, stdout, stderr) => {
  if (error) {
      console.log(`error: ${error.message}`);
      return;
  }
  if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
  }
  if (stdout == 'Already up to date.\n') {
    console.log('Nothing to update');
  } else {
    restartService();
  }
});
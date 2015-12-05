

var db1 = new Firebase('https://fitners.firebaseio.com/');
var db2 = new Firebase('https://fitners-dev.firebaseio.com/');

var password = window.prompt("Introduce password:","");

db1.authWithPassword({
    email    : 'pabloromanh@gmail.com',
    password : password
}, authHandler);


function authHandler(error, authData) {
    if (error) {
      console.log("Login 1 Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }

    db2.authWithPassword({
        email    : 'pabloromanh@gmail.com',
        password : password
    }, function () {

        if (error) {
          console.log("Login 2 Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }

        db1.once('value', function(snapshot) {
            if(snapshot.val() === null) {
                return;
            }

            db2.set(snapshot.val(), function(err) {
                if(err) {
                    console.log('Error: ', err);
                    window.alert("Error doing backup.");
                } else {
                    window.alert("Finished creating backup.");
                }
            });

        });
    });
}

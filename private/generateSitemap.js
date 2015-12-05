

function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }

    var lines = 'http://www.fitners.com/\n';
    var cities = {};

    var baseurl = 'http://www.fitners.com/';

    db.once('value', function(snapshot) {
        if(snapshot.val() === null) {
            return;
        }

        snapshot.forEach(function(data) {
            var value = data.val();
            var coachcity = slugify(value.city);
            var coachname = slugify(value.name);

            if(!cities[coachcity]) {
                cities[coachcity] = true;
                lines = lines + baseurl + coachcity + '\n';
            }

            lines = lines + baseurl + coachcity + '/' + coachname + '\n';
        });

        window.alert("Finished generating sitemap. Check the console.");

        console.log(lines);
    });
}

var db = new Firebase('https://fitners.firebaseio.com/coaches/');

var password = window.prompt("Introduce password:","");

db.authWithPassword({
    email    : 'pabloromanh@gmail.com',
    password : password
}, authHandler);

function slugify(name) {
    name = name.trim();
    name = name.toLowerCase();
    name = name.replace(/[^a-z\u00E0-\u00FC]+/g, '-');
    name = name.replace(/-+/g, '-'); // collapse dashes

    return name;
}

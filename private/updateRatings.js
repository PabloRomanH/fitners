

function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }

    function rankScore(numComments, score) {
        var riseSpeed = 5; // number of ratings for factor to rise to 60%
        return (1 - Math.exp(-numComments / riseSpeed)) * score;
    }

    db.once('value', function(snapshot) {
        if(snapshot.val() === null) {
            return;
        }

        snapshot.forEach(function(data) {
            var value = data.val();
            var key = data.key();

            var count = 0;

            var score = {
                total: 0,
                knowledge: 0,
                compatibility: 0,
                pricequality: 0,
                punctuality: 0,
                results: 0
            };

            for (var rating in value.ratings) {
                count++;
                score.total += value.ratings[rating].stars;
                score.knowledge += value.ratings[rating].knowledge;
                score.compatibility += value.ratings[rating].compatibility;
                score.pricequality += value.ratings[rating].pricequality;
                score.punctuality += value.ratings[rating].punctuality;
                score.results += value.ratings[rating].results;
            }

            if (count > 0) {
                score.total /= count;
                score.knowledge /= count;
                score.compatibility /= count;
                score.pricequality /= count;
                score.punctuality /= count;
                score.results /= count;
            }

            db.child(key + '/score').set(score);

            var rank = rankScore(count, score.total);

            db.child(key + '/rank').set(-rank);
        });

        window.alert("Finished updating DB.");
    });
}

var db = new Firebase('https://fitners.firebaseio.com/coaches/');

var password = window.prompt("Introduce password:","");

db.authWithPassword({
    email    : 'pabloromanh@gmail.com',
    password : password
}, authHandler);

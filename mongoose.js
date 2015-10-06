var mongoose = require('mongoose');
var Q = require('q');

mongoose.connect('mongodb://localhost/videoapi');

var schema = mongoose.Schema({
    title: String,
    url: String
});

var Video = mongoose.model('Video', schema);

var videoData = [
    {
        title: 'How to build a M.E.A.N web application',
        url: 'https://www.youtube.com/watch?v=OhPFgqHz68o'
    },
    {
        title: 'Building your first MEAN application',
        url: 'https://www.youtube.com/watch?v=PH_5lXxSpww'
    },
    {
        title: 'Bossable.com - MEAN Stack: 20 - Pass Customer Details to an Angular',
        url: 'https://www.youtube.com/watch?v=FVR7eilHJzE'
    }
];

var saveWithPromise = function(video) {
    var deferred = Q.defer();
    
    video.save(function(err) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve();
        }
    });
    
    return deferred.promise;
};

var findWithPromise = function(Video) {
    var deferred = Q.defer();
    
    Video.find(function(err, videos) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(videos);
        }
    });
    
    return deferred.promise;
};

var findByIdWithPromise = function(Video, id) {
    var deferred = Q.defer();
    
    Video.findById(id, function(err, video) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(video);
        }
    });
    
    Video
    
    return deferred.promise;
};

var removeWithPromise = function(video) {
    var deferred = Q.defer();
    
    video.remove(function(err) {
        if (err) {
            deferred.reject(new Error(err));    
        }
        else {
            deferred.resolve();
        }
    });
    
    return deferred.promise;
};

var removeAllWithPromise = function(Video) {
    var deferred = Q.defer();
    
    Video.remove({}, function(err) {
        if (err) {
            deferred.reject(new Error(err));    
        }
        else {
            deferred.resolve();
        }
    });
    
    return deferred.promise;
};

removeAllWithPromise(Video)
    .then(function() {
        return saveWithPromise(new Video(videoData[0]));        
    })
    .then(function() {
        return saveWithPromise(new Video(videoData[1]));
    })
    .then(function() {
        return saveWithPromise(new Video(videoData[2]));
    })
    .then(function() {
        return findWithPromise(Video);
    })
    .then(function(videos) {
        console.log(videos);
        var id = videos[1]._id;
        return findByIdWithPromise(Video, id);
    })
    .then(function(video) {
        console.log(video);
        video.title = 'Building your first M.E.A.N application';
        return saveWithPromise(video);
    })
    .then(function() {
        return findWithPromise(Video);
    })
    .then(function(videos) {
        console.log(videos);
        var id = videos[0]._id;
        return findByIdWithPromise(Video, id);
    })
    .then(function(video) {
        console.log(video);
        return removeWithPromise(video);
    })
    .then(function() {
        return findWithPromise(Video);
    })
    .then(function(videos) {
        console.log(videos);
    })
    .catch(function(err) {
        console.log(err);
    })
    .fin(function() {
        mongoose.connection.close(function() { process.exit(0); }); 
    });
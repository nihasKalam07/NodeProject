var fs = require('fs');

module.exports = {
    deleteFile: function (path, errorMessage) {
        fs.unlink(path, function (err) {
            if (err) throw err;
            console.log(errorMessage);
        });
    }
};
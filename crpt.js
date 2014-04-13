var crypto	= require("crypto");
var Q		= require("q");

exports.encrypt = function (cleartext, password) {
	var deferred = Q.defer();
	var key = new Buffer(password, "utf8");
	var cipher = crypto.createCipher("aes256", key);
	var ciphertext = "";
	cipher.setEncoding("base64");
	cipher.on("data", function (chunk) {
		ciphertext += chunk;
	});
	cipher.on("end", function () {
		deferred.resolve(ciphertext);
	});
	cipher.on("error", function (err) {
		deferred.reject(err);
	});
	cipher.end(cleartext, "utf8");
	return deferred.promise;
};

exports.decrypt = function (ciphertext, password) {
	var deferred = Q.defer();
	var key = new Buffer(password, "utf8");
	var decipher = crypto.createDecipher("aes256", key);
	var cleartext = "";
	decipher.setEncoding("utf8");
	decipher.on("data", function (chunk) {
		cleartext += chunk;
	});
	decipher.on("end", function () {
		deferred.resolve(cleartext);
	});
	decipher.on("error", function (err) {
		deferred.reject(err);
	});
	decipher.end(ciphertext, "base64");
	return deferred.promise;
};

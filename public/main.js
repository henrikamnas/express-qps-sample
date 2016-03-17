require.config({
    baseUrl: 'https://localhost/resources'
});

var config = {
	host: "localhost",
	prefix: "/",
	port: 443,
	isSecure: true
};

require(['js/qlik'], function(qlik) {
    var global = qlik.getGlobal(config);
    global.getAuthenticatedUser().then(function(reply) {
        console.log(reply)
    })
})
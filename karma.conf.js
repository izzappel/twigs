// Karma configuration
// Generated on Wed Mar 05 2014 09:38:26 GMT+0100 (W. Europe Standard Time)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'components/jquery/jquery.min.js'  ,
            'components/angular/angular.js',
            'components/angular-cookies/angular-cookies.js',
            'components/angular-mocks/angular-mocks.js',
            'components/angular-bootstrap/ui-bootstrap.min.js',
            'components/angular-route/angular-route.js',
            'components/select2/select2.js',
            'components/angular-ui-select2/src/select2.js',
            'src/*.js',
            'src/*.js',
            '.tmp/templates.js',
            'test/spec/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],

        preprocessors: {
            'src/*.js': 'coverage'
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['PhantomJS'],

        captureTimeout: 60000,

        singleRun: false
    });
};

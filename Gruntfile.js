var srcserver =  "src/";
var serverport = process.env.PORT || 8000;

module.exports = function(grunt) {

  grunt.initConfig({
    express: { 
        options: {
            port: serverport,
        },  
        dev: {
          options: {
            script: srcserver + 'index.js',
            node_env: 'dev'
          }
        },
        prod: {
          options: {
            script: srcserver + 'index.js',
            node_env: 'prod'
          }
        }
    }
  });

  grunt.loadNpmTasks('grunt-express-server');  

  grunt.registerTask('build', [  
        'jshint'
  ]);

    
    grunt.registerTask('express-keepalive', 'Keep grunt running', function(target) {
        var message = 'chatjs-server is running on http://localhost:' + serverport; 
        if (target == "dev") {
            message += " in development mode";
        } else {
            message += " in production mode";
        }
        console.log(message);
        this.async();       
    });
    
  grunt.registerTask('serve', 'My "serve" task description.', function(target) {
      if (target === 'dev') {
            return grunt.task.run([ 
                'express:dev',
                'express-keepalive:dev'
            ]);
        }
      else{
        return grunt.task.run([
                'express:prod',
                'express-keepalive:prod'
        ]);
      
      }
  });
    
  grunt.registerTask('default', [
      'build'
  ]);

};
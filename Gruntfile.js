// Generated by CoffeeScript 1.6.3
module.exports = function(grunt) {
  var benchmarks, cmd, config, coverage, cp, fs, openPage, projects, root, spawn, specs, startServer, test, testServer, testServerJs, testServerPath, testServerPort, testServerUrl, testServerWebSocketPort, testSocket;
  spawn = require('child_process').spawn;
  fs = require('fs');
  root = __dirname;
  test = root + '/';
  specs = test + 'specs/';
  benchmarks = test + 'benchmarks/';
  testServer = test;
  testServerJs = testServer + 'lib/';
  coverage = testServer + 'coverage/';
  cp = require('child_process');
  projects = require('./projects/config.coffee');
  testServerPath = testServer + 'unitTestServer.js';
  testServerPort = 4000;
  testServerUrl = 'localhost:' + testServerPort;
  testServerWebSocketPort = 1337;
  config = projects[projects.currentProject];
  if (typeof grunt.option('proj') !== "undefined" && typeof projects[grunt.option('proj')] !== "undefined") {
    config = projects[grunt.option('proj')];
  }
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', ['parallel:dev']);
  grunt.registerTask('test', ['clean', 'copy:src', 'coffeeCompile', 'instrument', 'requirejs', 'copy:main', 'copy:specs', 'coffeeCompile', 'startUnitTestServer', 'openTest']);
  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          name: 'itchcork',
          baseUrl: './lib/itchcork',
          paths: {
            'lodash': '../../lib/lodash',
            'benchmark': '../../lib/benchmark',
            'platform': '../../lib/platform',
            'lib': '../../lib'
          },
          inlineText: true,
          optimizeAllPluginResources: true,
          pragmas: {
            build: true
          },
          stubModules: ['text'],
          out: 'lib/itchcork.js'
        }
      }
    },
    clean: {
      testsrc: ['_src'],
      specs: ['specs'],
      instrumented: ['_instrumented'],
      coverage: ['coverage.json']
    },
    copy: {
      src: {
        files: [
          {
            expand: true,
            cwd: config.jsUnderTestPath,
            flatten: false,
            src: config.jsUnderTestInclude,
            dest: '_src'
          }
        ]
      },
      specs: {
        files: [
          {
            expand: true,
            cwd: config.specsPath,
            flatten: false,
            src: ['**'],
            dest: 'specs'
          }
        ]
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'projects/' + projects.currentProject,
            flatten: false,
            src: ['main.js'],
            dest: ''
          }
        ]
      }
    },
    concat: {
      itchcork: {
        src: [testServerJs + 'itchcork/**/*.js'],
        dest: testServerJs + 'itchcork.js'
      }
    },
    makeReport: {
      src: ['coverage.json'],
      options: {
        dir: 'coverage',
        basePath: 'coverage'
      }
    },
    instrument: {
      files: ['_src/**/*.js'],
      options: {
        basePath: '_instrumented',
        flatten: false
      }
    },
    parallel: {
      dev: {
        options: {
          stream: true,
          grunt: true
        },
        tasks: ['test', 'watch']
      }
    },
    watch: {
      currentProj: {
        files: [config.specsPath + '**/**/*.js', config.jsUnderTestPath + '**/**/*.js'],
        tasks: ['clean', 'copy', 'instrument'],
        options: {
          nospawn: true,
          interrupt: true,
          livereload: testServerWebSocketPort
        }
      },
      coverage: {
        files: ['coverage.json'],
        tasks: ['makeReport'],
        options: {
          nospawn: true,
          interrupt: true
        }
      }
    }
  });
  grunt.registerTask('startUnitTestServer', function() {
    var alreadyOn, callback, done;
    alreadyOn = false;
    callback = function(result) {
      alreadyOn = result;
      if (!alreadyOn) {
        return startServer(done, testServerPath);
      } else {
        console.log('no need to start JS Unit Test Server');
        return done();
      }
    };
    testSocket(testServerPort, this.async, callback);
    return done = this.async();
  });
  grunt.registerTask('kill', function() {
    return cmd('taskkill /IM node.exe /F', this.async());
  });
  cmd = function(cmd, done) {
    var exec, execCmd;
    exec = cp.exec;
    execCmd = exec(cmd, {}, function() {
      return done();
    });
    execCmd.stdout.pipe(process.stdout);
    return execCmd.stderr.pipe(process.stderr);
  };
  grunt.registerTask('coffeeCompile', function() {
    return cmd('coffee.cmd', this.async());
  });
  grunt.registerTask('coffeeWatch', function() {
    var coffeeSrc, done, script;
    script = 'coffeeWatch.cmd';
    coffeeSrc = spawn(script, [], {
      detached: true
    });
    coffeeSrc.stdout.pipe(process.stdout);
    coffeeSrc.stderr.pipe(process.stderr);
    return done = this.async();
  });
  grunt.registerTask('openTest', function() {
    var done;
    openPage(done, testServerUrl);
    return done = this.async();
  });
  startServer = function(done, serverPath) {
    var server;
    spawn = cp.spawn;
    server = spawn('node', [serverPath]);
    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stderr);
    return server.on('exit', function(code) {
      console.log('server killed');
      return done();
    });
  };
  openPage = function(doneCallback, url) {
    var chrome;
    console.log(url);
    spawn = require('child_process').spawn;
    chrome = spawn(process.env[(process.platform === 'win32' ? 'USERPROFILE' : 'HOME')] + '//AppData//Local//Google//Chrome//Application//chrome.exe', ['--new-tab --enable-benchmarks', url]);
    return doneCallback();
  };
  return testSocket = function(port, async, result) {
    var done, net, sock;
    net = require('net');
    sock = new net.Socket();
    sock.setTimeout(1500);
    sock.on('connect', function() {
      result(true);
      return done();
    }).on('error', function(e) {
      sock.destroy();
      result(false);
      return done();
    }).on('timeout', function(e) {
      console.log('ping timeout');
      result(false);
      return done();
    }).connect(port, '127.0.0.1');
    grunt.log.write('Waiting...');
    return done = async;
  };
};
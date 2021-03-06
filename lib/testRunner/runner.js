// Generated by CoffeeScript 1.6.3
define(function(require) {
  var runner;
  runner = void 0;
  runner = function(options) {
    var postCoverage, postResults;
    $.ajaxSetup({
      cache: false
    });
    postCoverage = void 0;
    postResults = void 0;
    if (!options.withCoverage) {
      requirejs.config({
        baseUrl: "_src",
        paths: options.pathConfig.paths
      });
    } else {
      requirejs.config({
        baseUrl: "_instrumented/_src",
        paths: options.pathConfig.paths
      });
    }
    window.require = require;
    postResults = function(stats, callback) {
      $.post("/stats", {
        stats: JSON.stringify(stats)
      }, function() {
        if (callback) {
          callback();
        }
      });
    };
    postCoverage = function() {
      var coverage;
      coverage = void 0;
      if (window.__coverage__) {
        coverage = JSON.stringify(window.__coverage__.valueOf());
        $.post("/coverage", {
          coverage: coverage
        });
      }
    };
    require(["lib/testRunner/processSource", "lib/testRunner/processSpecs"], function(ProcessSource, ProcessSpecs) {
      require(options.pathConfig.bootstrap, function() {
        if (!ItchCork.viewModel.processed) {
          ProcessSpecs(ItchCork.options.specs, function() {
            var mochaDone, mochaRunner;
            mochaDone = void 0;
            mochaRunner = void 0;
            if (ItchCork.options.framework === "itchcork") {
              ItchCork.viewModel.unitTestFrameworkManager.set("itchcork");
              ItchCork.on.end = function() {
                postCoverage();
                postResults(ItchCork.stats);
              };
              ItchCork.run();
            } else if (ItchCork.options.framework === "mocha") {
              ItchCork.viewModel.unitTestFrameworkManager.set("mocha");
              mochaRunner = require("lib/testRunner/mochaRunner");
              mochaDone = function(stats) {
                postResults(stats);
                ProcessSource(ItchCork.options.sourceList, function() {
                  if (options.withCoverage) {
                    postCoverage();
                  }
                  ItchCork.viewModel.processed = true;
                });
              };
              mochaRunner(ItchCork.options.specs, require, ItchCork, mochaDone);
            }
          });
        }
      });
    });
  };
  return runner;
});

// Generated by CoffeeScript 1.6.3
define(["lib/chai", "lib/sinon-chai"], function(chai, sinonChai) {
  var run;
  window.expect = chai.expect;
  chai.use(sinonChai);
  chai.Assertion.includeStack = true;
  chai.Assertion.addChainableMethod("you", (function() {}), function() {
    return this;
  });
  run = function(specs, require, ItchCork, mochaDone) {
    var ex;
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    } else {
      mocha.checkLeaks();
      mocha.globals(['jQuery']);
      mocha.setup("bdd");
      mocha.reporter("html");
      try {
        require(specs, function() {
          var runner;
          runner = mocha.run();
          runner.on("end", function() {
            ItchCork.suiteView.totals.Tests(runner.total);
            ItchCork.suiteView.totals.Passed(runner.stats.passes);
            ItchCork.suiteView.totals.Failed(runner.stats.failures);
            $("#mocha a").attr("href", "#");
            $("#mocha code").addClass("well");
            $("#mocha a").click(function() {
              var tests;
              tests = Array.prototype.slice.call($(this).parent().siblings()[0].children);
              tests.forEach(function(test) {
                if (test.hidden) {
                  test.hidden = false;
                } else {
                  test.hidden = true;
                }
              });
            });
            mochaDone(runner.stats);
          });
        });
      } catch (_error) {
        ex = _error;
        console.log(ex);
      }
    }
  };
  return run;
});
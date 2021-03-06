// Generated by CoffeeScript 1.6.3
define(function(require) {
  var processSpecModule, processSpecs;
  processSpecModule = function(moduleName, require) {
    var ex, _error;
    ex = void 0;
    try {
      ItchCork.codeProcessor.process(new ItchCork.SpecModel(moduleName), "", function(specModel) {
        ItchCork.viewModel.specs.push(specModel);
        if (typeof ItchCork.viewModel.selectedSpecModel !== "undefined") {
          ItchCork.viewModel.selectedSpecModel(specModel);
        }
      });
    } catch (_error) {
      _error = _error;
      ex = _error;
      console.log(ex);
    }
  };
  processSpecs = function(specList, done) {
    var i;
    ItchCork.viewModel.specs([]);
    i = 0;
    while (i < specList.length) {
      processSpecModule(specList[i].replace('.js', ''), require);
      i++;
      if (i === specList.length) {
        if (done) {
          done();
        }
      }
    }
  };
  return processSpecs;
});

config = {}

config.path = "../SpendOnLife-Splice/assets/"
config.jsRootPath = config.path + "javascripts/"
config.jsUnderTestPath = config.path + "javascripts/common"
config.jsUnderTestInclude = ['**',"!*.js",'!App/*.html','!App/*.jade','!App/main.coffee', '!App/main.js', '!specs/**']
config.specsPath = config.jsRootPath + "specs/"
config.coverage = ["_src/common/**/*.js","_src/OTCore/**/*.js"]
config.framework = "mocha"

module.exports =  config
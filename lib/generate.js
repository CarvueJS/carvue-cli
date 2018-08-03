const async = require('async')
const inquirer = require('inquirer')
const Metalsmith = require('metalsmith')
const render = require('consolidate').handlebars.render;

/**
 * questions for building.
 */
const questions = [
  {
    type: 'input',
    name: 'name',
    message: "What's your project name"
  },
  {
    type: 'input',
    name: 'version',
    message: "What's your project version",
    default: function() {
      return '0.0.1';
    }
  },
  {
    type: 'input',
    name: 'email',
    message: "What's your email",
    validate: function(value) {
      const pass = value.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid email';
    }
  },
  {
    type: 'input',
    name: 'repository',
    message: "What's your repository",
  },
  {
    type: 'input',
    name: 'description',
    message: "What's your description",
  },
  {
    type: 'input',
    name: 'license',
    message: "What's your license",
  },
];

/**
 * Prompt plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function ask(files, metalsmith, done){
  const metadata = metalsmith.metadata();
  inquirer.prompt(questions).then(answers => {
    Object.keys(answers).forEach(key => {
      metadata[key] = answers[key]
    })
    done()
  });
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function template(files, metalsmith, done){
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  async.each(keys, run, done);

  function run(file, done){
    var str = files[file].contents.toString();
    render(str, metadata, function(err, res){
      if (err) return done(err);
      files[file].contents = new Buffer(res);
      done();
    });
  }
}


module.exports = function generate (name, src, dest, done) {
  const metalsmith = Metalsmith(src)
    .destination(dest)
    .use(ask)
    .use(template)
    .build(function(err){
      done(err)
    });
}
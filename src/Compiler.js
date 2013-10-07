/**
 * @license Copyright 2013 DesertNet, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict"

var path = require("path")
  , spawn = require("child_process").spawn

var Compiler = module.exports = function () {
    this._closureSpawner = _basicClosureSpawner
}

Compiler.prototype.setClosureSpawner = function (spawner) {
    this._closureSpawner = spawner
}

Compiler.prototype.compile = function (job, cb) {
    var proc = this._closureSpawner.call(global, job.compilerArguments())
    
    proc.once("exit", function (codeOrSig) {
        if (codeOrSig === 0) {
            return cb(null)
        }
    }.bind(this))

    proc.once("error", function (err) {
        return cb(err)
    }.bind(this))
}

function _basicClosureSpawner (args) {
    var jarfile = path.resolve(__dirname + "/../support/compiler.jar")
    var javaArgs = ["-jar", jarfile].concat(args)
    return spawn("java", javaArgs)
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _geckodriver = _interopRequireDefault(require("geckodriver"));

var _getFilePath = _interopRequireDefault(require("./utils/getFilePath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_LOG_FILENAME = 'GeckoDriver.txt';

class GeckoDriverLauncher {
  constructor() {
    this.geckoDriverLogs = null;
    this.geckoDriverArgs = null;
    this.logToStdout = false;
    return this;
  }

  async onPrepare(config) {
    this.geckoDriverArgs = config.geckoDriverArgs || [];
    this.geckoDriverLogs = config.geckoDriverLogs;

    if (!this.geckoDriverArgs.find(arg => arg.startsWith('--port'))) {
      this.geckoDriverArgs.push(`--port=${config.port}`);
    }

    this.process = _geckodriver.default.start(this.geckoDriverArgs);

    if (typeof this.geckoDriverLogs === 'string') {
      this._redirectLogStream();
    }
  }

  onComplete() {
    _geckodriver.default.stop();
  }

  _redirectLogStream() {
    const logFile = (0, _getFilePath.default)(this.geckoDriverLogs, DEFAULT_LOG_FILENAME); // ensure file & directory exists

    _fsExtra.default.ensureFileSync(logFile);

    const logStream = _fsExtra.default.createWriteStream(logFile, {
      flags: 'w'
    });

    this.process.stdout.pipe(logStream);
    this.process.stderr.pipe(logStream);
  }

}

exports.default = GeckoDriverLauncher;
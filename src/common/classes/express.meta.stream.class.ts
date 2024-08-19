import { Writable } from 'stream';
import debug from 'debug';

class ExpressMetaStream extends Writable {
  private readonly logger: debug.IDebugger;

  constructor(logger: debug.IDebugger) {
    super();

    this.logger = logger;
  }

  _write(
    chunk: any,
    _encoding: BufferEncoding,
    next: (error?: Error | null) => void,
  ) {
    const meta = chunk.toString();

    this.logger(meta);

    next();
  }
}

export default ExpressMetaStream;

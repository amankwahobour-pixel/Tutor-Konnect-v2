import {devLogger} from './dev.logger';
import {prodLogger} from './prod.logger';

const isDev = process.env.NODE_ENV !== 'production';
const logger = isDev ? devLogger : prodLogger;

export default logger;
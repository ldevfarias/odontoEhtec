'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
require('dotenv/config');
exports.default = {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'],
  },
};
//# sourceMappingURL=drizzle.config.js.map

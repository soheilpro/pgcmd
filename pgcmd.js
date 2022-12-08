#!/usr/bin/env node

const { Client } = require('pg');
const csvStringify = require('csv-stringify/lib/sync');

const argv = require('yargs')
  .option('host',     { type: 'string',  alias: 'h', default: process.env.PGHOST || 'localhost' })
  .option('port',     { type: 'number',  alias: 'o', default: process.env.PGPORT || 5432 })
  .option('user',     { type: 'string',  alias: 'u', default: process.env.PGUSER || process.env.USER })
  .option('password', { type: 'string',  alias: 'p', default: process.env.PGPASSWORD || ' ' })
  .option('database', { type: 'string',  alias: 'd', default: process.env.PGDATABASE })
  .option('timeout',  { type: 'number',  alias: 't', default: 0 })
  .option('param',    { type: 'array',   alias: 'm', default: [] })
  .option('csv',      { type: 'boolean' })
  .strict(true)
  .argv;

function readInput() {
  return new Promise(resolve => {
    let data = Buffer.alloc(0);

    process.stdin.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    });

    process.stdin.on('end', () => {
      resolve(data.toString());
    });
  });
}

async function getQuery() {
  if (argv._.length !== 0 && argv._[0] !== '-')
    return argv._[0];

  return await readInput();
}

async function main() {
  const client = new Client({
    host: argv.host,
    port: argv.port,
    user: argv.user,
    password: argv.password,
    database: argv.database,
    statement_timeout: argv.timeout * 1000,
  });

  try {
    await client.connect();

    const query = await getQuery();
    const params = argv.param;

    const { rows } = await client.query(query, params);

    if (argv.csv) {
      console.log(csvStringify(rows, {
        header: true,
        cast: {
          date: date => date.toISOString(),
        },
        eof: false,
      }));
    }
    else {
      console.log(JSON.stringify(rows, null, 2));
    }
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
  finally {
    await client.end();
  }
}

main();

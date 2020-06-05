# pgcmd
Non-interactive PostgreSQL query tool.

By default, it outputs JSON which means that you can process and view the results with tools like [jq](https://stedolan.github.io/jq/manual) or [catj](https://github.com/soheilpro/catj).

## Install

```
npm install -g pgcmd
```

## Usage
```
pgcmd -h localhost \
      -u postgres \
      -p p@ssw0rd \
      -d postgres \
      'select * from pg_database where datname = $1' \
      -m template0
```

If no script is specified, pgcmd reads from the standard input:

```
echo 'select * from pg_database where datname = $1' | pgcmd -m template0
```

Output:
```
[
  {
    "datname": "template0",
    "datdba": 10,
    "encoding": 6,
    "datcollate": "en_US.utf8",
    "datctype": "en_US.utf8",
    "datistemplate": true,
    "datallowconn": false,
    "datconnlimit": -1,
    "datlastsysoid": 13066,
    "datfrozenxid": "562",
    "datminmxid": "1",
    "dattablespace": 1663,
    "datacl": "{=c/postgres,postgres=CTc/postgres}"
  }
]
```

It can also output CSV:

```
pgcmd 'select * from pg_database' --csv
```

Output:
```
datname,datdba,encoding,datcollate,datctype,datistemplate,datallowconn,datconnlimit,datlastsysoid,datfrozenxid,datminmxid,dattablespace,datacl
postgres,10,6,en_US.utf8,en_US.utf8,,1,-1,13066,562,1,1663,
template1,10,6,en_US.utf8,en_US.utf8,1,1,-1,13066,562,1,1663,"{=c/postgres,postgres=CTc/postgres}"
template0,10,6,en_US.utf8,en_US.utf8,1,,-1,13066,562,1,1663,"{=c/postgres,postgres=CTc/postgres}"
```

## Environment Variables
The following environment variables are supported:
- PGHOST
- PGPORT
- PGUSER
- PGPASSWORD
- PGDATABASE

## Version History
+ **1.1**
  + Added `--csv` output option.
  + Added support for Node 14. (Thanks [darky](https://github.com/darky))
  + Set exit code on errors. (Thanks [darky](https://github.com/darky))
+ **1.0**
	+ Initial release.

## Author
**Soheil Rashidi**

+ http://soheilrashidi.com
+ http://twitter.com/soheilpro
+ http://github.com/soheilpro

## Copyright and License
Copyright 2020 Soheil Rashidi.

Licensed under the The MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

http://www.opensource.org/licenses/mit-license.php

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

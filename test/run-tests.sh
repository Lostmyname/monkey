#!/usr/bin/env bash

serve -p 3124 & servepid=$!;
sleep 3;

phantomjs ./node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee http://127.0.0.1:3124/test/index.html;
code=$?;

if kill -0 $servepid;
  then kill $servepid;
fi;

wait $servepid;
exit $code;

tests=`dirname $0`
mocha=$dirname../node_modules/mocha/bin/mocha

$mocha $tests/$1 --no-timeouts

const fs = require('fs')
const rollup = require('rollup')
const UglifyJS = require('uglify-js')

async function build() {
  // build main file
  const bundle = await rollup.rollup({
    input: 'src/index.js',
  })

  await bundle.write({
    file: 'index.js',
    format: 'esm',
  })

  // minify main file
  fs.writeFileSync(
    'index.js',
    UglifyJS.minify(
      {
        'index.js': fs.readFileSync('index.js', 'utf8'),
      },
      {
        compress: true,
        mangle: true,
      }
    ).code,
    'utf8'
  )

  // copy and minify all submodules
  fs.writeFileSync(
    'delay.js',
    UglifyJS.minify(
      {
        'delay.js': fs.readFileSync('./src/delay.js', 'utf8'),
      },
      {
        compress: true,
        mangle: true,
      }
    ).code,
    'utf8'
  )

  fs.writeFileSync(
    'time.js',
    UglifyJS.minify(
      {
        'time.js': fs.readFileSync('./src/time.js', 'utf8'),
      },
      {
        compress: true,
        mangle: true,
      }
    ).code,
    'utf8'
  )
}

build()

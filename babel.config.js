module.exports = api => {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 2,
        targets: '>0.5%',
      },
    ],
  ]

  return {
    comments: true,
    ignore: [/[\/\\]core-js/, /@babel[\/\\]runtime/],
    presets,
  }
}

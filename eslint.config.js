import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'src/draw-path/paint/*.js',
    'src/draw-path/parse/*.js',
    'src/draw-path/utils/*.js',
  ],
})

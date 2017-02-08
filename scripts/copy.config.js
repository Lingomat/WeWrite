const orgCopyConfig = require('@ionic/app-scripts/config/copy.config')

orgCopyConfig.copyIndexContent.src.push('{{ROOT}}/node_modules/wavesurfer.js/dist/wavesurfer.min.js')
for (let wp of ['minimap', 'regions', 'timeline']) {
  orgCopyConfig.copyIndexContent.src.push('{{ROOT}}/node_modules/wavesurfer.js/dist/plugin/wavesurfer.' + wp + '.min.js')
}
module.exports = orgCopyConfig

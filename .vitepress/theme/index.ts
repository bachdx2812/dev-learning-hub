import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Comments from './components/comments.vue'
import ShareButtons from './components/share-buttons.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h('a', {
        href: '#VPContent',
        class: 'skip-to-content',
        'aria-label': 'Skip to main content'
      }, 'Skip to content'),
      'doc-after': () => h('div', null, [h(ShareButtons), h(Comments)])
    })
  }
}

// @flow
/* eslint-disable no-use-before-define, no-underscore-dangle */
import React from 'react'
import Editable from 'src/editor/components/Editable'
import Controls from 'src/editor/components/Controls'
import createStore from './store'
import { isProduction } from './const'
import { connectToRaven } from './raven'
import * as plugins from './plugins'
import PluginService from 'src/editor/service/plugin'
import ServerContext from 'src/editor/components/ServerContext'
import ReactDOMServer from 'react-dom/server'
import { createInitialState } from 'src/editor/plugins/content/slate/hooks'
import uuid from 'node-uuid'

import type Store from 'types/redux'

if (!isProduction && typeof window !== 'undefined') {
  window.Perf = require('react-addons-perf')
}
let instance: Editor
const initialState = {
  editables: {
    past: [],
    present: [],
    future: []
  }
}

/**
 * Editor is the core interface for dealing with the editor.
 */
class Editor {
  store: Store
  plugins: PluginService
  middleware: []
  errorReporting: bool

  constructor({
    plugins = new PluginService(),
    errorReporting = true,
    middleware = []
  }: {
    plugins: PluginService,
    errorReporting: boolean,
    middleware: []
  } = {}) {
    if (instance) {
      throw new Error('Only one instance of Editor is allowed')
    }

    instance = this
    this.store = createStore(initialState, middleware)
    this.plugins = plugins
    this.errorReporting = errorReporting
    this.middleware = middleware

    connectToRaven(errorReporting)
  }

  renderToHtml = (state: any) => ReactDOMServer.renderToStaticMarkup(
    <ServerContext>
      <Editable editor={{
        plugins: this.plugins,
        store: createStore(initialState, this.middleware)
      }} state={state}
      />
    </ServerContext>
  )
}

export {
  PluginService,
  Editable,
  Controls,
  plugins
}

export const createEmptyState = () => ({
  id: uuid.v4(),
  cells: [{
    content: {
      plugin: { name: 'ory/editor/core/content/slate' },
      state: {
        serialized: createInitialState()
      }
    }
  }]
})

export default Editor
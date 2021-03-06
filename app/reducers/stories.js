import objectFilter from 'object-filter'

import {
  CHANGE_SELECTION, CHANGE_RESOURCE, ENABLE_RESIZING, DISABLE_RESIZING, SET_WEBSITE_WIDTH, CHANGE_DISPLAY,
  CYCLE_DISPLAY, SET_LOADING, SET_LOADING_SECOND_PAGE, SET_FAILED, SET_DATA, MARK_STORY_AS_READ, CLEANUP_READ_STORIES
} from '../actions/stories'
import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  loading: false,
  failed: false,
  resource: 'news',
  data: [],
  loadedSecond: false, // Was the second top stories page loaded?,
  selected: 0,
  resizing: false,
  websiteWidth: 60, // in percent
  display: 'both', // both, link, comments
  preferedDisplay: 'both',
  readStories: {}
}

export default function counter (state = defaultState, action) {
  let { type, ...changes } = action
  let readStories = {}
  let { display, preferedDisplay } = state

  switch (type) {
    case REHYDRATE:
      var result = action.payload.stories
      if (result === undefined) return defaultState
      return { ...result, selected: 0, display: result.preferedDisplay }
    case CHANGE_SELECTION:
      display = state.preferedDisplay
      return { ...state, ...changes, display }
    case SET_LOADING:
      return { ...state, loading: true, failed: false }
    case SET_LOADING_SECOND_PAGE:
      return { ...state, loading: true, loadedSecond: true, failed: false }
    case SET_FAILED:
      return { ...state, loading: false, failed: true }
    case SET_DATA:
      return { ...state, loading: false, failed: false, ...changes }
    case CHANGE_RESOURCE:
      return { ...state, ...changes }
    case CHANGE_DISPLAY:
      display = changes.display
      preferedDisplay = display !== 'comments' ? display : state.preferedDisplay
      return { ...state, display, preferedDisplay }
    case CYCLE_DISPLAY:
      if (preferedDisplay === 'link') {
        display = display === 'link' ? 'comments' : 'link'
      } else {
        if (display === 'both') display = 'link'
        else if (display === 'link') display = 'comments'
        else if (display === 'comments') display = 'both'
      }
      return { ...state, display }
    case ENABLE_RESIZING:
      return { ...state, resizing: true }
    case DISABLE_RESIZING:
      return { ...state, resizing: false }
    case SET_WEBSITE_WIDTH:
      return { ...state, ...changes }
    case MARK_STORY_AS_READ:
      readStories = { ...state.readStories }
      readStories[action.id] = action.timestamp
      return { ...state, readStories }
    case CLEANUP_READ_STORIES:
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000
      readStories = objectFilter(state.readStories, (timestamp, id) => timestamp >= twoWeeksAgo)
      return { ...state, readStories }
    default:
      return state
  }
}

import { parseApiError } from '../../api/errors'

// Retry-After is in seconds (DRF throttling). Readable here because the dev
// server proxies /api; a cross-origin API must list it in CORS_EXPOSE_HEADERS.
function retryAfterText(error) {
  const seconds = Number(error.response?.headers?.['retry-after'])
  if (!seconds) return 'later'
  const minutes = Math.ceil(seconds / 60)
  return minutes <= 1 ? 'a minute' : `${minutes} minutes`
}

// What to show when asking a question fails.
// -> {fields: {question?, project_id?}, message, retryable}
export function describeAskError(error) {
  const status = error.response?.status
  switch (status) {
    case 400:
      return { ...parseApiError(error), retryable: false }
    case 404:
      return { fields: {}, message: 'Conversation not found.', retryable: false }
    case 422:
      return {
        fields: {},
        message: "The assistant couldn't answer that. Try rephrasing.",
        retryable: false,
      }
    case 429:
      return {
        fields: {},
        message: `You've asked a lot of questions. Try again in ${retryAfterText(error)}.`,
        retryable: false,
      }
    case 503:
      return { fields: {}, message: 'Assistant unavailable.', retryable: true }
    default:
      if (error.code === 'ECONNABORTED') {
        return { fields: {}, message: 'The assistant took too long to answer.', retryable: true }
      }
      return { ...parseApiError(error), retryable: true }
  }
}

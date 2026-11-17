// All message strings in a DRF error value. List fields nest their errors,
// e.g. labels: {"0": ["Ensure this field has no more than 50 characters."]}.
function messagesOf(value) {
  if (value == null) return []
  if (Array.isArray(value)) return value.flatMap(messagesOf)
  if (typeof value === 'object') return Object.values(value).flatMap(messagesOf)
  return [String(value)]
}

// Turn an Axios error from DRF into something a form can render.
// DRF validation errors look like {field: [messages]}; other errors use {detail}.
export function parseApiError(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!error?.response) {
    return { fields: {}, message: 'Could not reach the server. Is the API running?' }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { fields: {}, message: Array.isArray(data) ? data.join(' ') : fallback }
  }

  const { detail, non_field_errors: nonField, ...rest } = data
  const fields = {}
  for (const [key, value] of Object.entries(rest)) {
    fields[key] = [...new Set(messagesOf(value))]
  }
  const message = detail
    ? String(detail)
    : nonField
      ? [].concat(nonField).join(' ')
      : Object.keys(fields).length === 0
        ? fallback
        : null
  return { fields, message }
}

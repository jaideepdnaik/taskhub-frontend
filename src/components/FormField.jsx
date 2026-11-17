// A labelled input with the backend's validation errors for that field underneath.
export default function FormField({ label, errors, ...inputProps }) {
  return (
    <label>
      {label}
      <input aria-invalid={errors?.length ? true : undefined} {...inputProps} />
      {errors?.map((message) => (
        <span key={message} className="field-error">
          {message}
        </span>
      ))}
    </label>
  )
}

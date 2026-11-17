// A labelled input (or textarea, via as="textarea") with the backend's validation errors for that field underneath.
export default function FormField({ label, errors, as: Control = 'input', ...inputProps }) {
  return (
    <label>
      {label}
      <Control aria-invalid={errors?.length ? true : undefined} {...inputProps} />
      {errors?.map((message) => (
        <span key={message} className="field-error">
          {message}
        </span>
      ))}
    </label>
  )
}

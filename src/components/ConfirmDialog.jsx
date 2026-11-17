import Modal from './Modal'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  pending = false,
  error,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p>{message}</p>
      {error && <p className="error">{error}</p>}
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onClose} disabled={pending}>
          Cancel
        </button>
        <button
          type="button"
          className={danger ? 'danger' : undefined}
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

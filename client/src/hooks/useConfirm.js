import { useState, useCallback } from "react";

export default function useConfirm() {
  const [state, setState] = useState({ open: false, title: "", message: "", confirmLabel: "Delete", onConfirm: null });

  const confirm = useCallback(({ title, message, confirmLabel = "Delete", onConfirm }) => {
    setState({ open: true, title, message, confirmLabel, onConfirm });
  }, []);

  const close = useCallback(() => setState(s => ({ ...s, open: false })), []);

  const props = {
    open: state.open,
    title: state.title,
    message: state.message,
    confirmLabel: state.confirmLabel,
    onConfirm: () => { close(); state.onConfirm?.(); },
    onCancel: close,
  };

  return { confirm, confirmProps: props };
}

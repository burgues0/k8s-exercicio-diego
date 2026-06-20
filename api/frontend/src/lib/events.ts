function emitObraEvent(eventName: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(eventName);
    window.dispatchEvent(event);
  }
}

export function notifyObraCreated() {
  emitObraEvent('obraCreated');
}

export function notifyObraUpdated() {
  emitObraEvent('obraUpdated');
}

export function notifyObraDeleted() {
  emitObraEvent('obraDeleted');
}

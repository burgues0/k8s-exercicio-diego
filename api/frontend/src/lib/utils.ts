import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return 'Não disponível';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Data inválida';
  }
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Não disponível';
  try {
    const dateOnly = dateString.split('T')[0];
    const date = new Date(dateOnly + 'T00:00:00');
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
}

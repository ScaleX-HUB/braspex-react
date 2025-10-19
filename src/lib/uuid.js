/**
 * Gera UUID v4 compatível com todos os navegadores
 * Usa crypto.randomUUID() se disponível, senão gera manualmente
 */
export const generateUUID = () => {
  // Tenta usar a API nativa do navegador (mais segura)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      console.warn('crypto.randomUUID() falhou, usando fallback');
    }
  }
  
  // Fallback: gera UUID v4 manualmente (RFC 4122 compatível)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Valida se uma string é um UUID válido
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

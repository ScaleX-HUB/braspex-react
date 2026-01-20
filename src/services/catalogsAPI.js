/**
 * API para Catálogos no Supabase
 *
 * Tabela: catalogs
 * Campos esperados:
 * - id: uuid (pk)
 * - title: text
 * - pdf_url: text
 * - pdf_path: text
 * - cover_url: text
 * - cover_path: text
 * - active: boolean
 * - order_index: integer
 * - created_at: timestamp
 * - updated_at: timestamp
 */

import { supabase } from '../lib/supabaseClient';
import { storageAPI } from './storageAPI';

const TABLE_NAME = 'catalogs';
const BUCKET_NAME = import.meta.env.VITE_CATALOGS_BUCKET || 'catalogs';

const buildObjectPath = (folder, id, fileName) => {
  const safeName = (fileName || 'file')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '');
  return `${folder}/${id}-${Date.now()}-${safeName}`;
};

export const catalogsAPI = {
  async getAll(includeInactive = false) {
    const rows = await supabase.get(TABLE_NAME, {}, { order: 'order_index.asc,title.asc' });
    const items = rows || [];
    return includeInactive ? items : items.filter((c) => c.active !== false);
  },

  async getById(id) {
    const rows = await supabase.get(TABLE_NAME, { id });
    return rows && rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const payload = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const rows = await supabase.insert(TABLE_NAME, payload);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  async update(id, data) {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };
    const rows = await supabase.update(TABLE_NAME, { id }, payload);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  async delete(id) {
    await supabase.delete(TABLE_NAME, { id });
    return true;
  },

  async reorder(idsInOrder) {
    const promises = idsInOrder.map((id, index) => this.update(id, { order_index: index }));
    await Promise.all(promises);
    return true;
  },

  async uploadCoverImage(file, catalogId) {
    const objectPath = buildObjectPath('covers', catalogId, file.name);
    await storageAPI.uploadObject(BUCKET_NAME, objectPath, file, { upsert: true });
    return {
      url: storageAPI.getPublicUrl(BUCKET_NAME, objectPath),
      path: objectPath
    };
  },

  async uploadPdf(file, catalogId) {
    const fileName = file.name?.toLowerCase().endsWith('.pdf') ? file.name : `${file.name || 'catalogo'}.pdf`;
    const objectPath = buildObjectPath('pdf', catalogId, fileName);
    await storageAPI.uploadObject(BUCKET_NAME, objectPath, file, { upsert: true });
    return {
      url: storageAPI.getPublicUrl(BUCKET_NAME, objectPath),
      path: objectPath
    };
  }
};

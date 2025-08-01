// ---------------------------------------------------------------------------
//  qloo-service.ts  –  VibeVoyager <-> Qloo Hackathon API wrapper
// ---------------------------------------------------------------------------
import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '@/lib/logger';

/* ────────────────────────────────────── ENV CONFIG ────────────────────────────────────── */
const QLOO_API_KEY = import.meta.env.VITE_QLOO_API_KEY!;
const QLOO_BASE_URL =
  import.meta.env.VITE_QLOO_BASE_URL || 'https://hackathon.api.qloo.com';

if (!QLOO_API_KEY) {
  logger.error('❌  VITE_QLOO_API_KEY not set – add it to .env.local and restart Vite');
}

/* ──────────────────────────────────────── TYPES ──────────────────────────────────────── */
export type QlooEntityType =
  | 'urn:entity:artist' | 'urn:entity:book'     | 'urn:entity:brand'
  | 'urn:entity:destination' | 'urn:entity:movie' | 'urn:entity:person'
  | 'urn:entity:place'  | 'urn:entity:podcast' | 'urn:entity:tv_show'
  | 'urn:entity:video_game';

export interface QlooSearchHit { id:string; name:string }
export interface QlooTagHit    { id:string; name:string }
export interface QlooInsight   {
  entity:{ id:string; name:string; description?:string };
  affinity:{ score:number };
}

/* ────────────────────────────── AXIOS w/ LOGGING ────────────────────────────── */
const qloo = axios.create({
  baseURL: QLOO_BASE_URL,
  headers: { 'X-Api-Key': QLOO_API_KEY }
});

// request log
qloo.interceptors.request.use((cfg:AxiosRequestConfig) => {
  (cfg as any).meta = { start:Date.now() };
  logger.debug(`➡️  [Qloo] ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`, {
    params: cfg.params
  });
  return cfg;
});

// response / error log
qloo.interceptors.response.use(
  (resp) => {
    const ms = Date.now() - (resp.config as any).meta.start;
    logger.debug(`✅ [Qloo] ${resp.status} ${resp.config.url} (${ms} ms)`, {
      bytes: JSON.stringify(resp.data).length
    });
    return resp;
  },
  (err) => {
    const cfg = err.config || {};
    const ms = Date.now() - ((cfg as any).meta?.start ?? Date.now());
    logger.error(`❌ [Qloo] ${cfg.url ?? ''} (${ms} ms) – ${err.message}`, err.response?.data);
    return Promise.reject(err);
  }
);

/* ─────────────────────────────────── SERVICE ─────────────────────────────────── */
class QlooService {
  private static inst:QlooService;
  private constructor() {}
  static getInstance() { return this.inst ?? (this.inst = new QlooService()); }

  /* ---------- LOW-LEVEL ENDPOINTS ---------- */

  async searchEntities(query:string, type:QlooEntityType, limit=5):Promise<QlooSearchHit[]> {
    try {
      const { data } = await qloo.get('/search', { params:{ query, type, limit } });
      return data?.results ?? [];
    } catch { return []; }
  }

  async searchTags(query:string, limit=3):Promise<QlooTagHit[]> {
    try {
      const { data } = await qloo.get('/v2/tags', { params:{ query, limit } });
      return data?.tags ?? [];
    } catch { return []; }
  }

  async insightsByEntities(ids:string[], type:QlooEntityType, limit=10):Promise<QlooInsight[]> {
    if (!ids.length) return [];
    try {
      const { data } = await qloo.get('/v2/insights', {
        params:{
          'filter.type': type,
          'signal.interests.entities': ids.join(','),
          limit
        }
      });
      return data?.results ?? [];
    } catch { return []; }
  }

  /* ---------- HIGH-LEVEL VIBE HELPER ---------- */

  async destinationsFromVibes(vibes:string[], max=5):Promise<QlooInsight[]> {
    logger.info('🎵 Resolving vibes → destinations', { vibes });

    // 1️⃣ resolve each vibe to first tag hit
    const tagIds = (
      await Promise.all(vibes.map(v => this.searchTags(v,1).then(r=>r[0]?.id)))
    ).filter(Boolean) as string[];

    if (!tagIds.length) {
      logger.warn('⚠️  No tag URNs found', { vibes });
      return [];
    }
    logger.debug('Resolved tag URNs', tagIds);

    // 2️⃣ fetch destination insights
    try {
      const { data } = await qloo.get('/v2/insights', {
        params:{
          'filter.type':'urn:entity:destination',
          'signal.interests.tags': tagIds.join(','),
          limit: max
        }
      });
      return data?.results ?? [];
    } catch { return []; }
  }

  /* ---------- CONNECTIVITY TEST ---------- */

  async testConnection():Promise<boolean>{
    try {
      const { status } = await qloo.get('/search', {
        params:{ query:'coffee', type:'urn:entity:place', limit:1 }
      });
      return status === 200;
    } catch {
      return false;
    }
  }
}

export const qlooService = QlooService.getInstance();

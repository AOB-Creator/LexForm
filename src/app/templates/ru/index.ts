import { RuVersion } from '../../core/doc/types';
import { RU_CONTRACTS } from './contracts.ru';
import { RU_OTHER } from './other.ru';

/** Russian versions, keyed by template id. Templates not listed here are Uzbek-only for now. */
export const RU: Record<string, RuVersion> = { ...RU_CONTRACTS, ...RU_OTHER };

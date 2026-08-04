import type { DatasetName } from '../../lib/sqlSimulator'
import { DATASET_INFO } from './ecommerce'
import { SEDUH_DATASET_INFO } from './seduh'

/** Label and schema panel contents per SQL dataset. */
export const SQL_DATASETS: Record<DatasetName, {
  label: string
  info: { tables: { name: string; description: string; columns: string[]; rowCount: number }[]; totalRows: number }
}> = {
  seduh: { label: 'Seduh Coffee', info: SEDUH_DATASET_INFO },
  ecommerce: { label: 'E-Commerce', info: DATASET_INFO },
}

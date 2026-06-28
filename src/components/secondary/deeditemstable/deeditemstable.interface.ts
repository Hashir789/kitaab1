import type { DecryptedDeedItem } from "@/interfaces/deeds";

export interface DeedItemsTableProps {
  items: DecryptedDeedItem[];
  onEdit?: (item: DecryptedDeedItem) => void;
  onDelete?: (item: DecryptedDeedItem) => void;
  onMoveUp?: (item: DecryptedDeedItem, index: number) => void;
  onMoveDown?: (item: DecryptedDeedItem, index: number) => void;
}

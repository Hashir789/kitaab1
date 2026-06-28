"use client";

import { HiPencil } from "react-icons/hi";
import { MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styles from "./deeditemstable.module.css";
import { canMoveDeedItemDown, canMoveDeedItemUp, formatDeedCreatedAt } from "@/utils/deeds";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { deedsAria, deedsButtonLabel, deedsLabel, deedsMessage } from "@/constants/placeholders";
import type { DeedItemsTableProps } from "./deeditemstable.interface";

const actionButtonSize = 25;
const actionButtonGap = 6;
const actionButtonPadding = 4;

function TruncatedCell({ text }: { text?: string }) {
  const value = text?.trim();
  const display = value || "—";

  if (!value) {
    return <td className={styles.truncate}>{display}</td>;
  }

  return (
    <td className={styles.truncateCell}>
      <Tooltip
        text={value}
        position="auto"
        floating
        className={styles.cellTooltip}
      >
        <span className={styles.cellTooltipTrigger}>{display}</span>
      </Tooltip>
    </td>
  );
}

export default function DeedItemsTable({
  items,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: DeedItemsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{deedsLabel.NAME}</th>
            <th scope="col">{deedsLabel.DESCRIPTION}</th>
            <th scope="col">{deedsLabel.CREATED_AT}</th>
            <th scope="col" className={styles.actionCol}>
              {deedsLabel.ACTION}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.emptyCell}>
                {deedsMessage.EMPTY_TABLE}
              </td>
            </tr>
          ) : (
            items.map((item, index) => {
            const canMoveUp = canMoveDeedItemUp(index);
            const canMoveDown = canMoveDeedItemDown(index, items.length);
            const createdAt = formatDeedCreatedAt(item.created_at);

            return (
              <tr key={item.deed_item_id}>
                <TruncatedCell text={item.name} />
                <TruncatedCell text={item.description} />
                <TruncatedCell text={createdAt} />
                <td className={styles.actionCell}>
                  <div className={styles.actionCellInner}>
                    <ButtonGroup
                      className={styles.tableActions}
                      ariaLabel="Deed order actions"
                      buttonWidth={actionButtonSize}
                      buttonHeight={actionButtonSize}
                      gap={actionButtonGap}
                      padding={actionButtonPadding}
                    >
                      <Tooltip text={deedsButtonLabel.MOVE_UP} position="left">
                        <button
                          type="button"
                          onClick={() => onMoveUp?.(item, index)}
                          disabled={!canMoveUp}
                          aria-label={deedsAria.MOVE_DEED_UP}
                        >
                          <MdKeyboardArrowUp aria-hidden="true" />
                        </button>
                      </Tooltip>
                      <Tooltip text={deedsButtonLabel.MOVE_DOWN} position="left">
                        <button
                          type="button"
                          onClick={() => onMoveDown?.(item, index)}
                          disabled={!canMoveDown}
                          aria-label={deedsAria.MOVE_DEED_DOWN}
                        >
                          <MdKeyboardArrowDown aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </ButtonGroup>
                    <ButtonGroup
                      className={styles.tableActions}
                      ariaLabel="Deed actions"
                      buttonWidth={actionButtonSize}
                      buttonHeight={actionButtonSize}
                      gap={actionButtonGap}
                      padding={actionButtonPadding}
                    >
                      <Tooltip text={deedsButtonLabel.EDIT} position="left">
                        <button
                          type="button"
                          onClick={() => onEdit?.(item)}
                          aria-label={deedsAria.EDIT_DEED_SECTION}
                        >
                          <HiPencil aria-hidden="true" />
                        </button>
                      </Tooltip>
                      <Tooltip text={deedsButtonLabel.DELETE} position="left">
                        <button
                          type="button"
                          onClick={() => onDelete?.(item)}
                          aria-label={deedsAria.DELETE_DEED_SECTION}
                        >
                          <MdDelete aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </ButtonGroup>
                  </div>
                </td>
              </tr>
            );
          })
          )}
        </tbody>
      </table>
    </div>
  );
}

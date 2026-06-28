"use client";

import { useState } from "react";
import { HiMinus, HiPencil } from "react-icons/hi";
import { MdAdd, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Input from "@/components/secondary/input/Input";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import DeedCircleAddButton from "@/components/secondary/deedaddfab/DeedCircleAddButton";
import DeedItemsTableSkeleton from "@/components/secondary/deeditemstable/DeedItemsTableSkeleton";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import {
  deedsAria,
  deedsButtonLabel,
  deedsLabel,
  deedsMessage,
  deedsPlaceholder,
  scaleLabel,
} from "@/constants/placeholders";
import { useScaleItems } from "@/hooks/scales";
import type { DecryptedScaleItem } from "@/interfaces/scales";
import { canMoveDeedItemDown, canMoveDeedItemUp } from "@/utils/deeds";
import { useParams } from "next/navigation";
import formStyles from "../../new/newdeedform.module.css";
import styles from "../deeddetail.module.css";

const sectionActionButtonSize = 25;
const sectionActionButtonGap = 6;
const sectionActionButtonPadding = 4;
const addScaleItemQuestion = scaleLabel.ADD_SCALE_ITEM_QUESTION;
const addScaleItemTooltip = scaleLabel.ADD_SCALE_ITEM_QUESTION;

type ScaleSectionActionButtonsProps = {
  index: number;
  itemCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  showMinimize?: boolean;
  onEdit: (index: number) => void;
  onMinimize: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  actionClassName?: string;
};

function ScaleSectionActionButtons({
  index,
  itemCount,
  canMoveUp,
  canMoveDown,
  canDelete,
  showMinimize = false,
  onEdit,
  onMinimize,
  onDelete,
  onAdd,
  onMoveUp,
  onMoveDown,
  actionClassName = formStyles.collapsedCardActions,
}: ScaleSectionActionButtonsProps) {
  const isOnlyItem = itemCount === 1;

  return (
    <div className={formStyles.sectionCardActions}>
      {!isOnlyItem ? (
        <ButtonGroup
          className={actionClassName}
          ariaLabel="Scale item order actions"
          buttonWidth={sectionActionButtonSize}
          buttonHeight={sectionActionButtonSize}
          gap={sectionActionButtonGap}
          padding={sectionActionButtonPadding}
        >
          <Tooltip text={deedsButtonLabel.MOVE_UP} position="left">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={!canMoveUp}
              aria-label={deedsAria.MOVE_DEED_UP}
            >
              <MdKeyboardArrowUp aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip text={deedsButtonLabel.MOVE_DOWN} position="left">
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={!canMoveDown}
              aria-label={deedsAria.MOVE_DEED_DOWN}
            >
              <MdKeyboardArrowDown aria-hidden="true" />
            </button>
          </Tooltip>
        </ButtonGroup>
      ) : null}
      <ButtonGroup
        className={actionClassName}
        ariaLabel="Scale item actions"
        buttonWidth={sectionActionButtonSize}
        buttonHeight={sectionActionButtonSize}
        gap={sectionActionButtonGap}
        padding={sectionActionButtonPadding}
      >
        <Tooltip text={deedsButtonLabel.EDIT} position="left">
          <button
            type="button"
            onClick={() => onEdit(index)}
            aria-label={deedsAria.EDIT_DEED_SECTION}
          >
            <HiPencil aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip text={addScaleItemTooltip} position="left">
          <button
            type="button"
            onClick={() => onAdd(index)}
            aria-label={addScaleItemTooltip}
          >
            <MdAdd aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip text={deedsButtonLabel.DELETE} position="left">
          <button
            type="button"
            onClick={() => onDelete(index)}
            disabled={!canDelete}
            aria-label={deedsAria.DELETE_DEED_SECTION}
          >
            <MdDelete aria-hidden="true" />
          </button>
        </Tooltip>
        {showMinimize ? (
          <Tooltip text={deedsButtonLabel.MINIMIZE} position="left">
            <button
              type="button"
              onClick={() => onMinimize(index)}
              aria-label={deedsAria.MINIMIZE_DEED_SECTION}
            >
              <HiMinus aria-hidden="true" />
            </button>
          </Tooltip>
        ) : null}
      </ButtonGroup>
    </div>
  );
}

type ScaleDetailItemSectionProps = {
  item: DecryptedScaleItem;
  index: number;
  itemCount: number;
  expandedIndex: number;
  onEdit: (index: number) => void;
  onMinimize: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

function getCardTitle(item: DecryptedScaleItem, index: number): string {
  if (item.name.trim()) {
    return item.name.trim();
  }

  return index === 0 ? scaleLabel.SCALE_ITEM : scaleLabel.NEW_SCALE_ITEM;
}

function ScaleDetailItemSection({
  item,
  index,
  itemCount,
  expandedIndex,
  onEdit,
  onMinimize,
  onDelete,
  onAdd,
  onMoveUp,
  onMoveDown,
}: ScaleDetailItemSectionProps) {
  const fieldIdPrefix = `scale-detail-${index}`;
  const isExpanded = expandedIndex === index;
  const cardTitle = getCardTitle(item, index);
  const canDelete = itemCount > 1;
  const canMoveUp = canMoveDeedItemUp(index);
  const canMoveDown = canMoveDeedItemDown(index, itemCount);

  const actionButtonsProps = {
    index,
    itemCount,
    canMoveUp,
    canMoveDown,
    canDelete,
    onEdit,
    onMinimize,
    onDelete,
    onAdd,
    onMoveUp,
    onMoveDown,
  };

  return (
    <div className={formStyles.sectionWrap}>
      {!isExpanded ? (
        <div className={formStyles.collapsedCard} aria-label={cardTitle}>
          <div className={formStyles.sectionCardHeader}>
            <h2 className={formStyles.sectionTitle}>{cardTitle}</h2>
            <ScaleSectionActionButtons {...actionButtonsProps} />
          </div>
        </div>
      ) : (
        <section className={formStyles.section} aria-label={cardTitle}>
          <div className={formStyles.sectionCardHeader}>
            <h2 className={formStyles.sectionTitle}>{cardTitle}</h2>
            <ScaleSectionActionButtons
              {...actionButtonsProps}
              showMinimize
              actionClassName={formStyles.expandedSectionActions}
            />
          </div>

          <div className={formStyles.fieldStack}>
            <div className={formStyles.twoColumnRow}>
              <Input
                id={`${fieldIdPrefix}-name`}
                name={`${fieldIdPrefix}-name`}
                label={deedsLabel.NAME}
                ariaLabel={deedsLabel.NAME}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                readOnly
                width="100%"
                value={item.name.trim() || deedsPlaceholder.EMPTY}
              />
              <Input
                id={`${fieldIdPrefix}-display-order`}
                name={`${fieldIdPrefix}-display-order`}
                label={deedsLabel.DISPLAY_ORDER}
                ariaLabel={deedsLabel.DISPLAY_ORDER}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                readOnly
                width="100%"
                value={String(item.display_order)}
              />
            </div>

            <div className={styles.descriptionField}>
              <span className={formStyles.fieldLabel}>{deedsLabel.DESCRIPTION}</span>
              <p className={styles.readOnlyValue}>
                {item.description?.trim() || deedsPlaceholder.EMPTY}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ScaleDetail() {
  const params = useParams<{ deedItemId: string }>();
  const deedItemId = params.deedItemId;
  const { data: scaleItems = [], isLoading, isError, isFetched } = useScaleItems(deedItemId);
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!isFetched && isLoading) {
    return <DeedItemsTableSkeleton />;
  }

  if (isError) {
    return <p className={styles.message}>{deedsMessage.FETCH_FAILED}</p>;
  }

  if (!scaleItems.length) {
    return <p className={styles.message}>{deedsMessage.DEED_NOT_FOUND}</p>;
  }

  const handleEdit = (index: number) => {
    setExpandedIndex(index);
  };

  const handleMinimize = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    void index;
    void direction;
  };

  const handleDelete = (index: number) => {
    void index;
  };

  const handleAdd = (index: number) => {
    void index;
  };

  return (
    <div className={styles.page}>
      {scaleItems.map((item, index) => (
        <ScaleDetailItemSection
          key={item.scale_item_id || String(index)}
          item={item}
          index={index}
          itemCount={scaleItems.length}
          expandedIndex={expandedIndex}
          onEdit={handleEdit}
          onMinimize={handleMinimize}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onMoveUp={(itemIndex) => handleMove(itemIndex, "up")}
          onMoveDown={(itemIndex) => handleMove(itemIndex, "down")}
        />
      ))}

      <div className={formStyles.addSubDeedRow}>
        <span className={formStyles.fieldLabel}>{addScaleItemQuestion}</span>
        <DeedCircleAddButton
          ariaLabel={addScaleItemTooltip}
          tooltip={addScaleItemTooltip}
          onClick={() => handleAdd(scaleItems.length - 1)}
        />
      </div>
    </div>
  );
}

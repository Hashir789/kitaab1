"use client";

import { useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { HiMinus, HiPencil } from "react-icons/hi";
import { MdAdd, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Input from "@/components/secondary/input/Input";
import TextArea from "@/components/secondary/textarea/TextArea";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import DeedCircleAddButton from "@/components/secondary/deedaddfab/DeedCircleAddButton";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { deedFormLevel, iconState } from "@/constants/enums";
import {
  deedsAria,
  deedsButtonLabel,
  deedsLabel,
  deedsPlaceholder,
} from "@/constants/placeholders";
import type { DecryptedDeedItem, DeedFormPath } from "@/interfaces/deeds";
import {
  canAddChildDeed,
  canMoveDeedDown,
  canMoveDeedUp,
  getDeedFormLevel,
  pathToFieldKey,
} from "@/utils/deedForm";
import {
  validateDeedDescription,
  validateDeedName,
  validateDeedNameUniquenessAmongNames,
  validateDeedNameUniquenessAmongSiblings,
} from "@/utils/deedFormValidation";
import { formatDeedCreatedAt, formatDeedHideType, deedVisibilityOptions } from "@/utils/deeds";
import formStyles from "../new/newdeedform.module.css";
import styles from "./deeddetail.module.css";

type DeedDetailSectionProps = {
  item: DecryptedDeedItem;
  path: DeedFormPath;
  parentName?: string;
  siblingCount: number;
  siblings?: DecryptedDeedItem[];
  existingRootSiblingNames?: string[];
  expandedPathKey: string;
  editingPathKey: string;
  isSaving?: boolean;
  onEdit: (path: DeedFormPath) => void;
  onMinimize: (path: DeedFormPath) => void;
  onDelete: (path: DeedFormPath) => void;
  onAddChild: (path: DeedFormPath) => void;
  onChange: (
    path: DeedFormPath,
    updater: (current: DecryptedDeedItem) => DecryptedDeedItem
  ) => void;
  onMoveUp: (path: DeedFormPath) => void;
  onMoveDown: (path: DeedFormPath) => void;
  showMeasurementType?: boolean;
  measurementTypeLabel?: string;
};

type TouchedFields = {
  name: boolean;
  description: boolean;
};

const sectionActionButtonSize = 25;
const sectionActionButtonGap = 6;
const sectionActionButtonPadding = 4;
const addSubDeedQuestion = deedsLabel.ADD_SUB_DEED_QUESTION;
const addSubDeedTooltip = deedsAria.ADD_SUB_DEED;

const visibilityButtonGroupHeight = 47;

function getFieldIconState(
  value: string,
  validationError?: string,
  showError = false
): iconState | undefined {
  if (showError && validationError) {
    return iconState.ERROR;
  }

  if (!value.trim()) {
    return undefined;
  }

  if (!validationError) {
    return iconState.SUCCESS;
  }

  return undefined;
}

function getCollapsedCardFallback(path: DeedFormPath): string {
  if (path.length === 0) {
    return deedsLabel.DEED;
  }

  if (path.length === 1) {
    return deedsLabel.SUB_DEED;
  }

  return deedsLabel.SUB_SUB_DEED;
}

function getCardTitle(item: DecryptedDeedItem, path: DeedFormPath): string {
  if (item.name.trim()) {
    return item.name.trim();
  }

  return getCollapsedCardFallback(path);
}

function ExpandedSectionHeading({
  level,
  parentName,
  itemName,
}: {
  level: deedFormLevel;
  parentName?: string;
  itemName: string;
}) {
  if (level === deedFormLevel.ROOT) {
    return <span>{itemName.trim() || deedsLabel.DEED}</span>;
  }

  return (
    <span className={formStyles.sectionTitlePrompt}>
      <span>{parentName || deedsPlaceholder.NAME}</span>
      <FaGreaterThan className={formStyles.addChildSeparator} aria-hidden="true" />
      <span>{itemName.trim() || deedsLabel.SUB_DEED}</span>
    </span>
  );
}

type SectionActionButtonsProps = {
  path: DeedFormPath;
  isRootDeed: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  showAddChildAction: boolean;
  canAddSubDeed: boolean;
  showMinimize?: boolean;
  isSaving?: boolean;
  onEdit: (path: DeedFormPath) => void;
  onMinimize: (path: DeedFormPath) => void;
  onDelete: (path: DeedFormPath) => void;
  onAddChild: (path: DeedFormPath) => void;
  onMoveUp: (path: DeedFormPath) => void;
  onMoveDown: (path: DeedFormPath) => void;
  actionClassName?: string;
};

function SectionActionButtons({
  path,
  isRootDeed,
  canMoveUp,
  canMoveDown,
  showAddChildAction,
  canAddSubDeed,
  showMinimize = false,
  isSaving = false,
  onEdit,
  onMinimize,
  onDelete,
  onAddChild,
  onMoveUp,
  onMoveDown,
  actionClassName = formStyles.collapsedCardActions,
}: SectionActionButtonsProps) {
  return (
    <div className={formStyles.sectionCardActions}>
      {!isRootDeed ? (
        <ButtonGroup
          className={actionClassName}
          ariaLabel="Deed order actions"
          buttonWidth={sectionActionButtonSize}
          buttonHeight={sectionActionButtonSize}
          gap={sectionActionButtonGap}
          padding={sectionActionButtonPadding}
        >
          <Tooltip text={deedsButtonLabel.MOVE_UP} position="left">
            <button
              type="button"
              onClick={() => onMoveUp(path)}
              disabled={!canMoveUp}
              aria-label={deedsAria.MOVE_DEED_UP}
            >
              <MdKeyboardArrowUp aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip text={deedsButtonLabel.MOVE_DOWN} position="left">
            <button
              type="button"
              onClick={() => onMoveDown(path)}
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
        ariaLabel="Deed actions"
        buttonWidth={sectionActionButtonSize}
        buttonHeight={sectionActionButtonSize}
        gap={sectionActionButtonGap}
        padding={sectionActionButtonPadding}
      >
        <Tooltip text={deedsButtonLabel.EDIT} position="left">
          <button type="button" onClick={() => onEdit(path)} aria-label={deedsAria.EDIT_DEED_SECTION}>
            <HiPencil aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip text={addSubDeedTooltip} position="left">
          <button
            type="button"
            onClick={() => onAddChild(path)}
            disabled={!showAddChildAction || !canAddSubDeed}
            aria-label={addSubDeedTooltip}
          >
            <MdAdd aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip text={deedsButtonLabel.DELETE} position="left">
          <button
            type="button"
            onClick={() => onDelete(path)}
            disabled={isRootDeed}
            aria-label={deedsAria.DELETE_DEED_SECTION}
          >
            <MdDelete aria-hidden="true" />
          </button>
        </Tooltip>
        {showMinimize ? (
              <Tooltip
                text={isSaving ? deedsButtonLabel.SAVING : deedsButtonLabel.MINIMIZE}
                position="left"
              >
                <button
                  type="button"
                  onClick={() => onMinimize(path)}
                  disabled={isSaving}
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

export default function DeedDetailSection({
  item,
  path,
  parentName,
  siblingCount,
  siblings = [],
  existingRootSiblingNames = [],
  expandedPathKey,
  editingPathKey,
  isSaving = false,
  onEdit,
  onMinimize,
  onDelete,
  onAddChild,
  onChange,
  onMoveUp,
  onMoveDown,
  showMeasurementType = false,
  measurementTypeLabel = "",
}: DeedDetailSectionProps) {
  const [touched, setTouched] = useState<TouchedFields>({ name: false, description: false });
  const level = getDeedFormLevel(path);
  const fieldKey = pathToFieldKey(path);
  const fieldIdPrefix = fieldKey === "root" ? "deed-detail-root" : `deed-detail-${fieldKey}`;
  const sectionKey = pathToFieldKey(path);
  const isExpanded = expandedPathKey === sectionKey;
  const isEditing = editingPathKey === sectionKey;
  const isRootDeed = path.length === 0;
  const baseNameError = validateDeedName(item.name);
  const duplicateNameError = !baseNameError
    ? isRootDeed
      ? validateDeedNameUniquenessAmongNames(item.name, existingRootSiblingNames)
      : validateDeedNameUniquenessAmongSiblings(
          item.name,
          siblings.map((sibling) => ({ id: sibling.deed_item_id, name: sibling.name })),
          item.deed_item_id
        )
    : undefined;
  const nameValidationError = baseNameError ?? duplicateNameError;
  const descriptionValidationError = validateDeedDescription(item.description ?? "");
  const showNameError =
    !!nameValidationError && (touched.name || Boolean(duplicateNameError));
  const showDescriptionError = touched.description && !!descriptionValidationError;
  const canAddSubDeed = !validateDeedName(item.name) && !duplicateNameError;
  const cardTitle = getCardTitle(item, path);
  const canMoveUp = canMoveDeedUp(path);
  const canMoveDown = canMoveDeedDown(path, siblingCount);
  const showAddChildAction = canAddChildDeed(path);
  const children = item.children ?? [];
  const visibilityActiveIndex = deedVisibilityOptions.findIndex(
    (option) => option.value === item.hide_type
  );

  const collapsedNestClass =
    path.length >= 2
      ? formStyles.collapsedCardSubSub
      : path.length === 1
        ? formStyles.collapsedCardSub
        : "";

  const actionButtonsProps = {
    path,
    isRootDeed,
    canMoveUp,
    canMoveDown,
    showAddChildAction,
    canAddSubDeed,
    onEdit,
    onMinimize,
    onDelete,
    onAddChild,
    onMoveUp,
    onMoveDown,
  };

  return (
    <div className={formStyles.sectionWrap}>
      {!isExpanded ? (
        <div
          className={`${formStyles.collapsedCard} ${collapsedNestClass}`}
          aria-label={cardTitle}
        >
          <div className={formStyles.sectionCardHeader}>
            <h2 className={formStyles.sectionTitle}>{cardTitle}</h2>
            <SectionActionButtons {...actionButtonsProps} />
          </div>
        </div>
      ) : (
        <section
          className={`${formStyles.section} ${path.length > 0 ? formStyles.sectionNested : ""}`}
          aria-label={cardTitle}
        >
          <div className={formStyles.sectionCardHeader}>
            <h2 className={formStyles.sectionTitle}>
              <ExpandedSectionHeading
                level={level}
                parentName={parentName}
                itemName={item.name}
              />
            </h2>
            <SectionActionButtons
              {...actionButtonsProps}
              showMinimize
              isSaving={isSaving}
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
                placeholder={isEditing ? deedsPlaceholder.NAME : deedsPlaceholder.EMPTY}
                inputType="text"
                readOnly={!isEditing}
                width="100%"
                value={isEditing ? item.name : item.name.trim() || deedsPlaceholder.EMPTY}
                helperText={isEditing && showNameError ? nameValidationError : undefined}
                iconState={
                  isEditing
                    ? getFieldIconState(item.name, nameValidationError, showNameError)
                    : undefined
                }
                onBlur={
                  isEditing
                    ? () => setTouched((current) => ({ ...current, name: true }))
                    : undefined
                }
                onChange={
                  isEditing
                    ? (event) =>
                        onChange(path, (current) => ({ ...current, name: event.target.value }))
                    : undefined
                }
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

            {isEditing ? (
              <TextArea
                id={`${fieldIdPrefix}-description`}
                name={`${fieldIdPrefix}-description`}
                label={deedsLabel.DESCRIPTION}
                ariaLabel={deedsLabel.DESCRIPTION}
                placeholder={deedsPlaceholder.DESCRIPTION}
                width="100%"
                rows={4}
                value={item.description ?? ""}
                helperText={showDescriptionError ? descriptionValidationError : undefined}
                iconState={getFieldIconState(
                  item.description ?? "",
                  descriptionValidationError,
                  showDescriptionError
                )}
                onBlur={() => setTouched((current) => ({ ...current, description: true }))}
                onChange={(event) =>
                  onChange(path, (current) => ({ ...current, description: event.target.value }))
                }
              />
            ) : (
              <div className={styles.descriptionField}>
                <span className={formStyles.fieldLabel}>{deedsLabel.DESCRIPTION}</span>
                <p className={styles.readOnlyValue}>
                  {item.description?.trim() || deedsPlaceholder.EMPTY}
                </p>
              </div>
            )}

            <div className={formStyles.twoColumnRow}>
              {isEditing ? (
                <div className={formStyles.fieldBlock}>
                  <span className={formStyles.fieldLabel}>{deedsLabel.VISIBILITY}</span>
                  <ButtonGroup
                    className={formStyles.visibilityGroup}
                    ariaLabel={deedsLabel.VISIBILITY}
                    activeIndex={visibilityActiveIndex}
                    buttonHeight={35}
                    gap={8}
                    padding={5}
                    fullWidth
                    truncateLabels
                    tooltipPosition="top"
                  >
                    {deedVisibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          onChange(path, (current) => ({
                            ...current,
                            hide_type: option.value,
                          }))
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </ButtonGroup>
                </div>
              ) : (
                <Input
                  id={`${fieldIdPrefix}-visibility`}
                  name={`${fieldIdPrefix}-visibility`}
                  label={deedsLabel.VISIBILITY}
                  ariaLabel={deedsLabel.VISIBILITY}
                  placeholder={deedsPlaceholder.EMPTY}
                  inputType="text"
                  readOnly
                  width="100%"
                  value={formatDeedHideType(item.hide_type)}
                />
              )}
              <Input
                id={`${fieldIdPrefix}-created-at`}
                name={`${fieldIdPrefix}-created-at`}
                label={deedsLabel.CREATED_AT}
                ariaLabel={deedsLabel.CREATED_AT}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                readOnly
                width="100%"
                height={isEditing ? visibilityButtonGroupHeight : undefined}
                value={formatDeedCreatedAt(item.created_at)}
              />
            </div>
          </div>

          {showMeasurementType ? (
            <div className={formStyles.twoColumnRow}>
              <Input
                id={`${fieldIdPrefix}-measurement-type`}
                name={`${fieldIdPrefix}-measurement-type`}
                label={deedsLabel.MEASUREMENT_TYPE}
                ariaLabel={deedsLabel.MEASUREMENT_TYPE}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                readOnly
                width="100%"
                value={measurementTypeLabel}
              />
              {showAddChildAction ? (
                <div className={formStyles.addSubDeedAction}>
                  <span className={formStyles.fieldLabel}>{addSubDeedQuestion}</span>
                  <DeedCircleAddButton
                    ariaLabel={addSubDeedTooltip}
                    tooltip={addSubDeedTooltip}
                    disabled={!canAddSubDeed || isSaving}
                    onClick={() => onAddChild(path)}
                  />
                </div>
              ) : (
                <div />
              )}
            </div>
          ) : showAddChildAction ? (
            <div className={formStyles.addSubDeedRow}>
              <span className={formStyles.fieldLabel}>{addSubDeedQuestion}</span>
              <DeedCircleAddButton
                ariaLabel={addSubDeedTooltip}
                tooltip={addSubDeedTooltip}
                disabled={!canAddSubDeed || isSaving}
                onClick={() => onAddChild(path)}
              />
            </div>
          ) : null}
        </section>
      )}

      {children.length > 0 ? (
        <div className={formStyles.childrenStack}>
          {children.map((child, index) => {
            const childPath = [...path, index];

            return (
              <DeedDetailSection
                key={child.deed_item_id}
                item={child}
                path={childPath}
                siblingCount={children.length}
                siblings={children}
                parentName={item.name.trim() || deedsPlaceholder.NAME}
                existingRootSiblingNames={existingRootSiblingNames}
                expandedPathKey={expandedPathKey}
                editingPathKey={editingPathKey}
                isSaving={isSaving}
                onEdit={onEdit}
                onMinimize={onMinimize}
                onDelete={onDelete}
                onAddChild={onAddChild}
                onChange={onChange}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

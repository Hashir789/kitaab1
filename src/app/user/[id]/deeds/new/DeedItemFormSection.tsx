"use client";

import { useMemo, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { HiMinus, HiPencil } from "react-icons/hi";
import { MdAdd, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Input from "@/components/secondary/input/Input";
import TextArea from "@/components/secondary/textarea/TextArea";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import DeedCircleAddButton from "@/components/secondary/deedaddfab/DeedCircleAddButton";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { deedFormLevel, deedType, iconState } from "@/constants/enums";
import {
  deedsAria,
  deedsButtonLabel,
  deedsFormCategoryType,
  deedsLabel,
  deedsPlaceholder,
} from "@/constants/placeholders";
import type { DeedFormItem, DeedFormPath } from "@/interfaces/deeds";
import {
  canAddChildDeed,
  canMoveDeedDown,
  canMoveDeedUp,
  getDeedFormLevel,
  isDeedFormItemContentEmpty,
  pathToFieldKey,
} from "@/utils/deedForm";
import {
  canAddChildDeedToItem,
  validateDeedDescription,
  validateDeedName,
  validateDeedNameUniquenessAmongNames,
  validateDeedNameUniquenessAmongSiblings,
} from "@/utils/deedFormValidation";
import { formatDeedFormCreatedAt, deedCategoryTypeOptions, deedMeasurementTypeOptions, deedVisibilityOptions } from "@/utils/deeds";
import styles from "./newdeedform.module.css";

function formatCategoryTypeLabel(type: deedType): string {
  return (
    deedCategoryTypeOptions.find((option) => option.value === type)?.label ??
    deedsFormCategoryType.HASANAAT
  );
}

type DeedItemFormSectionProps = {
  item: DeedFormItem;
  path: DeedFormPath;
  displayOrderMax: number;
  siblingCount?: number;
  siblings?: DeedFormItem[];
  existingRootSiblingNames?: string[];
  parentDeedName?: string;
  expandedPathKey: string;
  errors: Record<string, string>;
  onChange: (path: DeedFormPath, updater: (current: DeedFormItem) => DeedFormItem) => void;
  onAddChild: (path: DeedFormPath) => void;
  onEdit: (path: DeedFormPath) => void;
  onDelete: (path: DeedFormPath) => void;
  onMinimize: (path: DeedFormPath) => void;
  onMoveUp: (path: DeedFormPath) => void;
  onMoveDown: (path: DeedFormPath) => void;
};

type TouchedFields = {
  name: boolean;
  description: boolean;
};

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

function getDeedNameLabel(name: string, fallback: string): string {
  return name.length > 0 ? name : fallback;
}

function getCollapsedCardFallback(path: DeedFormPath): string {
  if (path.length === 0) {
    return deedsLabel.NEW_DEED;
  }

  if (path.length === 1) {
    return deedsLabel.SUB_DEED;
  }

  return deedsLabel.SUB_SUB_DEED;
}

function getCardTitle(item: DeedFormItem, path: DeedFormPath): string {
  return getDeedNameLabel(item.name, getCollapsedCardFallback(path));
}

function ExpandedSectionHeading({
  level,
  parentDeedName,
  itemName,
}: {
  level: deedFormLevel;
  parentDeedName?: string;
  itemName: string;
}) {
  if (level === deedFormLevel.ROOT) {
    return <span>{getDeedNameLabel(itemName, deedsLabel.NEW_DEED)}</span>;
  }

  return (
    <span className={styles.sectionTitlePrompt}>
      <span>{parentDeedName || deedsPlaceholder.NAME}</span>
      <FaGreaterThan className={styles.addChildSeparator} aria-hidden="true" />
      <span>{getDeedNameLabel(itemName, deedsLabel.NEW_DEED)}</span>
    </span>
  );
}

const sectionActionButtonSize = 25;
const sectionActionButtonGap = 6;
const sectionActionButtonPadding = 4;

export default function DeedItemFormSection({
  item,
  path,
  displayOrderMax,
  siblingCount = 1,
  siblings = [],
  existingRootSiblingNames = [],
  parentDeedName,
  expandedPathKey,
  errors,
  onChange,
  onAddChild,
  onEdit,
  onDelete,
  onMinimize,
  onMoveUp,
  onMoveDown,
}: DeedItemFormSectionProps) {
  const [touched, setTouched] = useState<TouchedFields>({ name: false, description: false });
  const level = getDeedFormLevel(path);
  const fieldKey = pathToFieldKey(path);
  const fieldIdPrefix = fieldKey === "root" ? "root" : `deed-${fieldKey}`;
  const createdAtLabel = useMemo(() => formatDeedFormCreatedAt(new Date()), []);
  const visibilityActiveIndex = deedVisibilityOptions.findIndex(
    (option) => option.value === item.visibility
  );
  const categoryTypeLabel = formatCategoryTypeLabel(item.categoryType);
  const measurementTypeActiveIndex = deedMeasurementTypeOptions.findIndex(
    (option) => option.value === item.measurementType
  );

  const baseNameError = validateDeedName(item.name);
  const duplicateNameError = !baseNameError
    ? path.length === 0
      ? validateDeedNameUniquenessAmongNames(item.name, existingRootSiblingNames)
      : validateDeedNameUniquenessAmongSiblings(item.name, siblings, item.id)
    : undefined;
  const nameValidationError = baseNameError ?? duplicateNameError;
  const descriptionValidationError = validateDeedDescription(item.description);
  const nameTouched = touched.name || Boolean(errors[`${fieldKey}-name`]);
  const descriptionTouched =
    touched.description || Boolean(errors[`${fieldKey}-description`]);
  const showNameError =
    !!nameValidationError &&
    (nameTouched || Boolean(errors[`${fieldKey}-name`]) || Boolean(duplicateNameError));
  const showDescriptionError = descriptionTouched && !!descriptionValidationError;
  const canAddSubDeed = canAddChildDeedToItem(item) && !duplicateNameError;
  const sectionKey = pathToFieldKey(path);
  const isExpanded = expandedPathKey === sectionKey;
  const cardTitle = getCardTitle(item, path);
  const sectionAriaLabel = cardTitle;
  const showAddChildAction = canAddChildDeed(path);
  const isRootDeed = path.length === 0;
  const canMoveUp = canMoveDeedUp(path);
  const canMoveDown = canMoveDeedDown(path, siblingCount);

  const collapsedNestClass =
    path.length >= 2
      ? styles.collapsedCardSubSub
      : path.length === 1
        ? styles.collapsedCardSub
        : "";

  return (
    <div className={styles.sectionWrap}>
      {!isExpanded ? (
        <div
          className={`${styles.collapsedCard} ${collapsedNestClass}`}
          aria-label={sectionAriaLabel}
        >
          <div className={styles.sectionCardHeader}>
            <h2 className={styles.sectionTitle}>{cardTitle}</h2>
            <div className={styles.sectionCardActions}>
              {!isRootDeed ? (
                <ButtonGroup
                  className={styles.collapsedCardActions}
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
                className={styles.collapsedCardActions}
                ariaLabel="Deed actions"
                buttonWidth={sectionActionButtonSize}
                buttonHeight={sectionActionButtonSize}
                gap={sectionActionButtonGap}
                padding={sectionActionButtonPadding}
              >
              <Tooltip text={deedsButtonLabel.EDIT} position="left">
                <button
                  type="button"
                  onClick={() => onEdit(path)}
                  aria-label={deedsAria.EDIT_DEED_SECTION}
                >
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
            </ButtonGroup>
            </div>
          </div>
        </div>
      ) : (
        <section
          className={`${styles.section} ${path.length > 0 ? styles.sectionNested : ""}`}
          aria-label={sectionAriaLabel}
        >
          <div className={styles.sectionCardHeader}>
            <h2 className={styles.sectionTitle}>
              <ExpandedSectionHeading
                level={level}
                parentDeedName={parentDeedName}
                itemName={item.name}
              />
            </h2>
            <ButtonGroup
              className={styles.expandedSectionActions}
              ariaLabel="Deed section actions"
              buttonWidth={sectionActionButtonSize}
              buttonHeight={sectionActionButtonSize}
              gap={sectionActionButtonGap}
              padding={sectionActionButtonPadding}
            >
              <Tooltip text={deedsButtonLabel.MINIMIZE} position="left">
                <button
                  type="button"
                  onClick={() => onMinimize(path)}
                  aria-label={deedsAria.MINIMIZE_DEED_SECTION}
                >
                  <HiMinus aria-hidden="true" />
                </button>
              </Tooltip>
            </ButtonGroup>
          </div>

          <div className={styles.fieldStack}>
            <div className={styles.twoColumnRow}>
              <Input
                id={`${fieldIdPrefix}-name`}
                name={`${fieldIdPrefix}-name`}
                label={deedsLabel.NAME}
                ariaLabel={deedsLabel.NAME}
                placeholder={deedsPlaceholder.NAME}
                inputType="text"
                required
                width="100%"
                value={item.name}
                helperText={showNameError ? nameValidationError : undefined}
                iconState={getFieldIconState(item.name, nameValidationError, showNameError)}
                onBlur={() => setTouched((current) => ({ ...current, name: true }))}
                onChange={(event) =>
                  onChange(path, (current) => ({ ...current, name: event.target.value }))
                }
              />

              <Input
                id={`${fieldIdPrefix}-category-type`}
                name={`${fieldIdPrefix}-category-type`}
                label={deedsLabel.CATEGORY_TYPE}
                ariaLabel={deedsLabel.CATEGORY_TYPE}
                placeholder={categoryTypeLabel}
                inputType="text"
                required
                readOnly
                width="100%"
                value={categoryTypeLabel}
              />
            </div>

            <div className={styles.twoColumnRow}>
              <Input
                id={`${fieldIdPrefix}-parent-id`}
                name={`${fieldIdPrefix}-parent-id`}
                label={deedsLabel.PARENT_ID}
                ariaLabel={deedsLabel.PARENT_ID}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                required
                readOnly
                width="100%"
                value={deedsPlaceholder.EMPTY}
              />

              <Input
                id={`${fieldIdPrefix}-display-order`}
                name={`${fieldIdPrefix}-display-order`}
                label={deedsLabel.DISPLAY_ORDER}
                ariaLabel={deedsLabel.DISPLAY_ORDER}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                required
                readOnly
                width="100%"
                value={String(item.displayOrder)}
              />
            </div>

            <TextArea
              id={`${fieldIdPrefix}-description`}
              name={`${fieldIdPrefix}-description`}
              label={deedsLabel.DESCRIPTION}
              ariaLabel={deedsLabel.DESCRIPTION}
              placeholder={deedsPlaceholder.DESCRIPTION}
              width="100%"
              rows={4}
              value={item.description}
              helperText={showDescriptionError ? descriptionValidationError : undefined}
              iconState={getFieldIconState(
                item.description,
                descriptionValidationError,
                showDescriptionError
              )}
              onBlur={() => setTouched((current) => ({ ...current, description: true }))}
              onChange={(event) =>
                onChange(path, (current) => ({ ...current, description: event.target.value }))
              }
            />

            <div className={styles.twoColumnRow}>
              <div className={styles.fieldBlock}>
                <span className={styles.fieldLabel}>
                  {deedsLabel.VISIBILITY}
                  <span className={styles.requiredMark}>*</span>
                </span>
                <ButtonGroup
                  className={styles.visibilityGroup}
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
                          visibility: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </ButtonGroup>
              </div>

              <Input
                id={`${fieldIdPrefix}-created-at`}
                name={`${fieldIdPrefix}-created-at`}
                label={deedsLabel.CREATED_AT}
                ariaLabel={deedsLabel.CREATED_AT}
                placeholder={deedsPlaceholder.EMPTY}
                inputType="text"
                required
                readOnly
                width="100%"
                height={visibilityButtonGroupHeight}
                value={createdAtLabel}
              />
            </div>
          </div>

          {isRootDeed ? (
            <div className={styles.twoColumnRow}>
              <div className={styles.fieldBlock}>
                <span className={styles.fieldLabel}>
                  {deedsLabel.MEASUREMENT_TYPE}
                  <span className={styles.requiredMark}>*</span>
                </span>
                <ButtonGroup
                  className={styles.visibilityGroup}
                  ariaLabel={deedsLabel.MEASUREMENT_TYPE}
                  activeIndex={measurementTypeActiveIndex}
                  buttonHeight={35}
                  gap={8}
                  padding={5}
                  fullWidth
                  truncateLabels
                  tooltipPosition="top"
                >
                  {deedMeasurementTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        onChange(path, (current) => ({
                          ...current,
                          measurementType: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </ButtonGroup>
              </div>
              {canAddChildDeed(path) ? (
                <div className={styles.addSubDeedAction}>
                  <span className={styles.fieldLabel}>{addSubDeedQuestion}</span>
                  <DeedCircleAddButton
                    ariaLabel={addSubDeedTooltip}
                    tooltip={addSubDeedTooltip}
                    disabled={!canAddSubDeed}
                    onClick={() => onAddChild(path)}
                  />
                </div>
              ) : (
                <div />
              )}
            </div>
          ) : canAddChildDeed(path) ? (
            <div className={styles.addSubDeedRow}>
              <span className={styles.fieldLabel}>{addSubDeedQuestion}</span>
              <DeedCircleAddButton
                ariaLabel={addSubDeedTooltip}
                tooltip={addSubDeedTooltip}
                disabled={!canAddSubDeed}
                onClick={() => onAddChild(path)}
              />
            </div>
          ) : null}
        </section>
      )}

      {item.children.length > 0 ? (
        <div className={styles.childrenStack}>
          {item.children.map((child, index) => {
            const childPath = [...path, index];
            const childKey = pathToFieldKey(childPath);
            const isChildExpanded = expandedPathKey === childKey;

            if (!isChildExpanded && isDeedFormItemContentEmpty(child)) {
              return null;
            }

            return (
              <DeedItemFormSection
                key={child.id}
                item={child}
                path={childPath}
                displayOrderMax={Math.max(1, item.children.length)}
                siblingCount={item.children.length}
                siblings={item.children}
                parentDeedName={item.name.trim() || deedsPlaceholder.NAME}
                expandedPathKey={expandedPathKey}
                errors={errors}
                onChange={onChange}
                onAddChild={onAddChild}
                onEdit={onEdit}
                onDelete={onDelete}
                onMinimize={onMinimize}
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

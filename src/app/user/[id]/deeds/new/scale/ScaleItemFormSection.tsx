"use client";

import { useState } from "react";
import { HiMinus, HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import Input from "@/components/secondary/input/Input";
import TextArea from "@/components/secondary/textarea/TextArea";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import { iconState } from "@/constants/enums";
import { deedsButtonLabel, deedsLabel, deedsPlaceholder, scaleLabel } from "@/constants/placeholders";
import type { ScaleFormItem } from "@/interfaces/scales";
import {
  validateDeedDescription,
  validateDeedName,
  validateDeedNameUniquenessAmongSiblings,
} from "@/utils/deedFormValidation";
import styles from "../newdeedform.module.css";

type ScaleItemFormSectionProps = {
  item: ScaleFormItem;
  index: number;
  itemCount: number;
  siblings: ScaleFormItem[];
  expandedIndex: number;
  errors: Record<string, string>;
  onChange: (index: number, updater: (current: ScaleFormItem) => ScaleFormItem) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMinimize: (index: number) => void;
};

type TouchedFields = {
  name: boolean;
  description: boolean;
};

const sectionActionButtonSize = 25;
const sectionActionButtonGap = 6;
const sectionActionButtonPadding = 4;

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

function getCardTitle(item: ScaleFormItem, index: number): string {
  if (item.name.trim()) {
    return item.name.trim();
  }

  return index === 0 ? scaleLabel.SCALE_ITEM : scaleLabel.NEW_SCALE_ITEM;
}

export default function ScaleItemFormSection({
  item,
  index,
  itemCount,
  siblings,
  expandedIndex,
  errors,
  onChange,
  onEdit,
  onDelete,
  onMinimize,
}: ScaleItemFormSectionProps) {
  const [touched, setTouched] = useState<TouchedFields>({ name: false, description: false });
  const fieldKey = String(index);
  const fieldIdPrefix = `scale-${fieldKey}`;
  const isExpanded = expandedIndex === index;
  const cardTitle = getCardTitle(item, index);
  const canDelete = itemCount > 1;

  const baseNameError = validateDeedName(item.name);
  const duplicateNameError = !baseNameError
    ? validateDeedNameUniquenessAmongSiblings(
        item.name,
        siblings.map((entry) => ({ id: entry.id, name: entry.name })),
        item.id
      )
    : undefined;
  const nameValidationError = baseNameError ?? duplicateNameError;
  const descriptionValidationError = validateDeedDescription(item.description);
  const nameTouched = touched.name || Boolean(errors[`${fieldKey}-name`]);
  const descriptionTouched = touched.description || Boolean(errors[`${fieldKey}-description`]);
  const showNameError =
    !!nameValidationError &&
    (nameTouched || Boolean(errors[`${fieldKey}-name`]) || Boolean(duplicateNameError));
  const showDescriptionError = descriptionTouched && !!descriptionValidationError;

  return (
    <div className={styles.sectionWrap}>
      {!isExpanded ? (
        <div className={styles.collapsedCard} aria-label={cardTitle}>
          <div className={styles.sectionCardHeader}>
            <h2 className={styles.sectionTitle}>{cardTitle}</h2>
            <ButtonGroup
              className={styles.collapsedCardActions}
              ariaLabel="Scale item actions"
              buttonWidth={sectionActionButtonSize}
              buttonHeight={sectionActionButtonSize}
              gap={sectionActionButtonGap}
              padding={sectionActionButtonPadding}
            >
              <Tooltip text={deedsButtonLabel.EDIT} position="left">
                <button type="button" onClick={() => onEdit(index)} aria-label={deedsButtonLabel.EDIT}>
                  <HiPencil aria-hidden="true" />
                </button>
              </Tooltip>
              <Tooltip text={deedsButtonLabel.DELETE} position="left">
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  disabled={!canDelete}
                  aria-label={deedsButtonLabel.DELETE}
                >
                  <MdDelete aria-hidden="true" />
                </button>
              </Tooltip>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <section className={styles.section} aria-label={cardTitle}>
          <div className={styles.sectionCardHeader}>
            <h2 className={styles.sectionTitle}>{cardTitle}</h2>
            <ButtonGroup
              className={styles.expandedSectionActions}
              ariaLabel="Scale item section actions"
              buttonWidth={sectionActionButtonSize}
              buttonHeight={sectionActionButtonSize}
              gap={sectionActionButtonGap}
              padding={sectionActionButtonPadding}
            >
              <Tooltip text={deedsButtonLabel.MINIMIZE} position="left">
                <button type="button" onClick={() => onMinimize(index)} aria-label={deedsButtonLabel.MINIMIZE}>
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
                  onChange(index, (current) => ({ ...current, name: event.target.value }))
                }
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
                onChange(index, (current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}

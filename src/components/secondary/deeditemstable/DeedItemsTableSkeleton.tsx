import Skeleton from "@/components/secondary/skeleton/Skeleton";
import { deedsLabel, deedsMessage } from "@/constants/placeholders";
import styles from "./deeditemstable.module.css";
import skeletonStyles from "./deeditemstableskeleton.module.css";

type DeedItemsTableSkeletonProps = {
  rowCount?: number;
};

export default function DeedItemsTableSkeleton({ rowCount = 5 }: DeedItemsTableSkeletonProps) {
  return (
    <div
      className={styles.tableWrap}
      aria-busy="true"
      aria-live="polite"
      aria-label={deedsMessage.LOADING}
    >
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
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={index}>
              <td>
                <Skeleton variant="text" height={14} width={`${55 + (index % 3) * 12}%`} />
              </td>
              <td>
                <Skeleton variant="text" height={14} width={`${70 + (index % 2) * 10}%`} />
              </td>
              <td className={`${styles.truncate} ${skeletonStyles.createdAtCell}`}>
                <Skeleton
                  variant="text"
                  height={14}
                  width="100%"
                  className={skeletonStyles.createdAtSkeleton}
                />
              </td>
              <td className={styles.actionCell}>
                <div className={skeletonStyles.actionSkeletons}>
                  <Skeleton variant="rect" width={58} height={25} borderRadius={8} />
                  <Skeleton variant="rect" width={58} height={25} borderRadius={8} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

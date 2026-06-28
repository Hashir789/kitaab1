import { deedsLabel, sidebarLabel } from "@/constants/placeholders";



export type BreadcrumbItem = {

  label: string;

  href: string;

  disabled?: boolean;

};



export type BreadcrumbConfig = {

  items: BreadcrumbItem[];

  activeIndex: number;

};



const ROOT_SEGMENT_LABELS: Record<string, string> = {

  deeds: sidebarLabel.DEEDS,

  records: sidebarLabel.RECORDS,

  profile: sidebarLabel.PROFILE,

  scorecards: sidebarLabel.SCORECARDS,

};



type BreadcrumbOptions = {

  hasScales?: boolean;

};



function resolveSegmentLabel(segments: string[], index: number): string | null {

  const segment = segments[index];

  const parent = segments[index - 1];



  if (parent === "deeds" && index === 1) {
    return deedsLabel.DEED_DETAILS;
  }



  if (parent === "new" && segment === "scale") {

    return deedsLabel.SCALE_DETAILS;

  }



  if (parent !== "new" && segment === "scale" && segments[index - 2] === "deeds") {

    return deedsLabel.SCALE_DETAILS;

  }



  return ROOT_SEGMENT_LABELS[segment] ?? null;

}



export function getBreadcrumbConfig(

  pathname: string,

  userId: string,

  options: BreadcrumbOptions = {}

): BreadcrumbConfig {

  const base = `/user/${userId}`;



  if (!pathname.startsWith(base)) {

    return { items: [], activeIndex: -1 };

  }



  const rest = pathname.slice(base.length).replace(/^\//, "");

  const segments = rest ? rest.split("/").filter(Boolean) : [];



  if (segments.length === 0) {

    return { items: [{ label: sidebarLabel.DASHBOARD, href: base }], activeIndex: 0 };

  }



  const items: BreadcrumbItem[] = [];

  let path = base;



  for (let index = 0; index < segments.length; index += 1) {

    path += `/${segments[index]}`;

    const label = resolveSegmentLabel(segments, index);



    if (label) {

      items.push({ label, href: path });

    }

  }



  const isNewDeedPage =

    segments[0] === "deeds" && segments[1] === "new" && segments.length === 2;

  const isNewDeedScalePage =

    segments[0] === "deeds" && segments[1] === "new" && segments[2] === "scale";

  const isDeedDetailPage =

    segments[0] === "deeds" && segments.length === 2 && segments[1] !== "new";

  const isDeedScalePage =

    segments[0] === "deeds" && segments.length === 3 && segments[2] === "scale" && segments[1] !== "new";



  if (isNewDeedPage) {

    items.push({

      label: deedsLabel.SCALE_DETAILS,

      href: `${base}/deeds/new/scale`,

      disabled: true,

    });

    return { items, activeIndex: 1 };

  }



  if (isNewDeedScalePage) {

    items[1] = {

      ...items[1],

      href: `${base}/deeds/new`,

    };



    return { items, activeIndex: 2 };

  }



  if (isDeedDetailPage && items.length > 0) {

    const deedItemId = segments[1];

    items.push({

      label: deedsLabel.SCALE_DETAILS,

      href: `${base}/deeds/${deedItemId}/scale`,

      disabled: !options.hasScales,

    });

    return { items, activeIndex: 1 };

  }



  if (isDeedScalePage && items.length > 0) {

    const deedItemId = segments[1];

    items[1] = {

      ...items[1],

      href: `${base}/deeds/${deedItemId}`,

    };



    return { items, activeIndex: 2 };

  }



  return { items, activeIndex: items.length > 1 ? items.length - 1 : -1 };

}



export function getBreadcrumbItems(pathname: string, userId: string): BreadcrumbItem[] {

  return getBreadcrumbConfig(pathname, userId).items;

}



export function getBreadcrumbButtonWidth(label: string): number {

  return Math.max(88, Math.ceil(label.length * 8.5) + 28);

}



export function getBreadcrumbStripWidth(

  itemCount: number,

  buttonWidth: number,

  gap: number,

  padding: number

): number {

  if (itemCount === 0) {

    return 0;

  }



  return padding * 2 + buttonWidth * itemCount + gap * (itemCount - 1);

}


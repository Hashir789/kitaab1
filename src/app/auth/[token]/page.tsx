import { redirect } from "next/navigation";
import { ResetPasswordRedirectPageProps } from "./page.interface"

export default async function ResetPasswordRedirectPage({
  params,
}: ResetPasswordRedirectPageProps) {
  const { token } = await params;
  redirect(`/auth?token=${encodeURIComponent(token)}`);
}
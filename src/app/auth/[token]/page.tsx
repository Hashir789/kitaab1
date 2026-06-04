import { redirect } from "next/navigation";

interface ResetPasswordRedirectPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordRedirectPage({
  params,
}: ResetPasswordRedirectPageProps) {
  const { token } = await params;
  redirect(`/auth?token=${encodeURIComponent(token)}`);
}
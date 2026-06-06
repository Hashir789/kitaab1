import type { gender } from "@/constants/enums";
import { decryptFullName, unwrapMasterKey } from "@/utils/crypto";
import type { UserMeResponse, UserSession } from "@/interfaces/user";
import { getEmailFromToken, getMasterKey, setMasterKey } from "@/utils/session";

export function formatDobFromIso(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

async function resolveMasterKey(
  data: UserMeResponse,
  password: string | null
): Promise<string | null> {
  const existing = getMasterKey();
  if (existing) return existing;

  if (!password) return null;

  try {
    const masterKey = await unwrapMasterKey(
      password,
      data.key_salt,
      data.key_iv,
      data.encrypted_master_key
    );
    setMasterKey(masterKey);
    return masterKey;
  } catch {
    return null;
  }
}

export async function mapMeToUserSession(
  data: UserMeResponse,
  password: string | null
): Promise<UserSession> {
  const masterKey = await resolveMasterKey(data, password);
  let full_name = "";

  if (masterKey) {
    try {
      full_name = await decryptFullName(masterKey, data.full_name);
    } catch {
      full_name = "";
    }
  }

  return {
    id: data.id,
    email: getEmailFromToken() ?? "",
    full_name,
    gender: data.gender as gender,
    dob: formatDobFromIso(data.dob),
  };
}
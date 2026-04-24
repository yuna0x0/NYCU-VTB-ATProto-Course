import type { Client } from "@atcute/client";
import type { Did } from "@atcute/lexicons";
import type {} from "@atcute/atproto";

// Types come from `pnpm lex:generate` (src/lexicons/types/…). Importing them
// here means our TypeScript types stay in lockstep with the lexicon JSON:
// add a field to profile.json, re-run lex:generate, and the compiler tells
// us everywhere we need to handle it.
import * as LinkinbioLink from "./lexicons/types/com/example/linkinbio/link.js";
import * as LinkinbioProfile from "./lexicons/types/com/example/linkinbio/profile.js";

// NSIDs derived from the generated schemas at runtime. No hardcoded string
// duplication: the only place our collection names live is in the lexicon
// JSON files, and `pnpm lex:generate` wires them through to TypeScript.
export const PROFILE_NSID =
  LinkinbioProfile.mainSchema.object.shape.$type.expected;
export const LINK_NSID = LinkinbioLink.mainSchema.object.shape.$type.expected;

// Profile + Theme come straight from the generated schema. The raw record
// shape includes `$type`; we use `Profile` (without $type) at the app layer
// and re-add $type when writing to the PDS.
export type Theme = LinkinbioProfile.Theme;
export type Profile = Omit<LinkinbioProfile.Main, "$type">;

// A link as it comes out of listRecords: the lexicon record shape plus the
// repo metadata (uri + rkey) that the PDS returns alongside.
export interface LinkRecord extends Omit<LinkinbioLink.Main, "$type"> {
  uri: string;
  rkey: string;
}

// Load the user's profile (singleton record at rkey "self").
// Returns null only when the record genuinely doesn't exist yet.
// Throws on any other error (network, auth, etc.) so callers can react.
export async function getProfile(
  rpc: Client,
  did: Did,
): Promise<Profile | null> {
  const result = await rpc.get("com.atproto.repo.getRecord", {
    params: { repo: did, collection: PROFILE_NSID, rkey: "self" },
  });
  if (result.ok) return result.data.value as unknown as Profile;
  const err = (result.data as { error?: string } | undefined)?.error ?? "";
  // PDSes return "RecordNotFound" for missing records. Anything else (auth
  // failure, 5xx, etc.) is a real error and we rethrow so the UI can decide.
  if (/NotFound|not[\s_]?found/i.test(err)) return null;
  throw new Error(`getProfile failed: ${JSON.stringify(result.data)}`);
}

// Save the profile form (displayName, description, theme). Preserves any
// existing `linkOrder` + original `createdAt`.
export async function putProfile(
  rpc: Client,
  did: Did,
  data: { displayName?: string; description?: string; theme?: Theme },
): Promise<void> {
  const existing = await getProfile(rpc, did);
  const now = new Date().toISOString();
  const record = {
    $type: PROFILE_NSID,
    displayName: data.displayName,
    description: data.description,
    theme: data.theme,
    linkOrder: existing?.linkOrder,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const result = await rpc.post("com.atproto.repo.putRecord", {
    input: { repo: did, collection: PROFILE_NSID, rkey: "self", record },
  });
  if (!result.ok)
    throw new Error(`putProfile failed: ${JSON.stringify(result.data)}`);
}

// Update just the `linkOrder` on the profile. Used by add / delete /
// reorder. Preserves all other profile fields.
export async function setLinkOrder(
  rpc: Client,
  did: Did,
  linkOrder: string[],
): Promise<void> {
  const existing = await getProfile(rpc, did);
  const now = new Date().toISOString();
  const record = {
    $type: PROFILE_NSID,
    displayName: existing?.displayName,
    description: existing?.description,
    theme: existing?.theme,
    linkOrder,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const result = await rpc.post("com.atproto.repo.putRecord", {
    input: { repo: did, collection: PROFILE_NSID, rkey: "self", record },
  });
  if (!result.ok)
    throw new Error(`setLinkOrder failed: ${JSON.stringify(result.data)}`);
}

// List all link records in the user's repo, sorted by the profile's
// `linkOrder` (records not referenced there are appended at the end,
// sorted by createdAt).
export async function listLinks(rpc: Client, did: Did): Promise<LinkRecord[]> {
  const [profile, listResult] = await Promise.all([
    getProfile(rpc, did),
    rpc.get("com.atproto.repo.listRecords", {
      params: { repo: did, collection: LINK_NSID, limit: 100 },
    }),
  ]);
  if (!listResult.ok) return [];

  const records: LinkRecord[] = listResult.data.records.map((r) => {
    const v = r.value as LinkinbioLink.Main;
    return {
      uri: r.uri,
      rkey: r.uri.split("/").pop()!,
      url: v.url,
      title: v.title,
      emoji: v.emoji,
      createdAt: v.createdAt,
    };
  });

  const order = profile?.linkOrder ?? [];
  const byRkey = new Map(records.map((r) => [r.rkey, r]));
  const ordered: LinkRecord[] = [];
  for (const rkey of order) {
    const r = byRkey.get(rkey);
    if (r) {
      ordered.push(r);
      byRkey.delete(rkey);
    }
  }
  // Records not yet in linkOrder (e.g. created directly, pre-migration)
  // are appended in chronological order so they stay visible.
  const rest = [...byRkey.values()].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  return [...ordered, ...rest];
}

// Create a new link record via createRecord (server-assigned tid rkey).
// Returns the new rkey so the caller can append it to profile.linkOrder.
export async function addLink(
  rpc: Client,
  did: Did,
  data: { url: string; title: string; emoji?: string },
): Promise<string> {
  const record = {
    $type: LINK_NSID,
    url: data.url,
    title: data.title,
    emoji: data.emoji,
    createdAt: new Date().toISOString(),
  };
  const result = await rpc.post("com.atproto.repo.createRecord", {
    input: { repo: did, collection: LINK_NSID, record },
  });
  if (!result.ok)
    throw new Error(`addLink failed: ${JSON.stringify(result.data)}`);
  return result.data.uri.split("/").pop()!;
}

// Delete a link record by rkey.
export async function deleteLink(
  rpc: Client,
  did: Did,
  rkey: string,
): Promise<void> {
  const result = await rpc.post("com.atproto.repo.deleteRecord", {
    input: { repo: did, collection: LINK_NSID, rkey },
  });
  if (!result.ok)
    throw new Error(`deleteLink failed: ${JSON.stringify(result.data)}`);
}

// Build a PDSls URL that points at a specific record in the user's repo.
// Handy for "View on PDSls" debug links in the UI.
export function pdslsUrl(did: Did, collection: string, rkey: string): string {
  return `https://pdsls.dev/at://${did}/${collection}/${rkey}`;
}

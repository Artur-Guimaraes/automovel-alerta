import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";
import type { NextFunction, Request, Response } from "express";
import { getJWKSUrl, getIssuer, getProjectUrl, getAnonKey } from "./env";

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
function jwks() {
  if (!JWKS) JWKS = createRemoteJWKSet(new URL(getJWKSUrl()));
  return JWKS;
}

async function validateViaSupabase(token: string) {
  const res = await fetch(`${getProjectUrl()}/auth/v1/user`, {
    headers: {
      apikey: getAnonKey(),
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase /auth/v1/user: ${res.status}`);
  return (await res.json()) as { id?: string; user?: { id?: string } };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ error: "missing token" });

    // debug leve: vê iss/aud/exp (não imprime token)
    try {
      const p = decodeJwt(token);
    } catch {}

    // verificação forte via JWKS
    const { payload } = await jwtVerify(token, jwks(), {
      issuer: getIssuer(),
      audience: "authenticated",
      clockTolerance: 10,
    });
    (req as any).userId = String(payload.sub || "");
    if (!(req as any).userId) throw new Error("no-sub");
    return next();
  } catch (e1: any) {
    // fallback oficial via REST do Supabase (salva o dia)
    try {
      // console.warn("[auth] jwtVerify falhou, tentando fallback REST:", e1?.message);
      const u = await validateViaSupabase(
        (req.headers.authorization || "").replace(/^Bearer\s+/i, "")
      );
      const uid = u?.id || u?.user?.id;
      if (!uid) throw new Error("user id not found in fallback");
      (req as any).userId = String(uid);
      return next();
    } catch (e2) {
      // console.error("[auth] fallback também falhou:", (e2 as any)?.message);
      return res.status(401).json({ error: "invalid token" });
    }
  }
}

import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { authOptions, type SessionWithToken } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = (await getServerSession(authOptions)) as SessionWithToken | null;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const drive = google.drive({ version: "v3", auth });

  try {
    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: "files(id, name, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 50,
    });

    return NextResponse.json({ sheets: res.data.files ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Drive API error:", message);
    return NextResponse.json(
      { error: "Failed to list sheets" },
      { status: 500 }
    );
  }
}

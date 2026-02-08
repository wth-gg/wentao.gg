import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { authOptions, type SessionWithToken } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as SessionWithToken | null;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(request.url);
  const sheetParam = url.searchParams.get("sheet");

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    // Always get spreadsheet metadata for tab names
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: id,
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetNames =
      meta.data.sheets?.map((s) => s.properties?.title ?? "") ?? [];

    // If no sheet specified, return only metadata
    if (!sheetParam) {
      return NextResponse.json({ sheetNames });
    }

    // Fetch data for the requested sheet
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: sheetParam,
    });

    return NextResponse.json({
      sheetNames,
      activeSheet: sheetParam,
      values: data.data.values ?? [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Sheets API error:", message);
    return NextResponse.json(
      { error: "Failed to fetch sheet data" },
      { status: 500 }
    );
  }
}

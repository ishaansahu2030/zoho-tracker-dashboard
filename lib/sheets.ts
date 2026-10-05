import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { ZohoTask } from './types';
import { parseZohoDate, toISODateString, parseHours } from './date-utils';

/**
 * Returns an authenticated Google Sheets client strictly with read-only scope.
 * We guarantee zero mutations or updates to the sheet.
 */
function getSheetsClient() {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  // Check if direct credentials are in environment
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes,
    });
    return google.sheets({ version: 'v4', auth });
  }

  // Look for service_account.json
  const candidatePaths = [
    process.env.SERVICE_ACCOUNT_PATH,
    path.join(process.cwd(), 'service_account.json'),
    path.join(process.cwd(), '..', 'service_account.json'),
    path.join(process.cwd(), '..', '..', 'service_account.json'),
  ].filter(Boolean) as string[];

  let keyFilePath: string | null = null;
  for (const candidate of candidatePaths) {
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved)) {
      keyFilePath = resolved;
      break;
    }
  }

  if (!keyFilePath) {
    throw new Error(
      'Service account credentials not found. Please provide service_account.json or set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes,
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Fetch all task rows from the Google Sheet (Read-Only).
 * Range fetched is Sheet!A2:L.
 */
export async function fetchZohoTasks(): Promise<{ tasks: ZohoTask[]; lastFetchedAt: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'AllTracker';

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID is missing from environment configuration.');
  }

  const sheets = getSheetsClient();
  const range = `${sheetTab}!A2:L`;

  // Exclusively read values using GET
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = response.data.values || [];

  const tasks: ZohoTask[] = rows
    .filter((row) => row && row.length > 0 && (row[1] || row[2] || row[10])) // Filter empty rows
    .map((row) => {
      const sNo = (row[0] || '').toString().trim();
      const projectName = (row[1] || '').toString().trim();
      const taskName = (row[2] || '').toString().trim();
      const userOwner = (row[3] || '').toString().trim();
      const createdBy = (row[4] || '').toString().trim();
      const assignerEmail = (row[5] || '').toString().trim();
      const createdOn = (row[6] || '').toString().trim();
      const taskStartDate = (row[7] || '').toString().trim();
      const assigneeEmail = (row[8] || '').toString().trim();
      const rawHours = (row[9] || '').toString().trim();
      const individualHours = parseHours(rawHours);
      const taskId = (row[10] || '').toString().trim();
      const projectId = (row[11] || '').toString().trim();

      const startDateObj = parseZohoDate(taskStartDate);
      const createdOnDateObj = parseZohoDate(createdOn);

      return {
        sNo,
        projectName: projectName || 'Untitled Project',
        taskName: taskName || 'Untitled Task',
        userOwner: userOwner || 'Unassigned',
        createdBy: createdBy || 'System',
        assignerEmail,
        createdOn,
        taskStartDate,
        assigneeEmail,
        individualHours,
        taskId: taskId || `task-${Math.random().toString(36).substring(2, 9)}`,
        projectId,
        parsedStartDate: toISODateString(startDateObj),
        parsedCreatedOn: toISODateString(createdOnDateObj),
      };
    });

  return {
    tasks,
    lastFetchedAt: new Date().toISOString(),
  };
}

/**
 * Parse Google Drive share URLs for embed and download.
 * Files must be shared as "Anyone with the link" for embed/preview to work.
 */
export function parseGoogleDriveUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();
    let full = trimmed;
    if (!/^https?:\/\//i.test(full)) {
        full = `https://${full}`;
    }

    if (!/google\.com/i.test(full)) {
        return null;
    }

    let fileId = null;
    let isFolder = false;

    const folderMatch = full.match(/\/folders\/([a-zA-Z0-9_-]+)/i);
    const fileMatch = full.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
    const docMatch = full.match(/\/document\/d\/([a-zA-Z0-9_-]+)/i);
    const sheetMatch = full.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
    const openMatch = full.match(/[?&]id=([a-zA-Z0-9_-]+)/i);

    if (folderMatch) {
        fileId = folderMatch[1];
        isFolder = true;
    } else if (fileMatch) {
        fileId = fileMatch[1];
    } else if (docMatch) {
        fileId = docMatch[1];
    } else if (sheetMatch) {
        fileId = sheetMatch[1];
    } else if (openMatch) {
        fileId = openMatch[1];
    }

    if (!fileId) {
        return null;
    }

    if (isFolder) {
        return {
            fileId,
            isFolder: true,
            embedUrl: `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`,
            downloadUrl: `https://drive.google.com/drive/folders/${fileId}`,
            viewUrl: full,
        };
    }

    return {
        fileId,
        isFolder: false,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        viewUrl: full.includes('/view') || full.includes('/preview')
            ? full
            : `https://drive.google.com/file/d/${fileId}/view`,
    };
}

export function isValidGoogleDriveUrl(url) {
    return parseGoogleDriveUrl(url) !== null;
}

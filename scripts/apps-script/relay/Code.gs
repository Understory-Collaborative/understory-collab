/**
 * UC Blog relay: a standalone Apps Script, deployed once as a web app.
 *
 * The "UC Blog" menu in each post Doc calls this web app, and this web app starts the
 * "Blog sync from Google Drive" GitHub Action. The GitHub token lives only here, in
 * Script Properties, so it never travels inside a blog Doc.
 *
 * It does two things:
 *   preview  starts the sync for a Doc in Drafts or Published
 *   publish  moves a Doc from Drafts to Published, then starts the sync
 *
 * It refuses any Doc that isn't in one of the two blog folders, and it starts at most
 * one sync every 30 seconds, so a stray call can't do more than run the sync.
 *
 * Script Properties (Project Settings → Script properties):
 *   GITHUB_TOKEN               fine-grained token, this repo only, Actions: read and write
 *   DRIVE_DRAFTS_FOLDER_ID     same value as the GitHub variable of the same name
 *   DRIVE_PUBLISHED_FOLDER_ID  same value as the GitHub variable of the same name
 *
 * Setup steps: docs/blog-pipeline-setup.md, "Run the sync from the Doc".
 */

var REPO = 'Understory-Collaborative/understory-collab';
var WORKFLOW = 'blog-sync.yml';
var REF = 'main';
var COOLDOWN_SECONDS = 30;

// Opening the relay's URL in a browser sends a GET. Answer it with a note instead of
// an error, since the relay only does its work on POST from the Doc menu.
function doGet() {
  return ContentService.createTextOutput(
    'This is the UC Blog relay. Use the UC Blog menu in a post Doc to preview or publish.'
  );
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var action = body.action;
    var docId = body.docId;
    if (action !== 'preview' && action !== 'publish') return reply_(false, 'Unknown action.');
    if (!docId) return reply_(false, 'No Doc was given.');

    var props = PropertiesService.getScriptProperties();
    var draftsId = props.getProperty('DRIVE_DRAFTS_FOLDER_ID');
    var publishedId = props.getProperty('DRIVE_PUBLISHED_FOLDER_ID');

    var file = DriveApp.getFileById(docId);
    var place = folderOf_(file, draftsId, publishedId);
    if (!place) {
      return reply_(false, 'This Doc isn\'t in the UC Blog Drafts or Published folder.');
    }

    var moved = false;
    if (action === 'publish' && place === 'drafts') {
      file.moveTo(DriveApp.getFolderById(publishedId));
      moved = true;
    }

    var started = startSync_(props.getProperty('GITHUB_TOKEN'));
    if (!started.ok) return reply_(false, started.message, { moved: moved });
    return reply_(true, started.message, { moved: moved, published: action === 'publish' || place === 'published' });
  } catch (error) {
    return reply_(false, 'Something went wrong: ' + error.message);
  }
}

// 'drafts', 'published', or '' when the file is in neither folder.
function folderOf_(file, draftsId, publishedId) {
  var parents = file.getParents();
  var place = '';
  while (parents.hasNext()) {
    var id = parents.next().getId();
    if (id === publishedId) return 'published';
    if (id === draftsId) place = 'drafts';
  }
  return place;
}

function startSync_(token) {
  if (!token) return { ok: false, message: 'The relay has no GitHub token set.' };

  // One sync is enough for a burst of clicks; a second request inside the cooldown
  // reports success without starting another run.
  var cache = CacheService.getScriptCache();
  if (cache.get('recent-sync')) {
    return { ok: true, message: 'A sync started in the last few seconds, so this change will be included.' };
  }

  var response = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + REPO + '/actions/workflows/' + WORKFLOW + '/dispatches',
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      payload: JSON.stringify({ ref: REF }),
      muteHttpExceptions: true,
    }
  );

  var code = response.getResponseCode();
  if (code === 204) {
    cache.put('recent-sync', '1', COOLDOWN_SECONDS);
    return { ok: true, message: 'Sync started.' };
  }
  if (code === 401) return { ok: false, message: 'GitHub rejected the token. It may have expired.' };
  if (code === 403 || code === 404) {
    return { ok: false, message: 'GitHub refused the request (' + code + '). Check the token\'s repository access and Actions permission.' };
  }
  return { ok: false, message: 'GitHub returned ' + code + '.' };
}

function reply_(ok, message, extra) {
  var out = { ok: ok, message: message };
  if (extra) for (var key in extra) out[key] = extra[key];
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

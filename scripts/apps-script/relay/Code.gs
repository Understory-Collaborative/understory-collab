/**
 * UC relay: a standalone Apps Script, deployed once as a web app.
 *
 * The "UC Blog" menu in each post Doc and the "UC Profile" menu in each profile Doc call
 * this web app, and this web app starts the matching GitHub Action: the blog sync for a
 * Doc in the UC Blog folders, the profile sync for a Doc in the UC Team folders. The
 * GitHub token lives only here, in Script Properties, so it never travels inside a Doc.
 *
 * It does two things:
 *   preview  starts the sync for a Doc in Drafts or Published
 *   publish  moves a Doc from Drafts to Published, then starts the sync
 *
 * It refuses any Doc that isn't in one of those folders, and it starts each sync at most
 * once every 30 seconds, so a stray call can't do more than run a sync.
 *
 * Script Properties (Project Settings → Script properties):
 *   GITHUB_TOKEN                    fine-grained token, this repo only, Actions: read and write
 *   DRIVE_DRAFTS_FOLDER_ID          UC Blog / Drafts, same as the GitHub variable
 *   DRIVE_PUBLISHED_FOLDER_ID       UC Blog / Published, same as the GitHub variable
 *   DRIVE_TEAM_DRAFTS_FOLDER_ID     UC Team / Drafts, same as the GitHub variable
 *   DRIVE_TEAM_PUBLISHED_FOLDER_ID  UC Team / Published, same as the GitHub variable
 *
 * Setup steps: docs/blog-pipeline-setup.md, "Run the sync from the Doc", and
 * docs/profile-template.md, "Preview from the Doc".
 */

var REPO = 'Understory-Collaborative/understory-collab';
var REF = 'main';
var COOLDOWN_SECONDS = 30;

// Each set of folders and the workflow it runs. The profile folders are optional, so the
// relay still works for the blog before they're set.
function pipelines_(props) {
  return [
    {
      name: 'blog',
      workflow: 'blog-sync.yml',
      draftsId: props.getProperty('DRIVE_DRAFTS_FOLDER_ID'),
      publishedId: props.getProperty('DRIVE_PUBLISHED_FOLDER_ID'),
    },
    {
      name: 'profile',
      workflow: 'profile-sync.yml',
      draftsId: props.getProperty('DRIVE_TEAM_DRAFTS_FOLDER_ID'),
      publishedId: props.getProperty('DRIVE_TEAM_PUBLISHED_FOLDER_ID'),
    },
  ].filter(function (pipeline) {
    return pipeline.draftsId && pipeline.publishedId;
  });
}

// Opening the relay's URL in a browser sends a GET. Answer it with a note instead of
// an error, since the relay only does its work on POST from a Doc menu.
function doGet() {
  return ContentService.createTextOutput(
    'This is the UC relay. Use the UC Blog menu in a post Doc, or the UC Profile menu in a profile Doc, to preview or publish.'
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
    var file = DriveApp.getFileById(docId);
    var pipelines = pipelines_(props);
    var pipeline = null;
    var place = '';
    for (var i = 0; i < pipelines.length && !place; i++) {
      place = folderOf_(file, pipelines[i].draftsId, pipelines[i].publishedId);
      if (place) pipeline = pipelines[i];
    }
    if (!place) {
      return reply_(false, 'This Doc isn\'t in the Drafts or Published folder of UC Blog or UC Team.');
    }

    var moved = false;
    if (action === 'publish' && place === 'drafts') {
      file.moveTo(DriveApp.getFolderById(pipeline.publishedId));
      moved = true;
    }

    var started = startSync_(props.getProperty('GITHUB_TOKEN'), pipeline.workflow);
    if (!started.ok) return reply_(false, started.message, { moved: moved });
    return reply_(true, started.message, {
      moved: moved,
      published: action === 'publish' || place === 'published',
      pipeline: pipeline.name,
    });
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

function startSync_(token, workflow) {
  if (!token) return { ok: false, message: 'The relay has no GitHub token set.' };

  // One sync is enough for a burst of clicks; a second request inside the cooldown
  // reports success without starting another run.
  var cache = CacheService.getScriptCache();
  var cacheKey = 'recent-sync-' + workflow;
  if (cache.get(cacheKey)) {
    return { ok: true, message: 'A sync started in the last few seconds, so this change will be included.' };
  }

  var response = UrlFetchApp.fetch(
    'https://api.github.com/repos/' + REPO + '/actions/workflows/' + workflow + '/dispatches',
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
  // GitHub explains refusals in the response body; pass that along so the pop-up says
  // what's wrong (for example, a token still waiting for org approval).
  var detail = '';
  try {
    detail = JSON.parse(response.getContentText()).message || '';
  } catch (error) {
    detail = '';
  }
  var said = detail ? ' GitHub says: "' + detail + '"' : '';
  if (code === 204) {
    cache.put(cacheKey, '1', COOLDOWN_SECONDS);
    return { ok: true, message: 'Sync started.' };
  }
  if (code === 401) return { ok: false, message: 'GitHub rejected the token. It may have expired.' + said };
  if (code === 403 || code === 404) {
    return {
      ok: false,
      message: 'GitHub refused the request (' + code + '). Check that the token is approved in the org and has Actions: Read and write.' + said,
    };
  }
  return { ok: false, message: 'GitHub returned ' + code + '.' + said };
}

function reply_(ok, message, extra) {
  var out = { ok: ok, message: message };
  if (extra) for (var key in extra) out[key] = extra[key];
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

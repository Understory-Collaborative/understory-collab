/**
 * UC Blog menu: attached to the _TEMPLATE Doc, so every copy of the template has it.
 *
 * Adds a "UC Blog" menu with:
 *   Preview now  starts the blog sync and shows the preview link
 *   Publish      moves this Doc to Published and starts the sync
 *
 * The work happens in the relay web app (scripts/apps-script/relay), which holds the
 * GitHub token. This script only knows the relay's address, which isn't a secret.
 *
 * Setup steps: docs/blog-pipeline-setup.md, "Run the sync from the Doc".
 */

// Paste the relay's web app URL here (Deploy → Manage deployments → Web app URL).
var RELAY_URL = 'PASTE_RELAY_WEB_APP_URL_HERE';
var SITE_URL = 'https://understorycollab.com';
var LABELS = ['slug', 'author', 'subtitle', 'excerpt', 'category', 'tags'];

function onOpen() {
  DocumentApp.getUi()
    .createMenu('UC Blog')
    .addItem('Preview now', 'previewNow')
    .addItem('Publish', 'publish')
    .addToUi();
}

function previewNow() {
  run_('preview');
}

function publish() {
  var ui = DocumentApp.getUi();
  var answer = ui.alert(
    'Publish this post?',
    'This moves the Doc into the Published folder, and the post goes live on the site in a minute or two.',
    ui.ButtonSet.YES_NO
  );
  if (answer === ui.Button.YES) run_('publish');
}

function run_(action) {
  var ui = DocumentApp.getUi();
  var doc = DocumentApp.getActiveDocument();

  if (doc.getName().trim().charAt(0) === '_') {
    ui.alert('This is the template', 'Make a copy of it first (File → Make a copy), then use the menu in your copy.', ui.ButtonSet.OK);
    return;
  }
  if (RELAY_URL.indexOf('PASTE_') === 0) {
    ui.alert('Not set up yet', 'The relay address hasn\'t been added to this script.', ui.ButtonSet.OK);
    return;
  }

  var response = UrlFetchApp.fetch(RELAY_URL, {
    method: 'post',
    contentType: 'application/json',
    // The relay only accepts signed-in Google users; this passes the reader's sign-in.
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({ action: action, docId: doc.getId() }),
    muteHttpExceptions: true,
  });

  var result;
  try {
    result = JSON.parse(response.getContentText());
  } catch (error) {
    ui.alert('The relay didn\'t answer', 'It returned ' + response.getResponseCode() + '. Try again in a minute.', ui.ButtonSet.OK);
    return;
  }
  if (!result.ok) {
    ui.alert('The sync didn\'t start', result.message, ui.ButtonSet.OK);
    return;
  }

  var url = SITE_URL + '/blog/' + slugOf_(doc);
  var lead = action === 'publish'
    ? (result.moved ? 'Moved to Published. ' : 'Already in Published. ') + 'The post goes live'
    : 'Your preview is ready';
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;font-size:14px;line-height:1.5">' +
      '<p>' + escape_(result.message) + ' ' + lead + ' in a minute or two at:</p>' +
      '<p><a href="' + escape_(url) + '" target="_blank" rel="noopener">' + escape_(url) + '</a></p>' +
    '</div>'
  ).setWidth(420).setHeight(150);
  ui.showModalDialog(html, action === 'publish' ? 'Publishing' : 'Preview on its way');
}

// Mirrors the sync: a "Slug:" line wins, then the first Heading 1 or Title, then the
// Doc name. The label can share a paragraph with other labels.
function slugOf_(doc) {
  var paragraphs = doc.getBody().getParagraphs();
  var heading = '';
  for (var i = 0; i < paragraphs.length; i++) {
    var p = paragraphs[i];
    var text = p.getText().trim();
    var slug = labelValue_(text, 'slug');
    if (slug) return slugify_(slug);
    var level = p.getHeading();
    if (!heading && text && (level === DocumentApp.ParagraphHeading.HEADING1 || level === DocumentApp.ParagraphHeading.TITLE)) {
      heading = text;
    }
  }
  return slugify_(heading || doc.getName());
}

function labelValue_(text, label) {
  var names = LABELS.join('|');
  var start = new RegExp('^(' + names + '):', 'i');
  if (!start.test(text)) return '';
  var parts = text.split(new RegExp('(?=(?:' + names + '):)', 'i'));
  for (var i = 0; i < parts.length; i++) {
    var match = new RegExp('^' + label + ':\\s*(.*)$', 'i').exec(parts[i].trim());
    if (match) return match[1].trim();
  }
  return '';
}

function slugify_(text) {
  return String(text)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function escape_(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * UC Profile menu: attached to the profile _TEMPLATE Doc in UC Team / Drafts, so every
 * copy of the template has it.
 *
 * Adds a "UC Profile" menu with:
 *   Preview now  starts the profile sync and shows the preview link
 *   Publish      moves this Doc to UC Team / Published and starts the sync
 *
 * The work happens in the relay web app (scripts/apps-script/relay), which holds the
 * GitHub token. This script only knows the relay's address, which isn't a secret. It's
 * the same relay the UC Blog menu uses.
 *
 * Setup steps: docs/profile-template.md, "Preview from the Doc".
 */

// Paste the relay's web app URL here (Deploy → Manage deployments → Web app URL), the
// same address the UC Blog menu uses.
var RELAY_URL = 'PASTE_RELAY_WEB_APP_URL_HERE';
var SITE_URL = 'https://understorycollab.com';

function onOpen() {
  DocumentApp.getUi()
    .createMenu('UC Profile')
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
    'Publish your profile?',
    'This moves the Doc into UC Team / Published, and your page goes live, with your portrait as it looks in your preview. Check the preview first if you haven\'t.',
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
  var slug = slugOf_(doc);
  if (!slug || slug === 'your-name') {
    ui.alert('Add your name first', 'Fill in your name (the Heading 1) and your Slug line, then try again.', ui.ButtonSet.OK);
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

  var url = SITE_URL + '/about/' + (result.published ? slug : previewSlug_(slug));
  var lead = result.published
    ? (result.moved ? 'Moved to Published. ' : 'Already in Published. ') + 'Your page goes live'
    : 'Your preview will be ready';
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;font-size:14px;line-height:1.5">' +
      '<p>' + escape_(result.message) + ' ' + lead + ' in a few minutes at:</p>' +
      '<p><a href="' + escape_(url) + '" target="_blank" rel="noopener">' + escape_(url) + '</a></p>' +
      '<p>The first time, or after you change your photo, it takes a little longer while your portrait is drawn.</p>' +
    '</div>'
  ).setWidth(440).setHeight(190);
  ui.showModalDialog(html, result.published ? 'Publishing' : 'Preview on its way');
}

// Mirrors src/data/authors.js: a draft whose slug is already live (someone redoing their
// page) previews at /about/<slug>-preview, so the live page stays up.
function previewSlug_(slug) {
  var live = UrlFetchApp.fetch(SITE_URL + '/about/' + slug, { muteHttpExceptions: true, followRedirects: false });
  var isLive = live.getResponseCode() === 200 && live.getContentText().indexOf('Draft profile, not indexed') === -1;
  return isLive ? slug + '-preview' : slug;
}

// Mirrors the sync: a "Slug:" line wins, then the first Heading 1.
function slugOf_(doc) {
  var paragraphs = doc.getBody().getParagraphs();
  var heading = '';
  for (var i = 0; i < paragraphs.length; i++) {
    var p = paragraphs[i];
    var text = p.getText().trim();
    var match = /^slug:\s*(.*)$/i.exec(text);
    // The slug is the first word; the template's hint text can follow it.
    if (match && match[1].trim()) return slugify_(match[1].trim().split(/[\s(]/)[0]);
    if (!heading && text && p.getHeading() === DocumentApp.ParagraphHeading.HEADING1) heading = text;
  }
  return slugify_(heading);
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

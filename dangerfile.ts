import {
    danger,
    fail,
    message,
    warn,
    markdown
} from 'danger';



function formatMarkdownTable(title, icon, content)
{
    const tableTemplate = `
    |     | {0} |
    | --- | --- |
    | {1} | {2} |
    `
    let result = tableTemplate.replace('{0}', title);
    result = result.replace('{1}', icon);
    result = result.replace('{2}', content);
    return result;
}

if (danger.git.created_files.length > 0) {
    markdown(formatMarkdownTable('Added Files in this PR', ':green_book:', `<ul><li>${danger.git.created_files.join("</li><li>")}</li></ul>`));
    //message(`Added Files in this PR:<ul><li>${danger.git.created_files.join("</li><li>")}</li>`);
}

if (danger.git.deleted_files.length > 0) {
    markdown(formatMarkdownTable('Added Files in this PR', ':red_book:', `<ul><li>${danger.git.deleted_files.join("</li><li>")}</li></ul>`));
    //message(`Deleted Files in this PR:<ul><li>${danger.git.deleted_files.join("</li><li>")}</li>`);
}

if (danger.git.modified_files.length > 0) {
    markdown(formatMarkdownTable('Added Files in this PR', ':orange_book:', `<ul><li>${danger.git.modified_files.join("</li><li>")}</li></ul>`));
    //message(`Changed Files in this PR:<ul><li>${danger.git.modified_files.join("</li><li>")}</li>`);
}


if (danger.github.pr.head.ref.trim().replace(/-/g, ' ').toLowerCase() === danger.github.pr.title.trim().toLowerCase())
{
    fail("Title must be explicit as it will be used in your release change log.")
}

if (!danger.github.pr.assignee)
{
    fail("This pull request needs an assignee, and optionally include any reviewers.")
}

if (danger.github.issue.labels.length <=0)
{
    fail("This pull request needs a label.")
}

if (danger.github.pr.body.length < 10)
{
    fail("This pull request needs a description.")
}

const hasPackageChanges = danger.git.modified_files.includes("package.json")
const hasLockfileChanges = danger.git.modified_files.includes("yarn.lock")
if (hasPackageChanges && !hasLockfileChanges)
{
    warn("There are package.json changes with no corresponding lockfile changes")
}

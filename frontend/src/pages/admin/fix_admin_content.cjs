const fs = require('fs');
const path = 'h:/Daly Work/Flyeasy.com/Flyeasy web/flyeasymysql/flyeasy-mysql/frontend/src/pages/admin/AdminContent.jsx';
let code = fs.readFileSync(path, 'utf8');

// Move LinksManager, FooterColumnsManager, Field OUTSIDE AdminContent
// First, extract the components
const linksManagerRegex = /const LinksManager = \(\{\s*links, onChange, title, placeholder\s*\}\) => \{[\s\S]*?(?=const FooterColumnsManager)/;
const footerColumnsManagerRegex = /const FooterColumnsManager = \(\{\s*columns, onChange\s*\}\) => \{[\s\S]*?(?=const Field)/;
const fieldRegex = /const Field = \(\{\s*label, k, textarea, image, type = "text"\s*\}\) => \([\s\S]*?\);\n/;

let linksManagerMatch = code.match(linksManagerRegex);
let footerColumnsManagerMatch = code.match(footerColumnsManagerRegex);
let fieldMatch = code.match(fieldRegex);

if (!linksManagerMatch || !footerColumnsManagerMatch || !fieldMatch) {
  console.log("Failed to match components");
  process.exit(1);
}

// Remove them from inside AdminContent
code = code.replace(linksManagerMatch[0], '');
code = code.replace(footerColumnsManagerMatch[0], '');
code = code.replace(fieldMatch[0], '');

// Modify Field to accept content and update
let newField = fieldMatch[0];
newField = newField.replace('const Field = ({ label, k, textarea, image, type = "text" }) =>', 'const Field = ({ label, k, textarea, image, type = "text", content, update }) =>');

// Add them above AdminContent
const topComponents = `
${linksManagerMatch[0]}
${footerColumnsManagerMatch[0]}
${newField}
`;

code = code.replace('export default function AdminContent() {', topComponents + '\nexport default function AdminContent() {');

// Now add content={content} update={update} to all <Field ... /> calls
// Regex to match <Field ... /> or <Field ...></Field> (though it's self-closing)
code = code.replace(/<Field (.*?)\/>/g, '<Field $1 content={content} update={update} />');
code = code.replace(/<Field (.*?)><\/Field>/g, '<Field $1 content={content} update={update} />');

fs.writeFileSync(path, code);
console.log("Fixed AdminContent.jsx!");

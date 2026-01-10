import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'
import { marked } from 'marked'

const markdownToPlainText = (markdown) => {
  return markdown
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '[CODE BLOCK]')
    .replace(/`(.+?)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '[IMAGE]')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const exportAsPDF = (content, title) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPosition = 25

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  const titleLines = doc.splitTextToSize(title, maxWidth)
  titleLines.forEach((line) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
    doc.text(line, margin, yPosition)
    yPosition += 10
  })

  yPosition += 5
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')

  const plainText = markdownToPlainText(content)
  const contentLines = doc.splitTextToSize(plainText, maxWidth)

  contentLines.forEach((line) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
    doc.text(line, margin, yPosition)
    yPosition += 6
  })

  doc.save(`${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-notes.pdf`)
}

export const exportAsMarkdown = (content, title) => {
  const markdown = `# ${title}\n\n${content}`
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-notes.md`)
}

export const exportAsHTML = (content, title) => {
  const htmlContent = marked.parse(content)

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 40px;
      line-height: 1.7;
      color: #1a202c;
      background: #ffffff;
    }
    h1 {
      color: #2563eb;
      border-bottom: 3px solid #e5e7eb;
      padding-bottom: 12px;
      margin-bottom: 24px;
      font-size: 2.25rem;
    }
    h2 {
      color: #1e40af;
      margin-top: 32px;
      margin-bottom: 16px;
      font-size: 1.75rem;
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 8px;
    }
    h3 {
      color: #1e3a8a;
      margin-top: 24px;
      margin-bottom: 12px;
      font-size: 1.5rem;
    }
    p { margin: 16px 0; }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border-left: 4px solid #3b82f6;
      margin: 20px 0;
    }
    code {
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9em;
      color: #dc2626;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: #e2e8f0;
    }
    blockquote {
      border-left: 4px solid #3b82f6;
      margin: 24px 0;
      padding: 12px 20px;
      color: #475569;
      background: #f8fafc;
      font-style: italic;
      border-radius: 0 4px 4px 0;
    }
    a {
      color: #2563eb;
      text-decoration: none;
      border-bottom: 1px solid #93c5fd;
    }
    a:hover {
      color: #1d4ed8;
      border-bottom-color: #2563eb;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 24px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px 16px;
      text-align: left;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #f9fafb;
    }
    ul, ol {
      margin: 16px 0;
      padding-left: 32px;
    }
    li {
      margin: 10px 0;
      line-height: 1.6;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    strong {
      color: #1f2937;
      font-weight: 600;
    }
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 32px 0;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${htmlContent}
</body>
</html>`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  saveAs(blob, `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-notes.html`)
}

export const copyToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

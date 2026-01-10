"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EnhancedMDEditor({ value, onChange, height = 600, placeholder }) {
  const [viewMode, setViewMode] = useState("edit");

  return (
    <Tabs value={viewMode} onValueChange={setViewMode}>
      <TabsList className="mb-2">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="split">Split View</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="mt-0">
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={onChange}
            height={height}
            preview="edit"
            placeholder={placeholder}
          />
        </div>
      </TabsContent>

      <TabsContent value="preview" className="mt-0">
        <div
          className="border rounded-lg p-6 bg-background overflow-auto"
          style={{ minHeight: height }}
        >
          <MarkdownPreview content={value} />
        </div>
      </TabsContent>

      <TabsContent value="split" className="mt-0">
        <div className="grid grid-cols-2 gap-4">
          <div data-color-mode="light">
            <MDEditor
              value={value}
              onChange={onChange}
              height={height}
              preview="edit"
              placeholder={placeholder}
            />
          </div>
          <div
            className="border rounded-lg p-6 bg-background overflow-auto"
            style={{ height }}
          >
            <MarkdownPreview content={value} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function MarkdownPreview({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <CodeBlockWithCopy language={match[1]}>
              {String(children).replace(/\n$/, "")}
            </CodeBlockWithCopy>
          ) : (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="ml-4">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4">
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-primary underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border px-4 py-2 bg-muted font-semibold text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border px-4 py-2">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function CodeBlockWithCopy({ children, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}

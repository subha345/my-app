"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

async function downloadDocx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function createSimpleResume() {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Your Name",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Email: your.email@example.com | Phone: +1 234 567 8900 | LinkedIn: linkedin.com/in/yourprofile",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Experienced professional with a strong background in [your field]. Skilled in [key skills]. Passionate about [your interests].",
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Work Experience",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Job Title", bold: true }),
              new TextRun({ text: " | Company Name | Jan 2020 - Present" }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "• Key achievement or responsibility 1\n• Key achievement or responsibility 2\n• Key achievement or responsibility 3",
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Degree Name", bold: true }),
              new TextRun({ text: " | University Name | Year" }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Skill 1, Skill 2, Skill 3, Skill 4, Skill 5",
              }),
            ],
          }),
        ],
      },
    ],
  });
}

function createModernResume() {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "YOUR NAME",
                bold: true,
                size: 32,
                font: "Arial",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Professional Title",
                size: 24,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "email@example.com", size: 22 }),
              new TextRun({ text: " • ", size: 22 }),
              new TextRun({ text: "Phone", size: 22 }),
              new TextRun({ text: " • ", size: 22 }),
              new TextRun({ text: "Location", size: 22 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Senior Role", bold: true }),
              new TextRun({ text: " — Company Name" }),
            ],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "Month Year – Present", italics: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "• Led initiatives that resulted in measurable impact\n• Collaborated with cross-functional teams\n• Delivered projects on time and within budget",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Degree", bold: true }),
              new TextRun({ text: " — University, Year" }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Technical: Skill A | Skill B | Skill C | Skill D\nSoft: Communication | Leadership | Problem Solving",
              }),
            ],
          }),
        ],
      },
    ],
  });
}

function createMinimalResume() {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Name", bold: true, size: 28 })],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Contact info • Portfolio • LinkedIn" }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Brief 2-3 sentence summary of your professional background and goals.",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Title", bold: true }),
              new TextRun({ text: ", Company — Date range" }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Description of role and achievements." }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Degree — Institution — Year" }),
            ],
          }),
        ],
      },
    ],
  });
}

const TEMPLATES = [
  {
    id: "simple",
    name: "Simple & Clean",
    description: "Classic layout with clear sections. Ideal for traditional industries.",
    create: createSimpleResume,
  },
  {
    id: "modern",
    name: "Modern Professional",
    description: "Bold headers and structured format. Great for tech and creative roles.",
    create: createModernResume,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Streamlined single-column design. Perfect for experienced professionals.",
    create: createMinimalResume,
  },
];

export default function ResumeTemplatesPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (template: (typeof TEMPLATES)[0]) => {
    setDownloading(template.id);
    try {
      const doc = template.create();
      const blob = await Packer.toBlob(doc);
      await downloadDocx(blob, `resume-${template.id}.docx`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate document. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Resume Templates</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="mb-10 text-muted">
          Download professional resume templates in DOCX format. Edit in Word,
          Google Docs, or any word processor.
        </p>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {template.name}
              </h2>
              <p className="mb-4 text-sm text-muted">{template.description}</p>
              <button
                onClick={() => handleDownload(template)}
                disabled={downloading !== null}
                className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
              >
                {downloading === template.id ? "Generating..." : "Download DOCX"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

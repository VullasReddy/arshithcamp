import jsPDF from 'jspdf';

export function generateCoursePDF(course, studentName = 'Student') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Helper to add semi-transparent brand watermark background
  const addWatermark = (isDarkBg = false) => {
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    doc.saveGraphicsState();

    if (isDarkBg) {
      if (typeof doc.setGState === 'function') {
        doc.setGState(new doc.GState({ opacity: 0.05 }));
      }
      doc.setTextColor(255, 255, 255);
    } else {
      if (typeof doc.setGState === 'function') {
        doc.setGState(new doc.GState({ opacity: 0.07 }));
      }
      doc.setTextColor(1, 51, 35); // #013323 Dark Green
    }

    // Main watermark text: ARSHiTH
    doc.setFont("helvetica", "bold");
    doc.setFontSize(46);
    doc.text("ARSHiTH", centerX, centerY - 6, {
      align: "center",
      angle: 35
    });

    // Subtitle watermark: BOOT CAMP MANUAL
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    if (!isDarkBg) {
      doc.setTextColor(15, 164, 119); // Mint green accent
    } else {
      doc.setTextColor(166, 226, 205);
    }
    doc.text("BOOT CAMP — OFFICIAL MANUAL", centerX, centerY + 10, {
      align: "center",
      angle: 35
    });

    doc.restoreGraphicsState();
  };

  // Helper to add dark green headers/footers
  const addHeaderFooter = (pageNumber) => {
    // Render background watermark on content pages
    addWatermark(false);

    // Header bar
    doc.setFillColor(0, 51, 35); // #013323 Dark Green
    doc.rect(0, 0, pageWidth, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("ARSHiTH BOOT CAMP — Official Course Manual", margin, 8);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(course.title, pageWidth - margin, 8, { align: "right" });

    // Footer bar
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Learn Today, Build Tomorrow • www.arshithbootcamp.com", margin, pageHeight - 6);
    doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  };

  let pageCount = 1;

  // ==========================================
  // COVER PAGE
  // ==========================================
  // Dark Green Banner Background
  doc.setFillColor(1, 51, 35); // #013323
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  addWatermark(true);

  // Decorative Accent Bar
  doc.setFillColor(15, 164, 119); // #0FA477 Mint Green
  doc.rect(margin, 40, 6, 90, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("ARSHiTH BOOT CAMP", margin + 14, 52);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(166, 226, 205); // Mint light
  doc.text("Learn Today, Build Tomorrow", margin + 14, 62);

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin + 14, 70, pageWidth - margin, 70);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const courseTitleLines = doc.splitTextToSize(`COMPLETE COURSE MANUAL:\n${course.title.toUpperCase()}`, contentWidth - 20);
  doc.text(courseTitleLines, margin + 14, 85);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(`Level: ${course.level}  |  Duration: ${course.duration}  |  Total Modules: ${course.modules.length}`, margin + 14, 120);

  // Student Enrollment Card Box
  doc.setFillColor(5, 71, 49); // Dark green card
  doc.roundedRect(margin, 160, contentWidth, 50, 4, 4, 'F');

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(166, 226, 205);
  doc.text("STUDENT CREDENTIAL & ENROLLMENT", margin + 10, 172);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`Student Name: ${studentName}`, margin + 10, 184);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(226, 232, 240);
  doc.text(`Issued by: Arshith Boot Camp Platform`, margin + 10, 196);
  doc.text(`Date of Export: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin + 10, 204);

  // ==========================================
  // TABLE OF CONTENTS (PAGE 2)
  // ==========================================
  doc.addPage();
  pageCount++;
  addHeaderFooter(pageCount);

  y = 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(1, 51, 35);
  doc.text("Table of Contents", margin, y);

  y += 6;
  doc.setDrawColor(15, 164, 119);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 40, y);

  y += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  course.modules.forEach((mod, idx) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(pageCount);
      y = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(1, 51, 35);
    doc.text(`${(idx + 1).toString().padStart(2, '0')}.`, margin, y);
    doc.text(mod.title, margin + 10, y);

    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const descLines = doc.splitTextToSize(mod.description, contentWidth - 15);
    doc.text(descLines, margin + 10, y);

    y += (descLines.length * 4) + 5;
    doc.setFontSize(10);
  });

  // ==========================================
  // MODULES CONTENT
  // ==========================================
  course.modules.forEach((mod) => {
    doc.addPage();
    pageCount++;
    addHeaderFooter(pageCount);
    y = 25;

    // Module Header Box
    doc.setFillColor(234, 248, 243); // Mint light bg
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
    doc.setDrawColor(0, 135, 90);
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(1, 51, 35);
    doc.text(mod.title, margin + 6, y + 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(mod.description, margin + 6, y + 17);

    y += 30;

    const rm = mod.readingMaterial;
    if (rm) {
      // 1. Introduction
      if (rm.introduction) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 135, 90);
        doc.text("1. Introduction", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const introLines = doc.splitTextToSize(rm.introduction, contentWidth);
        doc.text(introLines, margin, y);
        y += (introLines.length * 4) + 6;
      }

      // 2. Learning Objectives
      if (rm.objectives && rm.objectives.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 135, 90);
        doc.text("2. Learning Objectives", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        rm.objectives.forEach((obj) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }
          const lines = doc.splitTextToSize(`• ${obj}`, contentWidth - 5);
          doc.text(lines, margin + 4, y);
          y += (lines.length * 4) + 1;
        });
        y += 6;
      }

      // 3. Detailed Explanations & Sections
      if (rm.sections && rm.sections.length > 0) {
        rm.sections.forEach((sec) => {
          if (y > pageHeight - 35) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(1, 51, 35);
          doc.text(sec.heading, margin, y);
          y += 5;

          if (sec.text) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            const secLines = doc.splitTextToSize(sec.text, contentWidth);
            doc.text(secLines, margin, y);
            y += (secLines.length * 4) + 4;
          }

          if (sec.bulletPoints && sec.bulletPoints.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            sec.bulletPoints.forEach((bp) => {
              if (y > pageHeight - 20) {
                doc.addPage();
                pageCount++;
                addHeaderFooter(pageCount);
                y = 25;
              }
              const bpLines = doc.splitTextToSize(`- ${bp}`, contentWidth - 6);
              doc.text(bpLines, margin + 4, y);
              y += (bpLines.length * 4) + 1;
            });
            y += 4;
          }

          // Table support in PDF
          if (sec.table && sec.table.headers && sec.table.rows) {
            if (y > pageHeight - 45) {
              doc.addPage();
              pageCount++;
              addHeaderFooter(pageCount);
              y = 25;
            }

            const colCount = sec.table.headers.length;
            const colWidth = contentWidth / colCount;

            // Table Header
            doc.setFillColor(241, 245, 249);
            doc.rect(margin, y, contentWidth, 7, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(15, 23, 42);

            sec.table.headers.forEach((h, hIdx) => {
              const hText = doc.splitTextToSize(String(h), colWidth - 2);
              doc.text(hText, margin + (hIdx * colWidth) + 2, y + 4.5);
            });
            y += 7;

            // Table Rows
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);

            sec.table.rows.forEach((r) => {
              if (y > pageHeight - 25) {
                doc.addPage();
                pageCount++;
                addHeaderFooter(pageCount);
                y = 25;
              }

              let maxRowHeight = 6;
              r.forEach((cell, cIdx) => {
                const cellLines = doc.splitTextToSize(String(cell), colWidth - 2);
                maxRowHeight = Math.max(maxRowHeight, cellLines.length * 3.5 + 2);
              });

              doc.setDrawColor(226, 232, 240);
              doc.rect(margin, y, contentWidth, maxRowHeight, 'S');

              r.forEach((cell, cIdx) => {
                const cellLines = doc.splitTextToSize(String(cell), colWidth - 2);
                doc.text(cellLines, margin + (cIdx * colWidth) + 2, y + 4);
              });
              y += maxRowHeight;
            });
            y += 6;
          }
        });
      }

      // 4. Code Examples
      if (rm.codeExamples && rm.codeExamples.length > 0) {
        rm.codeExamples.forEach((ex) => {
          if (y > pageHeight - 50) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(1, 51, 35);
          doc.text(`Code Example: ${ex.title}`, margin, y);
          y += 5;

          // Dark Code Box
          const codeLines = doc.splitTextToSize(ex.code, contentWidth - 12);
          const boxHeight = (codeLines.length * 3.8) + 8;

          if (y + boxHeight > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFillColor(30, 41, 59); // Slate dark code box
          doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');

          doc.setFont("courier", "normal");
          doc.setFontSize(8);
          doc.setTextColor(226, 232, 240);
          doc.text(codeLines, margin + 6, y + 6);

          y += boxHeight + 4;

          if (ex.explanation) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            const expLines = doc.splitTextToSize(`Note: ${ex.explanation}`, contentWidth);
            doc.text(expLines, margin, y);
            y += (expLines.length * 4) + 6;
          }
        });
      }

      // 5. Practice Exercise
      if (rm.practiceExercise) {
        if (y > pageHeight - 60) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(180, 83, 9); // Amber
        doc.text(`Practice Challenge: ${rm.practiceExercise.title}`, margin, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const probLines = doc.splitTextToSize(rm.practiceExercise.problem, contentWidth);
        doc.text(probLines, margin, y);
        y += (probLines.length * 4) + 4;

        if (rm.practiceExercise.solutionCode) {
          const solLines = doc.splitTextToSize(rm.practiceExercise.solutionCode, contentWidth - 12);
          const solBoxHeight = (solLines.length * 3.8) + 8;

          if (y + solBoxHeight > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFillColor(15, 23, 42);
          doc.roundedRect(margin, y, contentWidth, solBoxHeight, 2, 2, 'F');

          doc.setFont("courier", "normal");
          doc.setFontSize(8);
          doc.setTextColor(52, 211, 153); // Emerald
          doc.text(solLines, margin + 6, y + 6);

          y += solBoxHeight + 6;
        }
      }

      // 6. Key Takeaways
      if (rm.keyTakeaways && rm.keyTakeaways.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 135, 90);
        doc.text("Key Takeaways", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        rm.keyTakeaways.forEach((kt) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }
          const lines = doc.splitTextToSize(`✓ ${kt}`, contentWidth - 5);
          doc.text(lines, margin + 4, y);
          y += (lines.length * 4) + 1;
        });
        y += 6;
      }
    }
  });

  // ==========================================
  // FINAL COMPLETION SUMMARY PAGE
  // ==========================================
  doc.addPage();
  pageCount++;
  addHeaderFooter(pageCount);
  y = 30;

  doc.setFillColor(1, 51, 35);
  doc.roundedRect(margin, y, contentWidth, 140, 4, 4, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("COURSE COMPLETION SUMMARY", margin + 15, y + 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(166, 226, 205);
  doc.text("Congratulations on completing the entire curriculum!", margin + 15, y + 36);

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin + 15, y + 45, pageWidth - margin - 15, y + 45);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Student Name: ${studentName}`, margin + 15, y + 60);
  doc.text(`Course Title: ${course.title}`, margin + 15, y + 70);
  doc.text(`Total Modules Completed: ${course.modules.length} / ${course.modules.length} (100%)`, margin + 15, y + 80);
  doc.text(`Credential Platform: Arshith Boot Camp`, margin + 15, y + 90);
  doc.text(`Official Tagline: Learn Today, Build Tomorrow`, margin + 15, y + 100);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 215, 0); // Gold
  doc.text("★ Verified Official Course Document ★", margin + 15, y + 120);

  // Save PDF
  const filename = `ArshithBootCamp_${course.id}_Complete_Course.pdf`;
  doc.save(filename);
}

export function generateQuestionPaperPDF(course, paper, options = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const margin = 15;
  const y = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(1, 51, 35);
  doc.text(paper.title || "Examination Paper", margin, y + 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Candidate: ${paper.studentName || 'Student'} | Roll No: ${paper.rollNo || 'N/A'}`, margin, y + 18);
  doc.text(`Course: ${course.title || 'Course'}`, margin, y + 24);
  const filename = `${paper.id || 'question-paper'}.pdf`;
  doc.save(filename);
}

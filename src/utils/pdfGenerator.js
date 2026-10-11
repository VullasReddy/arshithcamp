import jsPDF from 'jspdf';

// Helper function to sanitize non-ASCII characters & encoding artifacts for jsPDF WinAnsi font
export function cleanText(str) {
  if (!str) return '';
  return String(str)
    // Fix existing corruption artifacts
    .replace(/"Çö/g, ' - ')
    .replace(/Çö/g, ' - ')
    .replace(/â€”—/g, ' - ')
    .replace(/â€”/g, ' - ')
    .replace(/â€“/g, ' - ')
    .replace(/â€/g, '')
    // Unicode dashes
    .replace(/[\u2014\u2013\u2012\u2015]/g, ' - ')
    // Unicode quotes
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    // Special symbols to ASCII equivalents
    .replace(/\u2022/g, '-')
    .replace(/\u25A0/g, '-')
    .replace(/\u2713/g, 'v')
    .replace(/\u2717/g, 'x')
    .replace(/\u00B0/g, ' deg ')
    .replace(/\u20AC/g, 'EUR')
    .replace(/\u03C0/g, 'pi')
    .replace(/\u00B2/g, '^2')
    .replace(/\u00D7/g, 'x')
    .replace(/\u2248/g, '~=')
    .replace(/\u03C3/g, 'sigma')
    .replace(/[\u2500-\u257F]/g, '-')
    // Unusual whitespace & zero-width spaces
    .replace(/[\u00A0\u200B]/g, ' ')
    // Remove any remaining non-ASCII character safely
    .replace(/[^\x00-\x7F]/g, ' ')
    // Clean up multiple spaces & dash spacing
    .replace(/\s+/g, ' ')
    .replace(/ -\s*- /g, ' - ')
    .trim();
}

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

  const cleanCourseTitle = cleanText(course.title);
  const cleanStudentName = cleanText(studentName);

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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(46);
    doc.text("ARSHiTH", centerX, centerY - 6, {
      align: "center",
      angle: 35
    });

    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    if (!isDarkBg) {
      doc.setTextColor(15, 164, 119); // Mint green accent
    } else {
      doc.setTextColor(166, 226, 205);
    }
    doc.text("IGNITE - OFFICIAL MANUAL", centerX, centerY + 10, {
      align: "center",
      angle: 35
    });

    doc.restoreGraphicsState();
  };

  // Helper to add dark green headers/footers
  const addHeaderFooter = (pageNumber) => {
    addWatermark(false);

    // Header bar
    doc.setFillColor(0, 51, 35); // #013323 Dark Green
    doc.rect(0, 0, pageWidth, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("ARSHITH IGNITE - Official Course Manual", margin, 8);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(cleanCourseTitle, pageWidth - margin, 8, { align: "right" });

    // Footer bar
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Learn Today, Build Tomorrow * www.arshithignite.com", margin, pageHeight - 6);
    doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  };

  let pageCount = 1;

  // ==========================================
  // COVER PAGE
  // ==========================================
  doc.setFillColor(1, 51, 35); // #013323
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  addWatermark(true);

  // Decorative Accent Bar
  doc.setFillColor(15, 164, 119); // #0FA477 Mint Green
  doc.rect(margin, 40, 6, 90, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("ARSHITH IGNITE", margin + 14, 52);

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
  const courseTitleLines = doc.splitTextToSize(`COMPLETE COURSE MANUAL:\n${cleanCourseTitle.toUpperCase()}`, contentWidth - 20);
  doc.text(courseTitleLines, margin + 14, 85);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(`Level: ${cleanText(course.level)}  |  Duration: ${cleanText(course.duration)}  |  Total Modules: ${course.modules.length}`, margin + 14, 120);

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
  doc.text(`Student Name: ${cleanStudentName}`, margin + 10, 184);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(226, 232, 240);
  doc.text(`Issued by: Arshith Ignite Platform`, margin + 10, 196);
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

  course.modules.forEach((mod, idx) => {
    const cleanTitle = cleanText(mod.title);
    const cleanDesc = cleanText(mod.description);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const titleLines = doc.splitTextToSize(cleanTitle, contentWidth - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const descLines = cleanDesc ? doc.splitTextToSize(cleanDesc, contentWidth - 14) : [];

    const entryHeight = (titleLines.length * 4.5) + (descLines.length > 0 ? (descLines.length * 3.8) + 2 : 0) + 4;

    if (y + entryHeight > pageHeight - 20) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(pageCount);
      y = 25;
    }

    const numStr = `${(idx + 1).toString().padStart(2, '0')}.`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(1, 51, 35);
    doc.text(numStr, margin, y);
    doc.text(titleLines, margin + 10, y);

    y += (titleLines.length * 4.5);

    if (descLines.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(descLines, margin + 10, y);
      y += (descLines.length * 3.8) + 5;
    } else {
      y += 4;
    }
  });

  // ==========================================
  // MODULES CONTENT
  // ==========================================
  course.modules.forEach((mod) => {
    doc.addPage();
    pageCount++;
    addHeaderFooter(pageCount);
    y = 25;

    const cleanTitle = cleanText(mod.title);
    const cleanDesc = cleanText(mod.description);

    // Green Module Heading Box with dynamic height & full wrapping
    const boxInnerWidth = contentWidth - 14;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(cleanTitle, boxInnerWidth);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const descLines = cleanDesc ? doc.splitTextToSize(cleanDesc, boxInnerWidth) : [];

    const topPad = 6;
    const gap = 3;
    const botPad = 6;
    const titleH = titleLines.length * 5.5;
    const descH = descLines.length > 0 ? descLines.length * 4.2 : 0;
    const boxHeight = topPad + titleH + (descLines.length > 0 ? gap + descH : 0) + botPad;

    if (y + boxHeight > pageHeight - 25) {
      doc.addPage();
      pageCount++;
      addHeaderFooter(pageCount);
      y = 25;
    }

    doc.setFillColor(234, 248, 243); // Mint light bg #EAF8F3
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'F');
    doc.setDrawColor(0, 135, 90); // Green border #00875A
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'S');

    let textY = y + topPad + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(1, 51, 35);
    doc.text(titleLines, margin + 7, textY);

    textY += (titleLines.length * 5.5);

    if (descLines.length > 0) {
      textY += 1;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, margin + 7, textY);
    }

    y += boxHeight + 8;

    const rm = mod.readingMaterial;
    if (rm) {
      // 1. Introduction
      if (rm.introduction) {
        const cleanIntro = cleanText(rm.introduction);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 135, 90);
        doc.text("1. Introduction", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const introLines = doc.splitTextToSize(cleanIntro, contentWidth);

        if (y + (introLines.length * 4.2) > pageHeight - 20) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }

        doc.text(introLines, margin, y);
        y += (introLines.length * 4.2) + 6;
      }

      // 2. Learning Objectives
      if (rm.objectives && rm.objectives.length > 0) {
        if (y > pageHeight - 35) {
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
          const cleanObj = cleanText(obj);
          const lines = doc.splitTextToSize(`- ${cleanObj}`, contentWidth - 5);
          if (y + (lines.length * 4.2) > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }
          doc.text(lines, margin + 4, y);
          y += (lines.length * 4.2) + 1.5;
        });
        y += 6;
      }

      // 3. Detailed Explanations & Sections
      if (rm.sections && rm.sections.length > 0) {
        rm.sections.forEach((sec) => {
          const cleanHeading = cleanText(sec.heading);
          const cleanTextBody = cleanText(sec.text);

          if (y > pageHeight - 35) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(1, 51, 35);
          const headingLines = doc.splitTextToSize(cleanHeading, contentWidth);
          doc.text(headingLines, margin, y);
          y += (headingLines.length * 5);

          if (cleanTextBody) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            const secLines = doc.splitTextToSize(cleanTextBody, contentWidth);
            if (y + (secLines.length * 4.2) > pageHeight - 20) {
              doc.addPage();
              pageCount++;
              addHeaderFooter(pageCount);
              y = 25;
            }
            doc.text(secLines, margin, y);
            y += (secLines.length * 4.2) + 4;
          }

          if (sec.bulletPoints && sec.bulletPoints.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            sec.bulletPoints.forEach((bp) => {
              const cleanBp = cleanText(bp);
              const bpLines = doc.splitTextToSize(`- ${cleanBp}`, contentWidth - 6);
              if (y + (bpLines.length * 4.2) > pageHeight - 20) {
                doc.addPage();
                pageCount++;
                addHeaderFooter(pageCount);
                y = 25;
              }
              doc.text(bpLines, margin + 4, y);
              y += (bpLines.length * 4.2) + 1.5;
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
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);

            sec.table.headers.forEach((h, hIdx) => {
              const cleanH = cleanText(h);
              const hText = doc.splitTextToSize(cleanH, colWidth - 4);
              doc.text(hText, margin + (hIdx * colWidth) + 2, y + 4.5);
            });
            y += 7;

            // Table Rows
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);

            sec.table.rows.forEach((r) => {
              let maxRowHeight = 6;
              const formattedCells = r.map((cell) => {
                const cleanCell = cleanText(cell);
                const cellLines = doc.splitTextToSize(cleanCell, colWidth - 4);
                maxRowHeight = Math.max(maxRowHeight, (cellLines.length * 3.8) + 3);
                return cellLines;
              });

              if (y + maxRowHeight > pageHeight - 25) {
                doc.addPage();
                pageCount++;
                addHeaderFooter(pageCount);
                y = 25;
              }

              doc.setDrawColor(226, 232, 240);
              doc.rect(margin, y, contentWidth, maxRowHeight, 'S');

              formattedCells.forEach((cellLines, cIdx) => {
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
          const cleanExTitle = cleanText(ex.title);
          const rawCode = String(ex.code || '').replace(/\t/g, '  ');

          if (y > pageHeight - 45) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(1, 51, 35);
          doc.text(`Code Example: ${cleanExTitle}`, margin, y);
          y += 5;

          // Wrap code lines to ensure code stays strictly within box width
          doc.setFont("courier", "normal");
          doc.setFontSize(8);
          
          const rawLines = rawCode.split('\n');
          const codeLines = [];
          rawLines.forEach((l) => {
            const wrapped = doc.splitTextToSize(cleanText(l), contentWidth - 14);
            if (wrapped.length > 0) {
              codeLines.push(...wrapped);
            } else {
              codeLines.push('');
            }
          });

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
            const cleanExp = cleanText(ex.explanation);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            const expLines = doc.splitTextToSize(`Note: ${cleanExp}`, contentWidth);
            if (y + (expLines.length * 4) > pageHeight - 20) {
              doc.addPage();
              pageCount++;
              addHeaderFooter(pageCount);
              y = 25;
            }
            doc.text(expLines, margin, y);
            y += (expLines.length * 4) + 6;
          }
        });
      }

      // 5. Practice Exercise
      if (rm.practiceExercise) {
        const cleanPracTitle = cleanText(rm.practiceExercise.title);
        const cleanProblem = cleanText(rm.practiceExercise.problem);
        const rawSolCode = String(rm.practiceExercise.solutionCode || '').replace(/\t/g, '  ');

        if (y > pageHeight - 50) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(180, 83, 9); // Amber
        doc.text(`Practice Challenge: ${cleanPracTitle}`, margin, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const probLines = doc.splitTextToSize(cleanProblem, contentWidth);
        if (y + (probLines.length * 4) > pageHeight - 20) {
          doc.addPage();
          pageCount++;
          addHeaderFooter(pageCount);
          y = 25;
        }
        doc.text(probLines, margin, y);
        y += (probLines.length * 4) + 4;

        if (rawSolCode) {
          doc.setFont("courier", "normal");
          doc.setFontSize(8);
          
          const solRawLines = rawSolCode.split('\n');
          const solLines = [];
          solRawLines.forEach((l) => {
            const wrapped = doc.splitTextToSize(cleanText(l), contentWidth - 14);
            if (wrapped.length > 0) {
              solLines.push(...wrapped);
            } else {
              solLines.push('');
            }
          });

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
        if (y > pageHeight - 35) {
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
          const cleanKt = cleanText(kt);
          const lines = doc.splitTextToSize(`- ${cleanKt}`, contentWidth - 5);
          if (y + (lines.length * 4.2) > pageHeight - 20) {
            doc.addPage();
            pageCount++;
            addHeaderFooter(pageCount);
            y = 25;
          }
          doc.text(lines, margin + 4, y);
          y += (lines.length * 4.2) + 1.5;
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
  doc.text(`Student Name: ${cleanStudentName}`, margin + 15, y + 60);
  doc.text(`Course Title: ${cleanCourseTitle}`, margin + 15, y + 70);
  doc.text(`Total Modules Completed: ${course.modules.length} / ${course.modules.length} (100%)`, margin + 15, y + 80);
  doc.text(`Credential Platform: Arshith Ignite`, margin + 15, y + 90);
  doc.text(`Official Tagline: Learn Today, Build Tomorrow`, margin + 15, y + 100);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 215, 0); // Gold
  doc.text("* Verified Official Course Document *", margin + 15, y + 120);

  if (typeof doc.save === 'function' && typeof window !== 'undefined') {
    const filename = `ArshithIgnite_${course.id}_Complete_Course.pdf`;
    doc.save(filename);
  }

  return doc;
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
  doc.text(cleanText(paper.title || "Examination Paper"), margin, y + 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Candidate: ${cleanText(paper.studentName || 'Student')} | Roll No: ${cleanText(paper.rollNo || 'N/A')}`, margin, y + 18);
  doc.text(`Course: ${cleanText(course.title || 'Course')}`, margin, y + 24);
  const filename = `${paper.id || 'question-paper'}.pdf`;
  doc.save(filename);
}

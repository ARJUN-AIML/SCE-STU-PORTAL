import jsPDF from "jspdf"
import "jspdf-autotable"
import { ScheduleEntry } from "@/types"

export async function exportTimetableToPDF(
  schedule: ScheduleEntry[],
  filters: { department: string; year: string; semester: string; section: string }
) {
  const doc = new jsPDF("landscape")
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  doc.setProperties({
    title: `Academic Timetable - ${filters.department} Year ${filters.year} Semester ${filters.semester}`,
    subject: "Saranathan College of Engineering timetable aligned to Anna University R2021 course structure",
    author: "SCE Campus OS",
    creator: "SCE Campus OS",
  })

  // Header Background
  doc.setFillColor(249, 250, 251)
  doc.rect(0, 0, pageWidth, 50, "F")

  // College Name & Details
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(30, 58, 138) // primary blue
  doc.text("Saranathan College of Engineering", 14, 24)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.setTextColor(75, 85, 99)
  doc.text(`Academic Timetable • Department of ${filters.department} • Year ${filters.year} • Semester ${filters.semester} • Section ${filters.section}`, 14, 34)
  
  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text(`Anna University R2021 aligned • Generated: ${new Date().toLocaleString()}`, 14, 42)

  if (!schedule || schedule.length === 0) {
    doc.text("No timetable data available.", 14, 70)
    doc.save(`${filters.department}-Year${filters.year}-Sem${filters.semester}-Section${filters.section}.pdf`)
    return
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const periods = ["1", "2", "3", "4", "5", "6", "7"]

  const tableData = days.map((day) => {
    const row = [day]
    periods.forEach((p) => {
      const entry = schedule.find((s) => s.day === day && s.period === p)
      if (entry) {
        row.push(`${entry.subjectCode}\n${entry.subjectName}\n${entry.faculty}\n${entry.room}`)
      } else {
        row.push("-")
      }
    })
    return row
  })

  // @ts-ignore
  doc.autoTable({
    startY: 55,
    head: [["Day", "P1\n08:45-09:35", "P2\n09:35-10:25", "P3\n10:45-11:35", "P4\n11:35-12:25", "P5\n13:15-14:05", "P6\n14:05-14:55", "P7\n14:55-15:45"]],
    body: tableData,
    theme: "grid",
    headStyles: { 
      fillColor: [37, 99, 235], 
      textColor: 255, 
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      minCellHeight: 12
    },
    styles: { 
      fontSize: 8, 
      cellPadding: 4, 
      valign: "middle", 
      halign: "center",
      lineColor: [229, 231, 235],
      lineWidth: 0.1
    },
    columnStyles: { 
      0: { fontStyle: "bold", halign: "left", fillColor: [249, 250, 251], textColor: [31, 41, 55] } 
    },
    alternateRowStyles: {
      fillColor: [252, 253, 253]
    },
    margin: { top: 55, bottom: 20, left: 14, right: 14 }
  })

  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    
    // Footer line
    doc.setDrawColor(229, 231, 235)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text("SCE Campus OS • Anna University R2021 aligned", 14, pageHeight - 8)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: "right" })
  }

  doc.save(`${filters.department}-Year${filters.year}-Sem${filters.semester}-Section${filters.section}.pdf`)
}

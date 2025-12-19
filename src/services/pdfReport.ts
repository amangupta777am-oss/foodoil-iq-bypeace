import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export interface ReportData {
  batchId: string;
  testDate: string;
  stationName: string;
  location: string;
  equipment: string;
  oilType: string;
  results: {
    ffa: number;
    tpc: number;
    pv: number;
    score: number;
    classification: 'pass' | 'borderline' | 'reject';
    confidence: number;
  };
  limits: {
    ffa: number;
    tpc: number;
    pv: number;
  };
  operatorName?: string;
  companyName?: string;
  companyAddress?: string;
}

export const generatePdfReport = async (data: ReportData): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [30, 64, 102]; // Deep blue
  const secondaryColor: [number, number, number] = [34, 139, 113]; // Teal
  const successColor: [number, number, number] = [34, 139, 72];
  const warningColor: [number, number, number] = [245, 158, 11];
  const dangerColor: [number, number, number] = [220, 38, 38];

  // Company header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo placeholder and title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FoodOil IQ', 20, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Oil Quality Testing', 20, 28);
  
  // Report type badge
  doc.setFontSize(12);
  doc.text('OIL QUALITY TEST REPORT', pageWidth - 20, 20, { align: 'right' });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 28, { align: 'right' });

  // Company info (if provided)
  if (data.companyName) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    let yPos = 50;
    doc.text(data.companyName, 20, yPos);
    if (data.companyAddress) {
      doc.text(data.companyAddress, 20, yPos + 5);
    }
  }

  // Classification badge
  let badgeColor = successColor;
  let badgeText = 'PASSED';
  if (data.results.classification === 'borderline') {
    badgeColor = warningColor;
    badgeText = 'BORDERLINE';
  } else if (data.results.classification === 'reject') {
    badgeColor = dangerColor;
    badgeText = 'REJECTED';
  }

  const badgeY = 55;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(pageWidth - 60, badgeY - 8, 50, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeText, pageWidth - 35, badgeY + 1, { align: 'center' });

  // Test Information Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Test Information', 20, 80);
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 83, 100, 83);

  // Test info table
  doc.autoTable({
    startY: 88,
    head: [],
    body: [
      ['Batch ID', data.batchId],
      ['Test Date', new Date(data.testDate).toLocaleString()],
      ['Station', data.stationName],
      ['Location', data.location],
      ['Equipment', data.equipment],
      ['Oil Type', data.oilType],
      ['Operator', data.operatorName || 'N/A'],
    ],
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 80 },
    },
    margin: { left: 20 },
  });

  // Results Section
  let yPos = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Test Results', 20, yPos);
  
  doc.setDrawColor(...primaryColor);
  doc.line(20, yPos + 3, 100, yPos + 3);

  // Score circle
  const scoreX = pageWidth - 45;
  const scoreY = yPos + 25;
  doc.setFillColor(...badgeColor);
  doc.circle(scoreX, scoreY, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(String(data.results.score), scoreX, scoreY + 2, { align: 'center' });
  doc.setFontSize(8);
  doc.text('SCORE', scoreX, scoreY + 10, { align: 'center' });

  // Results table
  const getStatusColor = (value: number, limit: number): [number, number, number] => {
    const ratio = value / limit;
    if (ratio < 0.7) return successColor;
    if (ratio < 0.9) return warningColor;
    return dangerColor;
  };

  doc.autoTable({
    startY: yPos + 8,
    head: [['Parameter', 'Value', 'Limit', 'Status']],
    body: [
      [
        'Free Fatty Acid (FFA)',
        `${data.results.ffa.toFixed(2)} %`,
        `≤ ${data.limits.ffa} %`,
        data.results.ffa <= data.limits.ffa ? 'Within Limits' : 'Exceeded'
      ],
      [
        'Total Polar Compounds (TPC)',
        `${data.results.tpc.toFixed(1)} %`,
        `≤ ${data.limits.tpc} %`,
        data.results.tpc <= data.limits.tpc ? 'Within Limits' : 'Exceeded'
      ],
      [
        'Peroxide Value (PV)',
        `${data.results.pv.toFixed(1)} meq/kg`,
        `≤ ${data.limits.pv} meq/kg`,
        data.results.pv <= data.limits.pv ? 'Within Limits' : 'Exceeded'
      ],
    ],
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 60 },
      3: { fontStyle: 'bold' },
    },
    margin: { left: 20, right: 60 },
    didParseCell: (data: any) => {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'Exceeded') {
          data.cell.styles.textColor = dangerColor;
        } else {
          data.cell.styles.textColor = successColor;
        }
      }
    },
  });

  // AI Confidence
  yPos = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`AI Confidence: ${data.results.confidence.toFixed(1)}%`, 20, yPos);

  // Compliance Certificate Section
  yPos += 20;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, yPos - 5, pageWidth - 30, 50, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('COMPLIANCE CERTIFICATE', pageWidth / 2, yPos + 5, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const certText = data.results.classification === 'pass'
    ? 'This oil sample has been tested and meets the quality standards as per FSSAI/Codex Alimentarius guidelines. The oil is suitable for continued use in food preparation.'
    : data.results.classification === 'borderline'
    ? 'This oil sample shows parameters approaching regulatory limits. Increased monitoring frequency is recommended. Consider replacement if values continue to rise.'
    : 'This oil sample has FAILED to meet regulatory standards and is NOT recommended for food preparation. Immediate replacement is required.';
  
  const splitText = doc.splitTextToSize(certText, pageWidth - 50);
  doc.text(splitText, pageWidth / 2, yPos + 15, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text(`Certificate ID: CERT-${data.batchId}-${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, yPos + 38, { align: 'center' });

  // Disclaimer
  yPos += 60;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'italic');
  const disclaimer = 'Disclaimer: This is an AI-assisted screening tool. For borderline or rejected samples, laboratory confirmation is recommended. Results should be interpreted by qualified food safety personnel.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('FoodOil IQ - Smart Oil Quality Testing Platform', 20, footerY);
  doc.text('Page 1 of 1', pageWidth - 20, footerY, { align: 'right' });

  return doc.output('blob');
};

export const downloadPdfReport = async (data: ReportData): Promise<void> => {
  const blob = await generatePdfReport(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FoodOilIQ_Report_${data.batchId}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

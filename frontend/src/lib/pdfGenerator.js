import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "@/lib/api";

// Color palette
const COLORS = {
  primary:   [0,   102, 204],   // deep blue
  accent:    [255, 107,   0],   // orange
  dark:      [15,  23,  42],    // slate-900
  mid:       [71,  85, 105],    // slate-600
  light:     [226, 232, 240],   // slate-200
  white:     [255, 255, 255],
  success:   [22,  163,  74],
  warning:   [217, 119,   6],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;

/**
 * Draw a rounded rectangle (simulated with lines for jsPDF compatibility)
 */
function roundRect(doc, x, y, w, h, r = 4) {
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

/**
 * Fetch logo as base64 for embedding
 */
async function fetchLogoBase64(logoUrl) {
  try {
    if (!logoUrl) return null;
    const fullUrl = logoUrl.startsWith('http') ? logoUrl : `http://localhost:4000${logoUrl}`;
    const res = await fetch(fullUrl);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Fetch site content for logo + contact info
 */
async function getSiteInfo() {
  try {
    const res = await api.get('/site-content');
    return res.data;
  } catch {
    return {};
  }
}

export async function generateBookingPDF(booking, user, itemType = 'Package') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const site = await getSiteInfo();
  const bookingId = (booking.id || '').toString().substring(0, 8).toUpperCase() || ('PKG' + Math.floor(Math.random() * 100000));
  const bookingDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const travelDate = booking.travel_date ? new Date(booking.travel_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD';
  const statusText = (booking.status || 'pending').toUpperCase();
  const statusColor = booking.status === 'confirmed' || booking.status === 'paid' ? COLORS.success : booking.status === 'cancelled' ? [220, 38, 38] : COLORS.warning;

  // ── HEADER BANNER ────────────────────────────────────────────
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, PAGE_W, 52, 'F');

  // Accent bar at bottom of header
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 50, PAGE_W, 2, 'F');

  // Try logo
  const logoSrc = site.logo_light_url || site.logo_dark_url || null;
  let logoBase64 = logoSrc ? await fetchLogoBase64(logoSrc) : null;

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', MARGIN, 10, 40, 16);
    } catch {
      logoBase64 = null;
    }
  }

  if (!logoBase64) {
    // Fallback text logo
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(site.site_name || 'FlyEasy', MARGIN, 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(178, 210, 255);
    doc.text('Your trusted travel partner', MARGIN, 31);
  }

  // Booking Confirmation label (right side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.white);
  doc.text('BOOKING CONFIRMATION', PAGE_W - MARGIN, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(178, 210, 255);
  doc.text(`Ref #: ${bookingId}`, PAGE_W - MARGIN, 28, { align: 'right' });
  doc.text(`Date: ${bookingDate}`, PAGE_W - MARGIN, 34, { align: 'right' });

  // ── STATUS BADGE ─────────────────────────────────────────────
  const statusX = PAGE_W - MARGIN - 32;
  doc.setFillColor(...COLORS.white);
  roundRect(doc, statusX, 38, 32, 10, 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...statusColor);
  doc.text(statusText, statusX + 16, 44.5, { align: 'center' });

  // ── TICKET STUB SECTION ───────────────────────────────────────
  let y = 62;

  // Passenger & Trip info cards side by side
  const cardW = (PAGE_W - MARGIN * 2 - 8) / 2;

  // Left card: Passenger
  doc.setFillColor(248, 250, 252);
  roundRect(doc, MARGIN, y, cardW, 52, 5);
  doc.setFillColor(...COLORS.primary);
  roundRect(doc, MARGIN, y, cardW, 9, 5);
  doc.setFillColor(...COLORS.primary);
  doc.rect(MARGIN, y + 4, cardW, 5, 'F'); // flat bottom of header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.white);
  doc.text('PASSENGER DETAILS', MARGIN + 4, y + 6.5);

  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(user?.name || booking.customer_name || 'Guest', MARGIN + 4, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.mid);
  const passengerLines = [
    { label: 'Email', value: user?.email || booking.customer_email || 'N/A' },
    { label: 'Phone', value: user?.phone || booking.customer_phone || 'N/A' },
    { label: 'Travelers', value: `${booking.number_of_travelers || 1} Person(s)` },
  ];
  passengerLines.forEach((item, i) => {
    const ly = y + 26 + i * 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.mid);
    doc.text(item.label + ':', MARGIN + 4, ly);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.dark);
    doc.text(String(item.value), MARGIN + 22, ly);
  });

  // Right card: Trip Details
  const cardX2 = MARGIN + cardW + 8;
  doc.setFillColor(248, 250, 252);
  roundRect(doc, cardX2, y, cardW, 52, 5);
  doc.setFillColor(...COLORS.accent);
  roundRect(doc, cardX2, y, cardW, 9, 5);
  doc.setFillColor(...COLORS.accent);
  doc.rect(cardX2, y + 4, cardW, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.white);
  doc.text('TRIP DETAILS', cardX2 + 4, y + 6.5);

  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const titleText = doc.splitTextToSize(booking.package_title || `${itemType} Booking`, cardW - 8);
  doc.text(titleText[0], cardX2 + 4, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.mid);
  const tripLines = [
    { label: 'Type',   value: itemType },
    { label: 'Travel', value: travelDate },
    { label: 'Amount', value: `BDT ${parseFloat(booking.total_price || 0).toLocaleString()}` },
  ];
  tripLines.forEach((item, i) => {
    const ly = y + 26 + i * 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.mid);
    doc.text(item.label + ':', cardX2 + 4, ly);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.dark);
    doc.text(String(item.value), cardX2 + 20, ly);
  });

  y += 60;

  // ── DASHED DIVIDER (tear line style) ─────────────────────────
  doc.setDrawColor(...COLORS.light);
  doc.setLineDashPattern([3, 2], 0);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  doc.setLineDashPattern([], 0);

  // Scissors icon text
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.light);
  doc.text('✂', PAGE_W / 2, y - 1, { align: 'center' });

  y += 6;

  // ── BOOKING SUMMARY TABLE ────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dark);
  doc.text('Booking Summary', MARGIN, y + 6);
  y += 12;

  const summaryRows = [
    ['Package / Service', booking.package_title || 'N/A'],
    ['Booking Type', itemType],
    ['Travel Date', travelDate],
    ['No. of Travelers', `${booking.number_of_travelers || 1} Person(s)`],
    ['Booking Reference', `#${bookingId}`],
    ['Booking Date', bookingDate],
    ['Status', statusText],
    ['Payment Status', booking.status === 'paid' ? 'PAID' : 'PENDING'],
  ];

  if (booking.message) summaryRows.push(['Notes / Requests', booking.message]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: PAGE_W - MARGIN * 2,
    theme: 'grid',
    styles: {
      fontSize: 9.5,
      cellPadding: 4,
      textColor: COLORS.dark,
      lineColor: COLORS.light,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60, fillColor: [241, 245, 249] },
      1: { cellWidth: 'auto' },
    },
    body: summaryRows,
    alternateRowStyles: { fillColor: [250, 251, 253] },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ── TOTAL PRICE HIGHLIGHT ────────────────────────────────────
  doc.setFillColor(0, 102, 204);
  roundRect(doc, MARGIN, y, PAGE_W - MARGIN * 2, 18, 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.white);
  doc.text('Total Amount:', MARGIN + 6, y + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`BDT ${parseFloat(booking.total_price || 0).toLocaleString()}`, PAGE_W - MARGIN - 6, y + 12, { align: 'right' });

  y += 26;

  // ── IMPORTANT NOTES ──────────────────────────────────────────
  doc.setFillColor(254, 243, 199); // amber-50
  roundRect(doc, MARGIN, y, PAGE_W - MARGIN * 2, 28, 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('⚠  IMPORTANT NOTES', MARGIN + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const notes = [
    '• This is a booking request confirmation, not a final ticket.',
    '• Our team will contact you within 24 hours to confirm availability.',
    '• Free cancellation available up to 7 days before travel date.',
  ];
  notes.forEach((note, i) => {
    doc.text(note, MARGIN + 5, y + 14 + i * 5);
  });

  y += 36;

  // ── CONTACT INFO ─────────────────────────────────────────────
  doc.setDrawColor(...COLORS.light);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.mid);
  doc.text('Need Help?', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const contactParts = [];
  if (site.contact_email || site.support_email) contactParts.push(`📧 ${site.support_email || site.contact_email}`);
  if (site.contact_phone) contactParts.push(`📞 ${site.contact_phone}`);
  if (site.contact_whatsapp) contactParts.push(`💬 WhatsApp: ${site.contact_whatsapp}`);
  if (site.contact_address) contactParts.push(`📍 ${site.contact_address}`);

  contactParts.forEach((part, i) => {
    doc.text(part, MARGIN, y + 7 + i * 6);
  });

  // ── FOOTER ───────────────────────────────────────────────────
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, PAGE_H - 20, PAGE_W, 20, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`© ${new Date().getFullYear()} ${site.site_name || 'FlyEasy Tourism'}. All Rights Reserved.`, PAGE_W / 2, PAGE_H - 12, { align: 'center' });
  doc.text(site.site_domain || 'www.flyeasytourism.com', PAGE_W / 2, PAGE_H - 6, { align: 'center' });

  doc.save(`FlyEasy_Ticket_${bookingId}.pdf`);
}

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type RecordValue = Record<string, any>;

export interface EventDocumentData {
  eventPlan: RecordValue;
  riskAssessment?: RecordValue | null;
  travelPlan?: RecordValue | null;
  kitList?: RecordValue | null;
  schedule?: RecordValue[] | null;
  eventDescription?: string;
}

const PAGE_MARGIN = 16;
const CONTENT_WIDTH = 178;
const PAGE_BOTTOM = 280;
const BLUE: [number, number, number] = [5, 52, 133];
const DARK: [number, number, number] = [30, 41, 59];
const MUTED: [number, number, number] = [71, 85, 105];

const safeText = (value: unknown, fallback = "TBC"): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
};

const formatDate = (value: unknown): string => {
  if (typeof value !== "string" || !value) return "TBC";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const asRecords = (value: unknown): RecordValue[] =>
  Array.isArray(value) ? value.filter((item): item is RecordValue => Boolean(item) && typeof item === "object") : [];

const fileSlug = (value: unknown): string =>
  safeText(value, "event")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "event";

class PdfLayout {
  private y = PAGE_MARGIN;

  constructor(private readonly doc: jsPDF) {}

  private ensureSpace(height: number) {
    if (this.y + height <= PAGE_BOTTOM) return;
    this.doc.addPage();
    this.y = PAGE_MARGIN;
  }

  title(title: string, subtitle: string) {
    this.doc.setTextColor(...BLUE);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(20);
    this.doc.text(title, 105, this.y + 4, { align: "center" });
    this.doc.setFontSize(14);
    const subtitleLines = this.doc.splitTextToSize(subtitle, CONTENT_WIDTH);
    this.doc.text(subtitleLines, 105, this.y + 13, { align: "center" });
    this.y += 17 + subtitleLines.length * 6;
    this.doc.setDrawColor(...BLUE);
    this.doc.setLineWidth(0.7);
    this.doc.line(PAGE_MARGIN, this.y, 194, this.y);
    this.y += 9;
  }

  section(title: string) {
    this.ensureSpace(18);
    this.doc.setFillColor(235, 241, 248);
    this.doc.roundedRect(PAGE_MARGIN, this.y, CONTENT_WIDTH, 9, 1, 1, "F");
    this.doc.setTextColor(...BLUE);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(title, PAGE_MARGIN + 3, this.y + 6.2);
    this.y += 14;
  }

  field(label: string, value: unknown) {
    const labelText = `${label}:`;
    const labelWidth = 43;
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const lines = this.doc.splitTextToSize(safeText(value), CONTENT_WIDTH - labelWidth);
    this.ensureSpace(8);
    this.doc.setTextColor(...DARK);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(labelText, PAGE_MARGIN, this.y);
    this.doc.setFont("helvetica", "normal");
    for (const line of lines) {
      this.ensureSpace(5);
      this.doc.text(line, PAGE_MARGIN + labelWidth, this.y);
      this.y += 5;
    }
    this.y += 3;
  }

  subheading(title: string) {
    this.ensureSpace(30);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10.5);
    this.doc.setTextColor(...DARK);
    this.doc.text(title, PAGE_MARGIN, this.y);
    this.y += 7;
  }

  bullet(item: unknown, caption?: unknown) {
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    const itemLines = this.doc.splitTextToSize(safeText(item), CONTENT_WIDTH - 9);
    const captionText = safeText(caption, "");
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(9);
    const captionLines = captionText ? this.doc.splitTextToSize(captionText, CONTENT_WIDTH - 13) : [];
    const height = itemLines.length * 5 + captionLines.length * 4.5 + 3;
    this.ensureSpace(Math.min(height, PAGE_BOTTOM - PAGE_MARGIN));
    this.doc.setFillColor(...BLUE);
    this.doc.circle(PAGE_MARGIN + 1.5, this.y - 1.2, 0.8, "F");
    this.doc.setTextColor(...DARK);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    for (const line of itemLines) {
      this.ensureSpace(5);
      this.doc.text(line, PAGE_MARGIN + 6, this.y);
      this.y += 5;
    }
    if (captionLines.length) {
      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(9);
      this.doc.setTextColor(...MUTED);
      for (const line of captionLines) {
        this.ensureSpace(4.5);
        this.doc.text(line, PAGE_MARGIN + 10, this.y);
        this.y += 4.5;
      }
    }
    this.y += 3;
  }

  scheduleItem(item: RecordValue) {
    const time = `${safeText(item.start_time)} - ${safeText(item.end_time)}`;
    const activity = safeText(item.activity);
    const details = `Lead: ${safeText(item.lead_person)} | Audience: ${safeText(item.target_audience, "All")}`;
    const notes = safeText(item.notes, "");
    autoTable(this.doc, {
      startY: this.y - 2,
      margin: { top: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN, bottom: 17 },
      theme: "grid",
      body: [[time, `${activity}\n${details}${notes ? `\nNotes: ${notes}` : ""}`]],
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: 37, fontStyle: "bold" } },
      didDrawPage: (hook) => { this.y = hook.cursor?.y ?? PAGE_MARGIN; },
    });
    this.y += 7;
  }

  footer() {
    const pages = this.doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      this.doc.setPage(page);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(...MUTED);
      this.doc.text(`Page ${page} of ${pages}`, 194, 290, { align: "right" });
    }
  }
}

const addEventOverview = (layout: PdfLayout, eventPlan: RecordValue, description?: string) => {
  layout.section("Event overview");
  layout.field("Location", eventPlan.location);
  layout.field("Dates", `${formatDate(eventPlan.start_date)} to ${formatDate(eventPlan.end_date || eventPlan.start_date)}`);
  layout.field("Staff lead", eventPlan.staff_lead);
  layout.field("Participants", `${safeText(eventPlan.total_cadets, "0")} cadets, ${safeText(eventPlan.total_staff, "0")} staff`);
  layout.field("Emergency contact", eventPlan.emergency_contact);
  if (description) layout.field("Description", description);
};

const addTravel = (layout: PdfLayout, travelPlan?: RecordValue | null) => {
  if (!travelPlan) return;
  layout.section("Travel arrangements");
  layout.field("Transport", travelPlan.transport_method);
  layout.field("Collection point", travelPlan.collection_point);
  layout.field("Drop-off point", travelPlan.drop_off_point);
  layout.field("Departure", travelPlan.departure_time);
  layout.field("Return", travelPlan.return_time);
  if (travelPlan.map_link) layout.field("Map", travelPlan.map_link);
  const vehicles = asRecords(travelPlan.vehicle_details);
  if (vehicles.length) {
    layout.subheading("Vehicles");
    vehicles.forEach((vehicle) => layout.bullet(`${safeText(vehicle.vrn)} — driver: ${safeText(vehicle.driver_name)}`));
  }
};

const addKitGroup = (layout: PdfLayout, title: string, value: unknown) => {
  const items = Array.isArray(value) ? value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [{ item, caption: "" }];
    if (item && typeof item === "object" && !Array.isArray(item)) return [item as RecordValue];
    return [];
  }) : [];
  if (!items.length) return;
  layout.subheading(title);
  items.forEach((item) => layout.bullet(item.item, item.caption));
};

const addKit = (layout: PdfLayout, kitList?: RecordValue | null) => {
  if (!kitList) return;
  const cadetKit = kitList.cadet_kit && typeof kitList.cadet_kit === "object" ? kitList.cadet_kit as RecordValue : {};
  const hasKit = [cadetKit.general, cadetKit.male, cadetKit.female, kitList.staff_kit].some((items) => Array.isArray(items) && items.length);
  if (!hasKit) return;
  layout.section("Required kit");
  if (kitList.activity_type) layout.field("Activity type", kitList.activity_type);
  addKitGroup(layout, "General kit (all cadets)", cadetKit.general);
  addKitGroup(layout, "Male-specific kit", cadetKit.male);
  addKitGroup(layout, "Female-specific kit", cadetKit.female);
  addKitGroup(layout, "Staff kit", kitList.staff_kit);
};

const addSchedule = (layout: PdfLayout, schedule?: RecordValue[] | null) => {
  const items = asRecords(schedule);
  if (!items.length) return;
  layout.section("Event schedule");
  let currentDate = "";
  items.forEach((item) => {
    const date = formatDate(item.date);
    if (date !== currentDate) {
      layout.subheading(date);
      currentDate = date;
    }
    layout.scheduleItem(item);
  });
};

const addRiskReference = (layout: PdfLayout, riskAssessment?: RecordValue | null) => {
  if (!riskAssessment) return;
  layout.section("Risk assessment reference");
  layout.field("Activity", riskAssessment.activity_title || riskAssessment.title);
  layout.field("Assessor", riskAssessment.assessor_name || riskAssessment.assessor);
  layout.field("Assessment date", formatDate(riskAssessment.assessment_date || riskAssessment.date));
  if (riskAssessment.squadron) layout.field("Squadron", riskAssessment.squadron);
};

const createDocument = (title: string, data: EventDocumentData) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const layout = new PdfLayout(doc);
  layout.title(title, safeText(data.eventPlan.name || data.eventPlan.event_name, "Event"));
  return { doc, layout };
};

export const exportJoiningOrdersPdf = (data: EventDocumentData) => {
  const { doc, layout } = createDocument("JOINING ORDERS", data);
  addEventOverview(layout, data.eventPlan, data.eventDescription);
  addTravel(layout, data.travelPlan);
  addKit(layout, data.kitList);
  addSchedule(layout, data.schedule);
  addRiskReference(layout, data.riskAssessment);
  layout.footer();
  doc.save(`joining-orders-${fileSlug(data.eventPlan.name || data.eventPlan.event_name)}.pdf`);
};

export const exportCompleteEventPackPdf = (data: EventDocumentData) => {
  const { doc, layout } = createDocument("COMPLETE EVENT PACK", data);
  addEventOverview(layout, data.eventPlan, data.eventDescription);
  addRiskReference(layout, data.riskAssessment);
  addTravel(layout, data.travelPlan);
  addKit(layout, data.kitList);
  addSchedule(layout, data.schedule);
  layout.section("Important notes");
  [
    "All participants must arrive at the specified collection point on time.",
    "Ensure all required kit is packed and clearly labelled.",
    "Emergency contact details must be readily available.",
    "All safety controls in the linked risk assessment must be followed.",
    "Changes to the plan will be communicated through official channels.",
  ].forEach((note) => layout.bullet(note));
  layout.footer();
  doc.save(`event-pack-${fileSlug(data.eventPlan.name)}.pdf`);
};
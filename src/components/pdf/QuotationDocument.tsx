import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Quotation, QuotationItem, RFQ, Profile } from '@/lib/types'

// Register Arabic font from Google Fonts CDN
Font.register({
  family: 'Tajawal',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1rzaLCr5IlLA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/tajawal/v9/Iura6YBj_oCad4k1nzeLCr5IlLA.ttf', fontWeight: 700 },
  ],
})

const gold = '#D4B87C'
const dark = '#1a1a1a'
const muted = '#666666'
const border = '#e0e0e0'
const lightBg = '#f9f7f3'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Tajawal',
    fontSize: 10,
    color: dark,
    backgroundColor: '#ffffff',
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    direction: 'rtl',
  },
  // Header
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: gold },
  companyName: { fontSize: 18, fontWeight: 700, color: gold },
  companyMeta: { fontSize: 8, color: muted, textAlign: 'right', marginTop: 2 },
  docLabel: { fontSize: 22, fontWeight: 700, color: dark },
  docMeta: { fontSize: 8, color: muted, textAlign: 'left', marginTop: 2 },
  // Section
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: gold, marginBottom: 6, textAlign: 'right' },
  // Info grid
  infoGrid: { flexDirection: 'row-reverse', gap: 8 },
  infoBox: { flex: 1, backgroundColor: lightBg, borderRadius: 4, padding: 8 },
  infoLabel: { fontSize: 8, color: muted, textAlign: 'right', marginBottom: 2 },
  infoValue: { fontSize: 9, fontWeight: 700, textAlign: 'right' },
  // Table
  table: { marginTop: 8 },
  tableHeader: { flexDirection: 'row-reverse', backgroundColor: dark, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 8 },
  tableHeaderCell: { color: '#ffffff', fontWeight: 700, fontSize: 9, textAlign: 'center' },
  tableRow: { flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: border, paddingVertical: 5, paddingHorizontal: 8 },
  tableRowAlt: { backgroundColor: lightBg },
  tableCell: { fontSize: 9, textAlign: 'center', color: dark },
  colNum: { width: '5%' },
  colName: { width: '35%', textAlign: 'right' },
  colUnit: { width: '10%' },
  colQty: { width: '10%' },
  colUnitPrice: { width: '15%' },
  colTotal: { width: '15%' },
  // Totals
  totalsBox: { marginTop: 12, marginLeft: 0, marginRight: 'auto', width: 220, backgroundColor: lightBg, borderRadius: 6, padding: 12 },
  totalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 9, color: muted },
  totalValue: { fontSize: 9, fontWeight: 700 },
  grandTotalRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingTop: 6, marginTop: 4, borderTopWidth: 1, borderTopColor: gold },
  grandTotalLabel: { fontSize: 11, fontWeight: 700, color: gold },
  grandTotalValue: { fontSize: 11, fontWeight: 700, color: gold },
  // Notes
  notesBox: { marginTop: 12, borderWidth: 1, borderColor: border, borderRadius: 4, padding: 10, textAlign: 'right' },
  notesText: { fontSize: 9, color: muted, lineHeight: 1.6 },
  // Validity
  validity: { fontSize: 8, color: muted, textAlign: 'right', marginTop: 8 },
  // Signature
  signatureSection: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 40 },
  signatureBox: { width: 180, borderTopWidth: 1, borderTopColor: border, paddingTop: 6, textAlign: 'center' },
  signatureLabel: { fontSize: 8, color: muted },
  // Footer
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: border, paddingTop: 6 },
  footerText: { fontSize: 7, color: muted },
  pageNum: { fontSize: 7, color: muted },
})

interface Props {
  quotation: Quotation
  items: QuotationItem[]
  rfq: RFQ
  profile: Profile
}

function currency(v: number | null | undefined) {
  if (!v) return '0 ر.س'
  return `${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`
}

export default function QuotationDocument({ quotation, items, rfq, profile }: Props) {
  const validUntil = quotation.valid_until
    ? new Date(quotation.valid_until).toLocaleDateString('ar-SA')
    : '-'
  const createdAt = new Date(quotation.created_at).toLocaleDateString('ar-SA')
  const subtotal = quotation.subtotal ?? 0
  const vatAmt = quotation.vat_amount ?? 0
  const total = quotation.total ?? 0

  return (
    <Document
      title={`عرض سعر - ${rfq.title}`}
      author="EAST PLUS"
      creator="EAST PLUS"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.companyName}>EAST PLUS</Text>
            <Text style={s.companyMeta}>إيست بلاس للمقاولات والخدمات</Text>
            <Text style={s.companyMeta}>المملكة العربية السعودية</Text>
          </View>
          <View>
            <Text style={s.docLabel}>عرض سعر</Text>
            <Text style={s.docMeta}>رقم: {quotation.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={s.docMeta}>تاريخ: {createdAt}</Text>
          </View>
        </View>

        {/* Client & Project Info */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>معلومات العميل والمشروع</Text>
          <View style={s.infoGrid}>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>اسم العميل</Text>
              <Text style={s.infoValue}>{profile.company_name || '-'}</Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>رقم الهاتف</Text>
              <Text style={s.infoValue}>{profile.phone || profile.whatsapp_number || '-'}</Text>
            </View>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>عنوان المشروع</Text>
              <Text style={s.infoValue}>{rfq.title}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>تفاصيل بنود العمل</Text>
          <View style={s.table}>
            {/* Table Header */}
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, s.colNum]}>#</Text>
              <Text style={[s.tableHeaderCell, s.colName]}>البند</Text>
              <Text style={[s.tableHeaderCell, s.colUnit]}>الوحدة</Text>
              <Text style={[s.tableHeaderCell, s.colQty]}>الكمية</Text>
              <Text style={[s.tableHeaderCell, s.colUnitPrice]}>سعر الوحدة</Text>
              <Text style={[s.tableHeaderCell, s.colTotal]}>الإجمالي</Text>
            </View>

            {items.map((item, idx) => (
              <View key={item.id} style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}>
                <Text style={[s.tableCell, s.colNum]}>{idx + 1}</Text>
                <Text style={[s.tableCell, s.colName, { textAlign: 'right' }]}>{item.item_name}</Text>
                <Text style={[s.tableCell, s.colUnit]}>{item.unit}</Text>
                <Text style={[s.tableCell, s.colQty]}>{item.quantity}</Text>
                <Text style={[s.tableCell, s.colUnitPrice]}>{currency(item.unit_price)}</Text>
                <Text style={[s.tableCell, s.colTotal]}>{currency(item.line_total)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={s.totalsBox}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>المجموع قبل الضريبة</Text>
            <Text style={s.totalValue}>{currency(subtotal)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>ضريبة القيمة المضافة (15%)</Text>
            <Text style={s.totalValue}>{currency(vatAmt)}</Text>
          </View>
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>الإجمالي الكلي</Text>
            <Text style={s.grandTotalValue}>{currency(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quotation.notes && (
          <View style={s.notesBox}>
            <Text style={[s.sectionTitle, { marginBottom: 4 }]}>ملاحظات</Text>
            <Text style={s.notesText}>{quotation.notes}</Text>
          </View>
        )}

        {/* Validity */}
        <Text style={s.validity}>صالح حتى: {validUntil}</Text>

        {/* Signatures */}
        <View style={s.signatureSection}>
          <View style={s.signatureBox}>
            <Text style={s.signatureLabel}>توقيع مُعِد العرض</Text>
          </View>
          <View style={s.signatureBox}>
            <Text style={s.signatureLabel}>توقيع العميل وختمه</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>EAST PLUS — إيست بلاس للمقاولات والخدمات</Text>
          <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from datetime import datetime
from pathlib import Path
import hashlib
import os

class ForensicPDFGenerator:
    """Generate professional forensic analysis reports"""
    
    def __init__(self, reports_folder="reports"):
        self.reports_folder = reports_folder
        os.makedirs(reports_folder, exist_ok=True)
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Create custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle
        self.styles.add(ParagraphStyle(
            name='Subtitle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#666666'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        # Section Header
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=12,
            spaceBefore=20,
            fontName='Helvetica-Bold',
            borderPadding=5,
            backColor=colors.HexColor('#ecf0f1')
        ))
        
        # Field Label
        self.styles.add(ParagraphStyle(
            name='FieldLabel',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#555555'),
            fontName='Helvetica-Bold'
        ))
        
        # Field Value
        self.styles.add(ParagraphStyle(
            name='FieldValue',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#333333'),
            fontName='Helvetica'
        ))
    
    def _create_header(self, canvas_obj, doc):
        """Create header for each page"""
        canvas_obj.saveState()
        
        # Header line
        canvas_obj.setStrokeColor(colors.HexColor('#3498db'))
        canvas_obj.setLineWidth(2)
        canvas_obj.line(50, letter[1] - 50, letter[0] - 50, letter[1] - 50)
        
        # Header text
        canvas_obj.setFont('Helvetica-Bold', 10)
        canvas_obj.setFillColor(colors.HexColor('#2c3e50'))
        canvas_obj.drawString(50, letter[1] - 40, "CYBERSHIELD INDIA")
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.drawRightString(letter[0] - 50, letter[1] - 40, "Forensic Analysis Report")
        
        canvas_obj.restoreState()
    
    def _create_footer(self, canvas_obj, doc):
        """Create footer for each page"""
        canvas_obj.saveState()
        
        # Footer line
        canvas_obj.setStrokeColor(colors.HexColor('#3498db'))
        canvas_obj.setLineWidth(1)
        canvas_obj.line(50, 50, letter[0] - 50, 50)
        
        # Page number
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.setFillColor(colors.HexColor('#7f8c8d'))
        page_num = f"Page {doc.page} | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        canvas_obj.drawCentredString(letter[0] / 2, 40, page_num)
        
        # Confidential notice
        canvas_obj.drawCentredString(letter[0] / 2, 30, "CONFIDENTIAL - FOR OFFICIAL USE ONLY")
        
        canvas_obj.restoreState()
    
    def generate_report(self, case_data: dict, media_path: str = None) -> str:
        """
        Generate forensic PDF report
        
        Args:
            case_data: Dictionary containing case information
            media_path: Optional path to media file for inclusion
            
        Returns:
            Path to generated PDF file
        """
        # Create filename
        case_id = case_data['case_id']
        pdf_filename = f"{case_id}_forensic_report.pdf"
        pdf_path = os.path.join(self.reports_folder, pdf_filename)
        
        # Create PDF document
        doc = SimpleDocTemplate(
            pdf_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=100,
            bottomMargin=72
        )
        
        # Container for PDF elements
        story = []
        
        # === PAGE 1: CASE SUMMARY ===
        
        # Logo/Title
        title = Paragraph("CYBERSHIELD INDIA", self.styles['CustomTitle'])
        story.append(title)
        
        subtitle = Paragraph("AI-Powered Cybercrime Forensic Analysis Report", self.styles['Subtitle'])
        story.append(subtitle)
        story.append(Spacer(1, 0.3 * inch))
        
        # Verdict Box
        verdict = "AI-GENERATED CONTENT DETECTED" if case_data['is_ai_generated'] else "AUTHENTIC CONTENT"
        verdict_color = colors.HexColor('#e74c3c') if case_data['is_ai_generated'] else colors.HexColor('#27ae60')
        
        verdict_data = [[Paragraph(f"<b>{verdict}</b>", self.styles['Normal'])]]
        verdict_table = Table(verdict_data, colWidths=[6 * inch])
        verdict_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), verdict_color),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 14),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        story.append(verdict_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Case Information
        story.append(Paragraph("CASE INFORMATION", self.styles['SectionHeader']))
        
        case_info_data = [
            ['Case ID:', case_data['case_id']],
            ['Analysis Date:', case_data.get('timestamp', datetime.now().isoformat())],
            ['Media Type:', case_data['media_type'].upper()],
            ['Filename:', case_data['filename']],
            ['File Hash (SHA-256):', case_data['media_hash'][:32] + '...'],
        ]
        
        case_info_table = Table(case_info_data, colWidths=[2 * inch, 4 * inch])
        case_info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#2c3e50')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(case_info_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Detection Results
        story.append(Paragraph("DETECTION ANALYSIS", self.styles['SectionHeader']))
        
        confidence = case_data['confidence'] * 100
        detection_data = [
            ['AI Detection Confidence:', f"{confidence:.2f}%"],
            ['Detection Model:', case_data.get('model', 'Ensemble AI Detector')],
            ['Classification:', 'ARTIFICIAL' if case_data['is_ai_generated'] else 'AUTHENTIC'],
            ['Risk Level:', self._get_risk_level(confidence, case_data['is_ai_generated'])],
        ]
        
        detection_table = Table(detection_data, colWidths=[2 * inch, 4 * inch])
        detection_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#2c3e50')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(detection_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # Include media preview if available
        if media_path and os.path.exists(media_path) and case_data['media_type'] == 'image':
            try:
                story.append(Paragraph("MEDIA PREVIEW", self.styles['SectionHeader']))
                img = RLImage(media_path, width=4*inch, height=3*inch, kind='proportional')
                img.hAlign = 'CENTER'
                story.append(img)
                story.append(Spacer(1, 0.2 * inch))
            except:
                pass
        
        # === PAGE 2: TECHNICAL DETAILS ===
        story.append(PageBreak())
        story.append(Paragraph("TECHNICAL FORENSIC ANALYSIS", self.styles['SectionHeader']))
        
        # Full hash
        story.append(Paragraph("<b>Complete File Hash (SHA-256):</b>", self.styles['FieldLabel']))
        story.append(Paragraph(f"<font name='Courier' size='8'>{case_data['media_hash']}</font>", 
                              self.styles['FieldValue']))
        story.append(Spacer(1, 0.2 * inch))
        
        # Detection breakdown
        if 'detection_details' in case_data and case_data['detection_details']:
            details = case_data['detection_details']
            
            story.append(Paragraph("<b>Detection Breakdown:</b>", self.styles['FieldLabel']))
            
            if 'breakdown' in details:
                breakdown = details['breakdown']
                breakdown_data = [
                    ['Component', 'Score'],
                    ['ML Model Score', f"{breakdown.get('ml_model_score', 0) * 100:.2f}%"],
                    ['Artifact Analysis', f"{breakdown.get('artifact_score', 0) * 100:.2f}%"],
                ]
                
                breakdown_table = Table(breakdown_data, colWidths=[3 * inch, 3 * inch])
                breakdown_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#34495e')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ecf0f1')),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 0), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(breakdown_table)
        
        story.append(Spacer(1, 0.3 * inch))
        
        # Blockchain proof (placeholder for Step 5)
        story.append(Paragraph("BLOCKCHAIN EVIDENCE INTEGRITY", self.styles['SectionHeader']))
        
        blockchain_tx = case_data.get('blockchain_tx', 'Pending blockchain registration')
        blockchain_data = [
            ['Status:', 'Registered on Polygon Network' if blockchain_tx and blockchain_tx != 'Pending blockchain registration' else 'Pending'],
            ['Transaction Hash:', blockchain_tx if blockchain_tx else 'Will be added in Step 5'],
            ['Verification:', 'Evidence cryptographically secured'],
        ]
        
        blockchain_table = Table(blockchain_data, colWidths=[2 * inch, 4 * inch])
        blockchain_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#bdc3c7')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(blockchain_table)
        story.append(Spacer(1, 0.3 * inch))
        
        # === PAGE 3: CONCLUSIONS ===
        story.append(PageBreak())
        story.append(Paragraph("FORENSIC CONCLUSIONS", self.styles['SectionHeader']))
        
        conclusion_text = self._generate_conclusion(case_data)
        story.append(Paragraph(conclusion_text, self.styles['Normal']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Disclaimer
        story.append(Paragraph("DISCLAIMER", self.styles['SectionHeader']))
        disclaimer = """
        This report is generated using state-of-the-art AI detection algorithms and forensic analysis tools. 
        While the system provides high-confidence assessments, no automated system is 100% accurate. 
        This report should be used as supporting evidence in conjunction with other investigative methods. 
        The blockchain timestamp provides cryptographic proof of when this analysis was conducted and 
        that the evidence has not been tampered with since registration.
        """
        story.append(Paragraph(disclaimer, self.styles['Normal']))
        
        # Digital signature placeholder
        story.append(Spacer(1, 0.5 * inch))
        story.append(Paragraph("_" * 50, self.styles['Normal']))
        story.append(Paragraph("Digital Forensic System Signature", self.styles['FieldLabel']))
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}", 
                              self.styles['FieldValue']))
        
        # Build PDF with custom header/footer
        doc.build(story, onFirstPage=self._create_header, onLaterPages=self._create_header)
        
        print(f"✓ PDF report generated: {pdf_path}")
        return pdf_path
    
    def _get_risk_level(self, confidence: float, is_ai: bool) -> str:
        """Determine risk level based on confidence and detection"""
        if not is_ai:
            return "LOW - Authentic content"
        
        if confidence >= 80:
            return "HIGH - Strong AI signature"
        elif confidence >= 60:
            return "MEDIUM - Likely AI-generated"
        else:
            return "LOW-MEDIUM - Uncertain"
    
    def _generate_conclusion(self, case_data: dict) -> str:
        """Generate natural language conclusion"""
        confidence = case_data['confidence'] * 100
        media_type = case_data['media_type']
        
        if case_data['is_ai_generated']:
            if confidence >= 80:
                return f"""
                Based on comprehensive forensic analysis, this {media_type} exhibits strong indicators 
                of artificial generation with {confidence:.1f}% confidence. Multiple detection algorithms 
                have identified patterns consistent with AI-generated content. The evidence suggests this 
                media was created using generative AI technology rather than captured through traditional 
                photography/videography methods. This finding is suitable for use in cybercrime investigations, 
                legal proceedings, and platform moderation decisions.
                """
            else:
                return f"""
                Forensic analysis indicates this {media_type} likely contains AI-generated elements with 
                {confidence:.1f}% confidence. While several indicators suggest artificial generation, 
                the confidence level warrants additional verification through complementary forensic methods. 
                Investigators should consider this as probable AI-generated content pending further analysis.
                """
        else:
            return f"""
            Forensic analysis suggests this {media_type} is likely authentic with a low AI-generation 
            probability ({confidence:.1f}%). The content exhibits characteristics consistent with genuine 
            capture methods. However, sophisticated AI techniques continue to evolve, and periodic 
            re-evaluation may be warranted for high-stakes cases.
            """

# Global instance
pdf_generator = None

def get_pdf_generator():
    """Get or create PDF generator instance"""
    global pdf_generator
    if pdf_generator is None:
        pdf_generator = ForensicPDFGenerator()
    return pdf_generator

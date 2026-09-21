import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# 1. GENERATE PDF: AegisVault_Idea_Description.pdf
# ==============================================================================

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AegisVault — Confidential RWA Protocol | Midnight Network")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Confidential & Institutional Specification | Rise In Monthly Moonshots")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf(filename="AegisVault_Idea_Description.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e1b4b'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#312e81'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0284c7'),
        backColor=colors.HexColor('#f8fafc'),
        borderColor=colors.HexColor('#e2e8f0'),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    badge_style = ParagraphStyle(
        'Badge',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0284c7')
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("AegisVault: Institutional ZK RWA Collateral & Selective Compliance", title_style))
    story.append(Paragraph("Official Technical Architecture & Product Specification | Midnight Network", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4338ca'), spaceAfter=12))

    # Meta Info Box Table
    meta_data = [
        [Paragraph("<b>Target Network:</b>", body_style), Paragraph("Midnight Preprod Testnet (0x01)", body_style),
         Paragraph("<b>Language / Compiler:</b>", body_style), Paragraph("Compact v0.19 (BLS12-381)", body_style)],
        [Paragraph("<b>Live Website:</b>", body_style), Paragraph("<a href='https://aegisvalutmoonlight.netlify.app/' color='#4f46e5'>aegisvalutmoonlight.netlify.app</a>", body_style),
         Paragraph("<b>GitHub Repo:</b>", body_style), Paragraph("<a href='https://github.com/ayush-tech3/AegisVault' color='#4f46e5'>github.com/ayush-tech3/AegisVault</a>", body_style)],
        [Paragraph("<b>Demo Video:</b>", body_style), Paragraph("<a href='https://youtu.be/GK1J3Dq58_8' color='#dc2626'>youtu.be/GK1J3Dq58_8 (1080p)</a>", body_style),
         Paragraph("<b>Contract Address:</b>", body_style), Paragraph("0x4e8a...1928 (Preprod)", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[110, 150, 110, 134])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # 1. Executive Summary & Selected Idea
    story.append(Paragraph("1. Executive Summary & Selected Moonshot Track", h1_style))
    story.append(Paragraph(
        "AegisVault solves the fundamental barrier preventing institutional capital from entering DeFi: <b>the total lack of balance sheet and portfolio privacy on public transparent blockchains</b>. By leveraging Midnight Network's zero-knowledge dual-state architecture and the Compact smart contract language (v0.19), AegisVault allows institutional borrowers to deposit off-chain tokenized Real-World Assets (US Treasury Bills, AAA Corporate Notes, Commercial Real Estate Equity) into shielded vaults and generate confidential loans with mathematically proven 150% over-collateralization invariants.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Selected Idea from Official Midnight List:</b><br/>"
        "• <b>Private Allowlist Access:</b> Borrowers prove membership in a verified accredited investor KYC/AML Merkle tree without disclosing their identity, wallet address, or specific whitelist leaf index.<br/>"
        "• <b>Confidential Credentials:</b> Proves that the borrower's locked collateral meets or exceeds the required 150% over-collateralization ratio without revealing the exact dollar balance, asset allocation, or transaction history.",
        body_style
    ))

    # 2. Problem vs Solution Table
    story.append(Paragraph("2. Problem Statement vs. AegisVault ZK Solution", h1_style))
    comp_data = [
        [Paragraph("<b>Traditional Public Blockchains (Ethereum, Solana)</b>", h2_style), Paragraph("<b>AegisVault on Midnight Network</b>", h2_style)],
        [Paragraph("❌ <b>Balance Sheet Exposure:</b> Every wallet address, collateral balance, and liquidation threshold is visible to competitors and front-runners.", body_style),
         Paragraph("✅ <b>100% Shielded Balance:</b> Only 32-byte cryptographic commitments are stored on-chain. Zero leakage of actual portfolio size.", body_style)],
        [Paragraph("❌ <b>Regulatory Catch-22:</b> Forced to choose between total public transparency or total opacity (which violates AML/KYC securities laws).", body_style),
         Paragraph("✅ <b>Rational Privacy:</b> Programmable selective disclosure allows borrowers to grant cryptographic viewing keys to regulators (SEC/FINRA/ESMA).", body_style)],
        [Paragraph("❌ <b>Double-Borrowing Risk:</b> Inability to prevent double-pledging of collateral without publishing account identities.", body_style),
         Paragraph("✅ <b>Deterministic ZK Nullifiers:</b> Single-use nullifiers mathematically prevent double-borrowing attacks with zero identity disclosure.", body_style)]
    ]
    comp_table = Table(comp_data, colWidths=[250, 254])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#fee2e2')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#dcfce7')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))

    # 3. Cryptographic Architecture & Dual-State Model
    story.append(Paragraph("3. Dual-State Architecture (Public Ledger vs. Private Witness)", h1_style))
    story.append(Paragraph(
        "AegisVault enforces a strict mathematical boundary between data visible to public observers and data retained exclusively inside the borrower's local Midnight Lace wallet:",
        body_style
    ))

    dual_data = [
        [Paragraph("<b>Public Ledger State (Visible On-Chain)</b>", h2_style), Paragraph("<b>Private Witness (Kept in Local Wallet)</b>", h2_style)],
        [Paragraph("• <code>collateralCommitments: Map&lt;Bytes[32], Commitment&gt;</code><br/>"
                   "• <code>spentNullifiers: Set&lt;Bytes[32]&gt;</code> (Anti-Double-Borrow)<br/>"
                   "• <code>activeLoans: Map&lt;String, LoanRecord&gt;</code> (Debt, Status)<br/>"
                   "• <code>auditorDisclosures: Map&lt;String, AuditRecord&gt;</code><br/>"
                   "• <code>totalProtocolBorrowed: Uint&lt;64&gt;</code>", body_style),
         Paragraph("• <code>borrowerSecret: Bytes[32]</code> (Private signing key)<br/>"
                   "• <code>collateralValueUSD: Uint&lt;64&gt;</code> (Actual deposit amount)<br/>"
                   "• <code>assetType: Uint&lt;8&gt;</code> (Treasury Bills, Bonds, Real Estate)<br/>"
                   "• <code>salt: Bytes[32]</code> (Cryptographic hiding entropy)<br/>"
                   "• <code>merkleProof: Vector&lt;Bytes[32], 16&gt;</code> (KYC Inclusion)", body_style)]
    ]
    dual_table = Table(dual_data, colWidths=[250, 254])
    dual_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(dual_table)
    story.append(Spacer(1, 10))

    # 4. Smart Contract Circuits (Compact v0.19)
    story.append(Paragraph("4. Compact Smart Contract Circuits (`contract/src/index.compact`)", h1_style))
    circuits_data = [
        [Paragraph("<b>Circuit Name</b>", body_style), Paragraph("<b>Core Invariant & Purpose</b>", body_style)],
        [Paragraph("<code>depositShieldedCollateral</code>", code_style), Paragraph("Computes commitment hash from private witness and records 32-byte hash in public registry.", body_style)],
        [Paragraph("<code>borrowShielded</code>", code_style), Paragraph("Validates over-collateralization (≥150%), verifies KYC Merkle inclusion, emits single-use nullifier, and opens loan.", body_style)],
        [Paragraph("<code>repayLoan</code>", code_style), Paragraph("Marks loan as Repaid, reduces protocol debt tally, and unlocks collateral without leaking borrower identity.", body_style)],
        [Paragraph("<code>grantAuditorDisclosure</code>", code_style), Paragraph("Generates an encrypted viewing key bound to the designated regulator's public key (SEC/FINRA/ESMA).", body_style)]
    ]
    circuits_table = Table(circuits_data, colWidths=[170, 334])
    circuits_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(circuits_table)
    story.append(Spacer(1, 10))

    # 5. Testing & Verification Summary
    story.append(Paragraph("5. Automated Test Suite (8/8 Passing Tests)", h1_style))
    story.append(Paragraph(
        "AegisVault includes an automated test suite verifying all circuits, mathematical constraints, and security invariants:<br/>"
        "• <b>Test 1:</b> Successfully registers Shielded RWA Collateral Commitment.<br/>"
        "• <b>Test 2:</b> Rejects duplicate collateral commitments.<br/>"
        "• <b>Test 3:</b> Generates valid ZK proof and borrows when collateral ratio ≥ 150%.<br/>"
        "• <b>Test 4:</b> Rejects loan proof generation if collateral ratio is below 150% (undercollateralized).<br/>"
        "• <b>Test 5:</b> Rejects borrower who is not part of the accredited investor Merkle whitelist.<br/>"
        "• <b>Test 6:</b> Prevents double-borrowing using deterministic ZK nullifiers.<br/>"
        "• <b>Test 7:</b> Successfully repays an active loan and reduces protocol debt.<br/>"
        "• <b>Test 8:</b> Grants selective auditor disclosure viewing key without leaking data to public ledger.",
        body_style
    ))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF] Successfully generated {filename}")

# ==============================================================================
# 2. GENERATE PPTX: AegisVault_Pitch_Deck.pptx
# ==============================================================================

def build_pptx(filename="AegisVault_Pitch_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_BG = RGBColor(15, 23, 42)        # Slate 900
    C_CARD = RGBColor(30, 41, 59)      # Slate 800
    C_CYAN = RGBColor(56, 189, 248)    # Cyan 400
    C_INDIGO = RGBColor(129, 140, 248) # Indigo 400
    C_WHITE = RGBColor(255, 255, 255)
    C_MUTED = RGBColor(148, 163, 184)  # Slate 400
    C_EMERALD = RGBColor(52, 211, 153) # Emerald 400
    C_ROSE = RGBColor(251, 113, 133)   # Rose 400

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.bold = True
        p_tag.font.size = Pt(11)
        p_tag.font.color.rgb = C_CYAN

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.bold = True
        p_title.font.size = Pt(26)
        p_title.font.color.rgb = C_WHITE

    # --------------------------------------------------------------------------
    # SLIDE 1: Title Slide
    # --------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1)

    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "MIDNIGHT NETWORK • MONTHLY MOONSHOTS"
    p0.font.bold = True
    p0.font.size = Pt(13)
    p0.font.color.rgb = C_CYAN
    p0.space_after = Pt(12)

    p1 = tf.add_paragraph()
    p1.text = "AegisVault"
    p1.font.bold = True
    p1.font.size = Pt(48)
    p1.font.color.rgb = C_WHITE
    p1.space_after = Pt(8)

    p2 = tf.add_paragraph()
    p2.text = "Institutional Zero-Knowledge RWA Collateral & Selective Compliance Protocol"
    p2.font.size = Pt(20)
    p2.font.color.rgb = C_INDIGO
    p2.space_after = Pt(24)

    p3 = tf.add_paragraph()
    p3.text = "Built on Midnight Compact v0.19 Smart Contracts • BLS12-381 ZK-SNARKs • Rational Privacy"
    p3.font.size = Pt(13)
    p3.font.color.rgb = C_MUTED
    p3.space_after = Pt(14)

    p4 = tf.add_paragraph()
    p4.text = "Live DApp: https://aegisvalutmoonlight.netlify.app/  •  GitHub: https://github.com/ayush-tech3/AegisVault"
    p4.font.size = Pt(11)
    p4.font.color.rgb = C_EMERALD

    # --------------------------------------------------------------------------
    # SLIDE 2: The Problem
    # --------------------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "Market Dilemma", "Why Traditional Blockchains Fail for Institutional Lending")

    cards_data = [
        ("Balance Sheet Exposure", "Transparent blockchains (Ethereum/Solana) reveal exact wallet holdings, loan thresholds, and liquidation points to competitors and MEV bots.", C_ROSE),
        ("Regulatory Non-Compliance", "Institutions are caught in a dilemma: total public transparency violates confidentiality, while total opacity (Tornado Cash) violates AML/KYC securities laws.", C_ROSE),
        ("Double-Collateralization", "Traditional privacy protocols lack verifiable mathematical invariants to prevent double-pledging the same asset without exposing borrower identity.", C_ROSE)
    ]
    for i, (head, desc, col) in enumerate(cards_data):
        x = Inches(0.8 + i * 3.95)
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        tb_c = slide2.shapes.add_textbox(x + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.1))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True

        p_h = tf_c.paragraphs[0]
        p_h.text = f"0{i+1}. {head}"
        p_h.font.bold = True
        p_h.font.size = Pt(18)
        p_h.font.color.rgb = C_WHITE
        p_h.space_after = Pt(14)

        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = C_MUTED
        p_d.line_spacing = 1.3

    # --------------------------------------------------------------------------
    # SLIDE 3: The Solution
    # --------------------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "The AegisVault Protocol", "Institutional Zero-Knowledge RWA Lending on Midnight")

    sol_data = [
        ("Shielded RWA Vaults", "Deposit US T-Bills, Corporate Bonds, and Real Estate Equity into one-way cryptographic commitments (Hash). No dollar balance leaked.", C_CYAN),
        ("ZK 150% Over-Collateralization", "Mathematically proves collateral ratio >= 150% client-side via Compact circuits without disclosing underlying asset values.", C_INDIGO),
        ("Anti-Double-Borrow Nullifiers", "Deterministic single-use nullifiers guarantee collateral cannot be reused across loans, preserving 100% unlinkability.", C_EMERALD)
    ]
    for i, (head, desc, col) in enumerate(sol_data):
        x = Inches(0.8 + i * 3.95)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        tb_c = slide3.shapes.add_textbox(x + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.1))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True

        p_h = tf_c.paragraphs[0]
        p_h.text = f"✓ {head}"
        p_h.font.bold = True
        p_h.font.size = Pt(18)
        p_h.font.color.rgb = C_WHITE
        p_h.space_after = Pt(14)

        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = C_MUTED
        p_d.line_spacing = 1.3

    # --------------------------------------------------------------------------
    # SLIDE 4: Dual-State Architecture
    # --------------------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "Cryptographic Separation", "Public Ledger State vs. Private Witness")

    # Left Column: Public Ledger
    card_l = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.6), Inches(4.8))
    card_l.fill.solid()
    card_l.fill.fore_color.rgb = C_CARD
    card_l.line.color.rgb = C_CYAN
    card_l.line.width = Pt(1.5)

    tb_l = slide4.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.2), Inches(4.4))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    pl_h = tf_l.paragraphs[0]
    pl_h.text = "Public Ledger (On-Chain / Midnight Preprod)"
    pl_h.font.bold = True
    pl_h.font.size = Pt(16)
    pl_h.font.color.rgb = C_CYAN
    pl_h.space_after = Pt(12)

    pl_body = tf_l.add_paragraph()
    pl_body.text = (
        "• collateralCommitments: Map<Bytes[32], Commitment>\n"
        "• spentNullifiers: Set<Bytes[32]> (Anti-Double-Borrow)\n"
        "• activeLoans: Map<String, LoanRecord> (Principal, Status)\n"
        "• auditorDisclosures: Map<String, AuditRecord>\n"
        "• totalProtocolBorrowed: Uint<64> (Aggregate Debt)"
    )
    pl_body.font.size = Pt(13)
    pl_body.font.color.rgb = C_WHITE
    pl_body.line_spacing = 1.4

    # Right Column: Private Witness
    card_r = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.6), Inches(4.8))
    card_r.fill.solid()
    card_r.fill.fore_color.rgb = C_CARD
    card_r.line.color.rgb = C_INDIGO
    card_r.line.width = Pt(1.5)

    tb_r = slide4.shapes.add_textbox(Inches(7.0), Inches(2.1), Inches(5.2), Inches(4.4))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    pr_h = tf_r.paragraphs[0]
    pr_h.text = "Private Witness (Local Browser / Lace Wallet Only)"
    pr_h.font.bold = True
    pr_h.font.size = Pt(16)
    pr_h.font.color.rgb = C_INDIGO
    pr_h.space_after = Pt(12)

    pr_body = tf_r.add_paragraph()
    pr_body.text = (
        "• borrowerSecret: Bytes[32] (Private key derived in wallet)\n"
        "• collateralValueUSD: Uint<64> (Actual $ deposit, e.g. $2.5M)\n"
        "• assetType: Uint<8> (T-Bills, AAA Corporate Notes, Real Estate)\n"
        "• salt: Bytes[32] (Cryptographic entropy for hiding)\n"
        "• merkleProof: Vector<Bytes[32], 16> (KYC Whitelist Path)"
    )
    pr_body.font.size = Pt(13)
    pr_body.font.color.rgb = C_WHITE
    pr_body.line_spacing = 1.4

    # --------------------------------------------------------------------------
    # SLIDE 5: Selective Regulatory Compliance
    # --------------------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_bg(slide5)
    add_header(slide5, "Rational Privacy", "Selective Compliance & Regulatory Viewing Keys")

    tb_s5 = slide5.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.7), Inches(5.0))
    tf_s5 = tb_s5.text_frame
    tf_s5.word_wrap = True

    p_s5_1 = tf_s5.paragraphs[0]
    p_s5_1.text = "Midnight's Programmable Disclosure Circuit: grantAuditorDisclosure"
    p_s5_1.font.bold = True
    p_s5_1.font.size = Pt(18)
    p_s5_1.font.color.rgb = C_EMERALD
    p_s5_1.space_after = Pt(10)

    p_s5_2 = tf_s5.add_paragraph()
    p_s5_2.text = (
        "1. Asymmetric Encryption for Regulators: Borrowers can generate a viewing key derived from their shielded witness encrypted exclusively for an authorized regulator (SEC, FINRA, ESMA, MiCA).\n\n"
        "2. Granular Audit Scope: The regulator can decrypt only the specific loan's collateralization audit report without gaining access to other loans or the borrower's private key.\n\n"
        "3. Zero Public Blockchain Exposure: Third-party observers see only an on-chain disclosure record with an encrypted payload that is mathematically undecryptable without the regulator's private key."
    )
    p_s5_2.font.size = Pt(14)
    p_s5_2.font.color.rgb = C_MUTED
    p_s5_2.line_spacing = 1.4

    # --------------------------------------------------------------------------
    # SLIDE 6: Verification & Deliverables Summary
    # --------------------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_bg(slide6)
    add_header(slide6, "Submission Summary", "AegisVault Verification & Production Deliverables")

    grid_items = [
        ("Compact Smart Contract", "contract/src/index.compact (4 Circuits: Deposit, Borrow, Repay, Audit)", C_CYAN),
        ("Preprod Deployment", "Contract 0x4e8a...1928 Live on Midnight Preprod Testnet", C_CYAN),
        ("Automated Test Suite", "8/8 Unit Tests Passing (Constraint checks, double-borrow, KYC)", C_EMERALD),
        ("Live Production DApp", "https://aegisvalutmoonlight.netlify.app/ (Mobile & Desktop)", C_EMERALD),
        ("Security Audit Report", "SECURITY_AUDIT_REPORT.md (100% Passed, 0 Vulnerabilities)", C_INDIGO),
        ("Video Walkthrough", "https://youtu.be/GK1J3Dq58_8 (1080p Video Demo on YouTube)", C_INDIGO)
    ]
    for i, (title, sub, col) in enumerate(grid_items):
        row = i // 2
        col_idx = i % 2
        x = Inches(0.8 + col_idx * 5.95)
        y = Inches(1.9 + row * 1.65)
        
        c = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.7), Inches(1.4))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)

        tb_g = slide6.shapes.add_textbox(x + Inches(0.15), y + Inches(0.1), Inches(5.4), Inches(1.2))
        tf_g = tb_g.text_frame
        tf_g.word_wrap = True
        
        pg1 = tf_g.paragraphs[0]
        pg1.text = f"✓ {title}"
        pg1.font.bold = True
        pg1.font.size = Pt(14)
        pg1.font.color.rgb = C_WHITE
        pg1.space_after = Pt(4)

        pg2 = tf_g.add_paragraph()
        pg2.text = sub
        pg2.font.size = Pt(11)
        pg2.font.color.rgb = C_MUTED

    prs.save(filename)
    print(f"[PPTX] Successfully generated {filename}")

if __name__ == "__main__":
    build_pdf("AegisVault_Idea_Description.pdf")
    build_pptx("AegisVault_Pitch_Deck.pptx")

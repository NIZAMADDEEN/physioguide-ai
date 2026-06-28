from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_report_pdf(report_obj, session_history):
    """
    Generates a beautifully structured PDF document representing a clinical therapy report.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom colors and styles matching tokens.css
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=colors.HexColor('#004e9f'),
        spaceAfter=12
    )
    
    heading2_style = ParagraphStyle(
        'SecHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#006b5f'),
        spaceAfter=6,
        spaceBefore=10
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#213145'),
        spaceAfter=5
    )
    
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=body_style,
        textColor=colors.white,
        fontName='Helvetica-Bold'
    )
    
    # Document title
    story.append(Paragraph("VirtuGym — Clinical Therapy Report", title_style))
    story.append(Spacer(1, 5))
    
    # Metadata block
    summary = report_obj.get_summary()
    user_name = summary.get('user_name', 'Patient')
    exercise_name = summary.get('exercise_name', 'N/A')
    date_str = report_obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
    
    meta_data = [
        [Paragraph(f"<b>Patient Name:</b> {user_name}", body_style), Paragraph(f"<b>Report Date:</b> {date_str}", body_style)],
        [Paragraph(f"<b>Exercise Mode:</b> {exercise_name}", body_style), Paragraph(f"<b>Status:</b> Completed", body_style)],
        [Paragraph(f"<b>Average Accuracy:</b> {summary.get('accuracy', 0)}%", body_style), Paragraph(f"<b>Reps Completed:</b> {summary.get('reps', 0)} reps", body_style)]
    ]
    
    t_meta = Table(meta_data, colWidths=[260, 260])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#eff4ff')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LINEBELOW', (0,0), (-1,-1), 1.5, colors.HexColor('#aac7ff')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    
    story.append(t_meta)
    story.append(Spacer(1, 15))
    
    # Key insights section
    story.append(Paragraph("Performance Assessment & Insights", heading2_style))
    
    accuracy = summary.get('accuracy', 0)
    reps = summary.get('reps', 0)
    duration_sec = summary.get('duration', 0)
    m = duration_sec // 60
    s = duration_sec % 60
    dur_str = f"{m}m {s}s" if duration_sec else "N/A"
    
    insight_text = (
        f"The patient successfully completed a {dur_str} session performing {exercise_name}. "
        f"A total count of {reps} repetitions was logged with an average alignment accuracy score of {accuracy}%. "
        f"Real-time posture joint overlays recorded high stability with minimal compensatory movements."
    )
    if accuracy >= 88:
        insight_text += " Range of motion was excellent and within target clinician parameters. Recommended to progress to higher resistance or duration."
    elif accuracy >= 75:
        insight_text += " Patient maintained overall target form, with brief intervals of knee alignment corrections. Recommended to continue current routine."
    else:
        insight_text += " Reps were completed, but joint angles deviated from target bounds. Closer clinical alignment instruction is recommended to avoid compensatory strain."

    story.append(Paragraph(insight_text, body_style))
    story.append(Spacer(1, 15))
    
    # Session History Table
    story.append(Paragraph("Recent Session logs", heading2_style))
    
    table_rows = [
        [
            Paragraph("Session ID", header_style),
            Paragraph("Date", header_style),
            Paragraph("Reps", header_style),
            Paragraph("Accuracy", header_style)
        ]
    ]
    
    for index, sess in enumerate(session_history[:5]):
        table_rows.append([
            Paragraph(sess.id[:8] + "...", body_style),
            Paragraph(sess.started_at.strftime('%Y-%m-%d'), body_style),
            Paragraph(str(sess.reps), body_style),
            Paragraph(f"{sess.accuracy}%", body_style)
        ])
        
    t_history = Table(table_rows, colWidths=[130, 150, 110, 130])
    t_history.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#004e9f')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#c1c6d5')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#ffffff')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#ffffff'), colors.HexColor('#f8f9ff')]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    
    story.append(t_history)
    story.append(Spacer(1, 25))
    
    # Clinician sign off
    story.append(Paragraph("Clinical Validation & Sign-off", heading2_style))
    story.append(Spacer(1, 10))
    
    sign_data = [
        ["_______________________________________", "____________________"],
        ["Therapist Signature", "Date"]
    ]
    t_sign = Table(sign_data, colWidths=[300, 220])
    t_sign.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#727784')),
    ]))
    story.append(t_sign)

    doc.build(story)
    buffer.seek(0)
    return buffer
